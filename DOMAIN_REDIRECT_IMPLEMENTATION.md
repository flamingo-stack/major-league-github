# Domain Redirect Implementation Guide

## Executive Summary

This document provides a complete analysis and implementation guide for clean domain redirects in the Major League GitHub project. The solution replaces the current fragile JavaScript-based redirects with server-side nginx 301 redirects for better SEO and user experience.

## Current Implementation Analysis

### Issues Identified

1. **Missing Environment Variable Pass-Through**
   - `FORWARD_TO_WWW` is defined in deploy.yml but not passed to frontend build
   - Not in `frontend/Dockerfile` ARG/ENV declarations
   - Not in `frontend/webpack.config.js` templateParameters
   - HTML template expects it but never receives it (lines 35-48 in `frontend/index.html`)

2. **Client-Side Redirect Limitations**
   - JavaScript redirect in `frontend/index.html` (lines 35-48):
     ```javascript
     if (parts.length === 2) {
       const rootDomain = hostname;
       const wwwDomain = 'www.' + rootDomain;
       window.location.replace('https://' + wwwDomain + window.location.pathname + window.location.search + window.location.hash);
     }
     ```
   - Only works after page loads (visible flicker)
   - SEO-unfriendly (search engines may not execute JavaScript)
   - Doesn't work for users with JavaScript disabled
   - Poor user experience

3. **Ingress Configuration Complexity**
   - Complex sed operations in `deploy.yml` (lines 413-438, 609-674)
   - Manual certificate domain additions
   - Fragile string manipulation:
     ```bash
     sed -i '/domains:/a\\    - '"$ROOT_DOMAIN"'' processed_k8s/ingress.yaml
     ```

### Current Redirect Flow Problems

- **HTTP→HTTPS**: ✅ Works (handled by GKE FrontendConfig)
- **Root→Subdomain**: ❌ Broken (JavaScript never executes due to missing env var)
- **Maintenance**: ❌ Complex (scattered across multiple files)

## Recommended Solution: Nginx-Based Server-Side Redirects

### Benefits

1. **Server-Side 301 Redirects**: SEO-friendly, works for all clients
2. **Clean Separation**: All redirect logic in nginx configuration
3. **Simple Substitution**: Uses standard `envsubst`, no complex sed operations
4. **Conditional Build**: Redirect server block only included when needed
5. **Flexible**: Easy to extend for different subdomain patterns (www, app, staging)
6. **Maintainable**: All redirect logic in one place
7. **Debug-Friendly**: Logs show exactly what configuration is being used

## Implementation Guide

### Step 1: Create Nginx Configuration Templates

#### `frontend/nginx.conf.template`
```nginx
# Main application server
server {
    listen 80;
    server_name ${TARGET_DOMAIN};
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Conditional redirect server block - only included if ENABLE_REDIRECT=true
${REDIRECT_SERVER_BLOCK}

# Health check server
server {
    listen 81;
    server_name _;

    location /nginx-health {
        access_log off;
        add_header Content-Type text/plain;
        return 200 'healthy\n';
    }
}
```

#### `frontend/nginx-redirect.conf.template`
```nginx
# Root domain to subdomain redirect (301 permanent)
server {
    listen 80;
    server_name ${ROOT_DOMAIN};
    
    location / {
        return 301 https://${TARGET_DOMAIN}$request_uri;
    }
}
```

### Step 2: Update Frontend Dockerfile

#### `frontend/Dockerfile` (Updated)
```dockerfile
FROM node:20-alpine as build

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build arguments for environment variables
ARG BACKEND_API_URL
ARG GTM_ID
ARG OG_TITLE
ARG OG_DESCRIPTION
ARG OG_TYPE
ARG OG_IMAGE_URL
ARG OG_URL
ARG OG_SITE_NAME
ARG WEBAPP_EXTRA_BUTTON_LINK
ARG WEBAPP_EXTRA_BUTTON_TEXT
ARG NODE_ENV=production

# NEW: Domain redirect configuration
ARG ENABLE_REDIRECT=false
ARG ROOT_DOMAIN=""
ARG TARGET_DOMAIN=""

# Set environment variables for the build
ENV BACKEND_API_URL=${BACKEND_API_URL}
ENV GTM_ID=${GTM_ID}
ENV OG_TITLE=${OG_TITLE}
ENV OG_DESCRIPTION=${OG_DESCRIPTION}
ENV OG_TYPE=${OG_TYPE}
ENV OG_IMAGE_URL=${OG_IMAGE_URL}
ENV OG_URL=${OG_URL}
ENV OG_SITE_NAME=${OG_SITE_NAME}
ENV WEBAPP_EXTRA_BUTTON_LINK=${WEBAPP_EXTRA_BUTTON_LINK}
ENV WEBAPP_EXTRA_BUTTON_TEXT=${WEBAPP_EXTRA_BUTTON_TEXT}
ENV NODE_ENV=${NODE_ENV}
ENV GENERATE_SOURCEMAP=false

# Build the application
RUN npm run build

# Production image
FROM nginx:alpine

# Install envsubst (part of gettext package)
RUN apk add --no-cache gettext

# Copy built application
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx templates
COPY nginx.conf.template /etc/nginx/templates/nginx.conf.template
COPY nginx-redirect.conf.template /etc/nginx/templates/nginx-redirect.conf.template

# Add entrypoint script for template processing
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80 81

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
```

### Step 3: Create Docker Entrypoint Script

#### `frontend/docker-entrypoint.sh`
```bash
#!/bin/sh
set -e

# Set defaults
ENABLE_REDIRECT=${ENABLE_REDIRECT:-false}
TARGET_DOMAIN=${TARGET_DOMAIN:-localhost}
ROOT_DOMAIN=${ROOT_DOMAIN:-}

# Process redirect block conditionally
if [ "$ENABLE_REDIRECT" = "true" ] && [ -n "$ROOT_DOMAIN" ]; then
    echo "Enabling redirect from $ROOT_DOMAIN to $TARGET_DOMAIN"
    export REDIRECT_SERVER_BLOCK=$(envsubst < /etc/nginx/templates/nginx-redirect.conf.template)
else
    echo "Redirect disabled or ROOT_DOMAIN not set"
    export REDIRECT_SERVER_BLOCK=""
fi

# Process main nginx config
envsubst '$TARGET_DOMAIN $REDIRECT_SERVER_BLOCK' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf

# Show final config for debugging
echo "Final nginx configuration:"
cat /etc/nginx/conf.d/default.conf

# Execute CMD
exec "$@"
```

### Step 4: Update Deploy.yml

#### Frontend Build Section (Replace lines 249-278)
```yaml
- name: Build and push frontend image 🎨
  if: steps.changes.outputs.frontend == 'true'
  env:
    OG_TITLE: ${{ env.OG_TITLE }}
    OG_DESCRIPTION: ${{ env.OG_DESCRIPTION }}
    OG_TYPE: ${{ env.OG_TYPE }}
    OG_IMAGE_URL: ${{ env.OG_IMAGE_URL }}
    OG_SITE_NAME: ${{ env.OG_SITE_NAME }}
    WEBAPP_EXTRA_BUTTON_LINK: ${{ env.WEBAPP_EXTRA_BUTTON_LINK }}
    WEBAPP_EXTRA_BUTTON_TEXT: ${{ env.WEBAPP_EXTRA_BUTTON_TEXT }}
  run: |
    echo "🚀 Building frontend image..."
    
    # Determine redirect configuration
    ENABLE_REDIRECT="false"
    ROOT_DOMAIN=""
    TARGET_DOMAIN="${{ env.DOMAIN_NAME }}.${{ env.DOMAIN_SUFFIX }}"
    
    if [ "${{ env.FORWARD_TO_WWW }}" = "true" ]; then
      # Check if DOMAIN_NAME is a subdomain (doesn't contain dots)
      if [[ "${{ env.DOMAIN_NAME }}" != *"."* ]]; then
        # This is a simple subdomain like "www", so enable redirect
        ENABLE_REDIRECT="true"
        ROOT_DOMAIN="${{ env.DOMAIN_SUFFIX }}"
        echo "📍 Enabling redirect: $ROOT_DOMAIN → $TARGET_DOMAIN"
      else
        echo "⚠️ DOMAIN_NAME contains dots, assuming complex subdomain - no redirect"
      fi
    fi
    
    docker build frontend \
      --build-arg NODE_ENV=production \
      --build-arg BACKEND_API_URL="/" \
      --build-arg GTM_ID="${{ env.GTM_ID }}" \
      --build-arg OG_TITLE="${{ env.OG_TITLE }}" \
      --build-arg OG_DESCRIPTION="${{ env.OG_DESCRIPTION }}" \
      --build-arg OG_TYPE="${{ env.OG_TYPE }}" \
      --build-arg OG_IMAGE_URL="${{ env.OG_IMAGE_URL }}" \
      --build-arg OG_URL="https://$TARGET_DOMAIN" \
      --build-arg OG_SITE_NAME="${{ env.OG_SITE_NAME }}" \
      --build-arg WEBAPP_EXTRA_BUTTON_LINK="${{ env.WEBAPP_EXTRA_BUTTON_LINK }}" \
      --build-arg WEBAPP_EXTRA_BUTTON_TEXT="${{ env.WEBAPP_EXTRA_BUTTON_TEXT }}" \
      --build-arg ENABLE_REDIRECT="$ENABLE_REDIRECT" \
      --build-arg ROOT_DOMAIN="$ROOT_DOMAIN" \
      --build-arg TARGET_DOMAIN="$TARGET_DOMAIN" \
      -t "${{ env.REGISTRY }}/${{ env.REGISTRY_NAME }}/frontend:${{ env.VERSION }}" \
      -t "${{ env.REGISTRY }}/${{ env.REGISTRY_NAME }}/frontend:latest"
    
    echo "🚀 Pushing frontend images..."
    docker push ${{ env.REGISTRY }}/${{ env.REGISTRY_NAME }}/frontend:${{ env.VERSION }}
    docker push ${{ env.REGISTRY }}/${{ env.REGISTRY_NAME }}/frontend:latest
```

#### Simplified Deploy to GKE Section (Replace lines 413-438)
```yaml
# Process ingress configuration (much simpler now)
DOMAIN_NAME="${{ env.DOMAIN_NAME }}" \
DOMAIN_SUFFIX="${{ env.DOMAIN_SUFFIX }}" \
  envsubst < kubernetes/base/ingress.yaml > processed_k8s/ingress.yaml

# Apply ingress - no more complex sed operations needed!
kubectl apply -n ${{ env.NAMESPACE }} -f processed_k8s/ingress.yaml
```

#### Remove DNS Root Domain Logic (Delete lines 609-674)
The nginx container now handles all redirect logic, so remove the complex DNS root domain setup code entirely.

### Step 5: Update Ingress Configuration

#### Update `kubernetes/base/ingress.yaml`
Add static root domain configuration when needed:

```yaml
apiVersion: networking.gke.io/v1
kind: ManagedCertificate
metadata:
  name: main-ingress-ssl-cert
spec:
  domains:
    - ${DOMAIN_NAME}.${DOMAIN_SUFFIX}
    # Add root domain when FORWARD_TO_WWW is enabled
    # This should be added manually in the ingress file or via simple envsubst
---
apiVersion: networking.gke.io/v1beta1
kind: FrontendConfig
metadata:
  name: main-ingress-frontend-config
spec:
  redirectToHttps:
    enabled: true
    responseCodeName: MOVED_PERMANENTLY_DEFAULT
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: main-ingress
  annotations:
    kubernetes.io/ingress.class: "gce"
    kubernetes.io/ingress.global-static-ip-name: "main-ingress-ip"
    networking.gke.io/managed-certificates: "main-ingress-ssl-cert"
    networking.gke.io/v1beta1.FrontendConfig: "main-ingress-frontend-config"
spec:
  rules:
  - host: ${DOMAIN_NAME}.${DOMAIN_SUFFIX}
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-service-service
            port:
              number: 8080
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
  # Root domain rule will be added via simple template when needed
```

### Step 6: Clean Up Frontend Code

#### Remove JavaScript Redirect from `frontend/index.html`
Delete lines 34-48:
```html
<!-- DELETE THIS ENTIRE SECTION -->
<!-- Root domain to www redirect (only if FORWARD_TO_WWW is enabled) -->
<% if (process.env.FORWARD_TO_WWW === 'true') { %>
<script>
  // Extract domain parts from current hostname
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  // Check if this is a root domain (no subdomain) and redirect to www
  if (parts.length === 2) {
    const rootDomain = hostname;
    const wwwDomain = 'www.' + rootDomain;
    window.location.replace('https://' + wwwDomain + window.location.pathname + window.location.search + window.location.hash);
  }
</script>
<% } %>
```

#### Update `frontend/webpack.config.js`
Remove FORWARD_TO_WWW from templateParameters (if it exists) since we're removing the JavaScript redirect.

## Complete Redirect Flow After Implementation

### 1. HTTP Root → HTTPS Subdomain
- `http://domain.com` → Nginx port 80 → 301 redirect to `https://www.domain.com`

### 2. HTTPS Root → HTTPS Subdomain  
- `https://domain.com` → Ingress (SSL terminated) → Nginx → 301 redirect to `https://www.domain.com`

### 3. HTTP Subdomain → HTTPS Subdomain
- `http://www.domain.com` → GKE FrontendConfig → 301 redirect to `https://www.domain.com`

### 4. HTTPS Subdomain (Final Destination)
- `https://www.domain.com` → Serves the application

## Migration Strategy

### Phase 1: Implementation
1. Create nginx template files
2. Update Dockerfile and add entrypoint script
3. Update deploy.yml frontend build section
4. Test with a staging environment

### Phase 2: Cleanup
1. Remove JavaScript redirect from index.html
2. Simplify deploy.yml ingress processing  
3. Remove complex DNS root domain logic
4. Update ingress.yaml if needed

### Phase 3: Optional Enhancement
Consider replacing `FORWARD_TO_WWW` boolean with `DOMAIN_PREFIX` for more flexibility:

```yaml
# Instead of FORWARD_TO_WWW=true/false
# Use DOMAIN_PREFIX=www (or app, staging, etc.)
DOMAIN_PREFIX: ${{ secrets.DOMAIN_PREFIX || '' }}
```

## Testing

### Local Testing
```bash
# Build with redirect enabled
docker build --build-arg ENABLE_REDIRECT=true --build-arg ROOT_DOMAIN=example.com --build-arg TARGET_DOMAIN=www.example.com -t test-frontend frontend/

# Test redirect
curl -I http://localhost:8080/
# Should return: HTTP/1.1 301 Moved Permanently
# Location: https://www.example.com/
```

### Production Verification
1. Test `http://domain.com` → `https://www.domain.com`
2. Test `https://domain.com` → `https://www.domain.com`  
3. Test `http://www.domain.com` → `https://www.domain.com`
4. Verify `https://www.domain.com` serves the application
5. Check nginx logs for redirect entries
6. Validate SSL certificates cover both domains

## Benefits Summary

### Technical Benefits
- ✅ Server-side 301 redirects (SEO-friendly)
- ✅ Works for all clients (no JavaScript dependency)
- ✅ Clean separation of concerns
- ✅ Simple environment variable substitution
- ✅ Conditional redirect configuration
- ✅ Debug-friendly logging

### Maintenance Benefits
- ✅ Eliminates complex sed operations in CI/CD
- ✅ Reduces deploy.yml complexity by ~100 lines
- ✅ Centralizes redirect logic in nginx templates
- ✅ Makes testing and debugging easier
- ✅ Provides clear configuration visibility

### User Experience Benefits
- ✅ No visible redirect flicker
- ✅ Faster redirects (server-side vs client-side)
- ✅ Works with JavaScript disabled
- ✅ Proper HTTP status codes
- ✅ Preserves URL parameters and anchors

This implementation provides a robust, maintainable, and SEO-friendly solution for domain redirects that eliminates the current issues while providing a clean foundation for future enhancements.
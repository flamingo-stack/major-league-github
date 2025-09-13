FROM node:20-alpine as build

WORKDIR /app

# Install git for ui-kit setup
RUN apk add --no-cache git

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Add build arguments for environment variables
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

# Verify the source files exist
RUN ls -la /app/src && \
    echo "Main entry file:" && \
    ls -la /app/src/main.tsx

# Build the application with explicit environment passing
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
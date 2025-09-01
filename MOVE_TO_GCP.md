# 🚀 DigitalOcean to GCP Migration Plan

## Overview
This document outlines the complete migration plan from DigitalOcean to Google Cloud Platform (GCP) for Major League GitHub.

## Current DigitalOcean Infrastructure

### Services in Use
- **DigitalOcean Kubernetes (DOKS)**: 1 node cluster (s-4vcpu-8gb) in NYC3
- **DigitalOcean Container Registry**: Docker image storage
- **DigitalOcean Load Balancer**: With Let's Encrypt SSL certificates
- **DNS Management**: Subdomain routing through DigitalOcean
- **Redis**: Self-hosted in Kubernetes (not managed)

### Application Architecture
- **Backend Services**:
  - `backend-service`: Main API service (port 8450)
  - `cache-updater`: Background GitHub data updater (port 8451)
- **Frontend**: React application served via Nginx
- **Data Store**: Redis for caching GitHub data

## Target GCP Architecture (Simplified for Low Load)

### Service Mapping
| Current (DigitalOcean) | Target (GCP/GitHub) | Notes |
|------------------------|---------------------|-------|
| DOKS | GKE (Google Kubernetes Engine) | Single zone, 1-2 nodes |
| DO Container Registry | GitHub Container Registry (ghcr.io) | Free for public repos |
| DO Load Balancer | GKE Ingress with Cloud Load Balancing | Simpler setup |
| Let's Encrypt SSL | Google-managed SSL certificates | Auto-renewal |
| Self-hosted Redis | Memorystore for Redis | Managed service |
| DNS (subdomain) | Keep existing or Cloud DNS | Minimal change |

## Migration Phases

### Phase 1: GitHub Container Registry Setup ✅
**Timeline: Day 1**

1. **Configure GitHub Packages**
   - Already enabled for your repository
   - Images will be: `ghcr.io/flamingo-stack/major-league-github/[service-name]`

2. **Prepare Authentication**
   - Use existing `GITHUB_TOKEN` in Actions
   - No additional PAT needed for public packages

### Phase 2: GCP Infrastructure Setup 🏗️
**Timeline: Day 1-2**

See `GCP_SETUP_INSTRUCTIONS.md` for detailed commands.

1. **Create GCP Project**
2. **Set up minimal GKE cluster** (1 node, no auto-scaling)
3. **Create Memorystore Redis instance** (1GB Basic tier)
4. **Configure networking** (VPC peering for Redis)

### Phase 3: CI/CD Pipeline Updates 🔄
**Timeline: Day 2-3**

#### Update `.github/workflows/deploy.yml`

**Key Changes:**
1. Replace DigitalOcean authentication with GCP
2. Switch from DO registry to GitHub Container Registry
3. Update deployment commands for GKE

**Specific Updates:**

```yaml
# Remove these environment variables:
- REGISTRY: ${{ secrets.REGISTRY }}
- REGISTRY_NAME: ${{ secrets.REGISTRY_NAME }}
- DIGITALOCEAN_ACCESS_TOKEN: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}
- CLUSTER_NAME: ${{ secrets.CLUSTER_NAME }}

# Add these:
+ GCP_PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}
+ GKE_CLUSTER: major-league-github
+ GKE_ZONE: us-central1-a
```

### Phase 4: Kubernetes Manifest Updates 📝
**Timeline: Day 3**

#### Files to Update:
1. **All deployment files** - Update image references:
   ```yaml
   # From:
   image: ${REGISTRY}/${REGISTRY_NAME}/service-name:${VERSION}
   # To:
   image: ghcr.io/flamingo-stack/major-league-github/service-name:${VERSION}
   ```

2. **Backend services** - Update Redis connection:
   ```yaml
   # Update SPRING_REDIS_HOST to Memorystore IP
   - name: SPRING_REDIS_HOST
     value: "10.x.x.x"  # Memorystore IP from GCP
   ```

3. **Remove** `redis.yaml` - Using managed service now

4. **Simplify** `ingress.yaml` - Use GKE ingress

### Phase 5: Testing & Deployment 🧪
**Timeline: Day 4**

1. **Deploy to GKE**
   - Push images to GitHub Container Registry
   - Apply Kubernetes manifests to GKE
   - Verify all pods are running

2. **Test Application**
   - Check web service endpoints
   - Verify cache updater is running
   - Test Redis connectivity
   - Confirm frontend is accessible

### Phase 6: DNS Cutover & Cleanup 🔀
**Timeline: Day 5**

1. **Update DNS Records**
   - Get GKE Load Balancer IP
   - Update A record for your domain
   - Wait for propagation

2. **Monitor**
   - Watch traffic in GCP Console
   - Check application logs
   - Verify SSL certificate

3. **Cleanup DigitalOcean** (after 1-2 weeks)
   - Delete DOKS cluster
   - Remove container registry
   - Cancel subscription

## Cost Analysis 💰

### Monthly Costs (Estimated)
**GCP:**
- GKE cluster (1 node, e2-medium): ~$25
- GKE management: $0 (first cluster free)
- Memorystore Redis (1GB): ~$35
- Load Balancer: ~$20
- **Total: ~$80/month**

**GitHub Container Registry:** FREE (public repos)

**Savings:** Approximately 50-60% compared to current DigitalOcean setup

## Required GitHub Secrets Updates

### Remove These:
- `DIGITALOCEAN_ACCESS_TOKEN`
- `REGISTRY`
- `REGISTRY_NAME`
- `CLUSTER_NAME`
- `CLUSTER_REGION`

### Add These:
- `GCP_SA_KEY`: Service account JSON for deployment
- `GCP_PROJECT_ID`: Your GCP project ID

### Keep These:
- `GITHUB_TOKEN`: Now used for GHCR
- `GH_API_TOKENS`
- `LINKEDIN_CLIENT_ID`
- `LINKEDIN_CLIENT_SECRET`
- `GTM_ID`
- `DOMAIN_NAME`
- `DOMAIN_SUFFIX`
- `PROJECT_NAME`

## File Change Summary

### Files to Modify:
1. `.github/workflows/deploy.yml` - ~100 lines of changes
2. `kubernetes/base/backend-service.yaml` - Image URLs and Redis host
3. `kubernetes/base/frontend.yaml` - Image URLs
4. `kubernetes/base/config.yaml` - Remove DO-specific configs
5. `kubernetes/base/ingress.yaml` - Simplify for GKE

### Files to Delete:
1. `kubernetes/base/redis.yaml` - Using managed Redis
2. `.github/scripts/cleanup-registry.sh` - Not needed with GHCR

## Rollback Plan 🔄

If issues arise during migration:

1. **DNS Rollback**: Point DNS back to DigitalOcean (immediate)
2. **Keep DO Running**: Don't delete DO resources for 2 weeks
3. **Dual Running**: Can run both environments temporarily
4. **Data Sync**: Redis cache will rebuild automatically

## Success Criteria ✅

Migration is complete when:
- [ ] All services running on GKE
- [ ] Images served from GitHub Container Registry
- [ ] Memorystore Redis connected and working
- [ ] DNS pointing to GCP
- [ ] SSL certificate active
- [ ] All health checks passing
- [ ] 24 hours of stable operation
- [ ] DigitalOcean resources deleted

## Benefits of This Migration 🎯

1. **Cost Reduction**: ~50% lower monthly costs
2. **Simplified Registry**: GitHub integration, no separate registry
3. **Managed Redis**: No more self-hosting Redis
4. **Better Integration**: With flamingo.cx already on GCP
5. **Superior Monitoring**: GCP's operations suite
6. **Free CI/CD Storage**: GitHub packages included
7. **Security Scanning**: GitHub's Dependabot for images

## Timeline Summary 📅

- **Day 1-2**: GCP setup, GKE cluster, Memorystore
- **Day 2-3**: Update CI/CD pipeline
- **Day 3-4**: Deploy and test on GKE
- **Day 5**: DNS cutover
- **Week 2**: Monitor and optimize
- **Week 3**: Cleanup DigitalOcean

## Support & Troubleshooting 🆘

### Common Issues:
1. **Redis Connection**: Ensure VPC peering is configured
2. **Image Pull Errors**: Check GHCR permissions
3. **SSL Issues**: Wait for cert provisioning (up to 15 min)
4. **DNS Propagation**: Can take up to 48 hours globally

### Monitoring:
- GKE Dashboard: `console.cloud.google.com/kubernetes`
- Cloud Logging: `console.cloud.google.com/logs`
- GitHub Packages: `github.com/orgs/flamingo-stack/packages`

## Next Steps

1. Read `GCP_SETUP_INSTRUCTIONS.md` for GCP setup commands
2. Create GCP project and run setup scripts
3. Update GitHub secrets
4. Modify CI/CD pipeline
5. Deploy and test
6. Switch DNS
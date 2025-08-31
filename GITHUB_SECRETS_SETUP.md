# GitHub Secrets Configuration

All hardcoded values have been externalized to GitHub secrets for better security and flexibility. You need to set up these secrets in your GitHub repository.

## How to Add Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with the exact name and value below

## Required Secrets

### 🏗️ GCP Infrastructure Secrets

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `GCP_PROJECT_ID` | Your GCP project ID | `major-league-github` |
| `GCP_SA_KEY` | Service account JSON key | `{"type": "service_account", ...}` |
| `GKE_CLUSTER` | GKE cluster name | `major-league-github` |
| `GKE_ZONE` | GKE cluster zone | `us-central1-a` |

### 📦 Container Registry Configuration

Container registry path is **automatically detected** from `${{ github.repository }}` (e.g., `flamingo-stack/major-league-github`).

No secrets needed for this section! ✅

### 🌍 DNS Configuration Secrets

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `DNS_PROJECT_ID` | GCP project ID containing DNS zone | `flash-asset-460518-v4` |
| `DNS_ZONE` | Cloud DNS zone name (not the domain) | `flamingo-cx` |

**Important**: `DNS_ZONE` is the **zone name** in GCP Cloud DNS, not the domain name itself. 

To find your DNS zone name:
1. Go to [Cloud DNS](https://console.cloud.google.com/net-services/dns/zones?project=flash-asset-460518-v4)
2. Look for the zone that manages `flamingo.cx`  
3. The "Zone name" column shows the value to use (usually `flamingo-cx`)

### 💾 Database Secrets

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `REDIS_IP` | Memorystore Redis IP address | `10.123.45.67` |

### 🌐 Domain Secrets

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `DOMAIN_NAME` | Subdomain name | `mlg` (for mlg.flamingo.cx) |
| `DOMAIN_SUFFIX` | Root domain | `flamingo.cx` |

### 🔧 Application Secrets

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `PROJECT_NAME` | Project display name | `Major League GitHub` |
| `GH_API_TOKENS` | GitHub API tokens (comma-separated) | `token1,token2,token3` |
| `LINKEDIN_CLIENT_ID` | LinkedIn OAuth client ID | `your-linkedin-client-id` |
| `LINKEDIN_CLIENT_SECRET` | LinkedIn OAuth client secret | `your-linkedin-secret` |
| `GTM_ID` | Google Tag Manager ID | `GTM-XXXXXXX` |

## Getting the Values

### GCP Infrastructure Values

```bash
# Get your project ID
gcloud config get-value project

# Get your cluster info
gcloud container clusters list

# Get Redis IP
gcloud redis instances describe mlg-redis --region=us-central1 --format="value(host)"

# Get service account key (already created in setup)
cat ~/github-actions-key.json
```

### DNS Values

- `DNS_PROJECT_ID`: `flash-asset-460518-v4` (from the URL you shared)
- `DNS_ZONE`: `flamingo-cx` (the zone name in Cloud DNS)

### Container Registry Values

Container registry path is automatically detected from your repository name (`${{ github.repository }}`).

Example: For repository `flamingo-stack/major-league-github`, images will be pushed to:
- `ghcr.io/flamingo-stack/major-league-github/web-service`
- `ghcr.io/flamingo-stack/major-league-github/cache-updater`  
- `ghcr.io/flamingo-stack/major-league-github/frontend`

## Secrets Validation

The workflow will automatically check that all required secrets are set before starting the deployment. If any are missing, it will show exactly which ones need to be added.

## Security Notes

✅ **No hardcoded values** in the workflow files
✅ **Environment-specific** configurations
✅ **Cross-project** DNS automation without hardcoded project IDs
✅ **Flexible** GKE cluster and zone configuration

## Quick Setup Commands

After you've added all secrets to GitHub, verify your setup:

```bash
# Check your current values
echo "GCP Project: $(gcloud config get-value project)"
echo "GKE Cluster: $(gcloud container clusters list --format='value(name)')"
echo "Redis IP: $(gcloud redis instances describe mlg-redis --region=us-central1 --format='value(host)')"
echo "DNS Project: flash-asset-460518-v4"
```

Once all secrets are added, your deployment will be completely automated and environment-agnostic! 🚀
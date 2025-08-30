# Add DNS Permissions for Automated DNS Updates

Since you already have `flamingo.cx` in GCP Cloud DNS, we can automate the DNS record updates. You need to grant your service account DNS permissions.

## Run these commands in your terminal:

```bash
# Set your project ID (replace with your actual project ID)
export PROJECT_ID="major-league-github"

# Enable Cloud DNS API (if not already enabled)
gcloud services enable dns.googleapis.com

# Grant DNS admin permissions to your GitHub Actions service account
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/dns.admin"

# Verify your DNS zone exists (should show flamingo-cx)
gcloud dns managed-zones list

# If flamingo-cx zone doesn't exist, create it:
# gcloud dns managed-zones create flamingo-cx \
#   --dns-name=flamingo.cx \
#   --description="Flamingo CX domain zone"
```

## What this enables:

✅ **Automatic DNS Updates**: The workflow will automatically update your DNS A record to point to the new GKE load balancer IP

✅ **No Manual DNS Steps**: You won't need to manually copy/paste IP addresses

✅ **Immediate Cutover**: DNS switches happen as part of the deployment

## Alternative: Manual DNS

If you prefer to manage DNS manually, you can:

1. **Remove the DNS step** from the workflow
2. **Get the Load Balancer IP** from the workflow output  
3. **Update DNS manually** in GCP Console

Let me know if you want me to remove the automated DNS step or if you want to proceed with the automated approach!
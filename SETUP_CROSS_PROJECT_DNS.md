# Setup Cross-Project DNS Automation

This will allow your GitHub Actions workflow to automatically update DNS records in the `flamingo.cx` project from your MLG project.

## Grant Cross-Project DNS Permissions

Run these commands to grant your service account DNS access to the flamingo.cx project:

```bash
# Get your project IDs from GitHub secrets values
MLG_PROJECT_ID="your-mlg-project-id"    # Same as GCP_PROJECT_ID secret
DNS_PROJECT_ID="flash-asset-460518-v4"  # Same as DNS_PROJECT_ID secret

# Service account email
SA_EMAIL="github-actions@${MLG_PROJECT_ID}.iam.gserviceaccount.com"

echo "Granting DNS permissions to: $SA_EMAIL"
echo "For DNS project: $DNS_PROJECT_ID"

# Grant DNS admin role on the DNS project
gcloud projects add-iam-policy-binding $DNS_PROJECT_ID \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/dns.admin"

echo "✅ Cross-project DNS permissions granted!"
```

## Enable DNS API in DNS Project

```bash
# Switch to DNS project and enable API
gcloud config set project $DNS_PROJECT_ID
gcloud services enable dns.googleapis.com

# Switch back to your MLG project  
gcloud config set project $MLG_PROJECT_ID
```

## Verify Setup

Test that the permissions work:

```bash
# Test cross-project access
gcloud dns managed-zones list --project=$DNS_PROJECT_ID

# Should show the flamingo-cx zone
```

## What This Enables

✅ **Fully Automated Deployment**: Push to GitHub → Deploy to GKE → Update DNS → Live site

✅ **Zero Manual Steps**: No need to copy/paste IP addresses or update DNS manually

✅ **Immediate Cutover**: Your site switches to GCP as soon as deployment completes

## Security Note

The service account only gets DNS admin permissions on the specific DNS project. It cannot access or modify anything else in that project.

## Alternative: Manual Approach

If you prefer not to grant cross-project permissions, you can:

1. Remove the DNS automation step from the workflow
2. Get the Load Balancer IP from workflow output
3. Manually update DNS in the GCP console

Let me know which approach you prefer!
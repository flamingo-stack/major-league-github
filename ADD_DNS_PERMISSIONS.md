# DNS Configuration for Cross-Project Setup

Since your `flamingo.cx` DNS zone is in a different GCP project (`flash-asset-460518-v4`), the workflow will provide you with the Load Balancer IP for manual DNS updates.

## How it works:

1. **Workflow completes deployment** to GKE
2. **Gets Load Balancer IP** from the ingress
3. **Shows DNS update instructions** with the exact IP and steps
4. **You manually update** the DNS record in the other project

## Manual DNS Update Steps:

After deployment, the workflow will show:

```
🌍 DNS UPDATE REQUIRED:
======================================
Load Balancer IP: 34.102.136.180
Domain: your-domain.flamingo.cx

📝 MANUAL STEPS:
1. Go to: https://console.cloud.google.com/net-services/dns/zones?project=flash-asset-460518-v4
2. Click on 'flamingo-cx' zone  
3. Find the A record for 'your-domain'
4. Update it to point to: 34.102.136.180
5. Save changes
======================================
```

## Alternative: Cross-Project Access

If you want fully automated DNS, you could:

1. **Grant cross-project permissions** (complex)
2. **Move the DNS zone** to your new project (if possible)
3. **Use a service account** from the DNS project

For this migration, **manual DNS update is simpler and safer**.
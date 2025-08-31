# 🛠️ GCP Setup Instructions for Major League GitHub Migration

## Prerequisites

1. **GCP Account**: Ensure you have a Google Cloud account with billing enabled
2. **gcloud CLI**: Install Google Cloud SDK on your local machine
3. **kubectl**: Install kubectl for Kubernetes management
4. **Domain Access**: Ability to modify DNS records for your domain

## Step-by-Step Setup

### 1. Install Google Cloud SDK 📦

**macOS:**
```bash
brew install --cask google-cloud-sdk
```

**Linux/WSL:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

**Windows:**
Download from: https://cloud.google.com/sdk/docs/install

### 2. Initialize gcloud and Login 🔑

```bash
# Login to your Google account
gcloud auth login

# Set up application default credentials
gcloud auth application-default login

# List available projects (if you have any)
gcloud projects list
```

### 3. Create GCP Project 🏗️

```bash
# Set project variables (CHANGE THESE)
export PROJECT_ID="major-league-github"  # Must be globally unique
export PROJECT_NAME="Major League GitHub"
export REGION="us-central1"
export ZONE="us-central1-a"

# Create project
gcloud projects create $PROJECT_ID --name="$PROJECT_NAME"

# Set as default project
gcloud config set project $PROJECT_ID

# Link billing account (you'll need to do this via Console if not set up)
echo "⚠️  IMPORTANT: Enable billing for project $PROJECT_ID in the GCP Console"
echo "   Visit: https://console.cloud.google.com/billing/linkedaccount?project=$PROJECT_ID"
```

### 4. Enable Required APIs 🔌

```bash
# Enable all necessary APIs
gcloud services enable \
    container.googleapis.com \
    compute.googleapis.com \
    redis.googleapis.com \
    cloudresourcemanager.googleapis.com \
    iam.googleapis.com

# Wait for APIs to be enabled
echo "⏳ Waiting for APIs to be enabled..."
sleep 30
```

### 5. Create VPC Network (Optional - use default) 🌐

```bash
# Using default VPC is fine for this setup
# But if you want a custom VPC:
# gcloud compute networks create mlg-network --subnet-mode=auto
```

### 6. Create GKE Cluster 🎯

```bash
# Create the cluster
gcloud container clusters create major-league-github \
    --zone=$ZONE \
    --machine-type=e2-medium \
    --num-nodes=1 \
    --disk-size=50GB \
    --disk-type=pd-standard \
    --no-enable-autoscaling \
    --no-enable-autorepair \
    --enable-ip-alias \
    --network="default" \
    --subnetwork="default" \
    --logging=SYSTEM \
    --monitoring=SYSTEM

echo "✅ GKE cluster created successfully"
```

### 7. Get Cluster Credentials 🔐

```bash
# Get kubectl credentials for the cluster
gcloud container clusters get-credentials major-league-github --zone=$ZONE

# Verify connection
kubectl cluster-info
kubectl get nodes
```

### 8. Create Memorystore Redis Instance 💾

```bash
# Create Redis instance
gcloud redis instances create mlg-redis \
    --size=1 \
    --region=$REGION \
    --tier=basic \
    --redis-version=redis_7_0 \
    --network=default

echo "⏳ Redis instance is being created (this takes 5-10 minutes)..."

# Wait for Redis to be ready
gcloud redis instances describe mlg-redis --region=$REGION --format="value(state)"

# Get Redis IP address (save this for later)
REDIS_IP=$(gcloud redis instances describe mlg-redis --region=$REGION --format="value(host)")
echo "✅ Redis IP: $REDIS_IP"
echo "📝 Save this IP address for Kubernetes configuration"
```

### 9. Create Service Account for GitHub Actions 👤

```bash
# Create service account
gcloud iam service-accounts create github-actions \
    --display-name="GitHub Actions Service Account" \
    --description="Service account for GitHub Actions CI/CD"

# Grant necessary permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/container.developer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/container.clusterViewer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/container.clusterAdmin"

# Create and download service account key
gcloud iam service-accounts keys create ~/github-actions-key.json \
    --iam-account=github-actions@$PROJECT_ID.iam.gserviceaccount.com

echo "✅ Service account key saved to ~/github-actions-key.json"
echo "📝 You'll need to add this as a GitHub secret"
```

### 10. Configure Load Balancer Permissions 🔀

```bash
# Grant additional permissions for load balancer management
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/compute.loadBalancerAdmin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/compute.publicIpAdmin"
```

### 11. Test Setup ✅

```bash
# Test cluster access
kubectl get namespaces

# Test Redis connectivity (create a test pod)
kubectl run redis-test --image=redis:alpine --rm -it --restart=Never -- redis-cli -h $REDIS_IP ping

# If you see "PONG", Redis is working!
```

## Required Information for GitHub Secrets 📋

After completing the setup, add these to your GitHub repository secrets:

### New Secrets to Add:

1. **`GCP_SA_KEY`**
   ```bash
   # Copy the contents of the service account key file:
   cat ~/github-actions-key.json
   # Copy the entire JSON and add as GitHub secret
   ```

2. **`GCP_PROJECT_ID`**
   ```
   # Your project ID (the one you set in $PROJECT_ID)
   major-league-github
   ```

### How to Add GitHub Secrets:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with the exact name and value

## Environment Variables Summary 📝

Save these values for your configuration:

```bash
echo "=== SAVE THESE VALUES ==="
echo "GCP_PROJECT_ID: $PROJECT_ID"
echo "GKE_CLUSTER: major-league-github"
echo "GKE_ZONE: $ZONE"
echo "REDIS_IP: $REDIS_IP"
echo "========================="
```

## Verification Commands 🔍

Run these to verify everything is working:

```bash
# Check cluster status
gcloud container clusters describe major-league-github --zone=$ZONE

# Check Redis instance
gcloud redis instances describe mlg-redis --region=$REGION

# Check service account
gcloud iam service-accounts describe github-actions@$PROJECT_ID.iam.gserviceaccount.com

# Test kubectl access
kubectl get nodes -o wide

# Check enabled APIs
gcloud services list --enabled
```

## Cost Optimization Settings 💰

```bash
# Set up billing budgets (optional)
gcloud alpha billing budgets create \
    --display-name="MLG Monthly Budget" \
    --budget-amount=100USD \
    --threshold-rule=percent=90 \
    --threshold-rule=percent=100

# Enable committed use discounts if running long-term
echo "💡 Consider committed use discounts for long-term savings"
```

## Cleanup Commands (if needed) 🧹

If you need to start over:

```bash
# Delete cluster
gcloud container clusters delete major-league-github --zone=$ZONE

# Delete Redis instance
gcloud redis instances delete mlg-redis --region=$REGION

# Delete service account
gcloud iam service-accounts delete github-actions@$PROJECT_ID.iam.gserviceaccount.com

# Delete project (nuclear option)
# gcloud projects delete $PROJECT_ID
```

## Troubleshooting 🔧

### Common Issues:

1. **"Billing not enabled"**
   - Visit GCP Console → Billing → Link billing account

2. **"API not enabled"**
   ```bash
   gcloud services enable container.googleapis.com
   ```

3. **kubectl connection issues**
   ```bash
   gcloud container clusters get-credentials major-league-github --zone=$ZONE
   ```

4. **Redis connection timeout**
   - Ensure VPC peering is working
   - Check firewall rules

5. **Permission denied**
   ```bash
   gcloud auth application-default login
   ```

### Support Resources:

- **GKE Documentation**: https://cloud.google.com/kubernetes-engine/docs
- **Memorystore Documentation**: https://cloud.google.com/memorystore/docs
- **GCP Support**: https://cloud.google.com/support

## Next Steps ➡️

After completing this setup:

1. ✅ Update GitHub secrets with the values above
2. ✅ Modify `.github/workflows/deploy.yml` as outlined in `MOVE_TO_GCP.md`
3. ✅ Update Kubernetes manifests with the Redis IP
4. ✅ Test deployment to your new GKE cluster
5. ✅ Update DNS to point to the new load balancer

## Security Notes 🔒

- **Service Account Key**: Keep `~/github-actions-key.json` secure and delete from local machine after adding to GitHub
- **Least Privilege**: The service account only has necessary GKE permissions
- **VPC**: Using default VPC is fine for this simple setup
- **Firewall**: GKE manages most firewall rules automatically

---

**🎉 Your GCP infrastructure is now ready for the migration!**

Proceed to update your GitHub Actions workflow and Kubernetes manifests as described in `MOVE_TO_GCP.md`.
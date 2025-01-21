#!/bin/bash

# Exit on error
set -e

echo "🦩 Starting registry cleanup..."

# Function to clean manifest string
clean_manifest() {
    local manifest=$1
    # Extract just the SHA256 digest, removing tags and other info
    echo "$manifest" | awk '{print $1}'
}

# Get all repositories
repos=$(doctl registry repository list-v2 --format Repository --no-header)

for repo in $repos; do
    echo "🦩 Processing repository: $repo"
    
    # Get manifests for the repository
    manifests=$(doctl registry repository list-manifests-v2 $repo --format Digest,Tags --no-header)
    
    # Skip if no manifests found
    if [ -z "$manifests" ]; then
        echo "No manifests found for $repo"
        continue
    }
    
    echo "🦩 Found manifests:"
    echo "$manifests"
    
    # Process each manifest
    while IFS= read -r manifest; do
        # Skip empty lines
        [ -z "$manifest" ] && continue
        
        # Get tags for this manifest
        tags=$(echo "$manifest" | awk '{$1=""; print $0}' | xargs)
        
        # Skip if manifest has 'latest' tag
        if echo "$tags" | grep -q "latest"; then
            echo "Skipping manifest with 'latest' tag"
            continue
        fi
        
        # Clean the manifest digest
        digest=$(clean_manifest "$manifest")
        
        echo "🦩 Processing manifest: $digest (Tags: $tags)"
        
        # Delete the manifest
        if doctl registry repository delete-manifest $repo $digest --force; then
            echo "✅ Successfully deleted manifest: $digest"
        else
            echo "⚠️ Warning: Failed to delete manifest: $digest"
        fi
    done <<< "$manifests"
done

echo "✅ Registry cleanup completed" 
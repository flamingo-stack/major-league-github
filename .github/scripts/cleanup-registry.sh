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
repos=$(doctl registry repository list-v2)

for repo in $repos; do
    # Skip empty or invalid repos
    if [ "$repo" = "<nil>" ] || [ -z "$repo" ]; then
        continue
    fi
    
    echo "🦩 Processing repository: $repo"
    
    # Get manifests for the repository
    manifests=$(doctl registry repository list-manifests "$repo")
    
    # Skip if no manifests found
    if [ -z "$manifests" ]; then
        echo "No manifests found for $repo"
        continue
    fi
    
    echo "🦩 Found manifests:"
    echo "$manifests"
    
    # Process each manifest
    while IFS= read -r manifest; do
        # Skip empty lines or headers
        if [ -z "$manifest" ] || [[ "$manifest" == *"Digest"* ]]; then
            continue
        fi
        
        # Get digest and tags from the manifest line
        digest=$(echo "$manifest" | awk '{print $1}')
        tags=$(echo "$manifest" | awk '{$1=""; print $0}' | sed 's/^[[:space:]]*//')
        
        # Skip if manifest has 'latest' tag
        if echo "$tags" | grep -q "latest"; then
            echo "Skipping manifest with 'latest' tag"
            continue
        fi
        
        echo "🦩 Processing manifest: $digest (Tags: $tags)"
        
        # Delete the manifest
        if doctl registry repository delete-manifest "$repo" "$digest" --force; then
            echo "✅ Successfully deleted manifest: $digest"
        else
            echo "⚠️ Warning: Failed to delete manifest: $digest"
        fi
    done <<< "$manifests"
done

# Start garbage collection
echo "🦩 Starting garbage collection..."
if ! doctl registry garbage-collection start --force; then
    echo "⚠️ Warning: Failed to start garbage collection"
fi

echo "✅ Registry cleanup completed" 
#!/bin/bash

# Exit on error
set -e

echo "🦩 Starting registry cleanup..."

# Function to clean manifest string
clean_manifest() {
    local manifest=$1
    echo "$manifest" | awk '{print $1}'
}

# Get all repositories
repos=$(doctl registry repository list-v2)

for repo in $repos; do
    # Skip empty or invalid repos
    if [ "$repo" = "<nil>" ] || [ -z "$repo" ]; then
        continue
    fi
    
    # Get manifests for the repository
    manifests=$(doctl registry repository list-manifests "$repo")
    
    # Skip if no manifests found
    if [ -z "$manifests" ]; then
        continue
    fi
    
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
            continue
        fi
        
        # Delete the manifest quietly
        if doctl registry repository delete-manifest "$repo" "$digest" --force >/dev/null 2>&1; then
            echo "✅ Cleaned up: $repo:$tags"
        fi
    done <<< "$manifests"
done

# Start garbage collection quietly
echo "🦩 Running garbage collection..."
if ! doctl registry garbage-collection start --force >/dev/null 2>&1; then
    echo "⚠️ Warning: Garbage collection failed"
fi

echo "✅ Registry cleanup completed" 
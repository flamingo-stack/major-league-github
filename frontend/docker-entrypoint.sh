#!/bin/sh
set -e

# Set defaults with debug
ENABLE_REDIRECT=${ENABLE_REDIRECT:-false}
TARGET_DOMAIN=${TARGET_DOMAIN:-localhost}
ROOT_DOMAIN=${ROOT_DOMAIN:-}

echo "Debug: ENABLE_REDIRECT='$ENABLE_REDIRECT'"
echo "Debug: TARGET_DOMAIN='$TARGET_DOMAIN'" 
echo "Debug: ROOT_DOMAIN='$ROOT_DOMAIN'"

# Process redirect block conditionally
if [ "$ENABLE_REDIRECT" = "true" ] && [ -n "$ROOT_DOMAIN" ]; then
    echo "Enabling redirect from $ROOT_DOMAIN to $TARGET_DOMAIN"
    export REDIRECT_SERVER_BLOCK=$(envsubst < /etc/nginx/templates/nginx-redirect.conf.template)
else
    echo "Redirect disabled or ROOT_DOMAIN not set"
    export REDIRECT_SERVER_BLOCK=""
fi

# Process main nginx config
envsubst '$TARGET_DOMAIN $REDIRECT_SERVER_BLOCK' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf

# Show final config for debugging
echo "Final nginx configuration:"
cat /etc/nginx/conf.d/default.conf

# Execute CMD
exec "$@"
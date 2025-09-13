FROM node:20-alpine as build
WORKDIR /app

# Install git for ui-kit setup
RUN apk add --no-cache git

# Build arguments from CI/CD
ARG BACKEND_API_URL
ARG GTM_ID
ARG OG_TITLE
ARG OG_DESCRIPTION
ARG OG_TYPE
ARG OG_IMAGE_URL
ARG OG_URL
ARG OG_SITE_NAME
ARG WEBAPP_EXTRA_BUTTON_LINK
ARG WEBAPP_EXTRA_BUTTON_TEXT
ARG ENABLE_REDIRECT=false
ARG ROOT_DOMAIN=""
ARG TARGET_DOMAIN=""
ARG NODE_ENV=production

# Set environment variables for build
ENV BACKEND_API_URL=${BACKEND_API_URL}
ENV GTM_ID=${GTM_ID}
ENV OG_TITLE=${OG_TITLE}
ENV OG_DESCRIPTION=${OG_DESCRIPTION}
ENV OG_TYPE=${OG_TYPE}
ENV OG_IMAGE_URL=${OG_IMAGE_URL}
ENV OG_URL=${OG_URL}
ENV OG_SITE_NAME=${OG_SITE_NAME}
ENV WEBAPP_EXTRA_BUTTON_LINK=${WEBAPP_EXTRA_BUTTON_LINK}
ENV WEBAPP_EXTRA_BUTTON_TEXT=${WEBAPP_EXTRA_BUTTON_TEXT}
ENV NODE_ENV=${NODE_ENV}
ENV GENERATE_SOURCEMAP=false

# Copy app files (ui-kit excluded by .dockerignore)
COPY . .

# Install dependencies fresh in container
RUN npm install

# Ensure webpack and webpack-cli are available
RUN npx webpack-cli --version

# Build the application
RUN npm run build

# Production
FROM nginx:alpine
RUN apk add --no-cache gettext
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/nginx.conf.template
COPY nginx-redirect.conf.template /etc/nginx/templates/nginx-redirect.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80 81
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
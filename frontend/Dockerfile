FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Add build arguments for environment variables
ARG BACKEND_API_URL
ARG OG_TITLE
ARG OG_DESCRIPTION
ARG OG_TYPE
ARG OG_IMAGE_URL
ARG OG_URL
ARG OG_SITE_NAME
ARG NODE_ENV=production

# Set environment variables for the build
ENV BACKEND_API_URL=${BACKEND_API_URL}
ENV OG_TITLE=${OG_TITLE}
ENV OG_DESCRIPTION=${OG_DESCRIPTION}
ENV OG_TYPE=${OG_TYPE}
ENV OG_IMAGE_URL=${OG_IMAGE_URL}
ENV OG_URL=${OG_URL}
ENV OG_SITE_NAME=${OG_SITE_NAME}
ENV NODE_ENV=${NODE_ENV}
ENV GENERATE_SOURCEMAP=false

# Build the application with explicit environment passing
RUN BACKEND_API_URL=${BACKEND_API_URL} \
    OG_TITLE=${OG_TITLE} \
    OG_DESCRIPTION=${OG_DESCRIPTION} \
    OG_TYPE=${OG_TYPE} \
    OG_IMAGE_URL=${OG_IMAGE_URL} \
    OG_URL=${OG_URL} \
    OG_SITE_NAME=${OG_SITE_NAME} \
    NODE_ENV=${NODE_ENV} \
    npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 81
CMD ["nginx", "-g", "daemon off;"] 
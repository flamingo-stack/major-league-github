FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Add build argument for backend API URL
ARG BACKEND_API_URL=http://localhost:8080
ENV BACKEND_API_URL=${BACKEND_API_URL}

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Pass the backend URL to runtime environment
ENV BACKEND_API_URL=${BACKEND_API_URL}

EXPOSE 80 81
CMD ["nginx", "-g", "daemon off;"] 
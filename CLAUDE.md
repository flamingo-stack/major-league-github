# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Major League GitHub is a full-stack application that creates leaderboards for GitHub contributors inspired by Major League Soccer. The project uses a microservices architecture with separate backend services and a React frontend.

## Architecture
- **Backend**: Java 21 + Spring Boot 3.4 with two microservices:
  - Backend Service: Handles API requests and data serving (port 8450)
  - Cache Updater: Background service for maintaining GitHub data freshness (port 8451)
- **Frontend**: React 18 + TypeScript + Material-UI with Webpack 5 bundling
- **Infrastructure**: Redis for distributed caching, Docker + Kubernetes for deployment on GKE
- **Deployment**: GitHub Actions CI/CD with automated builds and deployment to Google Cloud Platform

## Development Commands

### Backend
```bash
cd backend

# Build the project
./mvnw clean install

# Run Backend Service (default profile)
./mvnw spring-boot:run -Pbackend-service

# Run Cache Updater service
./mvnw spring-boot:run -Pcache-updater

# Note: Tests are currently skipped via maven-surefire-plugin configuration
```

### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Linting
npm run lint

# Type checking
npm run type-check

# Generate favicon from SVG
npm run generate-favicon
```

## Key Technical Details

### Backend Profiles
The backend uses Maven profiles to run different microservices:
- `backend-service`: Default profile for the main API service
- `cache-updater`: Profile for the background data update service

### Frontend Build System
Uses Webpack 5 instead of Vite, configured with:
- TypeScript support via ts-loader
- React + Material-UI components
- Custom webpack configuration for production builds

### Data Flow
1. Cache Updater fetches data from GitHub API and stores in Redis
2. Backend Service reads from Redis cache to serve API requests
3. Frontend uses React Query (@tanstack/react-query) for data fetching

## Environment Configuration
Backend requires `.env` file with:
- `GITHUB_TOKENS`: Comma-separated GitHub API tokens
- `LINKEDIN_CLIENT_ID/SECRET`: LinkedIn API credentials
- `REDIS_HOST/PORT`: Redis connection details

Frontend supports optional environment variables for Google Tag Manager and Open Graph meta tags:
- `GTM_ID`: Google Tag Manager container ID
- `OG_TITLE`, `OG_DESCRIPTION`, `OG_TYPE`, `OG_IMAGE_URL`, `OG_SITE_NAME`: Open Graph meta tags

## Development Ports
- Backend Service: http://localhost:8450
- Backend Cache Updater: http://localhost:8451  
- Frontend Development: http://localhost:3000
- Redis: localhost:6379

## Production Deployment
- **Live Site**: https://major-league-github.flamingo.cx
- **Platform**: Google Kubernetes Engine (GKE)
- **SSL**: Google-managed certificates with automatic HTTP→HTTPS redirect
- **Build Optimization**: Uses dorny/paths-filter for intelligent build skipping
- **Container Registry**: GitHub Container Registry (ghcr.io)

## CI/CD Pipeline
The deployment is fully automated via GitHub Actions:
- **Trigger**: Push to main branch
- **Build Optimization**: Only rebuilds changed services (backend/cache-updater/frontend)
- **Deployment**: Automated deployment to GKE with proper service updates
- **SSL Management**: Automatic certificate provisioning and renewal
- **Image Cleanup**: Automatic cleanup of old container images to save costs

## Key Files
- `.github/workflows/deploy.yml`: Main CI/CD pipeline
- `kubernetes/base/`: Kubernetes manifests for GKE deployment
- `frontend/src/services/api.ts`: API service configuration (uses relative paths)
- Backend profiles configured in `pom.xml` and `application-*.properties` files
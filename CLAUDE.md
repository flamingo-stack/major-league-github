# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Major League GitHub is a full-stack application that creates leaderboards for GitHub contributors inspired by Major League Soccer. The project uses a microservices architecture with separate backend services and a React frontend.

## Architecture
- **Backend**: Java 21 + Spring Boot 3.4 with two microservices:
  - Backend Service: Handles API requests and data serving (port 8450)
  - Cache Updater: Background service for maintaining GitHub data freshness (port 8451)
- **Frontend**: React 19 + TypeScript + Material-UI with Webpack 5 bundling using @flamingo/ui-kit components
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
- React + Material-UI components with @flamingo/ui-kit integration
- Custom webpack configuration for production builds
- Dark theme only (light theme support removed)

### UI Kit Integration
The frontend uses @flamingo/ui-kit for consistency:
- **Fonts**: Uses @flamingo/ui-kit/styles instead of local fonts (DM Sans primary)
- **Icons**: GitHubIcon and MlgLogo components from ui-kit replace Material-UI equivalents
- **Theme**: Dark theme only implementation (all light theme code removed)
- **Components**: Consistent styling across Header and HeroSection components

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
- `WEBAPP_EXTRA_BUTTON_LINK`: Custom blog link URL (defaults to Flamingo blog)
- `WEBAPP_EXTRA_BUTTON_TEXT`: Custom blog button text (defaults to "Why MLG?")

## Development Ports
- Backend Service: http://localhost:8450
- Backend Cache Updater: http://localhost:8451  
- Frontend Development: http://localhost:3000
- Redis: localhost:6379

## Production Deployment
- **Live Site**: https://www.mlg.soccer
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
- `frontend/src/theme.ts`: Dark theme only configuration using Material-UI
- `frontend/src/index.css`: UI kit styles import and font configuration
- `frontend/src/components/Header.tsx`: Navigation with consistent blog/GitHub links
- `frontend/src/components/HeroSection.tsx`: Main hero with responsive logo positioning
- Backend profiles configured in `pom.xml` and `application-*.properties` files

## Recent Major Changes (2025-01)

### Latest Updates (2025-09-10)
- **Nginx-Based Domain Redirects**: Complete overhaul of domain redirect system
  - Replaced fragile JavaScript client-side redirects with server-side nginx 301 redirects
  - Implemented dynamic nginx configuration using environment variable substitution
  - Added dual-domain SSL certificate support (mlg.soccer + www.mlg.soccer)
  - Created conditional redirect server blocks that activate when FORWARD_TO_WWW=true
  - Eliminated ~100 lines of complex sed operations in CI/CD pipeline
  - SEO-friendly permanent redirects with proper HTTP status codes
  - No more visible redirect flicker for users
- **Infrastructure Improvements**:
  - Enhanced Kubernetes ingress configuration with root domain support
  - Streamlined deployment pipeline with cleaner template substitution
  - Added comprehensive nginx configuration validation and debug logging
  - Improved SSL certificate provisioning workflow

### Previous Updates (2025-01-10)
- **React 19 Upgrade**: Complete upgrade from React 18 to React 19 for improved performance and compatibility
- **Full Rebuild**: Complete rebuild from scratch with clean dependency installation
  - Deleted all node_modules and package-lock.json files for both frontend and ui-kit
  - Fresh installation of all dependencies with React 19 compatibility
  - Resolved all TypeScript compilation errors and version conflicts
- **Enhanced Stability**: 
  - Fixed TypeScript configuration to prevent babel/traverse errors
  - Improved webpack aliases for consistent React version resolution
  - Verified deployment workflow compatibility with React 19
  - Application fully functional with React 19 at localhost:3000
- **UI Kit Compatibility**: Updated @flamingo/ui-kit to maintain React 18/19 peer dependency compatibility for other projects

### Earlier Updates (2025-01)
- **UI Kit Migration**: Migrated from local fonts/icons to @flamingo/ui-kit
- **Theme Simplification**: Removed light theme support, dark theme only
- **Component Cleanup**: Unified Header and HeroSection styling and link consistency
- **Mobile Responsiveness**: Improved hero section mobile layout with repositioned logo
- **Font System**: Replaced Google Fonts with ui-kit DM Sans integration
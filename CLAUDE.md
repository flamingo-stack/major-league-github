# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Major League GitHub is a full-stack application that creates leaderboards for GitHub contributors inspired by Major League Soccer. The project uses a microservices architecture with separate backend services and a React frontend.

## Architecture
- **Backend**: Java 21 + Spring Boot 3.4 with two microservices:
  - Web Service: Handles API requests and data serving (port 8450)
  - Cache Updater: Background service for maintaining GitHub data freshness (port 8451)
- **Frontend**: React 18 + TypeScript + Material-UI with Webpack 5 bundling
- **Infrastructure**: Redis for distributed caching, Docker + Kubernetes for deployment

## Development Commands

### Backend
```bash
cd backend

# Build the project
./mvnw clean install

# Run Web Service (default profile)
./mvnw spring-boot:run -Pweb-service

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
```

## Key Technical Details

### Backend Profiles
The backend uses Maven profiles to run different microservices:
- `web-service`: Default profile for the main API service
- `cache-updater`: Profile for the background data update service

### Frontend Build System
Uses Webpack 5 instead of Vite, configured with:
- TypeScript support via ts-loader
- React + Material-UI components
- Custom webpack configuration for production builds

### Data Flow
1. Cache Updater fetches data from GitHub API and stores in Redis
2. Web Service reads from Redis cache to serve API requests
3. Frontend uses React Query (@tanstack/react-query) for data fetching

## Environment Configuration
Backend requires `.env` file with:
- `GITHUB_TOKENS`: Comma-separated GitHub API tokens
- `LINKEDIN_CLIENT_ID/SECRET`: LinkedIn API credentials
- `REDIS_HOST/PORT`: Redis connection details

Frontend supports optional environment variables for Google Tag Manager and Open Graph meta tags.

## Development Ports
- Backend Web Service: http://localhost:8450
- Backend Cache Updater: http://localhost:8451  
- Frontend Development: http://localhost:3000
- Redis: localhost:6379
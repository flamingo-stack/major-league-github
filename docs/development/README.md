# Development Documentation

Welcome to the Major League GitHub development documentation. This section covers everything you need to contribute to, extend, or deploy the project.

---

## Overview

Major League GitHub is a full-stack application composed of:

- A **Java 21 + Spring Boot 3.4** backend (two microservices)
- A **React 19 + TypeScript** frontend
- A **Redis** distributed cache
- A **Docker + Kubernetes (GKE)** deployment pipeline
- A **GitHub Actions** CI/CD workflow

---

## Documentation Index

| Document | Description |
|----------|-------------|
| [Environment Setup](setup/environment.md) | IDE configuration, editor extensions, and dev tooling |
| [Local Development](setup/local-development.md) | Clone, run, debug, and iterate locally |
| [Architecture Overview](architecture/README.md) | System design, data flow, and key design decisions |
| [Security Guidelines](security/README.md) | Authentication, secrets management, and secure coding |
| [Testing Guide](testing/README.md) | Test structure, how to run tests, and coverage |
| [Contributing Guidelines](contributing/guidelines.md) | Code style, branch naming, PR process, and review checklist |

---

## Quick Reference

### Backend Commands

```bash
# Navigate to the backend module
cd backend

# Run the Backend Service (port 8450)
./mvnw spring-boot:run -Dspring-boot.run.profiles=backend-service

# Run the Cache Updater (port 8451)
./mvnw spring-boot:run \
  -Dspring-boot.run.profiles=cache-updater \
  -Dspring-boot.run.arguments=--server.port=8451

# Build the backend JAR
./mvnw clean package -DskipTests
```

### Frontend Commands

```bash
# Navigate to the frontend module
cd frontend

# Install dependencies
npm install

# Start development server
BACKEND_API_URL=http://localhost:8450 npm start

# Build for production
NODE_ENV=production npm run build
```

### Redis

```bash
# Start Redis with Docker
docker run -d -p 6379:6379 --name mlg-redis redis:7

# Check Redis health
redis-cli ping
```

---

## Repository Structure

```text
major-league-github/
├── backend/                    Spring Boot backend (both microservices)
│   └── src/main/java/cx/flamingo/analysis/
│       ├── cache/              Cache abstraction + Redis/Disk implementations
│       ├── config/             Spring configuration (Redis, async, CORS, profiles)
│       ├── controller/         REST controllers (/api/*)
│       ├── exception/          Exception types and global handler
│       ├── graphql/            GitHub GraphQL query builder
│       ├── model/              Domain models (Contributor, City, Language, etc.)
│       ├── rate/               GitHub token rate-limit management
│       └── service/            Business logic services
├── frontend/                   React + TypeScript frontend
│   ├── src/
│   │   ├── components/         React UI components
│   │   ├── hooks/              Custom React hooks (useUrlState, useNearestRegion)
│   │   ├── services/           API service layer (Axios)
│   │   ├── types/              TypeScript type definitions
│   │   └── styles/             Theme and color configuration
│   └── webpack-plugins/        Custom Webpack plugins (SEO, favicon generation)
└── docs/                       Documentation
    └── reference/architecture/ Auto-generated architecture reference (CodeWiki)
```

---

## Key Design Principles

1. **Cache-first architecture** — Redis caching with async background refresh minimizes GitHub API calls and latency
2. **Multi-token rate management** — Multiple GitHub tokens are rotated to maximize API throughput
3. **URL-driven state** — All filter selections are stored in the URL for shareability and deep linking
4. **Strong typing end-to-end** — Java DTOs map 1:1 to TypeScript interfaces
5. **Separation of concerns** — Controllers, services, caching, and models are in distinct layers

---

## Getting Help

- **GitHub Issues:** https://github.com/flamingo-stack/major-league-github/issues
- **Pull Requests:** https://github.com/flamingo-stack/major-league-github/pulls
- **Live Site:** https://www.mlg.soccer

# Development Documentation

Welcome to the Major League GitHub developer documentation. This section covers everything you need to understand, run, and contribute to the project.

---

## Overview

Major League GitHub is a full-stack application consisting of:

- A **Java 21 + Spring Boot 3.4** backend split into two microservices
- A **React 19 + TypeScript** frontend
- **Redis** for distributed caching
- **GitHub Actions** for CI/CD

---

## Documentation Index

### Setup

| Document | Description |
|----------|-------------|
| [Environment Setup](./setup/environment.md) | IDE recommendations, tools, editor extensions |
| [Local Development](./setup/local-development.md) | Clone, run, hot reload, debug configuration |

### Architecture

| Document | Description |
|----------|-------------|
| [Architecture Overview](./architecture/README.md) | System diagram, core components, data flow |

### Quality & Security

| Document | Description |
|----------|-------------|
| [Security Guidelines](./security/README.md) | Auth patterns, secrets management, input validation |
| [Testing Overview](./testing/README.md) | Test structure, running tests, writing new tests |

### Contribution

| Document | Description |
|----------|-------------|
| [Contributing Guidelines](./contributing/guidelines.md) | Code style, branch naming, PR process, commit format |

---

## Quick Navigation

**Setting up for the first time?**
Start with [Environment Setup](./setup/environment.md), then follow [Local Development](./setup/local-development.md).

**Understanding the system?**
Read the [Architecture Overview](./architecture/README.md).

**Submitting a change?**
Review the [Contributing Guidelines](./contributing/guidelines.md) before opening a PR.

**Thinking about security?**
Read the [Security Guidelines](./security/README.md) before working with tokens or configuration.

---

## Repository Structure

```text
major-league-github/
├── backend/                  # Spring Boot backend (both microservices)
│   └── src/main/java/cx/flamingo/analysis/
│       ├── MajorLeagueGithubApplication.java
│       ├── cache/            # Cache abstraction (Redis, Disk)
│       ├── config/           # Spring configuration beans
│       ├── controller/       # REST controllers
│       ├── exception/        # Exception hierarchy
│       ├── graphql/          # GitHub GraphQL query builder
│       ├── model/            # Domain models (Contributor, City, etc.)
│       ├── rate/             # GitHub token rate management
│       └── service/          # Business logic
└── frontend/                 # React 19 + TypeScript frontend
    ├── scripts/              # Build utility scripts
    ├── src/
    │   ├── components/       # React UI components
    │   ├── hooks/            # Custom React hooks
    │   ├── services/         # Axios API services
    │   ├── styles/           # Color mappings, themes
    │   ├── types/            # TypeScript contracts
    │   └── utils/            # Utility functions
    ├── webpack-plugins/      # Custom Webpack plugins
    └── webpack.config.js     # Webpack 5 config
```

---

## Backend Microservices

| Service | Port | Maven Profile | Purpose |
|---------|------|---------------|---------|
| Backend Service | 8450 | `backend-service` (default) | REST API + ranking |
| Cache Updater | 8451 | `cache-updater` | Scheduled cache warming |

Both services share the same codebase and pom.xml. The active profile determines which service starts.

---

## Key External Dependencies

| System | Purpose |
|--------|---------|
| GitHub GraphQL API | Contributor data source |
| LinkedIn API | Job posting integration (optional) |
| Redis | Distributed cache (required in production) |
| Google Kubernetes Engine | Deployment target |

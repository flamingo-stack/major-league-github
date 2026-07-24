# Development Documentation

Welcome to the Major League GitHub development documentation. This section covers everything you need to develop, extend, test, and contribute to the project.

---

## Overview

Major League GitHub is an open-source project with:

- A **Java 21 + Spring Boot 3.4** backend split into two microservices
- A **React 19 + TypeScript** frontend built with Vite and Material-UI
- A **Redis** distributed cache shared between both backend services

The project is designed for local development without needing a complex environment — just Java 21, Node.js 18+, and a running Redis instance.

---

## Development Guides

### Setup

| Guide | Description |
|---|---|
| [Environment Setup](setup/environment.md) | IDE recommendations, required tools, editor extensions |
| [Local Development](setup/local-development.md) | Clone, build, run locally, hot reload, and debug |

### Architecture

| Guide | Description |
|---|---|
| [Architecture Overview](architecture/README.md) | High-level diagrams, component roles, data flow, and key design decisions |

### Quality & Security

| Guide | Description |
|---|---|
| [Security](security/README.md) | Authentication patterns, secrets management, input validation, vulnerability mitigations |
| [Testing](testing/README.md) | Test structure, running tests, writing new tests |

### Contributing

| Guide | Description |
|---|---|
| [Contributing Guidelines](contributing/guidelines.md) | Code style, branch naming, commit format, PR process |

---

## Quick Navigation

```text
docs/development/
├── README.md                    ← You are here
├── setup/
│   ├── environment.md           ← IDE & toolchain setup
│   └── local-development.md    ← Running the project locally
├── architecture/
│   └── README.md               ← System design & data flow
├── security/
│   └── README.md               ← Security practices & secrets
├── testing/
│   └── README.md               ← Testing guide
└── contributing/
    └── guidelines.md           ← Contributing to the project
```

---

## Project Layout

```text
major-league-github/
├── backend/                    # Java 21 + Spring Boot 3.4
│   ├── pom.xml
│   └── src/main/java/cx/flamingo/analysis/
│       ├── config/             # Spring profiles, Redis, async config
│       ├── controller/         # REST controllers (contributors, autocomplete, hiring)
│       ├── service/            # Business logic (GitHub, caching, cities, languages)
│       ├── graphql/            # GitHub GraphQL query builder
│       ├── cache/              # Cache abstraction and Redis implementation
│       ├── rate/               # GitHub token rate-limit manager
│       ├── model/              # Domain models (Contributor, SoccerTeam, City, ...)
│       └── exception/          # Exception types and global handler
│
├── frontend/                   # React 19 + TypeScript
│   ├── package.json
│   ├── vite.config.ts          # Vite build config (dev server + fast refresh)
│   ├── webpack.config.js       # Webpack config (production, SEO, favicons)
│   └── src/
│       ├── App.tsx             # Root component with routing and QueryClient
│       ├── theme.ts            # Material-UI dark theme
│       ├── components/         # UI components (filters, table, hiring, header)
│       ├── hooks/              # Custom React hooks (useContributors, useUrlState)
│       ├── services/           # Axios API client
│       └── types/              # TypeScript type definitions
```

---

## Key Technologies at a Glance

| Layer | Technology | Version |
|---|---|---|
| Backend language | Java | 21 |
| Backend framework | Spring Boot | 3.4.1 |
| Reactive HTTP client | Spring WebFlux | (included in Spring Boot 3.4) |
| JSON serialization | Gson | (managed by Spring Boot) |
| Cache store | Redis (Lettuce driver) | 6+ |
| Frontend language | TypeScript | latest |
| Frontend framework | React | 19 |
| UI library | Material-UI (MUI) | latest |
| HTTP client | Axios + React Query | latest |
| Frontend build | Vite (dev) / Webpack (prod) | latest |

---

## Getting Started with Development

If you haven't set up your environment yet, start with the [Prerequisites Guide](../getting-started/prerequisites.md) and then the [Quick Start Guide](../getting-started/quick-start.md) before diving into the development-specific guides here.

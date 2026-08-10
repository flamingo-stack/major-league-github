# Architecture Overview

Major League GitHub is a full-stack, microservice-based system that transforms GitHub contribution data into a sports-themed leaderboard. This document provides the high-level architecture, component breakdown, data flow, and key design decisions.

For detailed per-module documentation, see the [reference architecture](../../reference/architecture/README.md).

---

## High-Level Architecture

```mermaid
flowchart LR
    User["User (Browser)"] --> Frontend["React 19 Frontend (Port 3000)"]
    Frontend --> Backend["Backend Service (Spring Boot - Port 8450)"]
    Backend --> Redis["Redis Cache"]
    Backend --> GitHub["GitHub GraphQL API"]
    Backend --> LinkedIn["LinkedIn API"]
    CacheUpdater["Cache Updater (Port 8451)"] --> Backend
    CacheUpdater --> GitHub
```

The system has three main runtime components:

| Component | Port | Technology | Role |
|-----------|------|-----------|------|
| Frontend | 3000 | React 19 + TypeScript | Leaderboard UI |
| Backend Service | 8450 | Java 21 + Spring Boot 3.4 | REST API + ranking engine |
| Cache Updater | 8451 | Java 21 + Spring Boot 3.4 | Scheduled cache warming |

Redis serves as the shared distributed cache between both backend services.

---

## Backend Architecture

The backend is a single Maven project that runs as two microservices via Spring profiles.

```mermaid
flowchart TD
    AppCore["Application Core"]
    Controllers["REST Controllers"]
    Services["Backend Services"]
    CacheLayer["Cache Services"]
    GraphQL["GraphQL Components"]
    Rate["Rate Management"]
    Models["Model Entities"]
    Config["Configuration Layer"]

    AppCore --> Controllers
    AppCore --> Services
    AppCore --> CacheLayer
    AppCore --> Config

    Controllers --> Services
    Services --> GraphQL
    Services --> Rate
    Services --> Models
    Services --> CacheLayer
```

### Backend Module Breakdown

| Module | Path | Responsibility |
|--------|------|----------------|
| Application Core | `cx.flamingo.analysis` | Bootstrap, `@EnableCaching`, `@EnableAsync` |
| Controllers | `cx.flamingo.analysis.controller` | REST endpoints (`/api/contributors`, `/api/autocomplete`, etc.) |
| Backend Services | `cx.flamingo.analysis.service` | Business logic, GitHub data, scoring, hiring |
| Cache Services | `cx.flamingo.analysis.cache` | Pluggable cache (Redis, Disk, ReadOnly) |
| GraphQL Components | `cx.flamingo.analysis.graphql` | Fluent GitHub GraphQL query builder |
| Rate Management | `cx.flamingo.analysis.rate` | Multi-token GitHub rate limit orchestration |
| Model Entities | `cx.flamingo.analysis.model` | Domain models: `Contributor`, `City`, `Region`, etc. |
| Configurations | `cx.flamingo.analysis.config` | Spring beans, profiles, Redis, CORS, async pools |

---

## Frontend Architecture

The frontend is a React 19 + TypeScript SPA using Webpack 5 for production builds and Vite for development.

```mermaid
flowchart TD
    Pages["React Pages"] --> Components["Frontend Components"]
    Components --> Hooks["Custom React Hooks"]
    Hooks --> Services["Frontend Services (Axios)"]
    Services --> Backend["Backend REST API"]
    Hooks --> Router["React Router (URL State)"]
```

### Frontend Module Breakdown

| Module | Path | Responsibility |
|--------|------|----------------|
| Components | `src/components/` | UI: filters, leaderboard table, autocomplete, tooltips |
| Hooks | `src/hooks/` | URL state management, nearest region geolocation |
| Services | `src/services/` | Axios-based API calls with typed responses |
| Types | `src/types/` | TypeScript contracts mirroring backend domain models |
| Styles | `src/styles/` | Theme configuration, color mappings |
| Webpack Plugins | `webpack-plugins/` | SEO files generator, favicon generator |

---

## Core Data Flow

### Contributor Search Request

```mermaid
sequenceDiagram
    participant Browser
    participant ReactApp as React App
    participant Hook as useUrlState Hook
    participant Service as Frontend Service
    participant Controller as ContributorController
    participant GithubSvc as GithubService
    participant Cache as CacheServiceAbs
    participant GitHubAPI as GitHub GraphQL API

    Browser->>ReactApp: User selects language/location filter
    ReactApp->>Hook: Update URL state (cityId, languageId, etc.)
    Hook->>Service: getContributors(params)
    Service->>Controller: GET /api/contributors/search
    Controller->>Cache: getHttpResponse()
    Cache-->>Controller: Cache Hit (return cached list)
    Controller-->>Service: ApiResponse with Contributor[]
    Service-->>ReactApp: Contributor[]
    ReactApp-->>Browser: Render leaderboard

    Note over Cache,GitHubAPI: On cache miss:
    Cache->>GithubSvc: Execute supplier
    GithubSvc->>GitHubAPI: GraphQL query (location + language)
    GitHubAPI-->>GithubSvc: User data
    GithubSvc->>GithubSvc: Score contributors
    GithubSvc-->>Cache: Store result
```

---

## Contributor Scoring Formula

The ranking engine scores each contributor as:

```text
score = commits × max(starsReceived, 1) × recencyMultiplier
```

- **commits** — total commits across repositories
- **starsReceived** — total stars received (floored at 1 to prevent zero score)
- **recencyMultiplier** — `1.0` to `2.0`, based on activity in the past year

---

## Cache Architecture

The cache layer uses a pluggable abstraction supporting three implementations:

```mermaid
flowchart LR
    Services["Backend Services"] --> Abstract["CacheServiceAbs (Abstract)"]
    Abstract --> Redis["RedisCacheService"]
    Abstract --> Disk["DiskCacheService"]
    Redis --> ReadOnly["ReadOnlyCacheService"]

    Redis --> RedisDB[("Redis")]
    Disk --> FS[("File System")]
```

| Mode | Description |
|------|-------------|
| `read-write` | Normal operation — read from cache, write on miss |
| `read-only` | Safe mode — read from Redis, never write |
| `force-update` | Always bypass cache and fetch fresh |

The active implementation is selected at startup via `cache.implementation` and `cache.mode` properties.

---

## Rate Management

GitHub API rate limits are managed via `GithubTokenRateManager`:

```mermaid
flowchart TD
    Request["Outbound GitHub Request"] --> Evaluate["Evaluate All Tokens"]
    Evaluate --> SecondaryCheck{"All Under Secondary Limit?"}
    SecondaryCheck -->|"Yes"| WaitSecondary["Sleep Until Earliest Retry"]
    SecondaryCheck -->|"No"| PrimaryCheck{"All Exhausted?"}
    PrimaryCheck -->|"Yes"| WaitPrimary["Sleep Until Earliest Reset"]
    PrimaryCheck -->|"No"| Select["Select Token with Highest Remaining Requests"]
    WaitSecondary --> Select
    WaitPrimary --> Select
    Select --> Execute["Execute GitHub GraphQL API Call"]
```

Multiple tokens can be configured via `github.tokens`. The manager tracks:
- **Primary rate limits** (per-hour quota)
- **Secondary rate limits** (burst/abuse protection via `Retry-After` headers)

---

## Geographic Modeling

Contributors are filtered using a multi-level geographic model:

```mermaid
flowchart TD
    Region["Region (multi-state MLS area)"] --> State["State"]
    State --> City["City"]
    City --> SoccerTeam["Nearest MLS Team (Haversine distance)"]
```

Data is loaded from static CSV files at startup (`cities.csv`, `states.csv`, `regions.csv`, `teams.csv`). No database is required.

The Haversine formula (Earth radius = 6371 km) is used to compute the nearest MLS stadium for each city.

---

## Deployment Model

```mermaid
flowchart LR
    GitHubRepo["GitHub Repository"] --> CI["GitHub Actions CI/CD"]
    CI --> Docker["Docker Images"]
    Docker --> GKE["Google Kubernetes Engine"]
    GKE --> BackendPods["Backend + Cache Updater Pods"]
    GKE --> RedisPod["Redis Pod"]
    GKE --> FrontendService["Frontend Service"]
```

- **Containerized:** All services run as Docker containers
- **Orchestrated:** Kubernetes (GKE) manages scaling and health
- **CI/CD:** GitHub Actions builds, tests, and deploys on push

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Two microservices from one codebase | Shared code, separated concerns; profile switching via Maven |
| Redis as distributed cache | Prevents redundant GitHub API calls across pods |
| Multi-token rate management | Maximizes GitHub API throughput without hitting limits |
| URL-driven frontend state | Filter state is shareable and bookmarkable without backend session |
| CSV data files (no database) | Eliminates database dependency for geographic reference data |
| Pluggable cache abstraction | Swap Redis ↔ Disk without changing business logic |
| Haversine proximity for teams | Accurate great-circle distance for stadium assignment |

# Architecture Overview

Major League GitHub is a distributed full-stack application organized into 18 logical modules across two Spring Boot microservices and a React TypeScript frontend.

---

## High-Level System Architecture

```mermaid
flowchart TD
    User["User Browser"] --> Frontend["React 19 + TypeScript\nFrontend"]
    Frontend --> BackendAPI["Backend Service\nPort 8450"]

    BackendAPI --> Controllers["REST Controllers\n/api/*"]
    Controllers --> Services["Service Layer\n(GitHub, Hiring, City, Language)"]
    Services --> Cache["CacheServiceAbs"]
    Cache --> Redis[("Redis")]
    Cache --> Disk[("Disk Cache\n(local dev)")]

    Services --> GraphQL["GitHubQueryBuilder\n(GraphQL DSL)"]
    GraphQL --> GitHubAPI["GitHub GraphQL API"]

    Services --> LinkedIn["LinkedIn API\n(Hiring Data)"]

    CacheUpdater["Cache Updater\nPort 8451"] --> Redis
    CacheUpdater --> GitHubAPI

    Redis --> BackendAPI
```

---

## Core Components

| Module | Layer | Key Classes | Responsibility |
|--------|-------|------------|---------------|
| Module 1 | Backend Core | `MajorLeagueGithubApplication`, `CacheServiceAbs` | App bootstrap, cache abstraction |
| Module 2 | Backend Infra | `RedisCacheService`, `AsyncConfig`, `CacheConfig` | Redis implementation, thread pools |
| Module 3 | Backend Config | `RedisConfig`, `WebConfig`, `CacheUpdaterConfig` | CORS, Redis connection, scheduling |
| Module 4 | API Layer | `ContributorController`, `AutocompleteController`, `HiringController` | REST endpoints |
| Module 5 | GraphQL | `GitHubQueryBuilder`, `QuerySerializer`, `Field` | GitHub GraphQL query construction |
| Module 6–7 | Domain Models | `Contributor`, `City`, `Language`, `Region`, `SoccerTeam` | Backend data contracts |
| Module 8 | Services | `GithubService`, `GithubTokenRateManager`, `CityService` | GitHub API + rate limiting + scoring |
| Module 9 | Services | `HiringService`, `LinkedInService`, `LanguageService`, `PreCacheService` | Hiring, languages, pre-warming |
| Module 10 | Services | `RegionService`, `StateService`, `SoccerTeamService` | Geographic + team lookups |
| Module 11–12 | Frontend UI | `ContributorsTable`, `LanguageAutocomplete`, `Pagination` | Leaderboard display components |
| Module 13 | Frontend Hooks | `useUrlState`, `useNearestRegion` | URL state + geolocation |
| Module 14 | Frontend API | `api.ts`, `GetContributorsParams` | Axios-based HTTP layer |
| Module 15–16 | Frontend Types | `Contributor`, `Language`, `Region`, `EnhancedCity` | TypeScript type contracts |
| Module 17–18 | Build Tools | `SeoFilesPlugin`, `FaviconGeneratorPlugin` | Webpack build-time plugins |

---

## Backend Architecture Detail

The backend follows a strict layered architecture:

```mermaid
flowchart TD
    App["MajorLeagueGithubApplication\n@SpringBootApplication"] --> Controllers
    
    subgraph Controllers["Controller Layer (Module 4)"]
        C1["ContributorController"]
        C2["AutocompleteController"]
        C3["EntityController"]
        C4["HiringController"]
    end

    subgraph Services["Service Layer (Modules 8–10)"]
        S1["GithubService"]
        S2["HiringService"]
        S3["CityService"]
        S4["LanguageService"]
        S5["RegionService"]
        S6["SoccerTeamService"]
        S7["PreCacheService"]
    end

    subgraph CacheLayer["Cache Layer (Modules 1–2)"]
        CA["CacheServiceAbs"]
        CR["RedisCacheService"]
        CD["DiskCacheService"]
    end

    Controllers --> Services
    Services --> CacheLayer
    Services --> GraphQL["GitHubQueryBuilder (Module 5)"]
    Services --> RateManager["GithubTokenRateManager (Module 8)"]
    CA --> CR
    CA --> CD
```

---

## GitHub Data Retrieval Flow

```mermaid
sequenceDiagram
    participant Client
    participant Controller as ContributorController
    participant Cache as CacheServiceAbs
    participant Service as GithubService
    participant Rate as GithubTokenRateManager
    participant Builder as GitHubQueryBuilder
    participant GitHub as GitHub GraphQL API

    Client->>Controller: GET /api/contributors/search
    Controller->>Cache: getHttpResponse(key, callback)
    Cache->>Cache: Check Redis
    alt Cache Hit
        Cache-->>Controller: Cached contributor list
    else Cache Miss
        Cache->>Service: getTopContributorsIn(city, language)
        Service->>Builder: build GraphQL query
        Builder-->>Service: query string
        Service->>Rate: select optimal token
        Rate-->>Service: WebClient + token
        Service->>GitHub: Execute GraphQL request
        GitHub-->>Service: JSON response
        Service-->>Cache: Ranked Contributor list
        Cache-->>Controller: Fresh contributor list
    end
    Controller-->>Client: ApiResponse<List<Contributor>>
```

---

## Frontend Architecture

The frontend is a single-page React application built with Webpack. All application state that affects the leaderboard view is stored in the URL query string:

```mermaid
flowchart LR
    User["User Action"] --> Filters["FiltersPanel\n(Dropdowns)"]
    Filters --> UrlState["useUrlState Hook\n(URL Query Params)"]
    UrlState --> ReactQuery["React Query\nuseQuery"]
    ReactQuery --> ApiLayer["api.ts\n(Axios)"]
    ApiLayer --> Backend["Backend REST API"]
    Backend --> Table["ContributorsTable\nComponent"]
    Table --> User
```

### URL State Parameters

| Query Parameter | Filter |
|----------------|--------|
| `languageId` | Programming language |
| `regionId` | MLS geographic region |
| `stateId` | U.S. state |
| `cityId` | City |
| `teamId` | MLS team |

---

## Caching Architecture

The system uses a **cache-first, async-refresh** pattern:

```mermaid
flowchart TD
    Request["Incoming Request"] --> CacheCheck["CacheServiceAbs.get()"]
    CacheCheck --> Exists{"Entry\nExists?"}
    Exists -->|"No"| Fetch["Fetch From GitHub"]
    Exists -->|"Yes"| Stale{"Is Stale?"}
    Stale -->|"No"| Return["Return Cached Data"]
    Stale -->|"Yes"| AsyncRefresh["Async Background Refresh"]
    AsyncRefresh --> Return
    Fetch --> Store["Store In Redis"]
    Store --> Return
```

Three cache implementations are available:

| Implementation | Config Value | Use Case |
|---------------|-------------|----------|
| `RedisCacheService` | `redis` | Production — distributed, scalable |
| `DiskCacheService` | `disk` | Local development — no Redis needed |
| `ReadOnlyCacheService` | `read-only` mode | Read-only replica deployments |

---

## Contributor Scoring Formula

```text
Score = commits × max(starsReceived, 1) × recencyMultiplier

Where:
  commits           = total GitHub contributions in the selected period
  starsReceived     = stars on repositories in the selected language
  recencyMultiplier = [1.0, 2.0] linearly scaled by recency of last activity
```

This formula simultaneously rewards:

- **Volume** — developers who contribute frequently
- **Impact** — developers whose repositories attract stars
- **Freshness** — developers who are actively contributing now

---

## Deployment Architecture

```mermaid
flowchart LR
    Code["Source Code\n(GitHub)"] --> Actions["GitHub Actions\nCI/CD"]
    Actions --> Docker["Docker Images"]
    Docker --> GKE["Google Kubernetes Engine"]

    subgraph GKE["GKE Cluster"]
        BackendPod["Backend Service Pod\n(Port 8450)"]
        CachePod["Cache Updater Pod\n(Port 8451)"]
        RedisPod["Redis Pod"]
    end

    BackendPod --> RedisPod
    CachePod --> RedisPod
```

- The **Backend Service** and **Cache Updater** run as separate Kubernetes Deployments
- Both services share the same Redis instance
- GitHub Actions builds Docker images and deploys to GKE on every push to `main`

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Two microservices instead of one | Separates read (API) from write (cache refresh) workloads independently |
| Redis as primary cache | Enables horizontal scaling and shared cache across multiple backend replicas |
| Multiple GitHub tokens | Allows higher API throughput by rotating across rate-limit windows |
| Haversine distance for geolocation | Accurate great-circle distance to nearest MLS stadium without external API |
| URL-driven filter state | Enables bookmarking, sharing, and browser back/forward navigation |
| Custom Webpack plugins | Generates SEO files (sitemap.xml, robots.txt) and favicons at build time |

---

## Reference Documentation

In-depth per-module documentation is available in `docs/reference/architecture/`. Each module document includes component diagrams, sequence diagrams, and implementation details.

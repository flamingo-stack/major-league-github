# Major League GitHub — Documentation

Welcome to the documentation for **[Major League GitHub](https://www.mlg.soccer)**, an open-source, sports-themed leaderboard that ranks GitHub contributors like professional soccer players — filtered by programming language, geographic location, and proximity to MLS stadiums.

> **Live site:** [https://www.mlg.soccer](https://www.mlg.soccer) · **GitHub:** [https://github.com/flamingo-stack/major-league-github](https://github.com/flamingo-stack/major-league-github)

---

## 📚 Table of Contents

- [Getting Started](#-getting-started)
- [Development](#-development)
- [Reference Architecture](#-reference-architecture)
- [Diagrams](#-diagrams)
- [Quick Links](#-quick-links)

---

## 🚀 Getting Started

New to Major League GitHub? Start here.

| Guide | Description |
|-------|-------------|
| [Introduction](./getting-started/introduction.md) | What Major League GitHub is, what it does, and who it's for |
| [Prerequisites](./getting-started/prerequisites.md) | Required tools, GitHub PATs, and environment variables |
| [Quick Start](./getting-started/quick-start.md) | Run the full stack locally in about 5 minutes |
| [First Steps](./getting-started/first-steps.md) | Explore filters, scoring, CSV export, and the REST API |

---

## 🛠 Development

Guides for contributors and engineers working on the codebase.

| Guide | Description |
|-------|-------------|
| [Development Overview](./development/README.md) | Project structure, two backend profiles, and quick links |
| [Local Development](./development/setup/local-development.md) | Clone, build, run, debug, and inspect Redis locally |
| [Environment Setup](./development/setup/environment.md) | IDE configuration, editor extensions, linting, and path aliases |
| [Security](./development/security/README.md) | Secrets management, CORS, input validation, and vulnerability reporting |
| [Architecture Overview](./development/architecture/README.md) | System design, data flow, module map, and key design decisions |

---

## 📖 Reference Architecture

Detailed technical reference for every module in the system.

### System Overview

- [Architecture Overview](./reference/architecture/README.md) — Full system map and component index

### Backend Modules

| Module | Description |
|--------|-------------|
| [Core Application](./reference/architecture/core-application/core-application.md) | Spring Boot bootstrap, `@EnableCaching`, `@EnableAsync` |
| [Controllers](./reference/architecture/controllers/controllers.md) | REST API layer — `/api/contributors`, `/api/autocomplete`, `/api/entities`, `/api/hiring` |
| [Service Layer](./reference/architecture/service-layer/service-layer.md) | GitHub integration, scoring engine, geographic filtering, cache warm-up |
| [Cache Services](./reference/architecture/cache-services/cache-services.md) | Redis + disk cache abstraction, read-only mode |
| [Configurations](./reference/architecture/configurations/configurations.md) | CORS, Redis, scheduling, async thread pool |
| [Rate Management](./reference/architecture/rate-management/rate-management.md) | Multi-token GitHub API rate limiting and token rotation |
| [GraphQL Components](./reference/architecture/graphql-components/graphql-components.md) | GitHub GraphQL query builder (fluent DSL) |
| [Model Entities](./reference/architecture/model-entities/model-entities.md) | Domain models: `Contributor`, `City`, `Region`, `State`, `SoccerTeam`, `Language` |

### Backend Infrastructure Modules

| Module | Description |
|--------|-------------|
| [Module 1](./reference/architecture/module_1/module_1.md) | Application bootstrap + cache abstraction (`CacheServiceAbs`) |
| [Module 2](./reference/architecture/module_2/module_2.md) | Redis implementation + async thread pool configuration |
| [Module 2 — Configuration Layer](./reference/architecture/module_2/configuration_layer.md) | Configuration layer detail |
| [Module 2 — Cache Layer](./reference/architecture/module_2/cache_layer.md) | Cache layer detail |
| [Module 3](./reference/architecture/module_3/module_3.md) | Infrastructure config: Redis, CORS, scheduling, JSON adapters |
| [Module 4](./reference/architecture/module_4/module_4.md) | REST controllers |
| [Module 5](./reference/architecture/module_5/module_5.md) | GitHub GraphQL query builder |
| [Module 6](./reference/architecture/module_6/module_6.md) | Domain models (Part 1) |
| [Module 7](./reference/architecture/module_7/module_7.md) | Domain models (Part 2) |
| [Module 8](./reference/architecture/module_8/module_8.md) | `GithubService`, scoring engine, `GithubTokenRateManager`, `CityService` |
| [Module 9](./reference/architecture/module_9/module_9.md) | `HiringService`, `LanguageService`, `PreCacheService`, `LinkedInService` |
| [Module 10](./reference/architecture/module_10/module_10.md) | `RegionService`, `StateService`, `SoccerTeamService`, `ReferencePopulationService` |

### Frontend Modules

| Module | Description |
|--------|-------------|
| [Frontend Components](./reference/architecture/frontend-components/frontend-components.md) | UI components: `ContributorsTable`, `FiltersPanel`, pagination |
| [Frontend Hooks](./reference/architecture/frontend-hooks/frontend-hooks.md) | Custom React hooks |
| [Frontend Services](./reference/architecture/frontend-services/frontend-services.md) | Axios API service layer |
| [Frontend Types](./reference/architecture/frontend-types/frontend-types.md) | TypeScript type definitions (`Contributor`, `City`, `ApiResponse<T>`) |
| [Module 11](./reference/architecture/module_11/module_11.md) | Contributors table + UI contracts |
| [Module 12](./reference/architecture/module_12/module_12.md) | Pagination and mobile/desktop views |
| [Module 13](./reference/architecture/module_13/module_13.md) | URL state + geolocation hooks |
| [Module 13 — useUrlState](./reference/architecture/module_13/use_url_state.md) | URL ↔ filter state synchronization hook |
| [Module 13 — useNearestRegion](./reference/architecture/module_13/use_nearest_region.md) | Nearest MLS region geolocation hook |
| [Module 14](./reference/architecture/module_14/module_14.md) | API integration layer (Axios + `useUrlState`) |
| [Module 15](./reference/architecture/module_15/module_15.md) | Core API TypeScript types |
| [Module 16](./reference/architecture/module_16/module_16.md) | Enhanced types and models |
| [Module 17](./reference/architecture/module_17/module_17.md) | Hiring types (`HiringManagerProfile`, `JobOpening`) |
| [Module 18](./reference/architecture/module_18/module_18.md) | SEO Webpack plugin (`SeoFilesPlugin` → `sitemap.xml`, `robots.txt`) |
| [Webpack Plugins](./reference/architecture/webpack-plugins/webpack-plugins.md) | Custom Webpack plugins: SEO and favicon generation |

---

## 📊 Diagrams

Architecture diagrams are available as Mermaid (`.mmd`) files in the `docs/diagrams/architecture/` directory.

Key diagrams include:

- `docs/diagrams/architecture/README.mmd` — System overview
- `docs/diagrams/architecture/service-layer.mmd` — Service layer dependency graph
- `docs/diagrams/architecture/core-application.mmd` — Core application startup flow
- `docs/diagrams/architecture/controllers.mmd` — Controller routing architecture
- `docs/diagrams/architecture/cache_layer.mmd` — Cache abstraction and flow
- `docs/diagrams/architecture/rate-management.mmd` — GitHub token rate management
- `docs/diagrams/architecture/frontend-components.mmd` — Frontend component hierarchy
- `docs/diagrams/architecture/use_url_state.mmd` — URL state hook data flow

All `.mmd` files can be rendered with the [Mermaid CLI](https://github.com/mermaid-js/mermaid-cli) or viewed directly in GitHub.

---

## 🔗 Quick Links

| Resource | Link |
|----------|------|
| Project README | [../README.md](../README.md) |
| Contributing Guide | [../CONTRIBUTING.md](../CONTRIBUTING.md) |
| Live Site | [https://www.mlg.soccer](https://www.mlg.soccer) |
| GitHub Repository | [https://github.com/flamingo-stack/major-league-github](https://github.com/flamingo-stack/major-league-github) |
| Open Issues | [https://github.com/flamingo-stack/major-league-github/issues](https://github.com/flamingo-stack/major-league-github/issues) |
| Pull Requests | [https://github.com/flamingo-stack/major-league-github/pulls](https://github.com/flamingo-stack/major-league-github/pulls) |
| Releases | [https://github.com/flamingo-stack/major-league-github/releases](https://github.com/flamingo-stack/major-league-github/releases) |
| Security Advisories | [https://github.com/flamingo-stack/major-league-github/security/advisories](https://github.com/flamingo-stack/major-league-github/security/advisories) |

---

*Documentation generated by [🦩 Flamingo AI Technical Writer](https://flamingo.run)*

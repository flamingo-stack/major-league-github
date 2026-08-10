# Major League GitHub — Documentation

Welcome to the documentation for **[Major League GitHub](https://www.mlg.soccer)** — an open-source, sports-themed leaderboard that ranks GitHub contributors like professional soccer players, filtered by programming language, geographic location, and proximity to MLS stadiums.

---

## 📚 Table of Contents

- [Getting Started](#-getting-started)
- [Development](#-development)
- [Reference Architecture](#-reference-architecture)
- [Architecture Diagrams](#-architecture-diagrams)
- [Quick Links](#-quick-links)

---

## 🚀 Getting Started

New to the project? Start here.

| Document | Description |
|----------|-------------|
| [Introduction](./getting-started/introduction.md) | What Major League GitHub is, who it's for, and how it works |
| [Prerequisites](./getting-started/prerequisites.md) | Required tools, accounts, and environment variables |
| [Quick Start](./getting-started/quick-start.md) | Get the app running locally in ~5 minutes |
| [First Steps](./getting-started/first-steps.md) | Explore the leaderboard, REST API, and configuration options |

---

## 🛠️ Development

Guides for contributors and developers working on the project.

| Document | Description |
|----------|-------------|
| [Development Overview](./development/README.md) | Documentation index, repository structure, and key dependencies |
| [Environment Setup](./development/setup/environment.md) | IDE recommendations, Lombok setup, ESLint, and editor extensions |
| [Local Development](./development/setup/local-development.md) | Clone, run, hot reload, debug configurations, and production builds |
| [Architecture Overview](./development/architecture/README.md) | System diagram, component breakdown, data flow, and design decisions |
| [Security Guidelines](./development/security/README.md) | Token management, secrets, CORS, input validation, and audit checklists |

---

## 📖 Reference Architecture

Detailed technical documentation for every module in the codebase.

### Backend Modules

| Document | Description |
|----------|-------------|
| [Overview](./reference/architecture/README.md) | End-to-end architecture, system overview, and design principles |
| [Application Core](./reference/architecture/application-core/application-core.md) | Spring Boot bootstrap, `@EnableCaching`, `@EnableAsync` |
| [Backend Services](./reference/architecture/backend-services/backend-services.md) | Business logic: GitHub ranking, geographic modeling, hiring integration |
| [Cache Services](./reference/architecture/cache-services/cache-services.md) | Pluggable cache abstraction (Redis, Disk, ReadOnly) |
| [Configurations](./reference/architecture/configurations/configurations.md) | Spring beans, profiles, Redis, CORS, async thread pools |
| [Controllers](./reference/architecture/controllers/controllers.md) | REST endpoints: `/api/contributors`, `/api/autocomplete`, `/api/entities`, `/api/hiring` |
| [GraphQL Components](./reference/architecture/graphql-components/graphql-components.md) | Fluent GitHub GraphQL query builder |
| [Model Entities](./reference/architecture/model-entities/model-entities.md) | Domain models: `Contributor`, `City`, `Region`, `State`, `SoccerTeam` |
| [Rate Management](./reference/architecture/rate-management/rate-management.md) | Multi-token GitHub rate limit orchestration |

### Frontend Modules

| Document | Description |
|----------|-------------|
| [Frontend Components](./reference/architecture/frontend-components/frontend-components.md) | UI components: leaderboard table, autocomplete, filters, pagination |
| [Frontend Hooks](./reference/architecture/frontend-hooks/frontend-hooks.md) | `useNearestRegion` (Haversine geolocation), `useUrlState` (URL-driven filters) |
| [Frontend Services](./reference/architecture/frontend-services/frontend-services.md) | Axios-based API service layer |
| [Frontend Types](./reference/architecture/frontend-types/frontend-types.md) | TypeScript contracts mirroring backend domain models |
| [Webpack Plugins](./reference/architecture/webpack-plugins/webpack-plugins.md) | Custom build plugins: `FaviconGeneratorPlugin`, `SeoFilesPlugin` |

---

## 🗺️ Architecture Diagrams

Visual Mermaid diagrams are available in the `docs/diagrams/architecture/` directory.

Key diagrams include:

- **System overview** — `docs/diagrams/architecture/README.mmd`
- **Backend services** — `docs/diagrams/architecture/backend-services.mmd`
- **Cache services** — `docs/diagrams/architecture/cache-services.mmd`
- **Rate management** — `docs/diagrams/architecture/rate-management.mmd`
- **Frontend components** — `docs/diagrams/architecture/frontend-components.mmd`
- **Frontend hooks** — `docs/diagrams/architecture/frontend-hooks.mmd`
- **Model entities** — `docs/diagrams/architecture/model-entities.mmd`
- **GraphQL components** — `docs/diagrams/architecture/graphql-components.mmd`
- **Controllers** — `docs/diagrams/architecture/controllers.mmd`
- **Configurations** — `docs/diagrams/architecture/configurations.mmd`
- **Webpack plugins** — `docs/diagrams/architecture/webpack-plugins.mmd`
- **Application core** — `docs/diagrams/architecture/application-core.mmd`
- **Frontend services** — `docs/diagrams/architecture/frontend-services.mmd`
- **Frontend types** — `docs/diagrams/architecture/frontend-types.mmd`

---

## 🔗 Quick Links

| Resource | Link |
|----------|------|
| Project README | [../README.md](../README.md) |
| Contributing Guide | [../CONTRIBUTING.md](../CONTRIBUTING.md) |
| Live Site | [https://www.mlg.soccer](https://www.mlg.soccer) |
| GitHub Repository | [https://github.com/flamingo-stack/major-league-github](https://github.com/flamingo-stack/major-league-github) |
| Issues | [https://github.com/flamingo-stack/major-league-github/issues](https://github.com/flamingo-stack/major-league-github/issues) |
| Pull Requests | [https://github.com/flamingo-stack/major-league-github/pulls](https://github.com/flamingo-stack/major-league-github/pulls) |

---

*Documentation generated by [🦩 Flamingo Code Documentation](https://flamingo.run)*

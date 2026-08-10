# Development Documentation

Welcome to the Major League GitHub development guide. This section covers everything you need to contribute to or extend the project — from setting up your local environment to understanding the architecture and contributing code.

---

## Contents

| Guide | Description |
|-------|-------------|
| [Environment Setup](setup/environment.md) | IDE configuration, editor extensions, and development tooling |
| [Local Development](setup/local-development.md) | Clone, build, run, and debug the full stack locally |
| [Architecture Overview](architecture/README.md) | High-level system design, data flow, and module breakdown |
| [Security](security/README.md) | Authentication patterns, secrets management, and vulnerability mitigations |
| [Testing](testing/README.md) | Test structure, running tests, and coverage guidelines |
| [Contributing Guidelines](contributing/guidelines.md) | Code style, branch naming, PR process, and review checklist |

---

## Project Structure

```text
major-league-github/
├── backend/                  # Java 21 + Spring Boot 3.4 backend
│   └── src/main/java/cx/flamingo/analysis/
│       ├── controller/       # REST API controllers
│       ├── service/          # Business logic services
│       ├── cache/            # Cache abstraction + implementations
│       ├── config/           # Spring configuration
│       ├── graphql/          # GitHub GraphQL query builder
│       ├── model/            # Domain models
│       ├── rate/             # GitHub token rate management
│       └── exception/        # Exception handling
├── frontend/                 # React 19 + TypeScript frontend
│   └── src/
│       ├── components/       # UI components
│       ├── hooks/            # Custom React hooks
│       ├── services/         # API integration layer
│       ├── types/            # TypeScript type definitions
│       └── styles/           # Theme and color configuration
├── docs/                     # Documentation
│   └── reference/
│       └── architecture/     # Module-level reference docs
└── package.json              # Root-level JS tooling (doc generation)
```

---

## Two Backend Profiles

The backend runs as **two separate services** from one codebase, activated by Maven profiles:

| Service | Maven Profile | Port | Role |
|---------|--------------|------|------|
| Backend Service | `backend-service` (default) | 8450 | Serves the REST API |
| Cache Updater | `cache-updater` | 8451 | Runs scheduled cache refresh jobs |

The active profile is set via `SPRING_PROFILES_ACTIVE` or the `-P` Maven flag.

---

## Quick Links

- **Repository:** [https://github.com/flamingo-stack/major-league-github](https://github.com/flamingo-stack/major-league-github)
- **Live site:** [https://www.mlg.soccer](https://www.mlg.soccer)
- **Issues:** [https://github.com/flamingo-stack/major-league-github/issues](https://github.com/flamingo-stack/major-league-github/issues)
- **Releases:** [https://github.com/flamingo-stack/major-league-github/releases](https://github.com/flamingo-stack/major-league-github/releases)

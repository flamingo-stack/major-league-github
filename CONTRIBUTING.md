# Contributing to Major League GitHub

Thank you for your interest in contributing to **Major League GitHub**! This is an open-source side project and contributions of all kinds are welcome — bug reports, feature suggestions, documentation improvements, and code changes.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Project Layout](#project-layout)
- [Development Setup](#development-setup)
- [Branch Naming](#branch-naming)
- [Commit Format](#commit-format)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Reporting Issues](#reporting-issues)
- [Community](#community)

---

## Getting Started

Before contributing code, make sure you can run the project locally:

1. Read the [Prerequisites Guide](./docs/getting-started/prerequisites.md) — ensure you have Java 21, Node.js 18+, Redis, and a GitHub PAT.
2. Follow the [Quick Start Guide](./docs/getting-started/quick-start.md) to clone and run all three services.
3. Explore the [Development Documentation](./docs/README.md) for architecture notes and development guides.

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
│
└── docs/                       # Project documentation
```

---

## Development Setup

### Backend

The backend uses two Spring Boot profiles:

- **`backend-service`** — REST API on port `8450`
- **`cache-updater`** — Background cache worker on port `8451`

```bash
cd backend

# Backend Service
./mvnw spring-boot:run \
  -Dspring-boot.run.profiles=backend-service \
  -Dspring-boot.run.jvmArguments="\
    -Dgithub.tokens=YOUR_GITHUB_PAT \
    -Dgithub.api.url=https://api.github.com \
    -Dgithub.api.url.rate_limit=https://api.github.com/rate_limit"

# Cache Updater (new terminal)
./mvnw spring-boot:run \
  -Dspring-boot.run.profiles=cache-updater \
  -Dspring-boot.run.jvmArguments="\
    -Dgithub.tokens=YOUR_GITHUB_PAT \
    -Dgithub.api.url=https://api.github.com \
    -Dgithub.api.url.rate_limit=https://api.github.com/rate_limit"
```

### Frontend

```bash
cd frontend
npm install
BACKEND_API_URL=http://localhost:8450 npm run dev
```

The dev server proxies all `/api` requests to the Backend Service on port `8450`.

### Redis

Both backend services require a Redis instance on `localhost:6379` (default). Start it with:

```bash
redis-server
```

---

## Branch Naming

Use descriptive, lowercase, hyphen-separated branch names with a short prefix indicating the type of change:

| Prefix | Use for |
|---|---|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `docs/` | Documentation changes only |
| `chore/` | Maintenance, dependency updates, build changes |
| `refactor/` | Code refactoring with no behaviour change |
| `test/` | Adding or improving tests |

**Examples:**

```text
feat/add-rust-language-filter
fix/csv-export-encoding
docs/update-prerequisites
chore/bump-spring-boot-version
```

---

## Commit Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```text
<type>(<scope>): <short description>

[optional body]

[optional footer(s)]
```

**Types:** `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`, `perf`

**Examples:**

```text
feat(frontend): add keyboard shortcut Alt+E for CSV export
fix(backend): handle null city field in contributor response
docs(readme): update quick-start clone instructions
chore(deps): upgrade Spring Boot to 3.4.2
```

- Keep the subject line under 72 characters
- Use the imperative mood: "add feature" not "added feature"
- Reference GitHub issues in the footer: `Closes #42`

---

## Pull Request Process

1. **Fork** the repository on GitHub.
2. **Create a branch** from `main` using the naming convention above.
3. **Make your changes** — keep commits focused and atomic.
4. **Test your changes** locally before opening a PR.
5. **Open a Pull Request** against the `main` branch of [flamingo-stack/major-league-github](https://github.com/flamingo-stack/major-league-github).
6. **Fill in the PR template** — describe what changed, why, and how to test it.
7. **Address review feedback** — be responsive and update the branch as needed.

### PR Checklist

- [ ] The project runs locally with my changes applied
- [ ] API endpoints still respond correctly (test with `curl` against the local Backend Service)
- [ ] No new compiler warnings in the backend (`./mvnw clean package`)
- [ ] No new TypeScript errors in the frontend (`npm run build`)
- [ ] Documentation updated if behaviour changed
- [ ] Commit messages follow the Conventional Commits format

---

## Code Style

### Backend (Java)

- Java 21 language features are welcome (records, pattern matching, text blocks)
- Follow standard Java naming conventions (camelCase methods, PascalCase classes)
- Use Lombok annotations (`@Data`, `@Builder`, `@RequiredArgsConstructor`) consistently with the existing codebase
- Spring Boot's reactive stack (WebFlux) is used for HTTP — prefer `Mono`/`Flux` over blocking calls
- Keep controllers thin — business logic belongs in service classes

### Frontend (TypeScript / React)

- All new components should be written in TypeScript with explicit prop types
- Use React functional components and hooks — no class components
- Follow the existing Material-UI theming patterns defined in `src/theme.ts`
- Custom data-fetching hooks belong in `src/hooks/`
- API calls should go through the Axios client in `src/services/`
- Filter/URL state is managed via the `useUrlState` hook — extend it rather than bypassing it

### General

- Prefer clarity over cleverness
- Add comments for non-obvious logic
- Keep pull requests focused — one concern per PR is easier to review

---

## Reporting Issues

Found a bug or have a feature request? Please open an issue on GitHub:

- **Bug reports:** [github.com/flamingo-stack/major-league-github/issues](https://github.com/flamingo-stack/major-league-github/issues)
- **Feature requests:** Use the same issue tracker with the `enhancement` label

When filing a bug report, please include:

- Your OS and version
- Java version (`java -version`)
- Node.js version (`node -version`)
- Steps to reproduce the issue
- What you expected to happen
- What actually happened (including any error output)

---

## Community

- **Live site:** [mlg.soccer](https://www.mlg.soccer)
- **Issues & Discussions:** [github.com/flamingo-stack/major-league-github/issues](https://github.com/flamingo-stack/major-league-github/issues)
- **Pull Requests:** [github.com/flamingo-stack/major-league-github/pulls](https://github.com/flamingo-stack/major-league-github/pulls)

All contributors are expected to be respectful and constructive. This project follows a standard open-source code of conduct — treat others the way you would want to be treated.

---

Thank you for helping make Major League GitHub better! ⚽

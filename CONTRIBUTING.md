# Contributing to Major League GitHub

Thank you for your interest in contributing to [Major League GitHub](https://www.mlg.soccer)! This is an open-source, standalone side project and contributions of all kinds are welcome — bug fixes, new features, documentation improvements, and more.

> **Repository:** [https://github.com/flamingo-stack/major-league-github](https://github.com/flamingo-stack/major-league-github)

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Two Backend Profiles](#two-backend-profiles)
- [Code Style](#code-style)
- [Environment Variables](#environment-variables)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Security Vulnerabilities](#security-vulnerabilities)

---

## Code of Conduct

Be respectful and constructive. This project follows standard open-source community norms — harassment, discrimination, or hostile behavior of any kind will not be tolerated.

---

## Getting Started

### Prerequisites

| Tool | Minimum Version |
|------|----------------|
| Java (JDK) | 21 |
| Maven | 3.9+ |
| Node.js | 18+ |
| npm | 9+ |
| Redis | 7+ (or Docker) |
| Docker | 24+ |
| Git | 2.40+ |

### Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/<your-username>/major-league-github.git
cd major-league-github
git remote add upstream https://github.com/flamingo-stack/major-league-github.git
```

### Start Redis

```bash
docker run -d -p 6379:6379 --name mlg-redis redis:7
```

### Run the Backend Service

```bash
export GITHUB_TOKENS="ghp_yourTokenHere"
export SPRING_REDIS_HOST="localhost"
export SPRING_REDIS_PORT="6379"

cd backend
mvn spring-boot:run -Pbackend-service
```

Health check:

```bash
curl http://localhost:8450/actuator/health
# Expected: {"status":"UP"}
```

### Run the Cache Updater

```bash
# In a new terminal
cd backend
GITHUB_TOKENS=$GITHUB_TOKENS \
SPRING_REDIS_HOST=localhost \
SPRING_REDIS_PORT=6379 \
mvn spring-boot:run -Pcache-updater
```

### Run the Frontend Dev Server

```bash
cd frontend
npm install
BACKEND_API_URL=http://localhost:8450 npx webpack serve
```

Open [http://localhost:8450](http://localhost:8450). See [Local Development](./docs/development/setup/local-development.md) for the full guide.

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
│       └── types/            # TypeScript type definitions
└── docs/                     # Documentation
```

---

## Development Workflow

### Branch Naming

Use descriptive, lowercase, hyphen-separated branch names:

```text
feat/add-team-filter-pagination
fix/cache-miss-on-empty-results
docs/update-quick-start
chore/bump-spring-boot-version
```

Prefixes:
- `feat/` — new feature
- `fix/` — bug fix
- `docs/` — documentation only
- `chore/` — dependency updates, tooling, non-functional changes
- `refactor/` — code restructuring without behavior change

### Workflow

1. **Create a branch** from `main`:

```bash
git checkout main
git pull upstream main
git checkout -b feat/your-feature-name
```

2. **Make changes** — keep commits focused and atomic.

3. **Verify your changes:**

```bash
# Backend: compile without tests
cd backend && mvn compile -DskipTests

# Backend: run tests (if available)
cd backend && mvn test

# Frontend: lint
cd frontend && npx eslint src/

# Frontend: build check
cd frontend && npx webpack --mode production
```

4. **Push and open a PR:**

```bash
git push origin feat/your-feature-name
```

Then open a pull request at [https://github.com/flamingo-stack/major-league-github/pulls](https://github.com/flamingo-stack/major-league-github/pulls).

---

## Two Backend Profiles

The backend runs as **two separate services** from one codebase, controlled by Maven profiles:

| Service | Maven Profile | Port | Role |
|---------|--------------|------|------|
| Backend Service | `backend-service` | 8450 | Serves the REST API |
| Cache Updater | `cache-updater` | 8451 | Runs scheduled cache refresh jobs |

Always test changes against the relevant profile. If you modify caching logic, test both profiles.

---

## Code Style

### Backend (Java)

- **Style:** Standard Java conventions; Lombok annotations (`@Data`, `@Builder`, `@RequiredArgsConstructor`) are used throughout.
- **Annotation processing:** Must be enabled in your IDE (IntelliJ: Settings → Compiler → Annotation Processors → Enable).
- **Constructor injection:** Prefer constructor injection over field injection for dependencies.
- **Thin controllers:** Controllers should delegate to services — no business logic in controllers.
- **Logging:** Use SLF4J. Log request parameters, cache state, and rate-limit status. **Never log token values or raw API responses containing personal data.**

### Frontend (TypeScript / React)

- **ESLint:** Configured in `frontend/eslint.config.js`. Run before committing:

```bash
cd frontend && npx eslint src/
```

- **Formatting:** Prettier is configured. Enable format-on-save in your editor.
- **Strong typing:** All API responses should be typed against the interfaces in `src/types/`. Avoid `any`.
- **URL state:** Filter state is managed via the `useUrlState` hook. Do not store filter state in component state or context — keep it URL-driven.
- **Path aliases:** Use `@/` for `frontend/src/` imports:

```typescript
import { ContributorsTable } from '@/components/ContributorsTable'
```

### IDE Setup

**Backend (IntelliJ IDEA):**
- Install plugins: **Lombok**, **Spring**
- Set Project SDK to Java 21
- Enable annotation processing

**Frontend (VS Code):**
- Install extensions: **ESLint**, **Prettier**, **TypeScript Language Features**, **GitLens**
- Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "frontend/node_modules/typescript/lib",
  "eslint.workingDirectories": ["frontend"]
}
```

---

## Environment Variables

### Never commit secrets

Add your local environment file to `.gitignore`:

```bash
echo ".env.local" >> .gitignore
```

### Required Variables

| Variable | Service | Description |
|----------|---------|-------------|
| `GITHUB_TOKENS` | Backend | Comma-separated GitHub PATs with `read:user` scope |
| `SPRING_REDIS_HOST` | Backend | Redis host (e.g., `localhost`) |
| `SPRING_REDIS_PORT` | Backend | Redis port (default: `6379`) |
| `SPRING_PROFILES_ACTIVE` | Backend | `backend-service` or `cache-updater` |
| `BACKEND_API_URL` | Frontend | Backend base URL for dev server proxy |

### GitHub Token Scopes

Minimum required scopes:
- `read:user` — contributor profile data
- `repo` — repository star counts

> Multiple tokens are supported for higher throughput. The `GithubTokenRateManager` automatically selects the token with the most remaining quota.

---

## Pull Request Guidelines

### Before Opening a PR

- [ ] Code compiles without errors (`mvn compile -DskipTests` / `npx webpack --mode production`)
- [ ] No secrets, tokens, or personal data in code or test fixtures
- [ ] ESLint passes for frontend changes (`npx eslint src/`)
- [ ] New environment variables are documented with empty defaults
- [ ] CORS origins are not expanded without justification
- [ ] Rate limiting behavior is preserved — do not bypass `GithubTokenRateManager`
- [ ] Log statements do not include token values or raw API responses

### PR Description

Include:
- **What** the change does
- **Why** it is needed
- **How** to test it locally
- Any related issues (e.g., `Closes #42`)

### Review Process

- All PRs require at least one review before merge
- Maintainers may request changes — this is normal and part of the process
- Keep PRs focused — one logical change per PR is easier to review

---

## Security Vulnerabilities

**Do not open a public issue for security vulnerabilities.**

Please report security issues responsibly via [GitHub Security Advisories](https://github.com/flamingo-stack/major-league-github/security/advisories). This allows the maintainers to assess and patch the issue before public disclosure.

---

## Getting Help

- **Browse open issues:** [https://github.com/flamingo-stack/major-league-github/issues](https://github.com/flamingo-stack/major-league-github/issues)
- **Open a new issue:** [https://github.com/flamingo-stack/major-league-github/issues/new](https://github.com/flamingo-stack/major-league-github/issues/new)
- **Read the architecture docs:** [docs/development/architecture/README.md](./docs/development/architecture/README.md)
- **Full development guide:** [docs/development/setup/local-development.md](./docs/development/setup/local-development.md)

---

<div align="center">
  Built with 💛 by the <a href="https://www.flamingo.run/about"><b>Flamingo</b></a> team
</div>

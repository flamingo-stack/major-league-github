# Contributing to Major League GitHub

Thank you for your interest in contributing to **Major League GitHub**! This is an independent, open-source side project and contributions of all kinds are welcome — bug reports, documentation improvements, feature requests, and code changes.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Security Guidelines](#security-guidelines)
- [Reporting Issues](#reporting-issues)

---

## Code of Conduct

This project follows standard open-source community norms. Be respectful, constructive, and welcoming. Harassment of any kind will not be tolerated.

---

## Getting Started

### 1. Fork and Clone

```bash
git clone https://github.com/flamingo-stack/major-league-github.git
cd major-league-github
```

### 2. Set Up the Development Environment

**Prerequisites:**

| Tool | Minimum Version |
|------|----------------|
| Java JDK | 21 |
| Apache Maven | 3.9+ |
| Node.js | 18+ |
| npm | 9+ |
| Redis | 6+ |

**Backend setup:**

```bash
cd backend
GITHUB_TOKENS=ghp_your_token_here mvn spring-boot:run
```

The backend starts on port **8450** (REST API) by default.

**Frontend setup:**

```bash
cd frontend
npm install
BACKEND_API_URL=http://localhost:8450 npm run dev
```

The frontend dev server starts on port **3000**.

> **No Redis?** Use the disk cache for simpler local development:
> ```bash
> GITHUB_TOKENS=ghp_your_token_here CACHE_IMPLEMENTATION=disk mvn spring-boot:run
> ```

See the [Local Development Guide](./docs/development/setup/local-development.md) for full details including debug configurations for IntelliJ IDEA and VS Code.

---

## Development Environment

### IDE Recommendations

**Backend (Java / Spring Boot):**
- **IntelliJ IDEA** (recommended) — enable Lombok annotation processing in Settings → Build, Execution, Deployment → Compiler → Annotation Processors
- **VS Code** — install Extension Pack for Java, Spring Boot Extension Pack, and Lombok Annotations Support

**Frontend (React / TypeScript):**
- **VS Code** (recommended) — install ESLint, Prettier, TypeScript extensions
- **WebStorm** — excellent TypeScript and React support out of the box

### Environment Variables

Set these before running the backend:

```bash
# Required
export GITHUB_TOKENS="ghp_your_token_here"

# Optional — use disk cache instead of Redis
export CACHE_IMPLEMENTATION="disk"

# Optional — Redis connection (defaults to localhost:6379)
export SPRING_REDIS_HOST="localhost"
export SPRING_REDIS_PORT="6379"

# Optional — frontend API URL (for separate frontend/backend)
export BACKEND_API_URL="http://localhost:8450"
```

---

## Branch Naming

Use descriptive branch names with a prefix indicating the type of change:

| Prefix | When to use |
|--------|-------------|
| `feat/` | New feature |
| `fix/` | Bug fix |
| `docs/` | Documentation changes |
| `refactor/` | Code refactoring (no behavior change) |
| `chore/` | Tooling, dependencies, build config |
| `test/` | Adding or improving tests |

**Examples:**

```text
feat/hiring-profile-caching
fix/rate-limit-token-rotation
docs/api-endpoint-reference
refactor/city-service-loading
```

---

## Commit Messages

Write clear, concise commit messages that explain *what* and *why*:

- Use the imperative mood: "Add cache invalidation" not "Added cache invalidation"
- Keep the first line under 72 characters
- Optionally add a body for context

**Examples:**

```text
feat: add Haversine proximity filter for MLS teams

fix: handle empty GITHUB_TOKENS env var gracefully

docs: document cache mode configuration options

refactor: extract scoring formula into separate method
```

---

## Pull Request Process

1. **Create a branch** from `main` using the naming convention above
2. **Make your changes** — keep PRs focused and small where possible
3. **Verify locally:**
   - Backend compiles and starts: `mvn spring-boot:run`
   - Frontend builds and lints: `npm run build` and `npx eslint src/`
   - The app functions at `http://localhost:3000`
4. **Write a clear PR description** explaining what changed and why
5. **Open the PR** against the `main` branch at [https://github.com/flamingo-stack/major-league-github/pulls](https://github.com/flamingo-stack/major-league-github/pulls)
6. **Address review feedback** — be responsive to comments

### PR Checklist

Before submitting:

- [ ] No secrets, tokens, or passwords committed to source
- [ ] No hardcoded URLs that should be configurable
- [ ] Backend compiles cleanly (`mvn clean package -DskipTests`)
- [ ] Frontend lints cleanly (`npx eslint src/`)
- [ ] No wildcard CORS (`allowedOrigins("*")`) introduced
- [ ] New endpoints or behavior changes are documented
- [ ] `ApiError` responses do not expose raw stack traces

---

## Code Style

### Backend (Java)

- **Java 21** — use modern Java features where appropriate
- **Lombok** — use `@Data`, `@Builder`, `@Slf4j`, etc. for boilerplate reduction
- **Spring conventions** — follow standard Spring Boot layering (Controller → Service → Repository/Cache)
- **Thin controllers** — business logic belongs in services, not controllers
- **Structured GraphQL** — use `GitHubQueryBuilder` for GitHub API queries; never build GraphQL strings manually
- **Async** — use `@Async` for long-running tasks; configure thread pools in the `Configurations` module

### Frontend (TypeScript / React)

- **TypeScript strict mode** — all props and state should be typed
- **React hooks rules** — follow the Rules of Hooks; ESLint will enforce this
- **URL-driven state** — use the `useUrlState` hook for filter state; do not use component-local state for URL-persisted filters
- **Axios service layer** — all API calls go through `frontend/src/services/`; do not call the backend directly from components
- **Material UI** — use MUI components consistently; avoid inline styles where a theme solution exists

### ESLint

```bash
cd frontend
npx eslint src/
```

The project uses ESLint 9 with `eslint-plugin-react-hooks` and `typescript-eslint`. Fix all warnings before submitting a PR.

---

## Security Guidelines

### Never Commit Secrets

- GitHub tokens, LinkedIn credentials, and any API keys must **never** be committed to source control
- Use environment variables locally; use GitHub Secrets for CI/CD; use Kubernetes Secrets in production
- Add `.env` and `.env.local` to `.gitignore` if you use env files

### Token Scopes

Only the minimum required GitHub token scopes should be used:

- `read:user` — read public user data
- `public_repo` — access public repository data

Do **not** request write, admin, or delete permissions.

### Input Validation

- Backend: validate all request parameters before passing to services
- Frontend: the `useUrlState` hook validates URL parameters against `^[a-zA-Z0-9-]+$` — maintain this pattern for new filters
- Use `GitHubQueryBuilder`'s structured arguments for GitHub API queries — never string-interpolate user input into GraphQL

### Error Responses

- Use `GlobalExceptionHandler` and `ApiResponse.error()` — never expose raw stack traces in API responses
- Rate limit exceptions (`GithubRateLimitException`, `GithubTimeoutException`, etc.) should be handled gracefully

### Dependency Audits

Before merging dependency updates, run:

```bash
# Backend
cd backend
mvn dependency:resolve

# Frontend
cd frontend
npm audit
```

Fix moderate and high-severity findings before merging.

---

## Reporting Issues

- **Bugs and feature requests:** [https://github.com/flamingo-stack/major-league-github/issues](https://github.com/flamingo-stack/major-league-github/issues)
- **Security vulnerabilities:** Open a private security advisory via GitHub's **Security → Advisories** feature in the repository

When filing a bug report, please include:

1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Environment details (OS, Java version, Node.js version, browser)
5. Relevant logs (redact any tokens before pasting)

---

## Additional Resources

- [Documentation](./docs/README.md) — Full project documentation index
- [Architecture Overview](./docs/development/architecture/README.md) — System design and data flow
- [Local Development Guide](./docs/development/setup/local-development.md) — Detailed setup instructions
- [Security Guidelines](./docs/development/security/README.md) — Full security reference
- [Live Site](https://www.mlg.soccer) — See the project in production

---

Thank you for contributing to Major League GitHub! 🏆

# Contributing to Major League GitHub

Thank you for your interest in contributing to Major League GitHub! This document outlines how to set up your development environment, the branching and PR workflow, code style expectations, and the review process.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Running the Project Locally](#running-the-project-locally)
- [Branching Strategy](#branching-strategy)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing](#testing)
- [Key Design Principles](#key-design-principles)
- [Getting Help](#getting-help)

---

## Getting Started

1. **Fork the repository** on GitHub: https://github.com/flamingo-stack/major-league-github
2. **Clone your fork** locally:

```bash
git clone https://github.com/<your-username>/major-league-github.git
cd major-league-github
```

3. **Add the upstream remote** so you can keep your fork in sync:

```bash
git remote add upstream https://github.com/flamingo-stack/major-league-github.git
```

---

## Development Environment

### Required Tools

| Tool | Minimum Version | Purpose |
|------|----------------|---------|
| **Java JDK** | 21 | Backend runtime |
| **Node.js** | 18+ | Frontend build tooling |
| **npm** | 9+ | Frontend package management |
| **Redis** | 6+ | Distributed caching (or use Docker) |
| **Docker** | 24+ | Containerized local Redis |
| **Git** | 2.40+ | Source control |

> The Maven Wrapper (`./mvnw`) is included — no system-wide Maven installation required.

### IDE Recommendations

- **IntelliJ IDEA** (Community or Ultimate) — recommended for the Spring Boot backend
  - Install the **Lombok** plugin and enable annotation processing: `Settings → Build → Compiler → Annotation Processors → Enable`
  - Set Project SDK to **Java 21**: `File → Project Structure → SDK`
- **VS Code** — recommended for the React + TypeScript frontend
  - Install the **ESLint** and **Prettier** extensions

### Key IntelliJ Plugins

| Plugin | Purpose |
|--------|---------|
| Lombok | Annotation processing for `@Data`, `@Builder`, `@Slf4j` |
| Spring Boot | Run configurations and endpoint browser |
| SonarLint | Real-time code quality warnings |

---

## Running the Project Locally

Full setup instructions are in the [Local Development Guide](./docs/development/setup/local-development.md). The short version:

```bash
# 1. Start Redis
docker run -d -p 6379:6379 --name mlg-redis redis:7

# 2. Start the Backend Service (port 8450)
cd backend
export GITHUB_TOKEN_1=ghp_your_token_here
./mvnw spring-boot:run -Dspring-boot.run.profiles=backend-service

# 3. Start the Cache Updater (port 8451) — in a new terminal
cd backend
export GITHUB_TOKEN_1=ghp_your_token_here
./mvnw spring-boot:run \
  -Dspring-boot.run.profiles=cache-updater \
  -Dspring-boot.run.arguments=--server.port=8451

# 4. Start the Frontend — in a new terminal
cd frontend
npm install
BACKEND_API_URL=http://localhost:8450 npm start
```

Open http://localhost:8450 in your browser.

---

## Branching Strategy

- `main` — production-ready code; all CI/CD deployments trigger from here
- `feature/<short-description>` — new features or enhancements
- `fix/<short-description>` — bug fixes
- `chore/<short-description>` — dependency updates, tooling, documentation

### Branch Naming Examples

```text
feature/csv-export-improvements
fix/redis-connection-timeout
chore/upgrade-react-19
```

### Keeping Your Branch Up to Date

```bash
git fetch upstream
git rebase upstream/main
```

---

## Making Changes

### Backend Changes

```bash
cd backend

# Compile and check for errors
./mvnw compile

# Run the service locally to test your changes
./mvnw spring-boot:run -Dspring-boot.run.profiles=backend-service

# Build the JAR
./mvnw clean package -DskipTests
```

### Frontend Changes

```bash
cd frontend

# Install dependencies (first time or after package.json changes)
npm install

# Start the dev server with hot reload
BACKEND_API_URL=http://localhost:8450 npm start

# Production build
NODE_ENV=production npm run build
```

### No-Redis Development

For backend-only changes that don't require Redis, use disk-based caching:

```bash
cd backend
export CACHE_IMPLEMENTATION=disk
./mvnw spring-boot:run -Dspring-boot.run.profiles=backend-service
```

---

## Pull Request Process

1. **Create a feature branch** from `main`:

```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes** with clear, focused commits:

```bash
git add .
git commit -m "feat: add MLS team filter to CSV export"
```

3. **Push your branch** to your fork:

```bash
git push origin feature/your-feature-name
```

4. **Open a Pull Request** against `main` on the upstream repository:
   - https://github.com/flamingo-stack/major-league-github/pulls

5. **Fill out the PR description** with:
   - What changed and why
   - How to test the change
   - Any relevant issues it closes (e.g., `Closes #42`)

6. **Wait for review** — maintainers will review and may request changes before merging

### PR Checklist

- [ ] Code compiles without errors (`./mvnw compile` / `npm run build`)
- [ ] New endpoints or behaviors are tested manually against a local stack
- [ ] Environment variables are documented if new ones are introduced
- [ ] No secrets, tokens, or credentials are committed
- [ ] The branch is up to date with `main`

---

## Code Style Guidelines

### Backend (Java)

- Follow standard Java conventions (camelCase methods/fields, PascalCase classes)
- Use Lombok annotations (`@Data`, `@Builder`, `@Slf4j`) to reduce boilerplate
- Keep controllers thin — business logic belongs in service classes
- Use `CacheServiceAbs` for any data that should be cached; do not call GitHub directly from controllers
- Log meaningful messages at `DEBUG` or `INFO` level at service boundaries
- Wrap all REST responses in `ApiResponse<T>` for consistency

### Frontend (TypeScript / React)

- Use TypeScript strictly — avoid `any` types
- All filter state must flow through `useUrlState` — do not use component-local state for leaderboard filters
- Keep components focused and composable; extract reusable logic into custom hooks
- Use React Query (`useQuery`) for all backend data fetching — do not fetch in `useEffect`
- Follow existing naming conventions: `use<Name>` for hooks, `<Name>Controller` for complex state logic
- Strong typing end-to-end: Java DTOs should map 1:1 to TypeScript interfaces in `src/types/`

### General

- Prefer explicit over implicit — clear variable names, no magic numbers
- Write self-documenting code; comments should explain *why*, not *what*
- Keep pull requests focused — one concern per PR

---

## Testing

### Backend

```bash
cd backend

# Run all tests
./mvnw test

# Run a specific test class
./mvnw test -Dtest=GithubServiceTest

# Build and run tests together
./mvnw clean verify
```

### Frontend

```bash
cd frontend

# Run tests (if configured)
npm test
```

### Manual API Testing

```bash
# Health check
curl http://localhost:8450/actuator/health

# Test contributor search
curl "http://localhost:8450/api/contributors/search?languageId=java&stateId=CA"

# Test city autocomplete
curl "http://localhost:8450/api/autocomplete/cities?query=San"

# Export as CSV
curl "http://localhost:8450/api/contributors/export?languageId=java" -o test.csv
```

---

## Key Design Principles

When contributing, please respect these architectural decisions:

| Principle | What It Means |
|-----------|--------------|
| **Cache-first** | All expensive GitHub queries go through `CacheServiceAbs`; never call GitHub directly from a controller |
| **URL-driven state** | All leaderboard filter state lives in URL query params via `useUrlState` — not in React component state |
| **Strong typing end-to-end** | Java DTOs map 1:1 to TypeScript types; maintain this contract when adding new fields |
| **Separation of concerns** | Controllers orchestrate; services contain logic; models carry data |
| **Multi-token rate management** | New GitHub API calls should go through `GithubTokenRateManager` to respect rate limits |

---

## Environment Variables Reference

Never commit secrets. Store tokens in a local `.env.local` file (gitignored):

```bash
cat > .env.local << 'EOF'
export GITHUB_TOKEN_1=ghp_your_primary_token_here
export GITHUB_TOKEN_2=ghp_your_secondary_token_here
export SPRING_REDIS_HOST=localhost
export SPRING_REDIS_PORT=6379
export CACHE_IMPLEMENTATION=redis
export CACHE_MODE=read-write
EOF

source .env.local
```

Required token scopes: `read:user`, `public_repo`

Generate tokens at: https://github.com/settings/tokens

---

## Getting Help

- **GitHub Issues:** https://github.com/flamingo-stack/major-league-github/issues
- **Pull Requests:** https://github.com/flamingo-stack/major-league-github/pulls
- **Live Site:** https://www.mlg.soccer
- **Architecture Docs:** [docs/development/architecture/README.md](./docs/development/architecture/README.md)
- **Full Documentation:** [docs/README.md](./docs/README.md)

---

*Thank you for contributing to Major League GitHub!*

# Development Environment Setup

This guide walks you through configuring your IDE, installing required tools, and setting up editor extensions for an optimal Major League GitHub development experience.

---

## Recommended IDE

### IntelliJ IDEA (Backend)

IntelliJ IDEA Community or Ultimate is the recommended IDE for Java backend development.

**Required plugins:**
- **Lombok** — enables annotation processing for `@Data`, `@Builder`, `@RequiredArgsConstructor`, etc.
- **Spring** — provides Spring Boot run configurations and bean navigation

**Setup steps:**

1. Open IntelliJ IDEA and choose **Open → select the `backend/` directory** (or the repo root)
2. IntelliJ auto-detects the Maven project from `backend/pom.xml`
3. Go to **Settings → Build, Execution, Deployment → Compiler → Annotation Processors** and enable annotation processing
4. Set the Project SDK to **Java 21**

```bash
# Verify your active JDK
java -version
# Requires: openjdk 21.x.x
```

### VS Code (Frontend)

VS Code is recommended for the React + TypeScript frontend.

**Required extensions:**
- **ESLint** (`dbaeumer.vscode-eslint`) — uses the project's `eslint.config.js`
- **Prettier** (`esbenp.prettier-vscode`) — code formatting
- **TypeScript and JavaScript Language Features** — built-in, provides IntelliSense
- **GitLens** (`eamodio.gitlens`) — enhanced Git tooling

**Optional extensions:**
- **vscode-styled-components** — for MUI `sx` prop syntax highlighting
- **Error Lens** — inline error display
- **Import Cost** — shows bundle size impact of imports

**VS Code workspace settings** (create `.vscode/settings.json` in the repo root):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "frontend/node_modules/typescript/lib",
  "eslint.workingDirectories": ["frontend"]
}
```

---

## Required Development Tools

| Tool | Install Command | Notes |
|------|----------------|-------|
| JDK 21 | [adoptium.net](https://adoptium.net) or `brew install temurin@21` | Set `JAVA_HOME` |
| Maven 3.9+ | `brew install maven` or [maven.apache.org](https://maven.apache.org) | |
| Node.js 18+ | [nodejs.org](https://nodejs.org) or `brew install node@18` | |
| npm 9+ | Bundled with Node.js | |
| Redis 7+ | `brew install redis` or Docker | |
| Docker | [docs.docker.com](https://docs.docker.com/get-docker/) | Optional but recommended |

---

## Environment Variables for Development

Create a file at `backend/.env.local` (or export in your shell profile) for backend development:

```bash
# Backend Service
export GITHUB_TOKENS="ghp_your_token_here"
export SPRING_REDIS_HOST="localhost"
export SPRING_REDIS_PORT="6379"
export SPRING_PROFILES_ACTIVE="backend-service"
```

For the frontend dev server, pass variables inline or export them:

```bash
# Frontend dev server
export BACKEND_API_URL="http://localhost:8450"
export NODE_ENV="development"
export PORT="8450"
```

> **Never commit tokens or secrets.** The `GITHUB_TOKENS` variable is sensitive. Add `.env.local` to `.gitignore` and use environment-specific secret management in CI/CD.

---

## Path Aliases (Frontend)

The Webpack config defines two path aliases for cleaner imports:

| Alias | Resolves To | Example |
|-------|------------|---------|
| `@/` | `frontend/src/` | `import { Layout } from '@/components/Layout'` |
| `@flamingo/ui-kit` | `ui-kit/src/` | `import { Button } from '@flamingo/ui-kit'` |

These are configured in `frontend/webpack.config.js` and are available across all TypeScript source files in the frontend.

---

## Linting and Formatting

The frontend uses ESLint configured via `frontend/eslint.config.js`.

Run the linter:

```bash
cd frontend
npx eslint src/
```

The linter enforces:
- TypeScript type-safety rules
- React hooks exhaustive dependencies
- Import ordering

---

## Netty DNS (macOS Apple Silicon)

The backend `pom.xml` includes a macOS-specific DNS resolver:

```xml
<dependency>
    <groupId>io.netty</groupId>
    <artifactId>netty-resolver-dns-native-macos</artifactId>
    <classifier>osx-aarch_64</classifier>
</dependency>
```

This resolves a known Netty warning when running Spring WebFlux on Apple Silicon Macs. No action is required — it is already wired in.

---

## Redis in Development

For local development, run Redis via Docker (no persistent volume needed):

```bash
docker run -d \
  --name mlg-redis \
  -p 6379:6379 \
  redis:7
```

To stop and remove:

```bash
docker stop mlg-redis && docker rm mlg-redis
```

Alternatively, if you installed Redis via Homebrew:

```bash
brew services start redis
# Stop with:
brew services stop redis
```

---

## Verify Your Setup

Run this checklist to confirm everything is in place:

```bash
# Java
java -version && javac -version

# Maven
mvn -version

# Node + npm
node -v && npm -v

# Redis
redis-cli ping

# Compile backend (no tests)
cd backend && mvn compile -DskipTests

# Install frontend deps
cd ../frontend && npm install && echo "Frontend deps OK"
```

All commands should return without errors before you begin development.

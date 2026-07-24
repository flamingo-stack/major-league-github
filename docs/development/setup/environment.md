# Development Environment Setup

This guide covers IDE configuration, editor extensions, required development tools, and environment variable setup for working on Major League GitHub.

---

## IDE Recommendations

### IntelliJ IDEA (Recommended for Backend)

IntelliJ IDEA is the recommended IDE for working on the Spring Boot backend. The Community Edition is free and sufficient.

**Key plugins to install:**

| Plugin | Purpose |
|--------|---------|
| **Lombok** | Annotation processing for `@Data`, `@Builder`, `@Slf4j`, etc. |
| **Spring Boot** | Run configurations, property file support, endpoint browser |
| **Maven** | Maven lifecycle and dependency management |
| **SonarLint** | Real-time code quality and security warnings |
| **GitToolBox** | Enhanced Git integration in the editor |

**Initial IntelliJ setup:**

1. Open the `backend/` directory as the project root (not the repo root)
2. Import as a Maven project when prompted
3. Set the Project SDK to **Java 21** under `File → Project Structure → SDK`
4. Enable annotation processing: `Settings → Build → Compiler → Annotation Processors → Enable`
5. The Lombok plugin must be installed for `@Data`, `@Builder`, and `@Slf4j` annotations to resolve correctly

### VS Code (Recommended for Frontend)

VS Code is the recommended editor for the React + TypeScript frontend.

**Required extensions:**

| Extension | Publisher | Purpose |
|-----------|-----------|---------|
| **ESLint** | Microsoft | Lint TypeScript/React code |
| **Prettier** | Prettier | Code formatting |
| **TypeScript** | Microsoft | Language support (usually built-in) |
| **ES7 React/Redux/GraphQL** | dsznajder | React snippet shortcuts |
| **Material Icon Theme** | Philipp Kief | File icons matching the MUI theme |

**Optional but helpful:**

| Extension | Purpose |
|-----------|---------|
| **GitLens** | Inline git blame and history |
| **Tailwind CSS IntelliSense** | Not used here, but useful if integrating custom CSS |
| **REST Client** | Test API endpoints directly from `.http` files |

---

## Required Development Tools

### Java 21

The backend requires exactly **Java 21** (LTS). Check your installed version:

```bash
java -version
```

**Installing Java 21:**

```bash
# macOS — using SDKMAN (recommended)
sdk install java 21.0.3-tem

# macOS — using Homebrew
brew install --cask temurin@21

# Ubuntu / Debian
sudo apt-get install temurin-21-jdk

# Windows — download from
# https://adoptium.net/temurin/releases/?version=21
```

### Maven Wrapper

The repository includes an `./mvnw` Maven wrapper script in the `backend/` directory. You do **not** need a system-wide Maven installation — use the wrapper:

```bash
cd backend
./mvnw --version
```

### Node.js and npm

The frontend requires Node.js 18 or later. Check your installed version:

```bash
node --version
npm --version
```

**Installing Node.js:**

```bash
# Using nvm (recommended — manages multiple versions)
nvm install 20
nvm use 20

# macOS — using Homebrew
brew install node

# Ubuntu / Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Redis

Redis is required at runtime. See the [Prerequisites guide](../../getting-started/prerequisites.md) for platform-specific installation instructions.

---

## Environment Variables

Set these environment variables before starting either service. For convenience, you can save them in a local `.env` file and source it:

```bash
# Create a local env file (do not commit this file)
cat > .env.local << 'EOF'
export GITHUB_TOKEN_1=ghp_your_primary_token_here
export GITHUB_TOKEN_2=ghp_your_secondary_token_here
export SPRING_REDIS_HOST=localhost
export SPRING_REDIS_PORT=6379
export CACHE_IMPLEMENTATION=redis
export CACHE_MODE=read-write
export GITHUB_API_CONCURRENCY=10
EOF

# Load the variables
source .env.local
```

> **Security:** Never commit `.env.local` or any file containing real GitHub tokens. Add it to `.gitignore`.

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GITHUB_TOKEN_1` | Primary GitHub PAT | (required) |
| `GITHUB_TOKEN_2` | Secondary GitHub PAT for rate-limit rotation | (optional) |
| `SPRING_REDIS_HOST` | Redis hostname | `localhost` |
| `SPRING_REDIS_PORT` | Redis port | `6379` |
| `CACHE_IMPLEMENTATION` | `redis` or `disk` | `redis` |
| `CACHE_MODE` | `read-write`, `read-only`, or `force-update` | `read-write` |
| `GITHUB_API_CONCURRENCY` | Thread pool size for GitHub API calls | `10` |

### Frontend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BACKEND_API_URL` | Backend base URL | `/` (proxied) |
| `PORT` | Dev server port | `8450` |
| `NODE_ENV` | Build mode (`development` or `production`) | `development` |
| `OG_URL` | Open Graph base URL (for SEO plugin) | `https://www.mlg.soccer` |

---

## Workspace Tips

### Running Both Backend and Frontend Simultaneously

Use split terminal panes or multiple terminal tabs. A recommended layout:

```text
Terminal 1: redis-server (or Docker Redis)
Terminal 2: cd backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=backend-service
Terminal 3: cd backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=cache-updater ...
Terminal 4: cd frontend && npm start
```

### IntelliJ Run Configurations

Create two Spring Boot run configurations in IntelliJ:

1. **Backend Service** — Main class: `cx.flamingo.analysis.MajorLeagueGithubApplication`, Active profiles: `backend-service`
2. **Cache Updater** — Main class: `cx.flamingo.analysis.MajorLeagueGithubApplication`, Active profiles: `cache-updater`, VM options: `-Dserver.port=8451`

Add your GitHub tokens and Redis settings as environment variables in each run configuration.

---

## Verifying Your Setup

After installing all tools and setting environment variables, run this verification checklist:

```bash
# Java 21
java -version 2>&1 | grep "21."

# Maven wrapper
cd backend && ./mvnw --version

# Node.js 18+
node --version

# npm
npm --version

# Redis
redis-cli ping   # Expected: PONG

# Backend compiles without errors
cd backend && ./mvnw compile -q

# Frontend installs without errors
cd frontend && npm install
```

All commands should complete without errors before you proceed to the [Local Development guide](local-development.md).

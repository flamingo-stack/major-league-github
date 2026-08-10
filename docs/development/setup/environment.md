# Development Environment Setup

This guide covers IDE recommendations, required development tools, and editor extensions for working on Major League GitHub.

---

## IDE Recommendations

### Backend (Java / Spring Boot)

**IntelliJ IDEA** (recommended)

IntelliJ IDEA provides the best Java 21 + Spring Boot 3.4 development experience:

- Built-in Spring Boot run configurations
- Lombok annotation processing (required for model classes)
- Full Maven integration
- Integrated Redis monitoring via Database Tools

**VS Code** (alternative)

Use with the following extensions:
- **Extension Pack for Java** (Microsoft)
- **Spring Boot Extension Pack** (VMware)
- **Lombok Annotations Support for VS Code**

### Frontend (React / TypeScript)

**VS Code** (recommended)

The frontend is built with React 19 + TypeScript. Use VS Code with:

- **ESLint** — enforces the project's ESLint config (`eslint.config.js`)
- **Prettier** — code formatting (configure to match project style)
- **TypeScript + JavaScript** (built-in)
- **ES7+ React/Redux/React-Native snippets**

**IntelliJ IDEA / WebStorm** (alternative)

WebStorm provides excellent TypeScript and React support out of the box.

---

## Required Development Tools

### Java Toolchain

Install Java 21. The recommended distributions:

- **Temurin (Eclipse Adoptium)** — free, production-grade
- **Oracle JDK 21** — official release
- **Amazon Corretto 21** — AWS-maintained distribution

Verify after installation:

```bash
java -version
```

Expected output should show `openjdk version "21"` (or similar).

### Maven

Maven 3.9+ is required for building the backend.

```bash
mvn -version
```

> **Tip:** IntelliJ IDEA bundles a Maven version. You can use the bundled Maven for IDE-only builds, but install Maven system-wide for terminal builds.

### Node.js and npm

Install Node.js 18 or later (LTS recommended). npm is bundled with Node.js.

```bash
node --version
npm --version
```

Use [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions if you work on multiple projects.

### Redis

Redis 6 or later is required for the backend cache layer.

**macOS (Homebrew):**

```bash
brew install redis
brew services start redis
```

**Linux (apt):**

```bash
sudo apt-get update
sudo apt-get install redis-server
sudo systemctl start redis
```

**Windows:**

Use WSL2 with a Linux distribution and install Redis inside it.

Verify:

```bash
redis-cli ping
```

Expected: `PONG`

---

## Lombok Setup

The backend uses **Lombok** for boilerplate reduction (`@Data`, `@Builder`, `@Slf4j`, etc.). Annotation processing must be enabled in your IDE.

### IntelliJ IDEA

1. Go to **Settings → Build, Execution, Deployment → Compiler → Annotation Processors**
2. Check **Enable annotation processing**
3. Install the **Lombok Plugin** from the marketplace if prompted

### VS Code

Install the **Lombok Annotations Support for VS Code** extension.

---

## Environment Variables for Development

Set these in your shell profile (`~/.bashrc`, `~/.zshrc`, or equivalent) or in your IDE run configuration:

```bash
# Required — at least one GitHub Personal Access Token
export GITHUB_TOKENS="ghp_your_token_here"

# Optional — use disk cache instead of Redis for simpler local dev
export CACHE_IMPLEMENTATION="disk"

# Optional — Redis connection (defaults to localhost:6379)
export SPRING_REDIS_HOST="localhost"
export SPRING_REDIS_PORT="6379"

# Optional — Frontend API URL (for running frontend separately)
export BACKEND_API_URL="http://localhost:8450"
```

---

## IntelliJ IDEA Run Configuration (Backend)

To run the backend from IntelliJ IDEA:

1. Open the `backend/` directory as a Maven project
2. Find `MajorLeagueGithubApplication.java`
3. Right-click → **Run**
4. In the run configuration, add environment variables:
   - `GITHUB_TOKENS` = your token(s)
   - `CACHE_IMPLEMENTATION` = `disk` (optional, to skip Redis during dev)
5. The active profile defaults to `backend-service` (port 8450)

---

## Frontend Build System

The frontend uses **Webpack 5** as its primary bundler with a Vite config also available:

| Config | Use Case |
|--------|----------|
| `webpack.config.js` | Production builds, custom plugins (SEO, favicon) |
| `vite.config.js` | Development server with hot module replacement |

The project includes two custom Webpack plugins:

- **FaviconGeneratorPlugin** — generates favicon assets at build time
- **SeoFilesPlugin** — generates sitemap and robots.txt at build time

These run automatically during `npm run build`.

---

## ESLint Configuration

The project uses ESLint 9 with TypeScript support. The configuration is defined in `frontend/eslint.config.js`.

Key rules enabled:
- `eslint-plugin-react-hooks` — enforces React Hooks rules
- `eslint-plugin-react-refresh` — warns about components incompatible with hot reload
- `typescript-eslint` — TypeScript-specific linting

Run lint checks:

```bash
cd frontend
npx eslint src/
```

---

## Recommended .editorconfig Settings

If you create a `.editorconfig` at the repository root, use these settings to match the project's code style:

```text
root = true

[*]
indent_style = space
indent_size = 4
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.{ts,tsx,js,jsx}]
indent_size = 2

[*.{yml,yaml}]
indent_size = 2
```

# Local Development Guide

This guide walks through cloning the project, running both the backend and frontend locally, configuring hot reload, and debugging.

---

## Clone and Initial Setup

```bash
git clone https://github.com/flamingo-stack/major-league-github.git
cd major-league-github
```

The repository contains two independent sub-projects:

- `backend/` — Java 21 + Spring Boot 3.4 (Maven project)
- `frontend/` — React 19 + TypeScript (npm project)

---

## Running the Backend Locally

### 1. Ensure Redis Is Running

```bash
redis-server
```

Or with Homebrew on macOS:

```bash
brew services start redis
```

### 2. Start the Backend Service

```bash
cd backend
GITHUB_TOKENS=ghp_your_token_here mvn spring-boot:run
```

The backend starts on **port 8450** using the `backend-service` profile (active by default).

**With disk cache (skip Redis requirement):**

```bash
cd backend
GITHUB_TOKENS=ghp_your_token_here \
CACHE_IMPLEMENTATION=disk \
mvn spring-boot:run
```

### 3. Verify the Backend

```bash
curl http://localhost:8450/actuator/health
```

Expected:

```json
{"status":"UP"}
```

**Test the contributors endpoint:**

```bash
curl "http://localhost:8450/api/contributors/search?languageId=java&maxResults=5"
```

---

## Running the Frontend Locally

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start the Development Server

```bash
BACKEND_API_URL=http://localhost:8450 npm run dev
```

The frontend dev server starts on **port 3000** with hot module replacement (HMR) enabled via Vite.

Open: **[http://localhost:3000](http://localhost:3000)**

> **Note:** The `BACKEND_API_URL` environment variable tells the frontend where to send API requests. Without it, the frontend defaults to `/` (same-origin), which only works when served by the backend itself.

### 3. Frontend Dev Server Proxy

During development, API calls from the browser (port 3000) to the backend (port 8450) require the `BACKEND_API_URL` variable. This is the simplest approach for local development.

---

## Hot Reload / Watch Mode

### Frontend (Vite Dev Server)

The Vite dev server provides **fast Hot Module Replacement (HMR)**. Changes to `.tsx`, `.ts`, `.css`, and other source files are reflected in the browser instantly without a full page reload.

No additional configuration is needed — HMR is enabled by default via `vite.config.js`.

### Backend (Spring Boot DevTools)

Spring Boot DevTools is not explicitly listed as a dependency in the current `pom.xml`. For backend hot-reload during development, the recommended approaches are:

**Option A — Use IntelliJ IDEA's "Build Project Automatically":**
1. Enable **Build → Build Project Automatically** in IntelliJ IDEA
2. Enable **Advanced Settings → Allow auto-make to start even if developed application is currently running**
3. Spring Boot will detect class changes and restart automatically

**Option B — Restart manually:**
Stop the running `mvn spring-boot:run` process and restart it. Maven rebuilds and reloads the application.

---

## Running the Cache Updater Service

The Cache Updater is a separate Spring Boot service on port 8451. It pre-warms and refreshes the Redis cache on a schedule.

```bash
cd backend
GITHUB_TOKENS=ghp_your_token_here \
mvn spring-boot:run -Dspring-boot.run.profiles=cache-updater
```

> For local development, the Cache Updater is typically not required. The backend service warms the cache on startup via `PreCacheService`.

---

## Debug Configuration

### Debugging the Backend (IntelliJ IDEA)

1. Open the backend as a Maven project in IntelliJ IDEA
2. Create a **Spring Boot run configuration**:
   - Main class: `cx.flamingo.analysis.MajorLeagueGithubApplication`
   - Environment variables: `GITHUB_TOKENS=ghp_your_token_here;CACHE_IMPLEMENTATION=disk`
3. Click the **Debug** button (instead of Run)
4. Set breakpoints in any service or controller class

### Debugging the Backend (VS Code)

Create a `launch.json` in the repository root:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "java",
      "name": "MajorLeagueGithubApplication",
      "request": "launch",
      "mainClass": "cx.flamingo.analysis.MajorLeagueGithubApplication",
      "projectName": "major-league-github",
      "env": {
        "GITHUB_TOKENS": "ghp_your_token_here",
        "CACHE_IMPLEMENTATION": "disk"
      }
    }
  ]
}
```

### Debugging the Frontend (VS Code)

Use the **VS Code JavaScript debugger** with the Vite dev server:

1. Start the dev server: `npm run dev`
2. In VS Code, open **Run and Debug** → **Create a launch.json file**
3. Select **Chrome** or **Edge**
4. Set URL to `http://localhost:3000`
5. Launch and set breakpoints in `.tsx`/`.ts` files

---

## Building for Production

### Backend (Fat JAR)

```bash
cd backend
mvn clean package -DskipTests
```

The fat JAR is generated at:

```text
backend/target/major-league-github-0.0.1-SNAPSHOT.jar
```

Run it:

```bash
GITHUB_TOKENS=ghp_your_token_here \
java -jar backend/target/major-league-github-0.0.1-SNAPSHOT.jar
```

### Frontend (Webpack Production Build)

```bash
cd frontend
npm run build
```

Output is written to `frontend/dist/` (or the configured output directory). The production build includes:

- Minified and bundled assets
- Favicon assets (via `FaviconGeneratorPlugin`)
- SEO files — sitemap and robots.txt (via `SeoFilesPlugin`)

---

## Common Local Development Scenarios

### Scenario: No Redis — Use Disk Cache

```bash
cd backend
GITHUB_TOKENS=ghp_your_token_here \
CACHE_IMPLEMENTATION=disk \
mvn spring-boot:run
```

### Scenario: Always fetch fresh data (bypass cache)

```bash
cd backend
GITHUB_TOKENS=ghp_your_token_here \
CACHE_MODE=force-update \
mvn spring-boot:run
```

> **Warning:** This bypasses the cache and queries GitHub's API on every request. Use only for debugging and be aware of rate limits.

### Scenario: Multiple GitHub tokens for higher throughput

```bash
cd backend
GITHUB_TOKENS=ghp_token1,ghp_token2,ghp_token3 \
mvn spring-boot:run
```

The `GithubTokenRateManager` automatically selects the token with the most remaining requests.

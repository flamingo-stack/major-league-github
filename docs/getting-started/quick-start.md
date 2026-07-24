# Quick Start

This guide gets Major League GitHub running locally in about 10 minutes. It assumes you have already reviewed and satisfied the [Prerequisites](prerequisites.md).

---

## TL;DR — The Minimum Steps

```bash
# 1. Clone the repository
git clone https://github.com/flamingo-stack/major-league-github.git
cd major-league-github

# 2. Start Redis (must be running before the backend)
docker run -d -p 6379:6379 --name mlg-redis redis:7

# 3. Start the Backend Service (port 8450)
cd backend
export GITHUB_TOKEN_1=ghp_your_token_here
./mvnw spring-boot:run -Dspring-boot.run.profiles=backend-service

# 4. In a new terminal — start the Cache Updater (port 8451)
cd backend
export GITHUB_TOKEN_1=ghp_your_token_here
./mvnw spring-boot:run \
  -Dspring-boot.run.profiles=cache-updater \
  -Dspring-boot.run.arguments=--server.port=8451

# 5. In a new terminal — start the Frontend
cd frontend
npm install
BACKEND_API_URL=http://localhost:8450 npm start

# 6. Open the app
open http://localhost:8450
```

---

## Step-by-Step Walkthrough

### Step 1 — Clone the Repository

```bash
git clone https://github.com/flamingo-stack/major-league-github.git
cd major-league-github
```

### Step 2 — Start Redis

The backend services require Redis to be running before they start. The quickest approach is Docker:

```bash
docker run -d -p 6379:6379 --name mlg-redis redis:7
```

Verify it is running:

```bash
redis-cli ping
# Expected: PONG
```

If you prefer a local Redis installation, see the [Prerequisites](prerequisites.md) guide.

### Step 3 — Configure GitHub Token(s)

Export at least one GitHub Personal Access Token. Multiple tokens enable rate-limit rotation for higher throughput:

```bash
export GITHUB_TOKEN_1=ghp_your_first_token_here
export GITHUB_TOKEN_2=ghp_your_second_token_here   # optional
```

> Generate tokens at: https://github.com/settings/tokens
> Required scopes: `read:user`, `public_repo`

### Step 4 — Start the Backend Service

The Backend Service (port 8450) serves the REST API consumed by the frontend.

```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=backend-service
```

Expected output includes:

```text
Started MajorLeagueGithubApplication in X.XXX seconds
```

The backend will be available at http://localhost:8450.

### Step 5 — Start the Cache Updater (Optional but Recommended)

The Cache Updater (port 8451) runs scheduled jobs that pre-warm the Redis cache with fresh contributor data. Without it, the first API call for each combination of filters will go live to GitHub.

```bash
# In a new terminal
cd backend
./mvnw spring-boot:run \
  -Dspring-boot.run.profiles=cache-updater \
  -Dspring-boot.run.arguments=--server.port=8451
```

### Step 6 — Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Step 7 — Start the Frontend Dev Server

```bash
BACKEND_API_URL=http://localhost:8450 npm start
```

The Webpack dev server will compile the TypeScript + React application and serve it.

### Step 8 — Open the App

```text
http://localhost:8450
```

You should see the Major League GitHub leaderboard with filter controls for language, city, state, region, and MLS team.

---

## Verifying the API Directly

You can test the backend REST API directly before the frontend is running:

```bash
# Check that the backend is healthy
curl http://localhost:8450/actuator/health

# Fetch top contributors (defaults to Java language, all regions)
curl "http://localhost:8450/api/contributors/search" | head -c 500

# Autocomplete cities
curl "http://localhost:8450/api/autocomplete/cities?query=San"
```

---

## Expected Results

Once the application is running:

1. The leaderboard displays top GitHub contributors ranked by the MLG scoring formula
2. The filter panel shows dropdowns for language, region, state, city, and MLS team
3. Selecting any filter updates the URL query string and re-fetches the leaderboard
4. The URL can be shared and will restore the exact same filtered view on reload

---

## Building for Production

To build optimized production artifacts:

```bash
# Backend: build a single executable JAR
cd backend
./mvnw clean package -DskipTests

# Frontend: build minified static assets
cd frontend
NODE_ENV=production npm run build
```

The backend JAR is output to `backend/target/`. The frontend dist is output to `frontend/dist/`.

---

## Next Steps

Now that the application is running, explore what it can do:

- [First Steps Guide](first-steps.md) — Tour the key features and configuration options

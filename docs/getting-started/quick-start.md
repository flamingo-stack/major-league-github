# Quick Start

Get Major League GitHub running locally in five minutes. This guide walks through cloning the repo, starting Redis, and running both the backend and frontend.

---

## TL;DR — Five Steps to a Running Leaderboard

```bash
# 1. Clone the repository
git clone https://github.com/flamingo-stack/major-league-github.git
cd major-league-github

# 2. Start Redis (must be running before the backend services)
redis-server

# 3. Run the Backend Service (port 8450)
cd backend
./mvnw spring-boot:run \
  -Dspring-boot.run.profiles=backend-service \
  -Dspring-boot.run.jvmArguments="\
    -Dgithub.tokens=YOUR_GITHUB_PAT \
    -Dgithub.api.url=https://api.github.com \
    -Dgithub.api.url.rate_limit=https://api.github.com/rate_limit"

# 4. In a new terminal — Run the Cache Updater (port 8451)
cd backend
./mvnw spring-boot:run \
  -Dspring-boot.run.profiles=cache-updater \
  -Dspring-boot.run.jvmArguments="\
    -Dgithub.tokens=YOUR_GITHUB_PAT \
    -Dgithub.api.url=https://api.github.com \
    -Dgithub.api.url.rate_limit=https://api.github.com/rate_limit"

# 5. In a new terminal — Run the Frontend (port 8450 dev server)
cd frontend
npm install
BACKEND_API_URL=http://localhost:8450 npm run dev
```

Once all three processes are running, open your browser to `http://localhost:8450`.

---

## Step-by-Step Walkthrough

### Step 1 — Clone the Repository

```bash
git clone https://github.com/flamingo-stack/major-league-github.git
cd major-league-github
```

The repository layout you will see:

```text
major-league-github/
├── backend/          # Java 21 + Spring Boot 3.4 backend
│   ├── pom.xml
│   └── src/
├── frontend/         # React 19 + TypeScript frontend
│   ├── package.json
│   └── src/
└── ...
```

### Step 2 — Start Redis

Both backend microservices share a single Redis instance for caching.

```bash
redis-server
```

Verify Redis is accepting connections:

```bash
redis-cli ping
# PONG
```

> **Note:** Redis must be running on `localhost:6379` (the default). If your Redis instance runs on a different host or port, supply `spring.redis.host` and `spring.redis.port` as JVM arguments when starting the backend services.

### Step 3 — Start the Backend Service

The **Backend Service** (`backend-service` profile) serves the REST API on port `8450`. The frontend calls this service for all contributor and autocomplete data.

```bash
cd backend
./mvnw spring-boot:run \
  -Dspring-boot.run.profiles=backend-service \
  -Dspring-boot.run.jvmArguments="\
    -Dgithub.tokens=YOUR_GITHUB_PAT \
    -Dgithub.api.url=https://api.github.com \
    -Dgithub.api.url.rate_limit=https://api.github.com/rate_limit"
```

Replace `YOUR_GITHUB_PAT` with your GitHub Personal Access Token. To provide multiple tokens, separate them with commas: `token1,token2`.

When it starts successfully, you will see Spring Boot's startup banner followed by:

```text
Started MajorLeagueGithubApplication in X.XXX seconds
```

### Step 4 — Start the Cache Updater

The **Cache Updater** (`cache-updater` profile) runs on port `8451`. It automatically warms the Redis cache at startup by iterating through all supported programming languages and fetching contributor data from GitHub.

Open a **new terminal window**:

```bash
cd backend
./mvnw spring-boot:run \
  -Dspring-boot.run.profiles=cache-updater \
  -Dspring-boot.run.jvmArguments="\
    -Dgithub.tokens=YOUR_GITHUB_PAT \
    -Dgithub.api.url=https://api.github.com \
    -Dgithub.api.url.rate_limit=https://api.github.com/rate_limit"
```

> **Heads up:** The initial cache warm-up can take several minutes depending on the number of languages and cities in the dataset and your GitHub token's rate limit headroom. The Backend Service will return a "cache is still being populated" error until warm-up completes — this is expected.

### Step 5 — Start the Frontend

Open another **new terminal window**:

```bash
cd frontend
npm install
BACKEND_API_URL=http://localhost:8450 npm run dev
```

The dev server starts on port `8450` by default (configurable via the `PORT` environment variable). All `/api` requests are proxied to the Backend Service.

---

## Expected Result

After all three services are running and the cache has warmed up, open your browser to:

```text
http://localhost:8450
```

You should see the Major League GitHub leaderboard:

- A **hero section** at the top with project branding
- A **filters panel** with dropdowns for language, MLS team, region, state, and city
- A **contributors table** (or mobile card list) ranked by GitHub activity score
- A **hiring section** footer bar at the bottom

> **Default language:** Java is automatically selected as the default language on first load if no `languageId` is in the URL. Use the filters panel to switch to TypeScript, Python, or any other supported language.

---

## Verify the API Directly

While the services are running, you can test the API directly:

```bash
# Fetch top 5 Java contributors (after cache warms up)
curl "http://localhost:8450/api/contributors/search?languageId=java&maxResults=5"
```

```bash
# Autocomplete cities matching "San"
curl "http://localhost:8450/api/autocomplete/cities?query=San&maxResults=5"
```

```bash
# List supported programming languages
curl "http://localhost:8450/api/autocomplete/languages?maxResults=20"
```

A successful contributor search returns JSON with a `status: "success"` field and an array of ranked contributor objects.

---

## Next Steps

After completing this quick start:

- Explore the **[First Steps Guide](first-steps.md)** to learn how to use filters, export data, and navigate the leaderboard
- Read the **[Prerequisites Guide](prerequisites.md)** if you encounter any environment issues

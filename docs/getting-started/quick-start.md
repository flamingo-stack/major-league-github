# Quick Start

Get Major League GitHub running locally in about 5 minutes.

---

## TL;DR

```bash
# 1. Clone the repository
git clone https://github.com/flamingo-stack/major-league-github.git
cd major-league-github

# 2. Start Redis (Docker)
docker run -d -p 6379:6379 --name mlg-redis redis:7

# 3. Start the Backend Service
cd backend
GITHUB_TOKENS=your_github_pat \
SPRING_REDIS_HOST=localhost \
SPRING_REDIS_PORT=6379 \
mvn spring-boot:run -Pbackend-service

# 4. (New terminal) Start the Cache Updater
cd backend
GITHUB_TOKENS=your_github_pat \
SPRING_REDIS_HOST=localhost \
SPRING_REDIS_PORT=6379 \
mvn spring-boot:run -Pcache-updater

# 5. (New terminal) Start the Frontend
cd frontend
npm install
BACKEND_API_URL=http://localhost:8450 npx webpack serve
```

Open your browser at [http://localhost:8450](http://localhost:8450).

---

## Step-by-Step

### Step 1 — Clone the Repository

```bash
git clone https://github.com/flamingo-stack/major-league-github.git
cd major-league-github
```

### Step 2 — Start Redis

The backend requires Redis for distributed caching. The quickest way is Docker:

```bash
docker run -d \
  -p 6379:6379 \
  --name mlg-redis \
  redis:7
```

Verify Redis is running:

```bash
docker logs mlg-redis
# Expected: Ready to accept connections
```

### Step 3 — Configure GitHub Tokens

Export your GitHub Personal Access Token as an environment variable:

```bash
export GITHUB_TOKENS="ghp_yourTokenHere"
```

> For higher throughput, supply multiple tokens separated by commas:
> `export GITHUB_TOKENS="ghp_token1,ghp_token2,ghp_token3"`

### Step 4 — Start the Backend Service

The Backend Service serves the REST API on port 8450:

```bash
cd backend
GITHUB_TOKENS=$GITHUB_TOKENS \
SPRING_REDIS_HOST=localhost \
SPRING_REDIS_PORT=6379 \
mvn spring-boot:run -Pbackend-service
```

Wait for this log line before proceeding:

```text
Started MajorLeagueGithubApplication in X.XXX seconds
```

### Step 5 — Start the Cache Updater (Optional but Recommended)

The Cache Updater populates Redis with fresh GitHub data in the background:

```bash
# In a new terminal
cd backend
GITHUB_TOKENS=$GITHUB_TOKENS \
SPRING_REDIS_HOST=localhost \
SPRING_REDIS_PORT=6379 \
mvn spring-boot:run -Pcache-updater
```

> **Note:** The Cache Updater runs scheduled refresh jobs. On first startup the `PreCacheService` iterates all configured languages and pre-warms the Redis cache. The frontend will show an empty leaderboard until the cache is ready.

### Step 6 — Start the Frontend Dev Server

```bash
# In a new terminal
cd frontend
npm install
BACKEND_API_URL=http://localhost:8450 npx webpack serve
```

The dev server proxies all `/api` requests to the backend.

---

## Expected Result

Open [http://localhost:8450](http://localhost:8450) in your browser.

You should see:
- The Major League GitHub leaderboard loading
- Filter controls for language, city, state, region, and MLS team
- Contributor cards rendering as the cache warms up

If the leaderboard shows "Cache is still being populated", wait 30–60 seconds for the `PreCacheService` to finish its first pass.

---

## API Quick Test

Confirm the backend is responding:

```bash
curl http://localhost:8450/api/contributors/search?languageId=java&maxResults=5
```

Expected response shape:

```json
{
  "status": "success",
  "message": "Found 5 contributors matching the criteria",
  "data": [...]
}
```

---

## What Happens Next

After the cache is warm, the leaderboard becomes fully responsive. Try:

- Selecting a different programming language from the filter panel
- Filtering by a U.S. state or MLS team
- Copying the URL — all filters are encoded as query parameters for sharing

For a guided tour of features, see the [First Steps](first-steps.md) guide.

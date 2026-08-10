# Quick Start

Get Major League GitHub running locally in about 5 minutes.

---

## TL;DR

```bash
# 1. Clone the repository
git clone https://github.com/flamingo-stack/major-league-github.git
cd major-league-github

# 2. Start Redis
redis-server

# 3. Start the backend (new terminal)
cd backend
GITHUB_TOKENS=your_github_token_here mvn spring-boot:run

# 4. Start the frontend (new terminal)
cd frontend
npm install
BACKEND_API_URL=http://localhost:8450 npm run dev
```

Open your browser at **[http://localhost:3000](http://localhost:3000)**.

---

## Step-by-Step Setup

### Step 1 — Clone the Repository

```bash
git clone https://github.com/flamingo-stack/major-league-github.git
cd major-league-github
```

### Step 2 — Start Redis

Redis must be running before the backend starts. If you installed Redis via Homebrew (macOS):

```bash
brew services start redis
```

Or start it directly:

```bash
redis-server
```

Verify Redis is running:

```bash
redis-cli ping
```

Expected output:

```text
PONG
```

### Step 3 — Start the Backend

The backend is a Spring Boot 3.4 application built with Maven. The `backend-service` profile runs the REST API on port 8450.

```bash
cd backend
GITHUB_TOKENS=ghp_your_token_here mvn spring-boot:run
```

> Replace `ghp_your_token_here` with a real GitHub Personal Access Token. See the Prerequisites guide for token creation instructions.

You should see Spring Boot startup output followed by:

```text
Started MajorLeagueGithubApplication
```

The cache will begin warming up immediately. The first load may take a moment as GitHub data is fetched and cached.

**To use the disk cache instead of Redis (simpler for dev):**

```bash
cd backend
GITHUB_TOKENS=ghp_your_token_here \
CACHE_IMPLEMENTATION=disk \
mvn spring-boot:run
```

### Step 4 — Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Step 5 — Start the Frontend Dev Server

```bash
BACKEND_API_URL=http://localhost:8450 npm run dev
```

The frontend dev server starts on port 3000.

### Step 6 — Open the App

Navigate to:

```text
http://localhost:3000
```

You should see the Major League GitHub leaderboard. Use the filter panel to select a programming language and geographic location.

---

## Expected Results

Once the app is running, you should see:

- A leaderboard displaying ranked GitHub contributors
- Filter dropdowns for language, city, state, region, and MLS team
- A scoring display showing commits, stars, and the calculated score
- A CSV export button to download results

---

## Multiple GitHub Tokens (Optional)

To increase rate limits and support higher API concurrency, provide multiple tokens separated by commas:

```bash
GITHUB_TOKENS=ghp_token1,ghp_token2,ghp_token3 mvn spring-boot:run
```

The `GithubTokenRateManager` will automatically distribute requests across all tokens and rotate intelligently based on remaining rate limits.

---

## Running the Cache Updater (Optional)

The Cache Updater is a second microservice that pre-warms and refreshes cached data on a schedule. Run it on port 8451:

```bash
cd backend
GITHUB_TOKENS=ghp_your_token_here mvn spring-boot:run -Dspring-boot.run.profiles=cache-updater
```

For most local development scenarios, the Cache Updater is not required. The backend service warms the cache on startup automatically.

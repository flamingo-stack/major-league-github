# First Steps

After completing the quick start and getting the app running, here are the first things to explore and configure.

---

## 1. Explore the Leaderboard

Open **[http://localhost:3000](http://localhost:3000)** and try the following:

### Filter by Programming Language

Use the **Language** autocomplete to select a language (e.g., Java, TypeScript, Python). The leaderboard updates automatically using the TanStack React Query caching layer — no page reload needed.

### Filter by Location

Combine geographic filters:

- **City** — drill down to a specific city
- **State** — view contributors across an entire U.S. state
- **Region** — multi-state MLS regions (e.g., Pacific, Southeast)
- **MLS Team** — contributors near a specific stadium

> Filters are URL-driven. Every filter change updates the browser URL, making results shareable and bookmarkable.

### Try the "Near Me" Feature

The `useNearestRegion` hook uses your browser's Geolocation API to automatically suggest the closest MLS region. Click **Use My Location** if prompted by the browser.

---

## 2. Explore the REST API

With the backend running on port 8450, open a browser or use curl to explore the API directly:

**Get ranked contributors (default language, no location filter):**

```bash
curl "http://localhost:8450/api/contributors/search"
```

**Filter by language and state:**

```bash
curl "http://localhost:8450/api/contributors/search?languageId=java&stateId=ca"
```

**Autocomplete cities:**

```bash
curl "http://localhost:8450/api/autocomplete/cities?query=San"
```

**Autocomplete languages:**

```bash
curl "http://localhost:8450/api/autocomplete/languages?query=ty"
```

**Get a specific city by ID:**

```bash
curl "http://localhost:8450/api/entities/cities/1"
```

**Export as CSV:**

```bash
curl "http://localhost:8450/api/contributors/export?languageId=java" \
  -o contributors.csv
```

The API always returns a consistent JSON envelope:

```json
{
  "status": "success",
  "message": null,
  "data": [...]
}
```

---

## 3. Understand the Scoring Formula

The ranking formula is:

```text
score = commits × max(starsReceived, 1) × recencyMultiplier
```

- **recencyMultiplier** ranges from `1.0` to `2.0`
- Contributors with activity in the past year receive a higher multiplier
- Stars floored at `1` to prevent zero-scores for active contributors with few-starred repos

This means a contributor with many commits and recent activity will outrank someone with high stars but old activity.

---

## 4. Configure the Cache

By default, the backend uses **Redis** in `read-write` mode. You can switch to disk-based caching for simpler local development:

**Disk cache (no Redis required):**

```bash
GITHUB_TOKENS=your_token \
CACHE_IMPLEMENTATION=disk \
mvn spring-boot:run -f backend/pom.xml
```

**Force-update mode (bypasses cache, always fetches fresh):**

```bash
GITHUB_TOKENS=your_token \
CACHE_MODE=force-update \
mvn spring-boot:run -f backend/pom.xml
```

> **Warning:** `force-update` mode makes a live GitHub API call on every request. Use sparingly to avoid hitting rate limits.

---

## 5. Check Application Health

Spring Boot Actuator is included. Check application health:

```bash
curl "http://localhost:8450/actuator/health"
```

Expected response:

```json
{
  "status": "UP"
}
```

---

## Key Configuration Reference

| Property | Default | Description |
|----------|---------|-------------|
| `cache.implementation` | `redis` | Cache backend: `redis` or `disk` |
| `cache.mode` | `read-write` | Cache mode: `read-write`, `read-only`, `force-update` |
| `spring.redis.host` | `localhost` | Redis host |
| `spring.redis.port` | `6379` | Redis port |
| `github.tokens` | — | Comma-separated GitHub PATs |
| `github.api.concurrency` | varies | Concurrent GitHub API calls |

---

## Where to Get Help

- **GitHub Issues:** [https://github.com/flamingo-stack/major-league-github/issues](https://github.com/flamingo-stack/major-league-github/issues)
- **GitHub Discussions / PRs:** [https://github.com/flamingo-stack/major-league-github/pulls](https://github.com/flamingo-stack/major-league-github/pulls)
- **Live Site:** [https://www.mlg.soccer](https://www.mlg.soccer)

---

## Common First-Run Issues

| Issue | Likely Cause | Fix |
|-------|-------------|-----|
| Backend won't start | Redis not running | Run `redis-server` first |
| Empty leaderboard | Cache still warming | Wait 30–60 seconds after startup |
| `Rate limit exceeded` error | GitHub token missing or exhausted | Check `GITHUB_TOKENS` env var |
| CORS error in browser | Frontend/backend URL mismatch | Set `BACKEND_API_URL=http://localhost:8450` |
| Frontend 404 on refresh | Dev server not configured for SPA routing | Use the frontend dev server, not a static server |

# First Steps

After getting Major League GitHub running locally, here are the first things to explore and configure.

---

## 1. Explore the Leaderboard

Open the app at http://localhost:8450 and observe the default leaderboard view:

- The leaderboard ranks GitHub contributors using the **MLG scoring formula** — a weighted combination of commits, repository stars, and activity recency
- Each contributor card shows their GitHub username, avatar, contribution count, stars earned, and the MLS team closest to their city
- The default filter shows all regions and languages (Java is the default language)

```text
Score = commits × max(starsReceived, 1) × recencyMultiplier
         ↑               ↑                    ↑
    volume         impact            freshness [1.0–2.0]
```

---

## 2. Try the Filters

The **Filters Panel** at the top of the page has five independent filter dropdowns:

| Filter | Description |
|--------|-------------|
| **Language** | Filter by programming language (Java, TypeScript, Python, etc.) |
| **Region** | Filter by MLS geographic region (Pacific, Mountain, Midwest, etc.) |
| **State** | Filter by U.S. state |
| **City** | Filter by specific city |
| **MLS Team** | Filter by the soccer team nearest to the contributor's city |

**Try this:** Select "TypeScript" as the language, then pick a region. Notice that the URL updates automatically — the full filter state is always in the URL, making it easy to share or bookmark.

### Shareable URLs

Every filter combination produces a unique, shareable URL. For example:

```text
http://localhost:8450?languageId=typescript&regionId=pacific
```

Paste that URL in a new browser tab and the same filtered leaderboard appears instantly.

---

## 3. Use the Auto-Locate Feature

The application automatically detects your browser's geographic location on first load (with your permission) and selects the nearest MLS region. This is powered by the `useNearestRegion` hook, which calculates Haversine distance from your coordinates to each region's centroid.

- Click **"Allow"** when the browser asks for location permission
- The region dropdown will auto-populate with the nearest MLS region
- You can still manually change it at any time

---

## 4. Export Contributors to CSV

You can download the current leaderboard view as a CSV spreadsheet. Use the export button in the UI, or call the API directly:

```bash
# Export current top contributors as CSV (adjust query params as needed)
curl "http://localhost:8450/api/contributors/export?languageId=java" \
  --output contributors.csv
```

The exported file contains all leaderboard fields including scores, city, and MLS team assignment.

---

## 5. Explore the Hiring Section

The Hiring Section surfaces a configurable hiring manager profile (fetched from GitHub) alongside job openings pulled from LinkedIn (or fallback defaults if LinkedIn is not configured).

To enable the LinkedIn hiring integration, set these environment variables:

```bash
export LINKEDIN_CLIENT_ID=your_client_id
export LINKEDIN_CLIENT_SECRET=your_client_secret
export LINKEDIN_ORGANIZATION_ID=your_org_id
```

Without these, the app shows a set of predefined default job listings — the leaderboard and all other features still work normally.

---

## 6. Inspect the REST API

The backend exposes a full REST API. These are the primary endpoints:

```text
GET /api/contributors/search   — Search and rank contributors (filtered leaderboard)
GET /api/contributors/export   — Download contributors as CSV
GET /api/autocomplete/cities   — City autocomplete
GET /api/autocomplete/states   — State autocomplete
GET /api/autocomplete/regions  — Region autocomplete
GET /api/autocomplete/languages — Language autocomplete
GET /api/autocomplete/teams    — MLS team autocomplete
GET /api/entities/...          — Lookup by entity ID
GET /api/hiring/...            — Hiring manager + job openings
GET /actuator/health           — Health check endpoint
```

All responses use a standardized envelope:

```json
{
  "status": "success",
  "message": "OK",
  "data": [ ... ]
}
```

---

## 7. Understand the Cache Behavior

Major League GitHub uses a **cache-first architecture**:

- The first request for a given filter combination fetches live data from GitHub and stores it in Redis
- Subsequent requests for the same combination are served from Redis (very fast)
- The Cache Updater service (port 8451) runs on a schedule to refresh cached entries in the background, so users never wait for a stale entry to expire

You can inspect the Redis cache directly:

```bash
redis-cli keys "*"          # List all cached keys
redis-cli get "some-key"    # Inspect a specific cached entry
```

---

## 8. Understand the Two Spring Profiles

The backend codebase runs as two distinct microservices controlled by Spring Boot profiles:

| Profile | Port | Purpose |
|---------|------|---------|
| `backend-service` | 8450 | Serves the public REST API |
| `cache-updater` | 8451 | Runs scheduled cache refresh jobs |

To switch profiles, pass `-Dspring-boot.run.profiles=<profile>` to the Maven Spring Boot plugin, or set the `SPRING_PROFILES_ACTIVE` environment variable.

---

## Where to Get Help

- **GitHub Issues:** https://github.com/flamingo-stack/major-league-github/issues
- **Source Code:** https://github.com/flamingo-stack/major-league-github
- **Live Site:** https://www.mlg.soccer
- **Architecture Docs:** See the `docs/reference/architecture/` directory in the repository for in-depth module documentation

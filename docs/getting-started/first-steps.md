# First Steps

After starting Major League GitHub locally, here are the five things to do first to orient yourself and explore the platform.

---

## 1. Explore the Leaderboard Filters

The filter panel at the top of the page lets you slice the leaderboard across several dimensions simultaneously:

| Filter | Description |
|--------|-------------|
| **Language** | Programming language (Java, Python, TypeScript, Go, etc.) |
| **City** | Filter contributors near a specific U.S. city |
| **State** | Filter by U.S. state |
| **Region** | Filter by geographic region (e.g., Pacific Northwest) |
| **MLS Team** | Filter contributors nearest to an MLS stadium |

Try combining a language (e.g., `Python`) with a state (e.g., `California`) to see how the leaderboard responds. Notice that the URL updates as you apply filters — the full filter state is encoded in the query parameters.

---

## 2. Share a Leaderboard View

Every leaderboard configuration is fully shareable via URL. For example:

```text
https://www.mlg.soccer/?languageId=python&stateId=california
```

All filter parameters are managed by the `useUrlState` hook in the frontend, which keeps the browser URL in sync with the current view. This means:

- Bookmarking a URL preserves your filters
- Sharing a link with a colleague shows them the exact same leaderboard
- Refreshing the page maintains your current filter selections

---

## 3. Understand Contributor Scoring

Each contributor card displays a score. The scoring formula is:

```text
Score = commits × max(starsReceived, 1) × recencyMultiplier
```

Where:
- **commits** = total contributions to repositories in the selected language
- **starsReceived** = total stars on repositories in that language
- **recencyMultiplier** = 1.0–2.0 based on activity within the past year

Higher scores indicate developers who are prolific, have impactful projects, and have been recently active. This formula deliberately rewards both volume and impact.

---

## 4. Export Results to CSV

Any filtered leaderboard view can be exported as a CSV file. The export button triggers a browser download of a file named `contributors.csv` containing:

- GitHub username, display name, and profile URL
- Location (city, state, region)
- Nearest MLS team
- Score breakdown (commits, stars, recency)
- Social links (GitHub, Twitter, Mastodon, Bluesky, website, email)

To export, click the **Export CSV** button in the UI, or make a direct request:

```bash
curl "http://localhost:8450/api/contributors/export?languageId=java&maxResults=15" \
  -o contributors.csv
```

---

## 5. Check the REST API Directly

The backend exposes a clean REST API you can explore directly. Key endpoints:

```bash
# Get top Java contributors in California
curl "http://localhost:8450/api/contributors/search?languageId=java&stateId=california"

# Autocomplete cities starting with "San"
curl "http://localhost:8450/api/autocomplete/cities?query=San"

# Autocomplete available programming languages
curl "http://localhost:8450/api/autocomplete/languages?query=py"

# Look up a specific MLS team by ID
curl "http://localhost:8450/api/entities/teams/la-galaxy"

# Look up a specific region by ID
curl "http://localhost:8450/api/entities/regions/west-coast"
```

All responses follow the standardized `ApiResponse<T>` wrapper:

```json
{
  "status": "success",
  "message": "...",
  "data": ...
}
```

---

## Where to Get Help

- **Open an issue:** [https://github.com/flamingo-stack/major-league-github/issues](https://github.com/flamingo-stack/major-league-github/issues)
- **Browse open PRs:** [https://github.com/flamingo-stack/major-league-github/pulls](https://github.com/flamingo-stack/major-league-github/pulls)
- **Read the architecture docs** in the `docs/reference/architecture/` folder of this repository for deep-dives into each module
- **Spring Boot Actuator** — the backend exposes `/actuator/health` for service health checks at [http://localhost:8450/actuator/health](http://localhost:8450/actuator/health)

---

## Common Early Questions

**Q: The leaderboard is empty after starting. What's wrong?**
A: The `PreCacheService` warms the Redis cache on startup by iterating all languages. Wait 30–90 seconds and refresh. The `/actuator/health` endpoint confirms the backend is running.

**Q: Can I add more GitHub tokens?**
A: Yes. Set `GITHUB_TOKENS` to a comma-separated list. The `GithubTokenRateManager` automatically distributes requests across tokens and selects the one with the most remaining quota.

**Q: Where is geographic data stored?**
A: Cities, states, regions, and teams are loaded from CSV files in `backend/src/main/resources/data/` at startup. No database migrations are needed.

**Q: How do I change the default language?**
A: The default language is Java (configured in `LanguageService`). Change `languageId` in the URL to switch — or modify the `LanguageService` default for your own deployment.

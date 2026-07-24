# First Steps

You have the leaderboard running — now let's explore it. This guide walks through the five most important things to do after your first startup.

---

## 1. Select a Programming Language

The language filter is the **primary filter** — without a language selected, no contributor data is shown.

On the filters panel at the top of the page:

1. Click the **Language** autocomplete dropdown
2. Start typing a language name (e.g., `Rust`, `TypeScript`, `Python`)
3. Select a result from the list

The leaderboard will immediately fetch and display the top contributors for that language.

> **Default:** Java is automatically selected on first load if no `languageId` is present in the URL query string.

**Deep-link example** — share a pre-filtered view by copying the URL after selecting filters:

```text
http://localhost:8450/?languageId=typescript
```

Any URL with valid filter parameters will load with those filters already applied — no configuration required.

---

## 2. Explore Geographic Filters

You can narrow the leaderboard by location using four geographic dimensions:

| Filter | Description |
|---|---|
| **MLS Team** | Shows contributors located near a specific MLS stadium (uses proximity/city mapping) |
| **Region** | Broad geographic groupings (e.g., Pacific, Midwest, Southeast) |
| **State** | US state filter |
| **City** | Specific city within a state or region |

### Geolocation Auto-Detection

The first time you load the app, your browser may prompt for location permission. If you grant it, the leaderboard uses the **Haversine formula** to calculate your distance from each MLS region and pre-selects the nearest one.

To use auto-detection manually:

1. Clear any existing region filter
2. Grant browser location access when prompted
3. The nearest region is automatically populated in the Region filter

### Filter Dependencies

Filters cascade: selecting a **State** narrows the available **City** options. Changing the **Region** clears any previously selected city to avoid mismatched combinations.

---

## 3. Export the Leaderboard as CSV

Any filtered view can be exported as a downloadable CSV file.

**Using the keyboard shortcut:**
- macOS: `Option + E`
- Windows / Linux: `Alt + E`

**Using the UI:**
1. Apply your desired language, location, and team filters
2. Click the **Download CSV** link in the filters panel
3. Choose the number of results to export when prompted
4. The file downloads automatically

**CSV filename format:**

```text
mlg-contributors-{language}-{location}-{date}.csv
```

**Columns in the exported file:**

```text
Rank, First Name, Last Name, City, State, MLG URL, GitHub URL, Email, Twitter, LinkedIn
```

---

## 4. Browse Contributor Profiles

Each row in the leaderboard is a ranked GitHub contributor. Hover over cells to see tooltips with additional information:

| Tooltip | Content |
|---|---|
| **Contributor tooltip** | GitHub avatar, username, full name, and bio |
| **Location tooltip** | City, state, and region details |
| **Team tooltip** | The nearest MLS team's logo, stadium, and location |

On **mobile**, contributors are displayed as cards instead of a table. Tap a card to expand its details.

Each contributor row includes:

- **Rank** — Numeric position on the leaderboard
- **Name / Avatar** — Links to their GitHub profile
- **Location** — City and state
- **MLS Team** — Nearest MLS stadium affiliation (with team logo)
- **Score** — Aggregate GitHub activity score
- **Commits** — Total commit count
- **Stars** — Stars received across their repositories

---

## 5. Explore the Hiring Section

At the bottom of the page, a collapsible **Hiring Section** strip shows hiring information configured by whoever runs the instance.

To expand it:
- Click anywhere on the footer bar, or tap the expand arrow

The expanded panel shows:
- **Hiring manager profile** — Avatar, name, role, bio
- **GitHub stats** — Their own repositories and star count
- **Social links** — LinkedIn, Twitter, and other platforms
- **Open positions** — Count of available job openings

> **Note:** The hiring section only renders when a hiring manager profile is configured by the backend. If you are self-hosting, this section can remain empty without affecting the leaderboard functionality.

---

## Quick Reference: Filter URL Parameters

All filter state is stored in the URL. You can construct any filtered view by editing the address bar directly:

| Parameter | Example Value | Description |
|---|---|---|
| `languageId` | `typescript` | Programming language |
| `teamId` | `lafc` | MLS team identifier |
| `regionId` | `pacific` | Geographic region |
| `stateId` | `CA` | US state code |
| `cityId` | `san-francisco` | City identifier |

**Example combined filter URL:**

```text
http://localhost:8450/?languageId=python&stateId=TX&cityId=austin
```

All parameter values are validated against the pattern `^[a-zA-Z0-9-]+$`. Invalid values are silently cleared and the filter reverts to its empty state.

---

## Where to Get Help

- **GitHub Issues** — [github.com/flamingo-stack/major-league-github/issues](https://github.com/flamingo-stack/major-league-github/issues)
- **Pull Requests** — [github.com/flamingo-stack/major-league-github/pulls](https://github.com/flamingo-stack/major-league-github/pulls)
- **Releases** — [github.com/flamingo-stack/major-league-github/releases](https://github.com/flamingo-stack/major-league-github/releases)
- **Live Site** — [mlg.soccer](https://www.mlg.soccer)

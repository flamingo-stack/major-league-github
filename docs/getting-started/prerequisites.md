# Prerequisites

Before running Major League GitHub locally, make sure you have all the required software, accounts, and environment variables in place.

---

## Required Software

| Tool | Minimum Version | Purpose |
|---|---|---|
| **Java (JDK)** | 21 | Backend microservices runtime |
| **Maven** | 3.9+ (or use the included `mvnw` wrapper) | Build and run the backend |
| **Node.js** | 18+ | Frontend build tooling |
| **npm** | 9+ | Frontend dependency management |
| **Redis** | 6+ | Distributed cache shared by both microservices |
| **Git** | Any modern version | Clone the repository |

> **Tip:** Use [SDKMAN!](https://sdkman.io/) to manage Java versions on macOS/Linux, and [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions.

---

## System Requirements

| Resource | Recommendation |
|---|---|
| **RAM** | 4 GB minimum (8 GB recommended when running both services + Redis + frontend dev server) |
| **CPU** | 2+ cores |
| **OS** | macOS, Linux, or Windows (WSL2 recommended on Windows) |
| **Network** | Internet access required — the backend queries the GitHub GraphQL API at runtime |

---

## Account and Access Requirements

### GitHub Personal Access Token (Required)

The backend service queries the **GitHub GraphQL API** to fetch contributor data. You need at least one GitHub Personal Access Token (PAT) with the appropriate scopes.

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. Select the following scope:
   - `read:user` — read user profile data

> **Multiple tokens:** The `GithubTokenRateManager` supports a pool of tokens. Providing multiple PATs improves throughput and reduces the chance of hitting rate limits, especially during cache warm-up.

---

## Required Environment Variables

Both backend microservices and the frontend require certain environment variables at startup.

### Backend Services

| Variable | Required | Description |
|---|---|---|
| `github.tokens` | **Yes** | Comma-separated list of GitHub PATs (e.g., `token1,token2`) |
| `github.api.url` | **Yes** | GitHub REST API base URL (e.g., `https://api.github.com`) |
| `github.api.url.rate_limit` | **Yes** | GitHub rate limit endpoint (e.g., `https://api.github.com/rate_limit`) |
| `spring.redis.host` | No | Redis hostname (default: `localhost`) |
| `spring.redis.port` | No | Redis port (default: `6379`) |
| `github.api.concurrency` | No | Number of parallel API threads (default: `10`) |

These properties can be supplied via `application.yml`, system properties, or environment variables using Spring Boot's standard externalized configuration.

### Frontend

| Variable | Default | Description |
|---|---|---|
| `BACKEND_API_URL` | `https://www.mlg.soccer` | URL of the Backend Service; override to `http://localhost:8450` for local development |
| `PORT` | `8450` | Frontend dev server port |
| `NODE_ENV` | `development` | Build mode (`development` or `production`) |
| `OG_URL` / `BASE_URL` | `https://www.mlg.soccer` | Canonical URL used in SEO metadata |

---

## Verification Commands

Run these commands to confirm your environment is ready before proceeding to the Quick Start guide.

### Check Java Version

```bash
java -version
```

Expected output (version 21 or higher):

```text
openjdk version "21.0.x" ...
```

### Check Maven Version

```bash
mvn -version
```

Or, using the project's Maven wrapper:

```bash
cd backend
./mvnw -version
```

### Check Node.js Version

```bash
node -version
```

Expected output (v18 or higher):

```text
v18.x.x
```

### Check npm Version

```bash
npm -version
```

Expected output:

```text
9.x.x
```

### Check Redis Is Running

```bash
redis-cli ping
```

Expected output:

```text
PONG
```

If Redis is not installed, follow the [official Redis installation guide](https://redis.io/docs/getting-started/installation/) for your OS.

### Verify GitHub Token Access

```bash
curl -H "Authorization: Bearer YOUR_GITHUB_PAT" https://api.github.com/rate_limit
```

Expected output includes `"limit": 5000` or higher under the `graphql` key. A `401` response means the token is invalid or has insufficient scopes.

---

## Notes on macOS (Apple Silicon)

The `pom.xml` includes a native DNS resolver for macOS ARM:

```xml
<dependency>
    <groupId>io.netty</groupId>
    <artifactId>netty-resolver-dns-native-macos</artifactId>
    <classifier>osx-aarch_64</classifier>
</dependency>
```

This dependency eliminates Netty DNS resolution warnings on M1/M2/M3 Macs. No additional configuration is required.

---

Once your environment passes all verification checks, proceed to the [Quick Start Guide](quick-start.md) to clone and run the project.

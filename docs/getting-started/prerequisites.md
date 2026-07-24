# Prerequisites

Before running Major League GitHub locally, make sure you have the following tools, accounts, and environment variables set up.

---

## Required Software

| Tool | Minimum Version | Purpose |
|------|----------------|---------|
| **Java JDK** | 21 | Backend runtime (Spring Boot 3.4) |
| **Apache Maven** | 3.9+ | Backend build and dependency management |
| **Node.js** | 18+ | Frontend build tooling (Webpack) |
| **npm** | 9+ | Frontend package management |
| **Redis** | 6+ | Distributed caching layer |
| **Docker** | 24+ | Containerized local execution (optional but recommended) |
| **Git** | 2.40+ | Source control |

> **Note:** The Maven Wrapper (`./mvnw`) is included in the repository, so a system-wide Maven installation is not strictly required for the backend.

---

## System Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| **RAM** | 4 GB | 8 GB |
| **CPU** | 2 cores | 4 cores |
| **Disk** | 2 GB free | 5 GB free |
| **OS** | macOS, Linux, or Windows (WSL2) | macOS or Linux |

---

## Account Requirements

You need access to the following external services to run the full application:

### GitHub API (Required)

The backend fetches contributor data exclusively through the **GitHub GraphQL API**. Without a token, no leaderboard data can be fetched.

- Create a **Personal Access Token (PAT)** at: https://github.com/settings/tokens
- The token needs the `read:user` and `public_repo` scopes (read-only public data is sufficient)
- For higher throughput, supply **multiple tokens** — the backend round-robins across them

### LinkedIn API (Optional)

Used only for the hiring section. If not configured, the backend will use fallback default job listings.

- Requires a LinkedIn developer application with `r_organization_social` access
- Configure via `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, and `LINKEDIN_ORGANIZATION_ID`

---

## Required Environment Variables

The backend is configured via standard Spring Boot application properties or environment variables.

### Backend Service (Port 8450)

| Variable | Description | Example |
|----------|-------------|---------|
| `GITHUB_TOKEN_1` | Primary GitHub PAT | `ghp_xxxxxxxxxxxx` |
| `GITHUB_TOKEN_2` | Optional second token for rate-limit rotation | `ghp_yyyyyyyyyyyy` |
| `SPRING_REDIS_HOST` | Redis hostname | `localhost` |
| `SPRING_REDIS_PORT` | Redis port | `6379` |
| `GITHUB_API_CONCURRENCY` | Thread pool size for GitHub API calls | `10` |
| `CACHE_IMPLEMENTATION` | `redis` (production) or `disk` (local dev) | `redis` |
| `CACHE_MODE` | `read-write`, `read-only`, or `force-update` | `read-write` |

### Cache Updater Service (Port 8451)

The Cache Updater uses the same Redis and GitHub token configuration as the Backend Service, but is activated with the `cache-updater` Spring profile.

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `BACKEND_API_URL` | URL where the backend is reachable | `/` |
| `PORT` | Port for the webpack dev server | `8450` |
| `NODE_ENV` | Build mode | `development` |

---

## CORS Allowed Origins

The backend's CORS policy allows requests from:

```text
http://localhost:8450
http://localhost:3000
https://www.mlg.soccer
http://www.mlg.soccer
```

If you run the frontend on a different port, you will need to update the `WebConfig.java` CORS configuration.

---

## Verification Commands

Run these commands to confirm your environment is ready before proceeding:

```bash
# Check Java version (must be 21+)
java -version

# Check Maven (or use ./mvnw in the repo)
mvn -version

# Check Node.js version (must be 18+)
node -version

# Check npm version
npm -version

# Check Redis is running
redis-cli ping
# Expected output: PONG

# Check Docker (optional)
docker --version

# Check Git version
git --version
```

---

## Redis Setup

Redis must be running before starting either backend service. The simplest local setup:

```bash
# macOS (Homebrew)
brew install redis
brew services start redis

# Ubuntu / Debian
sudo apt-get install redis-server
sudo systemctl start redis

# Using Docker
docker run -d -p 6379:6379 --name mlg-redis redis:7

# Verify Redis is reachable
redis-cli ping
```

---

## Cloning the Repository

```bash
git clone https://github.com/flamingo-stack/major-league-github.git
cd major-league-github
```

Once you have all prerequisites verified, continue to the [Quick Start guide](quick-start.md).

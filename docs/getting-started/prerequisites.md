# Prerequisites

Before running Major League GitHub locally, make sure you have the following tools and accounts in place.

---

## Required Software

| Tool | Minimum Version | Purpose |
|------|----------------|---------|
| Java (JDK) | 21 | Backend runtime (Spring Boot 3.4 requires Java 17+; project targets Java 21) |
| Maven | 3.9+ | Backend build tool |
| Node.js | 18+ | Frontend build toolchain (Webpack, npm) |
| npm | 9+ | Frontend package manager |
| Redis | 7+ | Distributed cache (required for production mode) |
| Docker | 24+ | Containerized local Redis or full deployment |
| Git | 2.40+ | Source control |

---

## Verification Commands

Run these commands to confirm your environment is ready:

```bash
# Java 21
java -version
# Expected: openjdk 21.x.x ...

# Maven
mvn -version
# Expected: Apache Maven 3.9.x ...

# Node.js
node --version
# Expected: v18.x.x or higher

# npm
npm --version
# Expected: 9.x.x or higher

# Redis (if running locally)
redis-cli ping
# Expected: PONG

# Docker
docker --version
# Expected: Docker version 24.x.x ...

# Git
git --version
# Expected: git version 2.x.x
```

---

## GitHub API Access

The backend calls the GitHub GraphQL API. You will need one or more **GitHub Personal Access Tokens (PATs)** with at minimum `read:user` scope.

### Creating a GitHub PAT

1. Go to [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. Select the scopes:
   - `read:user`
   - `repo` (if you want repository star counts)
4. Copy the generated token

> **Multi-token support:** The backend supports multiple tokens for increased throughput. Configure them as a comma-separated list in the `GITHUB_TOKENS` environment variable. The `GithubTokenRateManager` automatically selects the optimal token per request.

---

## Environment Variables

The following environment variables are required to run the backend. Set them in your shell, a `.env` file, or Kubernetes secrets depending on your deployment method.

### Backend Service

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKENS` | Yes | Comma-separated GitHub Personal Access Tokens |
| `SPRING_REDIS_HOST` | Yes | Redis host (e.g., `localhost`) |
| `SPRING_REDIS_PORT` | Yes | Redis port (default: `6379`) |
| `SPRING_PROFILES_ACTIVE` | Yes | Profile to activate: `backend-service` or `cache-updater` |

### Frontend Development

| Variable | Default | Description |
|----------|---------|-------------|
| `BACKEND_API_URL` | `https://www.mlg.soccer` | Backend API base URL for Webpack dev server proxy |
| `PORT` | `8450` | Webpack dev server port |
| `NODE_ENV` | `development` | Build mode |

---

## System Requirements

| Resource | Recommended |
|----------|-------------|
| RAM | 4 GB+ (8 GB for running all services concurrently) |
| CPU | 2+ cores |
| Disk | 2 GB free (Maven + npm dependency caches) |
| OS | macOS, Linux, or Windows (WSL2 recommended on Windows) |

---

## macOS Note

The backend's `pom.xml` includes a Netty DNS resolver for macOS (`netty-resolver-dns-native-macos` for `osx-aarch_64`). If you are on an Apple Silicon Mac, this dependency is already bundled and no additional configuration is required.

---

## Optional: LinkedIn API

The hiring section fetches job postings via the LinkedIn API. This is entirely optional. If LinkedIn credentials are not configured, the system falls back to static default job entries.

| Variable | Description |
|----------|-------------|
| `LINKEDIN_CLIENT_ID` | LinkedIn OAuth2 Client ID |
| `LINKEDIN_CLIENT_SECRET` | LinkedIn OAuth2 Client Secret |
| `LINKEDIN_ORGANIZATION_ID` | LinkedIn Organization ID for job postings |

---

## Repository

Clone the repository to get started:

```bash
git clone https://github.com/flamingo-stack/major-league-github.git
cd major-league-github
```

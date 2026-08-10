# Prerequisites

Before setting up Major League GitHub locally, ensure you have the required tools, accounts, and environment variables in place.

---

## Required Software

| Tool | Minimum Version | Purpose |
|------|----------------|---------|
| **Java JDK** | 21 | Backend runtime (Spring Boot) |
| **Apache Maven** | 3.9+ | Backend build and dependency management |
| **Node.js** | 18+ | Frontend build toolchain |
| **npm** | 9+ | Frontend package manager |
| **Redis** | 6+ | Distributed cache (required for backend) |
| **Git** | 2.x | Source control |

---

## System Requirements

| Resource | Recommended |
|----------|-------------|
| **RAM** | 4 GB minimum, 8 GB recommended |
| **Disk** | 2 GB free (for Maven + npm dependencies) |
| **OS** | macOS, Linux, or Windows (WSL2 recommended) |
| **CPU** | Any modern x86-64 or ARM64 (Apple Silicon supported) |

> **Apple Silicon (M1/M2/M3) Note:** The pom.xml includes the `netty-resolver-dns-native-macos` dependency with the `osx-aarch_64` classifier, which is required for macOS ARM64 DNS resolution. No special configuration needed beyond the standard Maven build.

---

## Account Requirements

### GitHub Personal Access Token (Required)

The backend queries the GitHub GraphQL API on your behalf. You need at least one GitHub Personal Access Token.

1. Go to [GitHub Settings → Developer Settings → Personal Access Tokens](https://github.com/settings/tokens)
2. Create a **Classic** or **Fine-grained** token
3. Required scopes: `read:user`, `public_repo`

> **Multiple tokens:** For production use, the rate manager supports multiple tokens (`github.tokens`). More tokens allow higher API concurrency and better rate limit resilience.

### LinkedIn API Credentials (Optional)

The hiring section integrates with the LinkedIn API to pull job postings. This is optional for development; the system falls back to predefined remote roles if the API is unavailable.

---

## Environment Variables

The following environment variables are required or optional depending on your setup:

### Backend Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKENS` | **Yes** | Comma-separated GitHub Personal Access Tokens |
| `SPRING_REDIS_HOST` | No | Redis host (default: `localhost`) |
| `SPRING_REDIS_PORT` | No | Redis port (default: `6379`) |
| `CACHE_IMPLEMENTATION` | No | Cache backend: `redis` or `disk` (default: `redis`) |
| `CACHE_MODE` | No | Cache mode: `read-write`, `read-only`, `force-update` (default: `read-write`) |
| `GITHUB_API_CONCURRENCY` | No | Number of concurrent GitHub API requests (default varies by profile) |

### Frontend Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BACKEND_API_URL` | No | Backend API base URL (default: `/`, same-origin) |

> Set `BACKEND_API_URL` to `http://localhost:8450` when running the frontend separately from the backend during local development.

---

## Verification Commands

Use these commands to verify your environment is ready:

**Check Java version:**
```bash
java -version
```
Expected output should show Java 21 or higher.

**Check Maven version:**
```bash
mvn -version
```

**Check Node.js version:**
```bash
node --version
```

**Check npm version:**
```bash
npm --version
```

**Check Redis connectivity:**
```bash
redis-cli ping
```
Expected output: `PONG`

**Check Git version:**
```bash
git --version
```

---

## Spring Boot Maven Profiles

The backend uses two Maven profiles that determine which microservice starts:

| Profile | Port | Purpose |
|---------|------|---------|
| `backend-service` | 8450 | REST API (active by default) |
| `cache-updater` | 8451 | Scheduled cache warming |

The `backend-service` profile is active by default. You do not need to set anything extra to run the API server.

---

## CORS Allowed Origins

The backend is pre-configured to allow CORS from:

- `http://localhost:3000` (local frontend dev server)
- `http://localhost:8450` (local backend)
- `https://www.mlg.soccer` (production)
- `http://www.mlg.soccer` (production HTTP)

No additional CORS configuration is required for standard local development.

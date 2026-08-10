# Security Best Practices

This document describes the security patterns used in Major League GitHub and provides guidelines for keeping the application and its data safe during development and deployment.

---

## Authentication and Authorization

Major League GitHub does not implement user authentication for the public leaderboard — the API is intentionally read-only and publicly accessible. However, several integration points require credential management:

### GitHub API Tokens

The backend authenticates to the GitHub GraphQL API using Personal Access Tokens (PATs). These are managed by the `GithubTokenRateManager` service.

**Token handling rules:**
- Tokens are read from the `GITHUB_TOKENS` environment variable at startup
- Each token is stored in memory as a `GithubToken` state object
- Tokens are never logged, exposed via API responses, or written to cache
- Multiple tokens are supported (comma-separated) for throughput resilience

```text
GITHUB_TOKENS=ghp_token1,ghp_token2,ghp_token3
```

**Required scopes** (minimum):
- `read:user` — to access contributor profile data
- `repo` — to access star counts on repositories

> **Principle of least privilege:** Only request the scopes your tokens actually need. Avoid `write:*` scopes entirely.

### LinkedIn API (Optional)

LinkedIn OAuth2 client credentials are used only if the hiring section is enabled. If not configured, the system falls back to static job entries — no error is thrown.

Credentials are stored exclusively in environment variables:

```text
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
LINKEDIN_ORGANIZATION_ID=...
```

---

## Secrets Management

### Development

In local development, set secrets as shell environment variables or in a `.env.local` file that is **never committed to Git**:

```bash
# Add to .gitignore
echo ".env.local" >> .gitignore

# Create local env file
cat > backend/.env.local << 'EOF'
GITHUB_TOKENS=ghp_yourDevToken
SPRING_REDIS_HOST=localhost
SPRING_REDIS_PORT=6379
EOF
```

### Production (Kubernetes)

In production on GKE, secrets should be stored as Kubernetes Secrets and injected as environment variables into pod containers — never hardcoded in Docker images, Kubernetes manifests committed to the repository, or application properties files.

```bash
kubectl create secret generic mlg-secrets \
  --from-literal=GITHUB_TOKENS="ghp_token1,ghp_token2" \
  --from-literal=LINKEDIN_CLIENT_SECRET="..."
```

Reference secrets in pod specs:

```yaml
env:
  - name: GITHUB_TOKENS
    valueFrom:
      secretKeyRef:
        name: mlg-secrets
        key: GITHUB_TOKENS
```

### CI/CD (GitHub Actions)

Store sensitive values as **GitHub Actions Secrets** in the repository settings. Never interpolate secrets directly into workflow YAML files — use the `secrets` context:

```yaml
- name: Deploy
  env:
    GITHUB_TOKENS: ${{ secrets.GITHUB_TOKENS }}
```

---

## Input Validation and Sanitization

### Backend (Spring Boot)

All request parameters accepted by the REST controllers are primitives or strings with well-defined domains:

- `cityId`, `regionId`, `stateId`, `teamId`, `languageId` — filtered against in-memory reference data (CSV-loaded IDs); if an ID doesn't match a known entity, a warning is logged and the request proceeds with default values
- `maxResults` — bounded by an integer with a default value; no upper limit is enforced in code, but pagination constraints limit result size
- No request body deserialization occurs on public endpoints; all input arrives as URL query parameters

### Frontend (TypeScript)

URL parameter validation is enforced by the `useUrlState` hook before values are passed to the API service:

```typescript
// Only alphanumeric characters and dashes are accepted
validate: (value: string) => /^[a-zA-Z0-9-]+$/.test(value)
```

Parameters that fail validation are silently dropped and replaced with `null` (the default), preventing malformed values from reaching the backend.

---

## CORS Configuration

CORS is configured in `WebConfig` and restricts API access to known origins:

| Allowed Origin | Purpose |
|----------------|---------|
| `http://localhost:8450` | Local development |
| `http://localhost:3000` | Alternative local dev port |
| `https://www.mlg.soccer` | Production frontend |
| `http://www.mlg.soccer` | Production frontend (HTTP redirect) |

Allowed HTTP methods: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`.

> When adding a new deployment environment (e.g., a staging domain), update `WebConfig` to include the staging origin.

---

## API Surface Security

The REST API is **read-only by design** — no authenticated write endpoints exist on the public-facing Backend Service:

- `GET /api/contributors/search` — read only
- `GET /api/contributors/export` — read only (triggers CSV download)
- `GET /api/autocomplete/*` — read only
- `GET /api/entities/*` — read only
- `GET /api/hiring/*` — read only

The Cache Updater service (port 8451) does not expose a public HTTP API. Its scheduled jobs run internally and communicate only with Redis.

**The `/api/` path is disallowed for search engine indexing** via the generated `robots.txt`:

```text
Disallow: /api/
```

---

## Dependency Security

### Backend

- Use `mvn dependency:analyze` periodically to identify unused or missing dependencies
- Review the [GitHub Dependabot alerts](https://github.com/flamingo-stack/major-league-github/security/dependabot) for known CVEs in Maven dependencies
- The `spring-boot-starter-parent` version (`3.4.1`) manages most transitive dependency versions — keep the parent version up to date

```bash
# Check for dependency updates
cd backend
mvn versions:display-dependency-updates
```

### Frontend

- Run `npm audit` regularly to scan for known vulnerabilities in npm packages
- Address `npm audit fix` suggestions promptly for high/critical severity issues

```bash
cd frontend
npm audit
npm audit fix
```

---

## Sensitive Data in Logs

Spring Boot uses SLF4J + Logback. By default, the project logs:
- Incoming request parameters (city, language, state filters) — these are safe public values
- GitHub API rate limit status — safe to log
- Cache readiness state — safe to log

**Never log:**
- `GITHUB_TOKENS` values
- LinkedIn client secrets
- Full GitHub API responses (they may contain private email addresses)

If adding new log statements, apply this rule: log only IDs and counts, never raw token values or personal data.

---

## Security Testing Guidelines

Before submitting a PR that touches authentication, configuration, or API layers, verify:

- [ ] No secrets or tokens appear in code, config files, or test fixtures
- [ ] New environment variables are documented and have empty defaults
- [ ] CORS origins list is not expanded unnecessarily
- [ ] Any new URL parameters pass through the `useUrlState` validation pattern
- [ ] Rate limiting behavior is preserved (do not bypass `GithubTokenRateManager`)
- [ ] No new external API endpoints are called without error handling and fallback behavior

---

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly via [GitHub Security Advisories](https://github.com/flamingo-stack/major-league-github/security/advisories) rather than opening a public issue.

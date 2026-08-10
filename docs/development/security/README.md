# Security Guidelines

This document covers security best practices for developing, configuring, and deploying Major League GitHub. Following these guidelines protects GitHub API credentials, user data, and the application's integrity.

---

## Authentication and Authorization

### GitHub API Tokens

Major League GitHub uses GitHub Personal Access Tokens (PATs) to authenticate with the GitHub GraphQL API. These tokens are the most security-sensitive credentials in the system.

**Required scopes (minimum):**
- `read:user` — read public user data
- `public_repo` — access public repository data

**Do not grant:**
- `repo` (private repository access — not needed)
- `write:*` (any write permission — not needed)
- `admin:*` (any admin permission — not needed)
- `delete_repo` or `gist` — not needed

### Token Storage Rules

| Environment | Storage Method |
|-------------|----------------|
| Local development | Shell environment variable (`export GITHUB_TOKENS=...`) |
| CI/CD (GitHub Actions) | GitHub Secrets (never hardcoded in YAML) |
| Kubernetes (production) | Kubernetes Secrets mounted as environment variables |

**Never:**
- Commit tokens to source control
- Log token values (the `GithubTokenRateManager` logs token metadata, not raw token strings)
- Store tokens in `application.properties` committed to Git
- Embed tokens in Docker images

### LinkedIn API Credentials (Optional)

The LinkedIn integration uses OAuth 2.0 client credentials flow. If configured:

- Store `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET` as Kubernetes Secrets or GitHub Actions Secrets
- Never hardcode credentials in source code or configuration files

---

## Secrets Management

### Local Development

Use shell environment variables, never application config files:

```bash
export GITHUB_TOKENS="ghp_your_token_here"
export LINKEDIN_CLIENT_ID="your_client_id"
export LINKEDIN_CLIENT_SECRET="your_client_secret"
```

Add sensitive variable names to `.gitignore` if you use `.env` files:

```text
.env
.env.local
.env.production
```

### GitHub Actions CI/CD

Store secrets in **GitHub Repository Settings → Secrets and Variables → Actions**:

- `GITHUB_TOKENS`
- `LINKEDIN_CLIENT_ID`
- `LINKEDIN_CLIENT_SECRET`

Reference them in workflow YAML:

```yaml
env:
  GITHUB_TOKENS: ${{ secrets.GITHUB_TOKENS }}
```

**Do not** echo secrets in workflow steps or store them in workflow artifacts.

### Kubernetes (Production)

Create Kubernetes Secrets for sensitive values:

```bash
kubectl create secret generic mlg-secrets \
  --from-literal=GITHUB_TOKENS="ghp_token1,ghp_token2" \
  --from-literal=LINKEDIN_CLIENT_SECRET="your_secret"
```

Reference them in pod specs as environment variables. Avoid base64-encoding secrets manually and storing them in version-controlled YAML files.

---

## Data Encryption

### Data at Rest

- **Redis:** All data cached in Redis is GitHub contributor data (public information). Redis should still be placed on a private network and not exposed publicly.
- **Disk cache:** JSON files on the filesystem contain public GitHub data. Ensure appropriate file system permissions.
- No personally identifiable information (PII) beyond public GitHub profiles is stored.

### Data in Transit

- All production traffic is served over **HTTPS** at `https://www.mlg.soccer`
- Backend-to-Redis communication should use a private network (within the Kubernetes cluster)
- Frontend-to-backend communication is over HTTPS in production

---

## Input Validation and Sanitization

### Backend

The backend validates request parameters in controllers. Key practices:

**ID parameters** — Only alphanumeric IDs are accepted. The `useUrlState` frontend hook validates URL parameters with the regex `^[a-zA-Z0-9-]+$` before sending them to the API.

**Query strings** — Autocomplete queries are passed to GitHub's search API after the backend assembles safe GraphQL queries using the `GitHubQueryBuilder`. The builder uses structured arguments rather than string interpolation, preventing injection.

**No SQL** — The application does not use a SQL database. Geographic data comes from static CSV files loaded at startup, so SQL injection is not applicable.

**Rate limit exceptions** — `GithubRateLimitException`, `GithubTimeoutException`, `GithubGeneralException`, and `GithubTooFastException` are handled by `GlobalExceptionHandler`, which returns structured `ApiError` responses without exposing internal stack traces.

### Frontend

**URL parameter validation** — The `useUrlState` hook validates all URL-driven filter values against `^[a-zA-Z0-9-]+$` before use. Invalid values fall back to defaults.

**No user-generated content rendered as HTML** — All contributor data (names, locations) is rendered through React's JSX, which escapes HTML by default.

---

## CORS Configuration

The backend's CORS policy (configured in `WebConfig`) restricts cross-origin requests to known origins:

```text
http://localhost:8450
http://localhost:3000
https://www.mlg.soccer
http://www.mlg.soccer
```

When deploying to a new environment, add its origin to the CORS allowlist rather than using wildcard (`*`) origins. Avoid `allowedOrigins("*")` in any environment that uses credentials.

---

## Common Security Vulnerabilities and Mitigations

| Vulnerability | Mitigation |
|---------------|-----------|
| **Token leakage** | Environment variables only; never commit to Git |
| **Rate limit exhaustion** | `GithubTokenRateManager` handles primary + secondary limits |
| **Denial of service via cache miss flood** | Redis cache with read-only mode and async refresh |
| **Injection via URL parameters** | Regex validation in `useUrlState`; structured GraphQL builder |
| **Exposed internal errors** | `GlobalExceptionHandler` returns `ApiError` without stack traces |
| **CORS bypass** | Explicit origin allowlist in `WebConfig` |
| **Sensitive data in logs** | Token values are not logged; rate metadata only |

---

## Security Testing and Code Review Guidelines

### Before Committing

- [ ] No secrets, tokens, or passwords committed
- [ ] No wildcard CORS (`allowedOrigins("*")`) added
- [ ] No raw user input passed to external APIs without validation
- [ ] Exception handlers return clean `ApiError` responses, not raw stack traces

### For Code Reviews

- Check that new environment variables are documented and not hardcoded
- Verify that any new endpoints validate their inputs
- Confirm that new external API integrations handle rate limits and timeouts
- Ensure new configuration properties have safe defaults

### Dependency Security

Regularly audit dependencies for known CVEs:

**Backend (Maven):**

```bash
cd backend
mvn dependency:resolve
```

Consider using [OWASP Dependency-Check Maven Plugin](https://owasp.org/www-project-dependency-check/) for automated CVE scanning.

**Frontend (npm):**

```bash
cd frontend
npm audit
```

Fix moderate and high-severity findings before merging.

---

## Reporting Security Issues

If you discover a security vulnerability in Major League GitHub, please report it via GitHub Issues:

[https://github.com/flamingo-stack/major-league-github/issues](https://github.com/flamingo-stack/major-league-github/issues)

For sensitive disclosures, open a private security advisory via GitHub's **Security → Advisories** feature in the repository.

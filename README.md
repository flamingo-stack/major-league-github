<div align="center">
  <img src="https://raw.githubusercontent.com/flamingo-cx/major-league-github/main/frontend/public/og-image-transparent.png" alt="Major League GitHub Logo"/>
</div>

[![Build and Deploy](https://github.com/flamingo-cx/major-league-github/actions/workflows/deploy.yml/badge.svg)](https://github.com/flamingo-cx/major-league-github/actions/workflows/deploy.yml)

**An open-source leaderboard for top GitHub contributors, inspired by Major League Soccer (MLS).**

## Overview
Major League GitHub brings the excitement of soccer to the open-source world by showcasing top GitHub contributors based on programming language, location, and engagement. With soccer-themed filters, this project bridges communities and highlights local open-source talent.

🌐 **Live Demo**: [major-league-github.flamingo.cx](https://major-league-github.flamingo.cx/)

## Features 🚀
- **Filter by Soccer Teams**: Discover top contributors near MLS stadiums, connecting coding and soccer fans.
- **Programming Language Leaderboards**: Focus on specific languages (e.g., Java) to find standout developers.
- **Regional Search**: Filter by region, state, or city to discover local open-source talent.
- **Activity and Engagement Metrics**: Explore contributors ranked by their GitHub activity, including commits, stars, and follower engagement.
- **Dynamic Updates**: Stay up to date with real-time GitHub data.

## Tech Stack 🛠️

### Backend
- Java 21
- Spring Boot 3.4
- Spring WebFlux for reactive programming
- Maven for dependency management
- Microservice Architecture:
  - Web Service: Handles API requests and data serving
  - Cache Updater: Background service for maintaining GitHub data freshness
- Redis for distributed caching

### Frontend
- React 18
- TypeScript
- Material-UI (MUI)
- React Query for data fetching
- Webpack 5 for bundling

### Infrastructure
- Docker for containerization
- Kubernetes for orchestration
- Nginx for frontend serving

## Architecture
```mermaid
graph TD
    subgraph "Frontend"
        UI[React UI]
    end

    subgraph "Backend Services"
        WS[Web Service]
        CU[Cache Updater]
        RC[(Redis Cache)]
    end

    subgraph "External Services"
        GH[GitHub API]
        LI[LinkedIn API]
    end

    UI --> |HTTP/REST| WS
    WS --> |Read| RC
    CU --> |Write| RC
    CU --> |Fetch Data| GH
    WS --> |Fetch Jobs| LI
```

## Prerequisites
- Java Development Kit (JDK) 21
- Node.js 18+ and npm
- Docker and Docker Compose
- Kubernetes cluster (for deployment)
- GitHub API tokens
- Redis instance

## Getting Started

### Backend Setup
```bash
cd backend
./mvnw clean install

# Run Web Service
./mvnw spring-boot:run -Pwebservice

# Run Cache Updater (in a separate terminal)
./mvnw spring-boot:run -Pcache-updater
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev    # For development
npm run build  # For production build
```

### Environment Configuration
1. Create a `.env` file in the backend directory:
```env
GITHUB_TOKENS=token_1,token_2
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_ORG_ID=your_organization_id
REDIS_HOST=localhost
REDIS_PORT=6379
```

2. For the frontend, set up the following environment variables:
```env
# Google Tag Manager
GTM_ID=your_gtm_container_id  # e.g., GTM-XXXXXXX

# Open Graph Meta Tags
OG_TITLE=Major League GitHub
OG_DESCRIPTION=GitHub Scouting Report: Major League Edition
OG_TYPE=website
OG_IMAGE_URL=/og-image.png
OG_SITE_NAME=Major League GitHub
```

### Docker Build
```bash
# Build backend services
cd backend
docker build -t major-league-github-webservice --build-arg PROFILE=web-service .
docker build -t major-league-github-cache-updater --build-arg PROFILE=cache-updater .

# Build frontend
cd frontend
docker build -t major-league-github-frontend .
```

### Kubernetes Deployment
```bash
cd kubernetes/base
kubectl apply -k .
```

## Development
- Backend Web Service runs on `http://localhost:8450`
- Backend Cache Updater runs on `http://localhost:8451`
- Frontend development server runs on `http://localhost:3000`
- Redis should be running on `localhost:6379`

## Why Major League GitHub?
1. **Attract Talent**: Showcase top open-source contributors and connect with experienced engineers.
2. **Highlight Flamingo.cx**: Establish Flamingo.cx as a leader in open-source development based in Miami Beach.
3. **Celebrate Open Source**: Engage with developers passionate about collaboration and innovation.

## How It Works 🛠️
1. **Data Collection**: The Cache Updater service continuously fetches and updates contributor data from GitHub API
2. **Data Storage**: Redis serves as a distributed cache for storing contributor data and API responses
3. **Web Service**: Handles API requests, data filtering, and serving content to the frontend
4. **Mapping with Teams**: Contributors are matched to nearby MLS teams based on location
5. **Interactive UI**: A sleek interface allows filtering by language, region, city, and team

## Contributing 🤝
We welcome contributions from the community! To contribute:
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add feature-name'`.
4. Push to your fork: `git push origin feature-name`.
5. Open a pull request.

## License
This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International Public License](LICENSE).

## Connect with Us 🌍
- Website: [flamingo.cx](https://flamingo.cx)
- LinkedIn: [Michael Assraf](https://linkedin.com/in/michaelassraf)

Let's bring the open-source community closer with Major League GitHub! 🌟

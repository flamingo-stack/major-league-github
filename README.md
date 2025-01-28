<div align="center">
  <img src="https://raw.githubusercontent.com/flamingo-cx/major-league-github/main/frontend/public/og-image-transparent.png" alt="Major League GitHub Logo"/>
</div>

[![Build and Deploy](https://github.com/flamingo-cx/major-league-github/actions/workflows/deploy.yml/badge.svg)](https://github.com/flamingo-cx/major-league-github/actions/workflows/deploy.yml)

**An open-source leaderboard for top GitHub contributors, inspired by Major League Soccer (MLS).**

## Overview
Major League GitHub brings the excitement of soccer to the open-source world by showcasing top GitHub contributors based on programming language, location, and engagement. With soccer-themed filters, this project bridges communities and highlights local open-source talent.

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

## Prerequisites
- Java Development Kit (JDK) 21
- Node.js 18+ and npm
- Docker and Docker Compose
- Kubernetes cluster (for deployment)
- GitHub API tokens

## Getting Started

### Backend Setup
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
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
```

### Docker Build
```bash
# Build backend
cd backend
docker build -t major-league-github-backend .

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
- Backend runs on `http://localhost:8450` (configurable via PORT environment variable)
- Frontend development server runs on `http://localhost:3000`

## Why Major League GitHub?
1. **Attract Talent**: Showcase top open-source contributors and connect with experienced engineers.
2. **Highlight Flamingo.cx**: Establish Flamingo.cx as a leader in open-source development based in Miami Beach.
3. **Celebrate Open Source**: Engage with developers passionate about collaboration and innovation.

## How It Works 🛠️
1. **Data Collection**: Leveraging the GitHub API to fetch contributor activity.
2. **Mapping with Teams**: Contributors are matched to nearby MLS teams based on location.
3. **Interactive UI**: A sleek interface allows filtering by language, region, city, and team.

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

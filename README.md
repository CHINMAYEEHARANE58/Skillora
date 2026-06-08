# Skillora - AI Career Copilot

Production-grade full-stack scaffold for an AI career copilot product.

## Stack

- Frontend: React, TypeScript, Tailwind CSS, ShadCN-style UI, React Router, Axios, Recharts
- Backend: Java 21, Spring Boot 3, Spring Security, JWT-ready structure, Maven
- Database: MySQL

## Structure

```text
.
|-- src/                         # React frontend
|   |-- components/              # Reusable UI and layout components
|   |-- layouts/                 # Auth and dashboard layouts
|   |-- lib/                     # API client and helpers
|   |-- pages/                   # Route pages
|   `-- styles/                  # Tailwind entry
|-- backend/                     # Spring Boot backend scaffold
|   |-- pom.xml
|   `-- src/main/
|       |-- java/com/skillora/
|       `-- resources/
`-- package.json
```

## Frontend

```bash
npm install
npm run dev
```

## Backend

```bash
cd backend
mvn spring-boot:run
```

AI features are intentionally not implemented yet.

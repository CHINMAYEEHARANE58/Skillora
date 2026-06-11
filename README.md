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

The AI Resume Analyzer module is scaffolded with an async production pipeline and a local FastAPI analyzer service.

## Authentication APIs

- `POST /api/auth/register` with `fullName`, `email`, `password`
- `POST /api/auth/login` with `email`, `password`
- `POST /api/auth/refresh` with `refreshToken`
- `POST /api/auth/logout` with `refreshToken`
- `POST /api/auth/password/forgot` with `email`
- `POST /api/auth/password/reset` with `token`, `newPassword`
- `GET /api/users/me` requires a bearer access token
- `GET /api/admin/status` requires `ROLE_ADMIN`

The frontend persists access and refresh tokens in local storage, attaches bearer tokens through Axios interceptors, refreshes expired access tokens, and protects dashboard routes.

## AI Resume Analyzer

The analyzer flow is asynchronous:

1. React uploads a PDF to `POST /api/resumes/upload`.
2. Spring stores the PDF in AWS S3.
3. Spring publishes a Kafka event to `resume-analysis-requested`.
4. A Kafka consumer downloads the PDF, extracts text with PDFBox, and sends the text to FastAPI.
5. Results are stored in MySQL and mirrored to Snowflake when enabled.

### Frontend

```bash
cd /Users/chinmayeedeepakharane/Documents/Skillora
npm run dev -- --host 127.0.0.1
```

Open `http://127.0.0.1:5173/resume-analyzer`.

### FastAPI Analyzer

```bash
cd /Users/chinmayeedeepakharane/Documents/Skillora/ai-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000
```

### Required Backend Infrastructure

- MySQL running at `localhost:3306`
- Kafka running at `localhost:9092`
- AWS credentials with access to `AWS_RESUME_BUCKET`
- Optional Snowflake table named `RESUME_ANALYTICS`

Useful environment variables:

```bash
export AWS_REGION=us-east-1
export AWS_RESUME_BUCKET=skillora-resumes
export KAFKA_BOOTSTRAP_SERVERS=localhost:9092
export RESUME_ANALYZER_URL=http://localhost:8000/analyze-resume
export SNOWFLAKE_ENABLED=false
```

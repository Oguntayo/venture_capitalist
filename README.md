# VC Scout - Portfolio Intelligence Platform

VC Scout is a premium "Precision AI Scout" for venture firms, designed to transform institutional discovery into an intelligence-driven experience.

## Features

- **Precision AI Discovery**: Semantic search and thesis-based company matching.
- **Match Intelligence**: Explainable AI scores aligned with your investment thesis.
- **Signal Pulse**: Real-time momentum tracking and growth signal extraction.
- **Enterprise Persistence**: Move beyond static JSON to a fully persistent PostgreSQL-backed data layer.
- **Venture Analytics**: Export curated portfolio data directly to Excel for deep-dive analysis.

## Local Setup Guide

### 1. Prerequisites
- **Node.js**: v18+ 
- **PostgreSQL**: A running instance (local or hosted like Neon.tech)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone <repo-url>
cd vc_internship
npm install
```

### 3. Environment Configuration
Copy the example environment file and populate it with your credentials:
```bash
cp .env.example .env
```
Ensure you provide:
- `DATABASE_URL`: Your PostgreSQL connection string.
- `OPENAI_API_KEY`: For AI enrichment and semantic search.
- `NEXTAUTH_SECRET`: For session security.

### 4. Database Setup & Seeding
Apply the database schema and seed the initial company data:
```bash
# Push schema to database
npx drizzle-kit push

# Seed company data from JSON
npx tsx scripts/seed-companies.ts
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the platform.

## Key Workflows

- **Thesis Alignment**: Set your investment thesis in the dashboard banner to unlock personalized match scores.
- **Deep Scan**: Click on any company to trigger a real-time "Deep Scan" AI enrichment pull from the web.
- **Portfolio Export**: Use the "Export to Excel" button on the Discovery page to download your filtered research.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS + Shadcn UI
- **AI**: OpenAI GPT-4o
- **Auth**: NextAuth.js

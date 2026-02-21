# VC Scout - Portfolio Intelligence Platform

VC Scout is a premium "Precision AI Scout" for venture firms, designed to transform institutional discovery into an intelligence-driven experience. Built for the modern investor, it combines high-fidelity market data with personalized AI reasoning.

## Core Capabilities

- **Institutional Design System**: A "Venture-Black" aesthetic featuring bold typography, glassmorphism, and dynamic micro-animations.
- **Precision AI Discovery**: Semantic search and thesis-based company matching that learns from your strategic lens.
- **Responsive Architecture**: Fully optimized for mobile, tablet, and desktop viewports, featuring an adaptive sidebar and mobile-first navigation.
- **Match Intelligence**: Explainable AI scores (0-100%) that provide transparent rationale aligned with your investment thesis.
- **Deep Wealth Extraction**: Real-time web-scouring to enrich company dossiers with founder backgrounds, investor history, and strategic summaries.
- **Portfolio Export Protocol**: Download curated research and lists directly to Excel, JSON, or CSV for internal reporting.

## Local Setup Guide

### 1. Prerequisites
- **Node.js**: v20+ (recommended)
- **PostgreSQL**: A running instance (local or hosted like Neon.tech)

### 2. Physical Installation
```bash
git clone https://github.com/Oguntayo/venture_capitalist.git
cd venture_capitalist
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```bash
DATABASE_URL="postgres://..."
OPENAI_API_KEY="sk-..."
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Initialization
Deploy the schema and seed the institutional dataset:
```bash
# Push schema to database
npx drizzle-kit push

# Seed company data
npx tsx scripts/seed-companies.ts
```

### 5. Launch Protocol
```bash
npm run dev
```
Access the platform at [http://localhost:3000](http://localhost:3000).

## Institutional Workflows

- **Thesis Alignment**: Define your strategy in the "Thesis" section to activate personalized matching across the entire repository.
- **Intelligence Cycling**: Trigger "Deep Scans" on individual company dossiers to refresh real-time web intelligence.
- **Thematic Collections**: Use "Lists" to group companies by sector, momentum, or deal-flow stage.

## Technical Foundation

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL + Drizzle ORM
- **Styling**: Vanilla CSS + Tailwind CSS + Shadcn UI
- **Intelligence**: OpenAI GPT-4o
- **Security**: NextAuth.js (Session Persistence)

# VC Scout Intelligence

A premium venture capital discovery interface with live AI enrichment, built for high-performance discovery workflows.

## Features

- **Discovery Engine**: Faceted search and filtering by industry, investment stage, and signal score.
- **AI Enrichment**: Real-time website scraping and analysis using OpenAI to generate structured company insights.
- **Workflow Automation**: Save complex searches and curated lists to your personal dashboard (persisted in `localStorage`).
- **Global Command Search**: Quick navigation via `⌘K` command palette.
- **Secure Authentication**: Email/password authentication using NextAuth and Neon (PostgreSQL).
- **Data Export**: Export your curated lists as CSV or JSON for offline analysis.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **Database**: Neon (Postgres) + Drizzle ORM
- **Authentication**: NextAuth.js
- **AI**: OpenAI GPT-4 Turbo
- **Type Safety**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- Neon PostgreSQL database
- OpenAI API Key

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd vc_internship
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="your-neon-db-url"
   OPENAI_API_KEY="your-openai-api-key"
   NEXTAUTH_SECRET="your-random-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Push the database schema:
   ```bash
   npm run db:push
   ```

5. Generate the company data:
   ```bash
   node scripts/generate-data.js
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

## Development Commands

- `npm run lint`: Check for code quality issues.
- `npm run build`: Build the application for production.
- `npm run dev`: Start development server.

## License

MIT

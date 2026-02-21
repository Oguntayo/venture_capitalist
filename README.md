# VC Scout

VC Scout is a product that uses ai to detect ,analyse the market and find the best companies that fits your thesis and investment thesis.This mvp presently,you register,login and then deplouy your thesis ,then on the discover screen,you can search with AI,this way the ai will search our db for companies that fit your description in search box,you have option to save your search workflow.

## Functionalities

- **AI Search**: Searches using AI.
- **Global Search**: Searches using AI and also the name of companies anywhere on the app.
- **Export**: You can export to excel sheet,csv and json.
- **Match Intelligence Score**: Score that shows how much a company matches your thesis ,it ranges from 0-100.

## Local Setup Guide

### 1. Prerequisites
- **Node.js**
- **PostgreSQL**

### 2. Physical Installation
```bash
git clone https://github.com/Oguntayo/venture_capitalist.git
cd venture_capitalist
npm install
```

### 3. Environment Configuration

run the command `cp .env.example .env`
add you own secrets to the .env file

### 4. Database Initialization
Seed the company dataset from the data folder :
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

## Workflows

- **Thesis Deployment**: Define your strategy in the "Thesis" screen to activate personalized matching across the db and when scouting for new data .
- **Deep scan**: Scan to access the websiste of the company and get the latest updates.
- **My Lists**: My list is used to manage companies that you want to monitor,companies undermy lists are monitored live and you get notification on any development.

## Tools Used

- **Framework**: Next.js 
- **Database**: Neon db
- **Styling**: CSS + Tailwind 
- **AI Model**: OpenAI GPT-4o


**You can acces the live demo** at https://venturecapitalist-4ty6izlr7-oguntayos-projects.vercel.app/companies
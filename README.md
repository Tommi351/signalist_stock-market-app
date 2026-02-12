# ✨ Signalist — AI-Powered Stock Market App

AI-powered stock market app built with Next.js, shadcn/ui, Better Auth, and Inngest.

Track real-time prices, set personalized alerts, explore company insights, and manage watchlists.  
An admin dashboard allows managing stocks, publishing news, and monitoring user activity.  
Event-driven workflows power automated alerts, AI-driven daily digests, earnings notifications, and sentiment analysis.

Built for developers and traders who want a modern, real-time financial platform.

---

## ⚙️ Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **MongoDB**
- **Better Auth**
- **Inngest** (event-driven workflows)
- **Finnhub API** (financial market data)
- **Nodemailer**
- **TailwindCSS + shadcn/ui**
- **CodeRabbit** (automated PR reviews)

---

## 🚀 Features

### 📊 Stock Dashboard
Track real-time stock prices with interactive line and candlestick charts.  
Filter stocks by industry, performance, or market cap.

### 🔎 Powerful Search
Quickly search and discover stocks through an intelligent search system.

### ⭐ Watchlist & Alerts
Create personalized watchlists and set price thresholds.  
Receive instant email notifications when conditions are met.

### 🏢 Company Insights
View detailed financial metrics including:
- PE Ratio
- EPS
- Revenue
- Recent news
- Filings
- Analyst ratings
- Sentiment scores

### ⚡ AI-Powered Workflows
Powered by Inngest:
- Automated alert scheduling
- Event-driven price monitoring
- AI-generated market summaries
- Daily digests
- Earnings notifications

### 🔔 Customizable Notifications
Fine-tune alerts based on user preferences.

### 📈 Analytics & Insights
Monitor stock trends, user engagement, and system behavior.

---

## 🤸 Quick Start

### Prerequisites

Make sure you have installed:

- Git
- Node.js
- npm

---

### Clone the Repository

```bash
git clone https://github.com/Tommi351/signalist_stock-tracker-app.git
cd signalist_stock-tracker-app

### Install Repository

```bash
npm install

### Set up Environment Variables

Create a .env file in the root directory and add:
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# FINNHUB
NEXT_PUBLIC_FINNHUB_API_KEY=
FINNHUB_BASE_URL=https://finnhub.io/api/v1

# MONGODB
MONGODB_URI=

# BETTER AUTH
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

# GEMINI
GEMINI_API_KEY=

# NODEMAILER
NODEMAILER_EMAIL=
NODEMAILER_PASSWORD=

Replace placeholer values with your real credentials

### Run the project
```bash
npm run dev
npx inngest-cli@latest dev

Open on http://localhost:3000

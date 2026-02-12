✨ Introduction

AI-powered stock market app built with Next.js, Shadcn, Better Auth, and Inngest! Track real-time prices, set personalized alerts, explore company insights, and manage watchlists. The admin dashboard allows managing stocks, publishing news, and monitoring user activity, while event-driven workflows power automated alerts, AI-driven daily digests, earnings notifications, and sentiment analysis. Perfect for devs and traders who want a dynamic, real-time financial platform.

⚙️ Tech Stack

- Next.js (App Router)
- TypeScript
- MongoDB
- Better Auth
- Inngest (event-driven workflows)
- Finnhub API (provides financial data on stocks, crypto and forex)
- Nodemailer
- TailwindCSS + shadcn/ui
- CodeRabbit (automated PR reviews)

🚀 Features

👉 Stock Dashboard: Track real-time stock prices with interactive line and candlestick charts, including historical data, and filter stocks by industry, performance, or market cap.

👉 Powerful Search: Quickly find the best stocks with an intelligent search system that helps you navigate through Signalist.

👉 Watchlist & Alerts: Create a personalized watchlist, set alert thresholds for price changes, and receive instant email notifications to stay on top of the market.

👉 Company Insights: Explore detailed financial data such as PE ratio, EPS, revenue, recent news, filings, analyst ratings, and sentiment scores for informed decision-making.

👉 AI-Powered Summaries and Real-Time Workflows: Powered by Inngest, automate event-driven processes like price updates, alert scheduling, automated reporting, and AI-driven insights. Generate personalized market summaries, daily digests, and earnings report notifications, helping users track performance and make data-driven decisions.

👉 Customizable Notifications: Fine-tune alerts and notifications based on user watchlists and preferences for a highly personalized experience.

👉 Analytics & Insights: Gain insights into user behavior, stock trends, and engagement metrics, enabling smarter business and trading decisions.

And many more, including code architecture and reusability.

🤸 Quick Start
Follow these steps to set up the project locally on your machine.

Prerequisites

Make sure you have the following installed on your machine:

Git
Node.js
npm (Node Package Manager)
Cloning the Repository

git clone https://github.com/Tommi351/signalist_stock-tracker-app.git
cd signalist_stock-tracker-app
Installation

Install the project dependencies using npm:

npm install
Set Up Environment Variables

Create a new file named .env in the root of your project and add the following content:

NODE_ENV='development'
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

#NODEMAILER
NODEMAILER_EMAIL=
NODEMAILER_PASSWORD=
Replace the placeholder values with your real credentials. You can get these by signing up at: MongoDB, Gemini, Inngest, Finnhub.

Running the Project

npm run dev
npx inngest-cli@latest dev
Open http://localhost:3000 in your browser to view the project.

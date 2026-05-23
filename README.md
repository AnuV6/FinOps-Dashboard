# FinOps Dashboard

A personal finance management dashboard built with Next.js. Track income, expenses, recurring payments, and get Telegram reminders before due dates.

## Features

- **Dashboard** — Monthly income/expenses overview, 6-month bar chart, category donut chart, upcoming payment alerts
- **Transactions** — Add, edit, delete, search, and filter transactions by type, category, and date range
- **Recurring Payments** — Track fixed-date and rolling-interval payments with overdue detection and mark-as-paid
- **Reports** — Monthly breakdown with daily spending chart, category-wise analysis, and PDF export
- **Categories** — Custom categories with color and icon picker for both income and expense
- **Settings** — Telegram bot integration, reminder preferences (1-day/2-day before), password management
- **Telegram Reminders** — Get notified before payments are due

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom CSS variables |
| Charts | Custom SVG charts |
| Fonts | Geist Sans & Geist Mono |
| Containerization | Docker (multi-stage, Alpine) |
| CI/CD | GitHub Actions → GHCR |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker

Build and run locally:

```bash
docker build -t finops-dashboard .
docker run -d -p 3000:3000 finops-dashboard
```

## Project Structure

```
src/
  app/
    globals.css        — Dark theme design system
    layout.tsx         — Root layout with Geist fonts
    page.tsx           — Main app with routing and state
  lib/
    data.ts            — Types, seed data, helpers
  components/
    Icon.tsx           — SVG icon library
    Sidebar.tsx        — Navigation sidebar
    Modal.tsx          — Reusable modal dialog
    Stat.tsx           — Stat card component
    FormControls.tsx   — Switch, Checkbox, Segmented control
    charts/            — BarsChart, DonutChart, DailyBars
    pages/             — All page components
```

## License

Private — personal use only.

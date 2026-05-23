"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import LoginPage from "@/components/pages/LoginPage";
import DashboardPage from "@/components/pages/DashboardPage";
import TransactionsPage from "@/components/pages/TransactionsPage";
import RecurringPage from "@/components/pages/RecurringPage";
import ReportsPage from "@/components/pages/ReportsPage";
import CategoriesPage from "@/components/pages/CategoriesPage";
import SettingsPage from "@/components/pages/SettingsPage";
import {
  type Route,
  type Transaction,
  type RecurringPayment,
  type Category,
  type Settings,
} from "@/lib/data";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [route, setRoute] = useState<Route>("dashboard");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurring, setRecurring] = useState<RecurringPayment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<Settings>({
    telegramChatId: "",
    remindersOn: true,
    remind1d: true,
    remind2d: true,
    dailySummary: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loggedIn) return;
    Promise.all([
      fetch("/api/transactions").then(r => r.json()),
      fetch("/api/recurring").then(r => r.json()),
      fetch("/api/categories").then(r => r.json()),
      fetch("/api/settings").then(r => r.json()),
    ]).then(([txs, recs, cats, setts]) => {
      setTransactions(txs);
      setRecurring(recs);
      setCategories(cats);
      setSettings(setts);
      setLoading(false);
    });
  }, [loggedIn]);

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "var(--text-dim)", fontSize: 14 }}>
        Loading…
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar
        route={route}
        setRoute={setRoute}
        onLogout={() => { setLoggedIn(false); setLoading(true); }}
      />
      <main className="main">
        {route === "dashboard" && (
          <DashboardPage transactions={transactions} recurring={recurring} categories={categories} setRoute={setRoute} />
        )}
        {route === "transactions" && (
          <TransactionsPage
            transactions={transactions}
            setTransactions={setTransactions}
            categories={categories}
          />
        )}
        {route === "recurring" && (
          <RecurringPage
            recurring={recurring} setRecurring={setRecurring}
            categories={categories}
            transactions={transactions} setTransactions={setTransactions}
          />
        )}
        {route === "reports" && (
          <ReportsPage transactions={transactions} categories={categories} />
        )}
        {route === "categories" && (
          <CategoriesPage categories={categories} setCategories={setCategories} transactions={transactions} />
        )}
        {route === "settings" && (
          <SettingsPage settings={settings} setSettings={setSettings} />
        )}
      </main>
    </div>
  );
}

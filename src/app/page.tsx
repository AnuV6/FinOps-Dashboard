"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import LoginPage from "@/components/pages/LoginPage";
import DashboardPage from "@/components/pages/DashboardPage";
import TransactionsPage from "@/components/pages/TransactionsPage";
import RecurringPage from "@/components/pages/RecurringPage";
import ReportsPage from "@/components/pages/ReportsPage";
import CategoriesPage from "@/components/pages/CategoriesPage";
import SettingsPage from "@/components/pages/SettingsPage";
import {
  SEED_TRANSACTIONS,
  SEED_RECURRING,
  SEED_CATEGORIES,
  DEFAULT_SETTINGS,
  type Route,
  type Transaction,
  type RecurringPayment,
  type Category,
  type Settings,
} from "@/lib/data";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [route, setRoute] = useState<Route>("dashboard");

  const [transactions, setTransactions] = useState<Transaction[]>(SEED_TRANSACTIONS);
  const [recurring, setRecurring] = useState<RecurringPayment[]>(SEED_RECURRING);
  const [categories, setCategories] = useState<Category[]>(SEED_CATEGORIES);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="app">
      <Sidebar
        route={route}
        setRoute={setRoute}
        onLogout={() => setLoggedIn(false)}
      />
      <main className="main">
        {route === "dashboard" && (
          <DashboardPage transactions={transactions} recurring={recurring} categories={categories} setRoute={setRoute} />
        )}
        {route === "transactions" && (
          <TransactionsPage transactions={transactions} setTransactions={setTransactions} categories={categories} />
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

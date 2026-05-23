export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: string;
  amount: number;
  note: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
}

export interface RecurringPayment {
  id: string;
  name: string;
  amount: number;
  category: string;
  schedule: "fixed" | "rolling";
  dayOfMonth: number | null;
  intervalDays: number | null;
  nextDue: string;
  status: "upcoming" | "overdue" | "paid";
  notes: string;
}

export interface Settings {
  telegramChatId: string;
  remindersOn: boolean;
  remind1d: boolean;
  remind2d: boolean;
  dailySummary: boolean;
}

export const LKR = (n: number): string => {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  return `${sign}LKR ${abs.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const todayISO = (): Date => {
  return new Date(2026, 4, 23); // May 23, 2026
};

export const fmtDate = (d: string | Date): string => {
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString("en-LK", { year: "numeric", month: "short", day: "numeric" });
};

export const fmtDateShort = (d: string | Date): string => {
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString("en-LK", { month: "short", day: "numeric" });
};

export const isoDate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const daysBetween = (a: string | Date, b: string | Date): number => {
  const A = new Date(a);
  A.setHours(0, 0, 0, 0);
  const B = new Date(b);
  B.setHours(0, 0, 0, 0);
  return Math.round((B.getTime() - A.getTime()) / 86400000);
};

export const SEED_CATEGORIES: Category[] = [
  { id: "c1", name: "Salary", type: "income", color: "#10b981", icon: "Briefcase" },
  { id: "c2", name: "Side Business", type: "income", color: "#34d399", icon: "Sparkles" },
  { id: "c3", name: "Food", type: "expense", color: "#f472b6", icon: "Utensils" },
  { id: "c4", name: "Transport", type: "expense", color: "#60a5fa", icon: "Car" },
  { id: "c5", name: "Hosting", type: "expense", color: "#a78bfa", icon: "Server" },
  { id: "c6", name: "Finance", type: "expense", color: "#2dd4bf", icon: "Landmark" },
  { id: "c7", name: "Gold Payment", type: "expense", color: "#fbbf24", icon: "Gem" },
  { id: "c8", name: "Utilities", type: "expense", color: "#fb923c", icon: "Bolt" },
  { id: "c9", name: "Other", type: "expense", color: "#94a3b8", icon: "MoreHorizontal" },
];

export const SEED_TRANSACTIONS: Transaction[] = (() => {
  const t = todayISO();
  const tx: Transaction[] = [];
  let id = 1;
  const add = (daysAgo: number, type: TransactionType, category: string, amount: number, note: string) => {
    const d = new Date(t);
    d.setDate(d.getDate() - daysAgo);
    tx.push({ id: `t${id++}`, date: isoDate(d), type, category, amount, note });
  };

  // May 2026
  add(0, "expense", "Food", 1850, "Dinner at Upali's");
  add(0, "expense", "Transport", 620, "PickMe to office");
  add(1, "expense", "Food", 980, "Lunch w/ team");
  add(2, "income", "Side Business", 32000, "Logo design - Acme");
  add(3, "expense", "Utilities", 4200, "Mobile + ADSL bill");
  add(4, "expense", "Food", 2300, "Weekly groceries");
  add(5, "expense", "Hosting", 3800, "DigitalOcean droplet");
  add(7, "expense", "Transport", 8500, "Fuel");
  add(8, "expense", "Food", 1450, "Takeout");
  add(10, "expense", "Finance", 12000, "Credit card interest");
  add(12, "expense", "Gold Payment", 18500, "Monthly gold installment");
  add(14, "expense", "Food", 2100, "Groceries");
  add(15, "income", "Salary", 185000, "May salary");
  add(16, "expense", "Utilities", 8400, "Electricity bill");
  add(18, "expense", "Other", 4500, "Birthday gift for Nim");
  add(20, "expense", "Transport", 780, "PickMe");
  add(21, "expense", "Food", 1620, "Lunch");
  add(22, "expense", "Hosting", 1500, "Cloudflare Workers Pro");

  // April 2026
  add(33, "income", "Salary", 185000, "April salary");
  add(35, "income", "Side Business", 45000, "Webflow build");
  add(38, "expense", "Food", 12400, "Groceries x3");
  add(40, "expense", "Transport", 9200, "Fuel + service");
  add(42, "expense", "Utilities", 12600, "Power + water");
  add(45, "expense", "Hosting", 5400, "DO + S3");
  add(48, "expense", "Gold Payment", 18500, "Gold installment");
  add(50, "expense", "Finance", 14000, "CC payment");
  add(52, "expense", "Food", 6800, "Eating out");
  add(55, "expense", "Other", 3200, "Toiletries");

  // March 2026
  add(63, "income", "Salary", 178000, "March salary");
  add(66, "income", "Side Business", 28000, "Brand kit - local cafe");
  add(70, "expense", "Food", 21500, "Groceries (month)");
  add(74, "expense", "Transport", 11200, "Fuel + tyres");
  add(78, "expense", "Utilities", 10800, "Bills");
  add(80, "expense", "Hosting", 5400, "Servers");
  add(82, "expense", "Gold Payment", 18500, "Gold");
  add(84, "expense", "Finance", 10000, "CC payment");
  add(88, "expense", "Other", 7500, "Dental");

  // February 2026
  add(95, "income", "Salary", 178000, "Feb salary");
  add(98, "income", "Side Business", 18000, "Quick logo");
  add(100, "expense", "Food", 19800, "Groceries");
  add(104, "expense", "Transport", 8400, "Fuel");
  add(108, "expense", "Utilities", 9200, "Bills");
  add(110, "expense", "Hosting", 5400, "Servers");
  add(112, "expense", "Gold Payment", 18500, "Gold");
  add(115, "expense", "Finance", 8500, "CC payment");

  // January 2026
  add(125, "income", "Salary", 175000, "Jan salary");
  add(130, "income", "Side Business", 52000, "Year-start project");
  add(132, "expense", "Food", 22400, "Groceries");
  add(136, "expense", "Transport", 12800, "Trip to Kandy");
  add(140, "expense", "Utilities", 9800, "Bills");
  add(142, "expense", "Hosting", 5400, "Servers");
  add(144, "expense", "Gold Payment", 18500, "Gold");
  add(148, "expense", "Other", 9500, "New keyboard");

  // December 2025
  add(158, "income", "Salary", 175000, "Dec salary");
  add(160, "income", "Side Business", 38000, "Holiday cards design");
  add(162, "expense", "Food", 28500, "Holidays groceries");
  add(166, "expense", "Transport", 11400, "Fuel + trips");
  add(170, "expense", "Utilities", 11200, "Bills");
  add(174, "expense", "Hosting", 5400, "Servers");
  add(176, "expense", "Gold Payment", 18500, "Gold");
  add(180, "expense", "Other", 24000, "Christmas gifts");

  return tx.sort((a, b) => (a.date < b.date ? 1 : -1));
})();

export const SEED_RECURRING: RecurringPayment[] = (() => {
  const t = todayISO();
  const inDays = (n: number) => {
    const d = new Date(t);
    d.setDate(d.getDate() + n);
    return isoDate(d);
  };
  return [
    { id: "r1", name: "DigitalOcean droplet", amount: 3800, category: "Hosting", schedule: "fixed", dayOfMonth: 24, intervalDays: null, nextDue: inDays(1), status: "upcoming", notes: "Auto-charge on Visa" },
    { id: "r2", name: "Gold Installment", amount: 18500, category: "Gold Payment", schedule: "fixed", dayOfMonth: 25, intervalDays: null, nextDue: inDays(2), status: "upcoming", notes: "" },
    { id: "r3", name: "Cloudflare Workers Pro", amount: 1500, category: "Hosting", schedule: "rolling", dayOfMonth: null, intervalDays: 30, nextDue: inDays(8), status: "upcoming", notes: "" },
    { id: "r4", name: "Mobile + ADSL", amount: 4200, category: "Utilities", schedule: "fixed", dayOfMonth: 5, intervalDays: null, nextDue: inDays(12), status: "upcoming", notes: "Dialog combined bill" },
    { id: "r5", name: "Electricity (CEB)", amount: 8400, category: "Utilities", schedule: "fixed", dayOfMonth: 18, intervalDays: null, nextDue: inDays(-3), status: "overdue", notes: "" },
    { id: "r6", name: "Credit Card minimum", amount: 12000, category: "Finance", schedule: "fixed", dayOfMonth: 28, intervalDays: null, nextDue: inDays(5), status: "upcoming", notes: "" },
    { id: "r7", name: "Spotify Family", amount: 1900, category: "Other", schedule: "rolling", dayOfMonth: null, intervalDays: 30, nextDue: inDays(18), status: "upcoming", notes: "" },
  ];
})();

export const DEFAULT_SETTINGS: Settings = {
  telegramChatId: "742108391",
  remindersOn: true,
  remind1d: true,
  remind2d: true,
  dailySummary: false,
};

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "Dashboard" },
  { id: "transactions", label: "Transactions", icon: "Transactions" },
  { id: "recurring", label: "Recurring Payments", icon: "Recurring" },
  { id: "reports", label: "Reports", icon: "Reports" },
  { id: "categories", label: "Categories", icon: "Categories" },
  { id: "settings", label: "Settings", icon: "Settings" },
] as const;

export type Route = (typeof NAV_ITEMS)[number]["id"];

export const ICONS_FOR_CATS = ["Briefcase", "Sparkles", "Utensils", "Car", "Server", "Landmark", "Gem", "Bolt", "Wallet", "Coins", "PiggyBank", "MoreHorizontal"];
export const COLOR_SWATCHES = ["#10b981", "#34d399", "#f472b6", "#60a5fa", "#a78bfa", "#2dd4bf", "#fbbf24", "#fb923c", "#94a3b8", "#f87171", "#38bdf8", "#c4b5fd"];

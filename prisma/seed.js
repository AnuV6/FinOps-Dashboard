const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const todayISO = () => new Date(2026, 4, 23);
const isoDate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

async function main() {
  const existing = await prisma.transaction.count();
  if (existing > 0) {
    console.log("Database already seeded, skipping.");
    return;
  }

  console.log("Seeding database...");

  const categories = [
    { id: "c1", name: "Salary",        type: "income",  color: "#10b981", icon: "Briefcase" },
    { id: "c2", name: "Side Business", type: "income",  color: "#34d399", icon: "Sparkles" },
    { id: "c3", name: "Food",          type: "expense", color: "#f472b6", icon: "Utensils" },
    { id: "c4", name: "Transport",     type: "expense", color: "#60a5fa", icon: "Car" },
    { id: "c5", name: "Hosting",       type: "expense", color: "#a78bfa", icon: "Server" },
    { id: "c6", name: "Finance",       type: "expense", color: "#2dd4bf", icon: "Landmark" },
    { id: "c7", name: "Gold Payment",  type: "expense", color: "#fbbf24", icon: "Gem" },
    { id: "c8", name: "Utilities",     type: "expense", color: "#fb923c", icon: "Bolt" },
    { id: "c9", name: "Other",         type: "expense", color: "#94a3b8", icon: "MoreHorizontal" },
  ];
  for (const c of categories) {
    await prisma.category.upsert({ where: { name: c.name }, update: {}, create: c });
  }

  const t = todayISO();
  const add = async (daysAgo, type, category, amount, note) => {
    const d = new Date(t);
    d.setDate(d.getDate() - daysAgo);
    await prisma.transaction.create({ data: { date: isoDate(d), type, category, amount, note } });
  };

  await add(0,  "expense", "Food",         1850,   "Dinner at Upali's");
  await add(0,  "expense", "Transport",    620,    "PickMe to office");
  await add(1,  "expense", "Food",         980,    "Lunch w/ team");
  await add(2,  "income",  "Side Business",32000,  "Logo design - Acme");
  await add(3,  "expense", "Utilities",    4200,   "Mobile + ADSL bill");
  await add(4,  "expense", "Food",         2300,   "Weekly groceries");
  await add(5,  "expense", "Hosting",      3800,   "DigitalOcean droplet");
  await add(7,  "expense", "Transport",    8500,   "Fuel");
  await add(8,  "expense", "Food",         1450,   "Takeout");
  await add(10, "expense", "Finance",      12000,  "Credit card interest");
  await add(12, "expense", "Gold Payment", 18500,  "Monthly gold installment");
  await add(14, "expense", "Food",         2100,   "Groceries");
  await add(15, "income",  "Salary",       185000, "May salary");
  await add(16, "expense", "Utilities",    8400,   "Electricity bill");
  await add(18, "expense", "Other",        4500,   "Birthday gift");
  await add(20, "expense", "Transport",    780,    "PickMe");
  await add(21, "expense", "Food",         1620,   "Lunch");
  await add(22, "expense", "Hosting",      1500,   "Cloudflare Workers Pro");
  await add(33, "income",  "Salary",       185000, "April salary");
  await add(35, "income",  "Side Business",45000,  "Webflow build");
  await add(38, "expense", "Food",         12400,  "Groceries x3");
  await add(40, "expense", "Transport",    9200,   "Fuel + service");
  await add(42, "expense", "Utilities",    12600,  "Power + water");
  await add(45, "expense", "Hosting",      5400,   "DO + S3");
  await add(48, "expense", "Gold Payment", 18500,  "Gold installment");
  await add(50, "expense", "Finance",      14000,  "CC payment");
  await add(52, "expense", "Food",         6800,   "Eating out");
  await add(55, "expense", "Other",        3200,   "Toiletries");
  await add(63, "income",  "Salary",       178000, "March salary");
  await add(66, "income",  "Side Business",28000,  "Brand kit - local cafe");
  await add(70, "expense", "Food",         21500,  "Groceries (month)");
  await add(74, "expense", "Transport",    11200,  "Fuel + tyres");
  await add(78, "expense", "Utilities",    10800,  "Bills");
  await add(80, "expense", "Hosting",      5400,   "Servers");
  await add(82, "expense", "Gold Payment", 18500,  "Gold");
  await add(84, "expense", "Finance",      10000,  "CC payment");
  await add(88, "expense", "Other",        7500,   "Dental");
  await add(95,  "income",  "Salary",      178000, "Feb salary");
  await add(98,  "income",  "Side Business",18000, "Quick logo");
  await add(100, "expense", "Food",        19800,  "Groceries");
  await add(104, "expense", "Transport",   8400,   "Fuel");
  await add(108, "expense", "Utilities",   9200,   "Bills");
  await add(110, "expense", "Hosting",     5400,   "Servers");
  await add(112, "expense", "Gold Payment",18500,  "Gold");
  await add(115, "expense", "Finance",     8500,   "CC payment");
  await add(125, "income",  "Salary",      175000, "Jan salary");
  await add(130, "income",  "Side Business",52000, "Year-start project");
  await add(132, "expense", "Food",        22400,  "Groceries");
  await add(136, "expense", "Transport",   12800,  "Trip to Kandy");
  await add(140, "expense", "Utilities",   9800,   "Bills");
  await add(142, "expense", "Hosting",     5400,   "Servers");
  await add(144, "expense", "Gold Payment",18500,  "Gold");
  await add(148, "expense", "Other",       9500,   "New keyboard");
  await add(158, "income",  "Salary",      175000, "Dec salary");
  await add(160, "income",  "Side Business",38000, "Holiday cards");
  await add(162, "expense", "Food",        28500,  "Holidays groceries");
  await add(166, "expense", "Transport",   11400,  "Fuel + trips");
  await add(170, "expense", "Utilities",   11200,  "Bills");
  await add(174, "expense", "Hosting",     5400,   "Servers");
  await add(176, "expense", "Gold Payment",18500,  "Gold");
  await add(180, "expense", "Other",       24000,  "Christmas gifts");

  const inDays = (n) => {
    const d = new Date(t);
    d.setDate(d.getDate() + n);
    return isoDate(d);
  };

  const recurring = [
    { name: "DigitalOcean droplet",   amount: 3800,  category: "Hosting",      schedule: "fixed",   dayOfMonth: 24, intervalDays: null, nextDue: inDays(1),  status: "upcoming", notes: "Auto-charge on Visa" },
    { name: "Gold Installment",       amount: 18500, category: "Gold Payment", schedule: "fixed",   dayOfMonth: 25, intervalDays: null, nextDue: inDays(2),  status: "upcoming", notes: "" },
    { name: "Cloudflare Workers Pro", amount: 1500,  category: "Hosting",      schedule: "rolling", dayOfMonth: null, intervalDays: 30, nextDue: inDays(8),  status: "upcoming", notes: "" },
    { name: "Mobile + ADSL",          amount: 4200,  category: "Utilities",    schedule: "fixed",   dayOfMonth: 5,  intervalDays: null, nextDue: inDays(12), status: "upcoming", notes: "Dialog combined bill" },
    { name: "Electricity (CEB)",      amount: 8400,  category: "Utilities",    schedule: "fixed",   dayOfMonth: 18, intervalDays: null, nextDue: inDays(-3), status: "overdue",  notes: "" },
    { name: "Credit Card minimum",    amount: 12000, category: "Finance",      schedule: "fixed",   dayOfMonth: 28, intervalDays: null, nextDue: inDays(5),  status: "upcoming", notes: "" },
    { name: "Spotify Family",         amount: 1900,  category: "Other",        schedule: "rolling", dayOfMonth: null, intervalDays: 30, nextDue: inDays(18), status: "upcoming", notes: "" },
  ];
  for (const r of recurring) {
    await prisma.recurringPayment.create({ data: r });
  }

  const settings = [
    { key: "telegramChatId", value: "742108391" },
    { key: "remindersOn",    value: "true" },
    { key: "remind1d",       value: "true" },
    { key: "remind2d",       value: "true" },
    { key: "dailySummary",   value: "false" },
    { key: "password",       value: "demo" },
  ];
  for (const s of settings) {
    await prisma.setting.upsert({ where: { key: s.key }, update: {}, create: s });
  }

  console.log("Seeding complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

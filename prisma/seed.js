const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.category.count();
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

  const settings = [
    { key: "telegramChatId", value: "" },
    { key: "remindersOn",    value: "true" },
    { key: "remind1d",       value: "true" },
    { key: "remind2d",       value: "true" },
    { key: "dailySummary",   value: "false" },
    { key: "password",       value: "A1234" },
  ];
  for (const s of settings) {
    await prisma.setting.upsert({ where: { key: s.key }, update: {}, create: s });
  }

  console.log("Seeding complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

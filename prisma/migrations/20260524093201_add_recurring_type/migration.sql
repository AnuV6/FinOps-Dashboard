-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RecurringPayment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "category" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'expense',
    "schedule" TEXT NOT NULL,
    "dayOfMonth" INTEGER,
    "intervalDays" INTEGER,
    "nextDue" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'upcoming',
    "notes" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_RecurringPayment" ("amount", "category", "dayOfMonth", "id", "intervalDays", "name", "nextDue", "notes", "schedule", "status") SELECT "amount", "category", "dayOfMonth", "id", "intervalDays", "name", "nextDue", "notes", "schedule", "status" FROM "RecurringPayment";
DROP TABLE "RecurringPayment";
ALTER TABLE "new_RecurringPayment" RENAME TO "RecurringPayment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

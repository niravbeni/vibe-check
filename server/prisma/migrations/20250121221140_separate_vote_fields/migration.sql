/*
  Warnings:

  - You are about to drop the column `percentages` on the `Prompt` table. All the data in the column will be lost.
  - You are about to drop the column `votes` on the `Prompt` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Prompt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "promptText" TEXT NOT NULL,
    "goodVotes" INTEGER NOT NULL DEFAULT 0,
    "okVotes" INTEGER NOT NULL DEFAULT 0,
    "badVotes" INTEGER NOT NULL DEFAULT 0,
    "totalVotes" INTEGER NOT NULL DEFAULT 0,
    "goodPercentage" INTEGER NOT NULL DEFAULT 0,
    "okPercentage" INTEGER NOT NULL DEFAULT 0,
    "badPercentage" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Prompt" ("id", "name", "promptText", "totalVotes") SELECT "id", "name", "promptText", "totalVotes" FROM "Prompt";
DROP TABLE "Prompt";
ALTER TABLE "new_Prompt" RENAME TO "Prompt";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

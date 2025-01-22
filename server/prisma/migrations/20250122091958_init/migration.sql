/*
  Warnings:

  - You are about to alter the column `badPercentage` on the `Prompt` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `goodPercentage` on the `Prompt` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `okPercentage` on the `Prompt` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

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
    "goodPercentage" REAL NOT NULL DEFAULT 0,
    "okPercentage" REAL NOT NULL DEFAULT 0,
    "badPercentage" REAL NOT NULL DEFAULT 0
);
INSERT INTO "new_Prompt" ("badPercentage", "badVotes", "goodPercentage", "goodVotes", "id", "name", "okPercentage", "okVotes", "promptText", "totalVotes") SELECT "badPercentage", "badVotes", "goodPercentage", "goodVotes", "id", "name", "okPercentage", "okVotes", "promptText", "totalVotes" FROM "Prompt";
DROP TABLE "Prompt";
ALTER TABLE "new_Prompt" RENAME TO "Prompt";
CREATE UNIQUE INDEX "Prompt_name_key" ON "Prompt"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

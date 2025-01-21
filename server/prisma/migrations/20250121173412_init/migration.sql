/*
  Warnings:

  - You are about to drop the `Vote` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `Prompt` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Prompt` table. All the data in the column will be lost.
  - You are about to drop the column `systemPrompt` on the `Prompt` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Prompt` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Prompt` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `percentages` to the `Prompt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `votes` to the `Prompt` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Vote_promptId_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Vote";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Prompt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "promptText" TEXT NOT NULL,
    "votes" JSONB NOT NULL,
    "totalVotes" INTEGER NOT NULL DEFAULT 0,
    "percentages" JSONB NOT NULL
);
INSERT INTO "new_Prompt" ("id", "name", "promptText") SELECT "id", "name", "promptText" FROM "Prompt";
DROP TABLE "Prompt";
ALTER TABLE "new_Prompt" RENAME TO "Prompt";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateTable
CREATE TABLE "Prompt" (
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

-- CreateIndex
CREATE UNIQUE INDEX "Prompt_name_key" ON "Prompt"("name");

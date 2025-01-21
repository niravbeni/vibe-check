-- CreateTable
CREATE TABLE "Prompt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "promptText" TEXT NOT NULL,
    "systemPrompt" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "promptId" TEXT NOT NULL,
    "score" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vote_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Vote_promptId_idx" ON "Vote"("promptId");

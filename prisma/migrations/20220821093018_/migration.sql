-- CreateTable
CREATE TABLE "Word" (
    "word" TEXT NOT NULL,
    "isNoun" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "Word_word_key" ON "Word"("word");

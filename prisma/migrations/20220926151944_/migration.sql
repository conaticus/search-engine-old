-- CreateTable
CREATE TABLE "Plural" (
    "plural" TEXT NOT NULL,
    "pluralFor" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Plural_plural_key" ON "Plural"("plural");

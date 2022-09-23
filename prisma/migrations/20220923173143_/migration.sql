-- CreateTable
CREATE TABLE "WebPage" (
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "language" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Keyword" (
    "id" SERIAL NOT NULL,
    "webPageUrl" TEXT NOT NULL,

    CONSTRAINT "Keyword_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WebPage_url_key" ON "WebPage"("url");

-- AddForeignKey
ALTER TABLE "Keyword" ADD CONSTRAINT "Keyword_webPageUrl_fkey" FOREIGN KEY ("webPageUrl") REFERENCES "WebPage"("url") ON DELETE RESTRICT ON UPDATE CASCADE;

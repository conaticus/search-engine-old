/*
  Warnings:

  - A unique constraint covering the columns `[index]` on the table `WebPage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `index` to the `WebPage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WebPage" ADD COLUMN     "index" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "WebPage_index_key" ON "WebPage"("index");

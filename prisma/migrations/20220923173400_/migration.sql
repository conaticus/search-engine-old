/*
  Warnings:

  - Added the required column `keyword` to the `Keyword` table without a default value. This is not possible if the table is not empty.
  - Added the required column `occurances` to the `Keyword` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priority` to the `Keyword` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "KeywordPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "Keyword" ADD COLUMN     "keyword" TEXT NOT NULL,
ADD COLUMN     "occurances" INTEGER NOT NULL,
ADD COLUMN     "priority" "KeywordPriority" NOT NULL;

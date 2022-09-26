/*
  Warnings:

  - Added the required column `rank` to the `WebPage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WebPage" ADD COLUMN     "rank" INTEGER NOT NULL;

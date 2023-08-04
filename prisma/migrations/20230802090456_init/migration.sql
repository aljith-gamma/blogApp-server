/*
  Warnings:

  - Added the required column `readTime` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Blog` ADD COLUMN `readTime` VARCHAR(191) NOT NULL;

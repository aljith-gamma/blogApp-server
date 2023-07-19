/*
  Warnings:

  - You are about to drop the column `blogId` on the `Category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[categoryId]` on the table `Blog` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Category` DROP FOREIGN KEY `Category_blogId_fkey`;

-- AlterTable
ALTER TABLE `Blog` ADD COLUMN `categoryId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Category` DROP COLUMN `blogId`;

-- CreateIndex
CREATE UNIQUE INDEX `Blog_categoryId_key` ON `Blog`(`categoryId`);

-- AddForeignKey
ALTER TABLE `Blog` ADD CONSTRAINT `Blog_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

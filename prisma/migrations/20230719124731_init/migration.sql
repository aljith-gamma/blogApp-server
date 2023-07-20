/*
  Warnings:

  - A unique constraint covering the columns `[blogId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Category` DROP FOREIGN KEY `Category_blogId_fkey`;

-- AlterTable
ALTER TABLE `Category` MODIFY `blogId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Category_blogId_key` ON `Category`(`blogId`);

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_blogId_fkey` FOREIGN KEY (`blogId`) REFERENCES `Blog`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

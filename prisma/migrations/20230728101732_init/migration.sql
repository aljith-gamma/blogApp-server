/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `Blog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Blog_id_userId_key` ON `Blog`(`id`, `userId`);

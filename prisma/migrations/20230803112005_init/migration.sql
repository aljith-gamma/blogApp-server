-- CreateIndex
CREATE FULLTEXT INDEX `Blog_content_title_description_idx` ON `Blog`(`content`, `title`, `description`);

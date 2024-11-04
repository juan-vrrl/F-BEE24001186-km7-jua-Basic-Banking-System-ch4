/*
  Warnings:

  - A unique constraint covering the columns `[file_id]` on the table `posts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profile_picture_id]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `file_id` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "file_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "profile_picture_id" TEXT,
ALTER COLUMN "profile_picture" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "posts_file_id_key" ON "posts"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_profile_picture_id_key" ON "profiles"("profile_picture_id");

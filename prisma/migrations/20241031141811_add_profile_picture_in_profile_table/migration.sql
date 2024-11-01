/*
  Warnings:

  - Added the required column `profile_picture` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "profile_picture" TEXT NOT NULL;

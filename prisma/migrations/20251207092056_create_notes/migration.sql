/*
  Warnings:

  - You are about to drop the column `authorId` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the `Attachment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NoteTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Attachment" DROP CONSTRAINT "Attachment_noteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Note" DROP CONSTRAINT "Note_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."NoteTag" DROP CONSTRAINT "NoteTag_noteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."NoteTag" DROP CONSTRAINT "NoteTag_tagId_fkey";

-- AlterTable
ALTER TABLE "public"."Note" DROP COLUMN "authorId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Attachment";

-- DropTable
DROP TABLE "public"."NoteTag";

-- DropTable
DROP TABLE "public"."Tag";

-- AddForeignKey
ALTER TABLE "public"."Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

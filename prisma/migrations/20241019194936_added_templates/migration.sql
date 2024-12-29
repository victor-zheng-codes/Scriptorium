/*
  Warnings:

  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `commentID` on the `Comment` table. All the data in the column will be lost.
  - The primary key for the `CommentReply` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `commentID` on the `CommentReply` table. All the data in the column will be lost.
  - You are about to drop the column `replyID` on the `CommentReply` table. All the data in the column will be lost.
  - You are about to drop the column `commentID` on the `UserCommentRating` table. All the data in the column will be lost.
  - You are about to drop the column `userID` on the `UserCommentRating` table. All the data in the column will be lost.
  - Added the required column `commentId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commentId` to the `CommentReply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `replyId` to the `CommentReply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commentId` to the `UserCommentRating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UserCommentRating` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comment" (
    "commentId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "blogId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Comment_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog" ("blogId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("blogId", "content", "createdAt", "downvotes", "updatedAt", "upvotes") SELECT "blogId", "content", "createdAt", "downvotes", "updatedAt", "upvotes" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
CREATE TABLE "new_CommentReply" (
    "commentId" INTEGER NOT NULL,
    "replyId" INTEGER NOT NULL,

    PRIMARY KEY ("commentId", "replyId"),
    CONSTRAINT "CommentReply_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment" ("commentId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CommentReply_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Comment" ("commentId") ON DELETE RESTRICT ON UPDATE CASCADE
);
DROP TABLE "CommentReply";
ALTER TABLE "new_CommentReply" RENAME TO "CommentReply";
CREATE TABLE "new_UserCommentRating" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    CONSTRAINT "UserCommentRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserCommentRating_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment" ("commentId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserCommentRating" ("id", "rating") SELECT "id", "rating" FROM "UserCommentRating";
DROP TABLE "UserCommentRating";
ALTER TABLE "new_UserCommentRating" RENAME TO "UserCommentRating";
CREATE UNIQUE INDEX "UserCommentRating_userId_commentId_key" ON "UserCommentRating"("userId", "commentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

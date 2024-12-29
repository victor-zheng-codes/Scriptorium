/*
  Warnings:

  - Added the required column `content` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Blog" (
    "blogId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isAppropriate" BOOLEAN NOT NULL DEFAULT true,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "Blog_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Blog" ("authorId", "blogId", "createdAt", "description", "downvotes", "isAppropriate", "isDeleted", "title", "updatedAt", "upvotes") SELECT "authorId", "blogId", "createdAt", "description", "downvotes", "isAppropriate", "isDeleted", "title", "updatedAt", "upvotes" FROM "Blog";
DROP TABLE "Blog";
ALTER TABLE "new_Blog" RENAME TO "Blog";
CREATE TABLE "new_BlogRating" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "blogId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    CONSTRAINT "BlogRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BlogRating_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog" ("blogId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BlogRating" ("blogId", "id", "rating", "userId") SELECT "blogId", "id", "rating", "userId" FROM "BlogRating";
DROP TABLE "BlogRating";
ALTER TABLE "new_BlogRating" RENAME TO "BlogRating";
CREATE UNIQUE INDEX "BlogRating_userId_blogId_key" ON "BlogRating"("userId", "blogId");
CREATE TABLE "new_BlogReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "blogId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL,
    CONSTRAINT "BlogReport_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog" ("blogId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BlogReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BlogReport" ("blogId", "explanation", "id", "userId") SELECT "blogId", "explanation", "id", "userId" FROM "BlogReport";
DROP TABLE "BlogReport";
ALTER TABLE "new_BlogReport" RENAME TO "BlogReport";
CREATE TABLE "new_BlogTags" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tagId" INTEGER NOT NULL,
    "blogId" INTEGER NOT NULL,
    CONSTRAINT "BlogTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("tagId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BlogTags_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog" ("blogId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BlogTags" ("blogId", "id", "tagId") SELECT "blogId", "id", "tagId" FROM "BlogTags";
DROP TABLE "BlogTags";
ALTER TABLE "new_BlogTags" RENAME TO "BlogTags";
CREATE UNIQUE INDEX "BlogTags_tagId_blogId_key" ON "BlogTags"("tagId", "blogId");
CREATE TABLE "new_BlogTemplate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "templateId" INTEGER NOT NULL,
    "blogId" INTEGER NOT NULL,
    CONSTRAINT "BlogTemplate_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template" ("templateId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BlogTemplate_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog" ("blogId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BlogTemplate" ("blogId", "id", "templateId") SELECT "blogId", "id", "templateId" FROM "BlogTemplate";
DROP TABLE "BlogTemplate";
ALTER TABLE "new_BlogTemplate" RENAME TO "BlogTemplate";
CREATE UNIQUE INDEX "BlogTemplate_templateId_blogId_key" ON "BlogTemplate"("templateId", "blogId");
CREATE TABLE "new_Comment" (
    "commentId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "isAppropriate" BOOLEAN NOT NULL DEFAULT true,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,
    "blogId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog" ("blogId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("blogId", "commentId", "content", "createdAt", "downvotes", "isAppropriate", "updatedAt", "upvotes", "userId") SELECT "blogId", "commentId", "content", "createdAt", "downvotes", "isAppropriate", "updatedAt", "upvotes", "userId" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
CREATE TABLE "new_CommentReply" (
    "commentId" INTEGER NOT NULL,
    "replyId" INTEGER NOT NULL,

    PRIMARY KEY ("commentId", "replyId"),
    CONSTRAINT "CommentReply_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment" ("commentId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CommentReply_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Comment" ("commentId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CommentReply" ("commentId", "replyId") SELECT "commentId", "replyId" FROM "CommentReply";
DROP TABLE "CommentReply";
ALTER TABLE "new_CommentReply" RENAME TO "CommentReply";
CREATE TABLE "new_CommentReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "commentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL,
    CONSTRAINT "CommentReport_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment" ("commentId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CommentReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CommentReport" ("commentId", "explanation", "id", "userId") SELECT "commentId", "explanation", "id", "userId" FROM "CommentReport";
DROP TABLE "CommentReport";
ALTER TABLE "new_CommentReport" RENAME TO "CommentReport";
CREATE TABLE "new_TemplateTags" (
    "templateTagId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tagId" INTEGER NOT NULL,
    "templateId" INTEGER NOT NULL,
    CONSTRAINT "TemplateTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("tagId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TemplateTags_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template" ("templateId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TemplateTags" ("tagId", "templateId", "templateTagId") SELECT "tagId", "templateId", "templateTagId" FROM "TemplateTags";
DROP TABLE "TemplateTags";
ALTER TABLE "new_TemplateTags" RENAME TO "TemplateTags";
CREATE TABLE "new_UserCommentRating" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    CONSTRAINT "UserCommentRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserCommentRating_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment" ("commentId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserCommentRating" ("commentId", "id", "rating", "userId") SELECT "commentId", "id", "rating", "userId" FROM "UserCommentRating";
DROP TABLE "UserCommentRating";
ALTER TABLE "new_UserCommentRating" RENAME TO "UserCommentRating";
CREATE UNIQUE INDEX "UserCommentRating_userId_commentId_key" ON "UserCommentRating"("userId", "commentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

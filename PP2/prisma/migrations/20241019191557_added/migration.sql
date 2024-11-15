-- CreateTable
CREATE TABLE "Template" (
    "templateId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "language" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Template_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "tagId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tagName" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TemplateTags" (
    "templateTagId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tagId" INTEGER NOT NULL,
    "templateId" INTEGER NOT NULL,
    CONSTRAINT "TemplateTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("tagId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TemplateTags_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template" ("templateId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "TemplateTags_tagId_key" ON "TemplateTags"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateTags_templateId_key" ON "TemplateTags"("templateId");

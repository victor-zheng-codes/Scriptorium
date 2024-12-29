-- CreateTable
CREATE TABLE "BlogTemplate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "templateId" INTEGER NOT NULL,
    "blogId" INTEGER NOT NULL,
    CONSTRAINT "BlogTemplate_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template" ("templateId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BlogTemplate_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog" ("blogId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogTemplate_templateId_blogId_key" ON "BlogTemplate"("templateId", "blogId");

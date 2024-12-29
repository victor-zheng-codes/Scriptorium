-- CreateTable
CREATE TABLE "UserRating" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "blogId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    CONSTRAINT "UserRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserRating_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog" ("blogId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserRating_userId_blogId_key" ON "UserRating"("userId", "blogId");

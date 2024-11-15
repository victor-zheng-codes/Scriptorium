-- CreateTable
CREATE TABLE "CommentReply" (
    "commentID" INTEGER NOT NULL,
    "replyID" INTEGER NOT NULL,

    PRIMARY KEY ("commentID", "replyID"),
    CONSTRAINT "CommentReply_commentID_fkey" FOREIGN KEY ("commentID") REFERENCES "Comment" ("commentID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CommentReply_replyID_fkey" FOREIGN KEY ("replyID") REFERENCES "Comment" ("commentID") ON DELETE RESTRICT ON UPDATE CASCADE
);

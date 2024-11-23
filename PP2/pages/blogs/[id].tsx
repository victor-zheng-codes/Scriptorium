import { GetServerSideProps } from 'next';
import Layout from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from "next/link";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Comment = {
  commentId: number;
  parentId?: number;
  content: string;
  upvotes: number;
  downvotes: number;
  isAppropriate: boolean;
  user: { username: string };
  UserCommentRating: { userId: number, rating: number }[];
  CommentReplyChild: CommentReply[];
  CommentReplyParent: CommentReply[];
  CommentReport: { explanation: string }[];
};

type CommentReply = {
  commentId: number;
  replyId: number;
  comment: Comment;
  reply: Comment;
}

type Blog = {
  blogId: number;
  authorId: number;
  title: string;
  content: string;
  description: string;
  upvotes: number;
  downvotes: number;
  isAppropriate: boolean;
  tags: { tag: { tagName: string } }[];
  Comment: Comment[];
  BlogRating: { userId: number, rating: number }[];
  BlogTags: { tag: { tagId: number; tagName: string; } }[];
  BlogTemplate: { template: { templateId: number; title: string; } }[];
  BlogReport: { explanation: string }[];
};

type BlogPageProps = {
  blog: Blog | null;
};

const BlogPage: React.FC<BlogPageProps> = ({ blog }) => {
  if (!blog) {
    return <p className="text-center text-gray-600 dark:text-gray-300 mt-8">Blog not found</p>;
  }
  const router = useRouter();

  const [currentBlog, setCurrentBlog] = useState<Blog>(blog);
  const [commentContents, setCommentContents] = useState<{ [key: number]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(0);
  const [replies, setReplies] = useState<{ [commentId: number]: Comment[] | null }>({}); // Store replies for each comment (null means hidden)
  const [reportReasons, setReportReasons] = useState<Record<number, string | undefined>>({});
  const [isReporting, setIsReporting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
      fetch("/api/user/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.user) {
            if (data.user.username) {
              setUsername(data.user.username);
            }
            if (data.user.userId) {
              setUserId(data.user.userId);
            }
            if (!currentBlog.isAppropriate && data.user.userId !== currentBlog.authorId) {
              router.replace('/404');
            }
          } 
        })
        .catch((error) => console.error("Error fetching user data:", error));
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  
  const getCurrentBlogRating = (userId: number): number | null => {
    // Check what rating the user has given (1 = upvote, -1 = downvote, or null if no rating)
    const rating = currentBlog.BlogRating.find(rating => rating.userId === userId);
    return rating ? rating.rating : null;  // return the rating value or null if not rated
  };
  
  const getCurrentCommentRating = (userId: number, commentId: number): number | null => {
    // Check what rating the user has given to the comment
    const comment = currentBlog.Comment.find(c => c.commentId === commentId);
    if (comment) {
      const rating = comment.UserCommentRating.find(rating => rating.userId === userId);
      return rating ? rating.rating : null;  // return the rating value or null if not rated
    }
    return null;
  };

  const handleVote = async (
    rating: number, // 1 = upvote, -1 = downvote, 0 = remove vote
    id: number,
    isComment: boolean,
    parentId?: number
  ) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to rate.");
      return;
    }
  
    let currentRating: number | null = null;
  
    if (isComment) {
      currentRating = getCurrentCommentRating(userId, id);
    } else {
      currentRating = getCurrentBlogRating(userId);
    }
  
    // If user already has the same rating, remove the vote
    if (currentRating === rating) {
      rating = 0; // Remove vote
    }
  
    const endpoint = isComment
      ? `/api/blogs/${currentBlog.blogId}/comment/rate`
      : `/api/blogs/${currentBlog.blogId}/rate`;
  
    const body = isComment
      ? JSON.stringify({ commentId: id, rating })
      : JSON.stringify({ rating });
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });
  
      if (!response.ok) {
        throw new Error("Failed to register vote");
      }
  
      // Fetch updated blog data
      const updatedBlogResponse = await fetch(`/api/blogs/${currentBlog.blogId}`);
      if (!updatedBlogResponse.ok) {
        throw new Error("Failed to fetch updated blog data");
      }
      const updatedBlog = await updatedBlogResponse.json();
      setCurrentBlog(updatedBlog.blogDetails);
      
      if (parentId) { // If this is a reply, refetch the parent's replies
        fetchReplies(parentId);
      }
    } catch (error) {
      toast.error("Error submitting rating. Please try again.");
    }
  };
  
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("You must be logged in to comment.");
      return;
    }
    if (!commentContents[0] || !commentContents[0].trim()) {
      toast.error("Please enter a comment before submitting.");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/blogs/${currentBlog.blogId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentContents[0] }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add comment");
      }
  
      // Fetch updated blog data
      const updatedBlogResponse = await fetch(`/api/blogs/${currentBlog.blogId}`);
      if (!updatedBlogResponse.ok) {
        throw new Error("Failed to fetch updated blog data");
      }
      const updatedBlog = await updatedBlogResponse.json();
      setCurrentBlog(updatedBlog.blogDetails);
  
      handleCommentChange(0, "");
    } catch (error: any) {
      toast.error("Error adding comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getButtonClass = (rating: number | null, action: number) => {
    if (rating === action) {
      return action === 1 ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
    } else if (rating === 0) {
      return 'bg-gray-200 text-gray-800';
    } else {
      return 'bg-gray-200 text-gray-600';
    }
  };

  const fetchReplies = async (commentId: number) => {
    try {
      const response = await fetch(`/api/blogs/${currentBlog.blogId}/comment/replies?commentId=${commentId}`);
      const data = await response.json();

      if (response.ok) {
        setReplies((prevReplies) => ({
          ...prevReplies,
          [commentId]: data.replies.
          filter((commentReply: CommentReply) =>
            commentReply.reply.isAppropriate || commentReply.reply.user.username === username).
          map((commentReply: CommentReply) => ({
            ...commentReply.reply, // Update state with fetched replies
            parentId: commentId,
          }))
        }));
      } else {
        console.error("Failed to fetch replies:", data.message);
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };

  const toggleReplies = (commentId: number) => {
    if (replies[commentId]) {
      // If replies are already fetched, toggle visibility (set to null to hide them)
      setReplies((prevReplies) => ({
        ...prevReplies,
        [commentId]: null, // Hide the replies
      }));
    } else {
      fetchReplies(commentId); // Fetch replies if they are not yet loaded
    }
  };

  const handleReplySubmit = async (e: React.FormEvent, parentId: number) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("You must be logged in to reply.");
      return;
    }
    if (!commentContents[parentId] || !commentContents[parentId].trim()) {
      toast.error("Please enter a reply before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/blogs/${currentBlog.blogId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentContents[parentId], commentId: parentId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add reply");
      }

      // Fetch updated blog data
      const updatedBlogResponse = await fetch(`/api/blogs/${currentBlog.blogId}`);
      if (!updatedBlogResponse.ok) {
        throw new Error("Failed to fetch updated blog data");
      }
      const updatedBlog = await updatedBlogResponse.json();
      setCurrentBlog(updatedBlog.blogDetails);
      handleCommentChange(parentId, "");

      fetchReplies(parentId);
    } catch (error: any) {
      toast.error("Error adding reply. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentChange = (commentId: number, value: string) => {
    setCommentContents((prevContents) => ({
      ...prevContents,
      [commentId]: value,
    }));
  };

  const maxDepth = 5; // Limit nesting to 5 levels
  const renderReplies = (thisReplies: Comment[], depth: number = 0) => {
    if (depth > maxDepth) {
      return <p>Replies are too deep to display.</p>; // Optionally show a message
    }
    return (
      <ul className="ml-8 space-y-4">
        {thisReplies.map((reply) => (
          // If the reply is appropriate, show it normally for everyone
          reply.isAppropriate ? (
            <li key={reply.commentId} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <p className="mb-2">{reply.content}</p>
              <div className="flex justify-between items-center text-sm">
                <p>
                  By: <span className="font-medium">{reply.user?.username || "Unknown"}</span>
                </p>
                <p>
                  Upvotes: {reply.upvotes} | Downvotes: {reply.downvotes}
                </p>
              </div>

              {/* Upvote/downvote reply */}
              <div className="flex gap-2 mb-8">
                <Button
                  onClick={() => handleVote(1, reply.commentId, true, reply.parentId)}
                  className={getButtonClass(getCurrentCommentRating(userId, reply.commentId), 1)}
                >
                  Upvote
                </Button>
                <Button
                  onClick={() => handleVote(-1, reply.commentId, true, reply.parentId)}
                  className={getButtonClass(getCurrentCommentRating(userId, reply.commentId), -1)}
                >
                  Downvote
                </Button>
              </div>

              <div className="mt-2">
                <Button
                  onClick={() => handleReportChange(reply.commentId, "")}
                  size="sm"
                  variant="link"
                >
                  Report
                </Button>
                {reportReasons[reply.commentId] !== undefined && (
                  <form
                    onSubmit={(e) => handleReportSubmit(e, reply.commentId)}
                    className="mt-2"
                  >
                    <textarea
                      value={reportReasons[reply.commentId]}
                      onChange={(e) =>
                        handleReportChange(reply.commentId, e.target.value)
                      }
                      rows={2}
                      className="w-full p-2 border rounded-md"
                      placeholder="Provide a reason for the report..."
                    />
                    <Button
                      type="submit"
                      disabled={isReporting}
                      className="mt-2 px-4 py-2"
                    >
                      {isReporting ? "Reporting..." : "Submit Report"}
                    </Button>
                  </form>
                )}
              </div>
            </li>
          ) : username === reply.user?.username ? (
            // If the reply is inappropriate and the user is the creator, show it with a message indicating it's inappropriate and show the reports
            <li key={reply.commentId} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <p className="mb-2">{reply.content}</p>
              <div className="flex justify-between items-center text-sm">
                <p>
                  By: <span className="font-medium">{reply.user.username}</span>
                </p>
              </div>
              <div className="bg-red-100 text-red-600 p-4 rounded-md mt-4">
                <p className="mb-2">This reply has been marked as inappropriate.</p>
                {reply.CommentReport && reply.CommentReport.length > 0 ? (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Reports:</h3>
                    <ul className="space-y-2">
                      {reply.CommentReport.map((report, index) => (
                        <li
                          key={index}
                          className="bg-gray-50 border border-gray-200 p-3 rounded-md"
                        >
                          <p className="text-sm">
                            <span className="font-semibold">Reason:</span> {report.explanation}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">
                    No reports available for this reply.
                  </p>
                )} 
              </div>
            </li>
          ) : null // If the reply is inappropriate and the user is not the creator, don't render it
        ))}
      </ul>
    );
  };

  const handleReportSubmit = async (e: React.FormEvent, commentId?: number) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    if (!token) {
      toast.error("You must be logged in to report.");
      return;
    }
  
    const explanation = reportReasons[commentId || 0]?.trim();
    if (!explanation) {
      toast.error("Please provide a reason for the report.");
      return;
    }
  
    const endpoint = `/api/blogs/${currentBlog.blogId}/report`;
    const body = commentId
      ? JSON.stringify({ explanation, commentId })
      : JSON.stringify({ explanation });
  
    try {
      setIsReporting(true);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });
  
      if (!response.ok) throw new Error("Failed to submit the report");
  
      setReportReasons((prev) => ({ ...prev, [commentId || 0]: "" }));
      toast.success("Your report has been submitted successfully. Thank you!")
    } catch (error) {
      toast.error("Error submitting report. Please try again.");
    } finally {
      setIsReporting(false);
    }
  };

  const handleReportChange = (commentId: number | 0, value: string | undefined) => {
    setReportReasons((prev) => ({
      ...prev,
      [commentId]: value,
    }));
  };

  const handleEditBlog = () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      toast.error("You must be logged in to edit.");
      return;
    }

    if (userId !== currentBlog.authorId) {
      toast.error("You are not the owner of this blog!")
      return;
    }

    router.push(`/blogs/edit/${currentBlog.blogId}`)
  }

  const handleDeleteBlog = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      toast.error("You must be logged in to delete.");
      return;
    }

    if (userId !== currentBlog.authorId) {
      toast.error("You are not the owner of this blog!")
      return;
    }

    const response = await fetch(`/api/blogs/${currentBlog.blogId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      router.push("/studio");
    } else {
      toast.error("Failed to delete blog. Please try again.");
    }
  }
    

  return (
    <Layout>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="container mx-auto px-4 py-8 text-gray-600 dark:text-gray-300">
        {/* Blog Content */}
        <h1 className="text-4xl font-bold mb-4">{currentBlog.title}</h1>
        <p className="text-lg mb-4">{currentBlog.description}</p>
        <div className="prose lg:prose-xl mb-12">{currentBlog.content}</div>

        {/* Edit and Delete Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <Button
            onClick={() => handleEditBlog()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Edit Blog
          </Button>
          <Button
            onClick={() => handleDeleteBlog()}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Delete Blog
          </Button>
        </div>


        {/* Report Information (if inappropriate) */}
        {!currentBlog.isAppropriate && (
        <div className="bg-red-100 text-red-600 p-4 rounded-md mb-6">
          <p className="font-semibold">
            This blog has been marked as inappropriate.
          </p>
          {currentBlog.BlogReport && currentBlog.BlogReport.length > 0 ? (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Reports:</h3>
              <ul className="space-y-2">
                {currentBlog.BlogReport.map((report, index) => (
                  <li
                    key={index}
                    className="bg-gray-50 border border-gray-200 p-3 rounded-md"
                  >
                    <p className="text-sm">
                      <span className="font-semibold">Reason:</span> {report.explanation}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-2">
              No reports available for this blog.
            </p>
          )}
        </div>
      )}

        {/* Display Tags */}
        <div className="mb-4">
          <h2><strong>Tags: </strong></h2>
          {currentBlog.BlogTags.length > 0 ? (
            <ul className="flex gap-2 p-2">
              {currentBlog.BlogTags.map(({ tag }) => (
                <li key={tag.tagId} className="bg-gray-200 px-3 py-1 rounded-full dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                  {tag.tagName}
                </li>
              ))}
            </ul>
          ) : (
            <span>No tags available</span>
          )}
        </div>

        {/* Display Templates */}
        <div className="mb-4">
        <h2><strong>Templates: </strong></h2>
        {currentBlog.BlogTemplate.length > 0 ? (
            <ul className="flex gap-2 p-3">
              {currentBlog.BlogTemplate.map(({ template }) => (
                <li key={template.templateId} className="bg-gray-200 px-3 py-1 rounded-full dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                  <Link href={`/templates/${template.templateId}`} className="text-blue-500 hover:underline">
                    {template.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <span>No templates linked</span>
          )}
        </div>

        {/* Upvote/Downvote/Remove Vote for Blog */}
        <p className="text-sm mt-8 mb-2">Upvotes: {currentBlog.upvotes} | Downvotes: {currentBlog.downvotes}</p>
        <div className="flex gap-2 mb-8">
          <Button
            onClick={() => handleVote(1, currentBlog.blogId, false)}
            className={getButtonClass(getCurrentBlogRating(userId), 1)}
          >
            Upvote
          </Button>
          <Button
            onClick={() => handleVote(-1, currentBlog.blogId, false)}
            className={getButtonClass(getCurrentBlogRating(userId), -1)}
          >
            Downvote
          </Button>
        </div>

        {/* Comments Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Comments</h2>
          {!currentBlog.Comment || currentBlog.Comment.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            <ul className="space-y-4">
              {currentBlog.Comment.filter((comment) =>
                comment.CommentReplyChild === null || comment.CommentReplyChild.length === 0
              ).map((comment) => (
                (comment.isAppropriate || username === comment.user.username) ? (
                <li
                  key={comment.commentId}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  {/* Check if the comment is inappropriate */}
                  {comment.isAppropriate ? (
                    // Regular Comment Display
                    <>
                      <p className="mb-2">{comment.content}</p>
                      <div className="flex justify-between items-center text-sm">
                        <p>
                          By: <span className="font-medium">{comment.user.username}</span>
                        </p>
                        <p>
                          Upvotes: {comment.upvotes} | Downvotes: {comment.downvotes}
                        </p>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button
                          onClick={() => handleVote(1, comment.commentId, true)}
                          size="sm"
                          className={getButtonClass(getCurrentCommentRating(userId, comment.commentId), 1)}
                        >
                          Upvote
                        </Button>
                        <Button
                          onClick={() => handleVote(-1, comment.commentId, true)}
                          size="sm"
                          variant="secondary"
                          className={getButtonClass(getCurrentCommentRating(userId, comment.commentId), -1)}
                        >
                          Downvote
                        </Button>
                      </div>

                      {/* Button to show/hide replies */}
                      <Button
                        onClick={() => toggleReplies(comment.commentId)}
                        size="sm"
                        variant="link"
                      >
                        {(replies[comment.commentId] && replies[comment.commentId]!.length > 0) ? "Hide Replies" : "Show Replies"}
                      </Button>

                      {/* Render replies */}
                      {replies[comment.commentId] && renderReplies(replies[comment.commentId]!)}

                      <form onSubmit={(e) => handleReplySubmit(e, comment.commentId)} className="mt-4">
                        <h2>Reply</h2>
                        <textarea
                          value={commentContents[comment.commentId]}
                          onChange={(e) => handleCommentChange(comment.commentId, e.target.value)}
                          rows={3}
                          className="w-full p-2 border rounded-md"
                          placeholder="Write your reply..."
                        />
                        <Button type="submit" disabled={isSubmitting} className="mt-2 px-4 py-2">
                          {isSubmitting ? "Submitting..." : "Add Reply"}
                        </Button>
                      </form>

                      <div className="mt-2">
                        <Button
                          onClick={() => {
                            if (reportReasons[comment.commentId] !== undefined) {
                              handleReportChange(comment.commentId, undefined);
                            } else {
                              handleReportChange(comment.commentId, "");
                            }
                          }}
                          size="sm"
                          variant="link"
                        >
                          Report
                        </Button>
                        {reportReasons[comment.commentId] !== undefined && (
                          <form
                            onSubmit={(e) => handleReportSubmit(e, comment.commentId)}
                            className="mt-2"
                          >
                            <textarea
                              value={reportReasons[comment.commentId]}
                              onChange={(e) =>
                                handleReportChange(comment.commentId, e.target.value)
                              }
                              rows={2}
                              className="w-full p-2 border rounded-md"
                              placeholder="Provide a reason for the report..."
                            />
                            <Button
                              type="submit"
                              disabled={isReporting}
                              className="mt-2 px-4 py-2"
                            >
                              {isReporting ? "Reporting..." : "Submit Report"}
                            </Button>
                          </form>
                        )}
                      </div>
                    </>
                  ) : username === comment.user?.username ? (
                    // If the comment is inappropriate and the user is the creator, show the content with the "Inappropriate" message
                    <>
                      <p className="mb-2">{comment.content}</p>
                      <div className="flex justify-between items-center text-sm">
                        <p>
                          By: <span className="font-medium">{comment.user.username}</span>
                        </p>
                      </div>
                      <div className="bg-red-100 text-red-600 p-4 rounded-md mt-4">
                        <p className="font-semibold">
                          This comment has been marked as inappropriate.
                        </p>
                        {comment.CommentReport && comment.CommentReport.length > 0 ? (
                          <div className="mt-4">
                            <h3 className="font-semibold mb-2">Reports:</h3>
                            <ul className="space-y-2">
                              {comment.CommentReport.map((report, index) => (
                                <li
                                  key={index}
                                  className="bg-gray-50 border border-gray-200 p-3 rounded-md"
                                >
                                  <p className="text-sm">
                                    <span className="font-semibold">Reason:</span> {report.explanation}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 mt-2">
                            No reports available for this comment.
                          </p>
                        )}
                      </div>
                    </>
                  ) : null}
                </li>
                ) : null
              ))}
            </ul>

          )}

          {/* Add Comment */}
          <form onSubmit={handleCommentSubmit} className="mt-6">
            <h2>Add a Comment</h2>
            <textarea
              value={commentContents[0]}
              onChange={(e) => handleCommentChange(0, e.target.value)}
              rows={4}
              className="w-full p-2 border rounded-md"
              placeholder="Write your comment here..."
            />
            <Button type="submit" disabled={isSubmitting} className="mt-2 px-4 py-2">
              {isSubmitting ? "Submitting..." : "Add Comment"}
            </Button>
          </form>
        </section>
        <div className="mt-4">
          <Button onClick={() => {
            if (reportReasons[0] !== undefined) {
              handleReportChange(0, undefined);
            } else {
              handleReportChange(0, "");
            }
          }} 
          size="sm" variant="link">
            Report Blog
          </Button>
          {reportReasons[0] !== undefined && (
            <form onSubmit={(e) => handleReportSubmit(e)}>
              <textarea
                value={reportReasons[0]}
                onChange={(e) => handleReportChange(0, e.target.value)}
                rows={3}
                className="w-full p-2 border rounded-md mt-2"
                placeholder="Provide a reason for the report..."
              />
              <Button
                type="submit"
                disabled={isReporting}
                className="mt-2 px-4 py-2"
              >
                {isReporting ? "Reporting..." : "Submit Report"}
              </Button>
            </form>
          )}
        </div>

      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;

  const response = await fetch(`http://localhost:3000/api/blogs/${id}`);

  if (!response.ok) {
    return { notFound: true };
  }

  const data = await response.json();

  return {
    props: {
      blog: data.blogDetails || null,
    },
  };
};

export default BlogPage;

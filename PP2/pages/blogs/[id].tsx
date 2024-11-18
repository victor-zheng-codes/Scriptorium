import { GetServerSideProps } from 'next';
import Layout from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';

type Comment = {
  commentId: number;
  content: string;
  upvotes: number;
  downvotes: number;
  user: { username: string };
  UserCommentRating: { userId: number, rating: number }[];
  CommentReplyChild: CommentReply[];
  CommentReplyParent: CommentReply[];
};

type CommentReply = {
  commentId: number;
  replyId: number;
  comment: Comment;
  reply: Comment;
}

type Blog = {
  blogId: number;
  title: string;
  content: string;
  description: string;
  upvotes: number;
  downvotes: number;
  tags: { tag: { tagName: string } }[];
  Comment: Comment[];
  BlogRating: { userId: number, rating: number }[];
};

type BlogPageProps = {
  blog: Blog | null;
};

const BlogPage: React.FC<BlogPageProps> = ({ blog }) => {
  if (!blog) {
    return <p className="text-center text-gray-600 dark:text-gray-300 mt-8">Blog not found</p>;
  }

  const [currentBlog, setCurrentBlog] = useState<Blog>(blog);
  const [commentContents, setCommentContents] = useState<{ [key: number]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(0);
  const [replies, setReplies] = useState<{ [commentId: number]: Comment[] | null }>({}); // Store replies for each comment (null means hidden)
  const [reportReasons, setReportReasons] = useState<{ [key: number]: string }>({});
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
          } 
        })
        .catch((error) => console.error("Error fetching user data:", error));
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const hasRatedBlog = (userId: number): boolean => {
    // Check if the user has rated the blog
    return currentBlog.BlogRating.some(rating => rating.userId === userId);
  };
  
  const getCurrentBlogRating = (userId: number): number | null => {
    // Check what rating the user has given (1 = upvote, -1 = downvote, or null if no rating)
    const rating = currentBlog.BlogRating.find(rating => rating.userId === userId);
    return rating ? rating.rating : null;  // return the rating value or null if not rated
  };

  const hasRatedComment = (userId: number, commentId: number): boolean => {
    // Check if the user has rated the comment
    const comment = currentBlog.Comment.find(c => c.commentId === commentId);
    return comment ? comment.UserCommentRating.some(rating => rating.userId === userId) : false;
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
    isComment: boolean
  ) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to rate.");
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
    } catch (error) {
      setError("Error voting. Please try again.");
    }
  };
  
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setError("Must be logged in to comment");
      return;
    }
    if (!commentContents[0].trim()) {
      setError("Cannot write empty comment");
      return;
    }
  
    setIsSubmitting(true);
    setError(null);
  
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
      setError(error.message || "Error adding comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getButtonClass = (rating: number | null, action: number) => {
    if (rating === action) {
      return action === 1 ? 'bg-blue-500 text-white' : 'bg-red-500 text-white';
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
          [commentId]: data.replies.map((commentReply: CommentReply) => commentReply.reply), // Update state with fetched replies
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
      console.log(replies);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent, parentId: number) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setError("Must be logged in to reply");
      return;
    }
    if (!commentContents[parentId].trim()) {
      setError("Cannot write empty reply");
      return;
    }

    setIsSubmitting(true);
    setError(null);

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
      setError(error.message || "Error adding reply");
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

            {/* Button to show/hide replies for this reply */}
            { depth < maxDepth && (
            <Button
              onClick={() => toggleReplies(reply.commentId)}
              size="sm"
              variant="link"
            >
              {replies[reply.commentId] ? "Hide Replies" : "Show Replies"}
            </Button>)
            }

            {replies[reply.commentId] && depth < maxDepth && renderReplies(replies[reply.commentId]!, depth + 1)}
            {/* Render replies for this reply */}

            {/* Only show reply button if depth is within the max limit */}
            {depth < maxDepth && (
              <form onSubmit={(e) => handleReplySubmit(e, reply.commentId)} className="mt-4">
                <textarea
                  value={commentContents[reply.commentId]}
                  onChange={(e) => handleCommentChange(reply.commentId, e.target.value)}
                  rows={3}
                  className="w-full p-2 border rounded-md"
                  placeholder="Write your reply..."
                />
                <Button type="submit" disabled={isSubmitting} className="mt-2 px-4 py-2">
                  {isSubmitting ? "Submitting..." : "Add Reply"}
                </Button>
              </form>
            )}

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
        ))}
      </ul>
    );
  };

  const handleReportSubmit = async (e: React.FormEvent, commentId?: number) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    if (!token) {
      setError("You must be logged in to report.");
      return;
    }
  
    const explanation = reportReasons[commentId || 0]?.trim();
    if (!explanation) {
      setError("Please provide a reason for the report.");
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
    } catch (error) {
      setError("Error submitting report. Please try again.");
    } finally {
      setIsReporting(false);
    }
  };

  const handleReportChange = (commentId: number | 0, value: string) => {
    setReportReasons((prev) => ({
      ...prev,
      [commentId]: value,
    }));
  };
    

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 text-gray-600 dark:text-gray-300">
        {/* Blog Content */}
        <h1 className="text-4xl font-bold mb-4">{currentBlog.title}</h1>
        <p className="text-lg mb-4">{currentBlog.description}</p>
        <div className="prose lg:prose-xl mb-12">{currentBlog.content}</div>

        <p className="text-sm mb-8">Upvotes: {currentBlog.upvotes} | Downvotes: {currentBlog.downvotes}</p>

        {/* Upvote/Downvote/Remove Vote for Blog */}
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
              {currentBlog.Comment.filter((comment) => comment.CommentReplyChild === null || comment.CommentReplyChild.length === 0).map((comment) => (
                <li
                  key={comment.commentId}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
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
                    {replies[comment.commentId] ? "Hide Replies" : "Show Replies"}
                  </Button>

                  {/* Render replies */}
                  {replies[comment.commentId] && renderReplies(replies[comment.commentId]!)}
                  <form onSubmit={(e) => handleReplySubmit(e, comment.commentId)} className="mt-4">
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
                      onClick={() => handleReportChange(comment.commentId, "")}
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

                </li>
              ))}
            </ul>
          )}

          {/* Add Comment */}
          <form onSubmit={handleCommentSubmit} className="mt-6">
            <h2>Comment on Blog</h2>
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
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </section>
        <div className="mt-4">
          <Button onClick={() => handleReportChange(0, "")} size="sm" variant="link">
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

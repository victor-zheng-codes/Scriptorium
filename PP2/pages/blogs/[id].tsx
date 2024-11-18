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
};

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
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(0);

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
    if (!commentContent.trim()) {
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
        body: JSON.stringify({ content: commentContent }),
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
  
      setCommentContent("");
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
              {currentBlog.Comment.map((comment) => (
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
                </li>
              ))}
            </ul>
          )}

          {/* Add Comment */}
          <form onSubmit={handleCommentSubmit} className="mt-6">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
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

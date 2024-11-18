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
};

type Blog = {
  blogId: number;
  title: string;
  content: string;
  description: string;
  tags: { tag: { tagName: string } }[];
  Comment: Comment[];
};

type BlogPageProps = {
  blog: Blog | null;
};

const BlogPage: React.FC<BlogPageProps> = ({ blog }) => {
  if (!blog) {
    return <p className="text-center text-gray-600 dark:text-gray-300 mt-8">Blog not found</p>;
  }

  // Add state for the blog and comments
  const [currentBlog, setCurrentBlog] = useState<Blog>(blog);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

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
          if (data.user.username) {
            setUsername(data.user.username); // Set the username from the API response
          }
        })
        .catch((error) => console.error("Error fetching user data:", error));
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Handle comment form submission
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const newComment = await response.json();
      console.log(newComment);
      newComment.content = commentContent;
      newComment.upvotes = 0;
      newComment.downvotes = 0;
      newComment.user = {};
      newComment.user.username = username;
      setCommentContent(''); // Reset input
      setCurrentBlog((prevBlog) => ({
        ...prevBlog,
        Comment: [...prevBlog.Comment, newComment], // Add new comment to the state
      }));
    } catch (error: any) {
      setError(error.message || 'Error adding comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 text-gray-600 dark:text-gray-300">
        {/* Blog Title */}
        <h1 className="text-4xl font-bold mb-4">{currentBlog.title}</h1>
        <p className="text-lg mb-8">{currentBlog.description}</p>

        {/* Blog Content */}
        <div className="prose lg:prose-xl mb-12">
          {currentBlog.content}
        </div>

        {/* Comments Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Comments</h2>
          {!currentBlog.Comment || currentBlog.Comment.length === 0 ? (
            <p className="">No comments yet.</p>
          ) : (
            <ul className="space-y-4">
              {currentBlog.Comment.map((comment) => (
                <li
                  key={comment.commentId}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <p className="mb-2">{comment.content}</p>
                  <div className="flex justify-between items-center text-sm">
                    <p>By: <span className="font-medium">{comment.user.username}</span></p>
                    <p>Upvotes: {comment.upvotes} | Downvotes: {comment.downvotes}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {/* Add Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mt-6">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              rows={4}
              className="w-full p-2 border rounded-md"
              placeholder="Write your comment here..."
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 px-4 py-2"
            >
              {isSubmitting ? 'Submitting...' : 'Add Comment'}
            </Button>
          </form>

          {error && <p className="mt-2 text-red-500">{error}</p>}
        </section>

        {/* Tags Section */}
        <section>
          <h3 className="text-2xl font-semibold mb-4">Tags</h3>
          <ul className="flex flex-wrap gap-2">
            {!currentBlog.tags || currentBlog.tags.length === 0 ? (
              <li>No tags available.</li>
            ) : (
              currentBlog.tags.map((tag, index) => (
                <li
                  key={index}
                  className="px-3 py-1 bg-blue-100 rounded-full text-sm"
                >
                  {tag.tag.tagName}
                </li>
              ))
            )}
          </ul>
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

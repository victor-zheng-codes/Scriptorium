import { GetServerSideProps } from 'next';
import Layout from "@/components/ui/layout";

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
  comments: Comment[];
};

type BlogPageProps = {
  blog: Blog | null;
};

const BlogPage: React.FC<BlogPageProps> = ({ blog }) => {
  if (!blog) {
    return <p className="text-center text-gray-500 mt-8">Blog not found</p>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Blog Title */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{blog.title}</h1>
        <p className="text-gray-600 text-lg mb-8">{blog.description}</p>

        {/* Blog Content */}
        <div className="prose lg:prose-xl mb-12 text-gray-700">
          {blog.content}
        </div>

        {/* Comments Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comments</h2>
          {!blog.comments || blog.comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            <ul className="space-y-4">
              {blog.comments.map((comment) => (
                <li
                  key={comment.commentId}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <p className="text-gray-700 mb-2">{comment.content}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <p>By: <span className="font-medium text-gray-800">{comment.user.username}</span></p>
                    <p>Upvotes: {comment.upvotes} | Downvotes: {comment.downvotes}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Tags Section */}
        <section>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Tags</h3>
          <ul className="flex flex-wrap gap-2">
            {!blog.tags || blog.tags.length === 0 ? (
              <li className="text-gray-500">No tags available.</li>
            ) : (
              blog.tags.map((tag, index) => (
                <li
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
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
  const { id } = context.params!; // Get the id from the URL params

  const response = await fetch(`http://localhost:3000/api/blogs/${id}`); // Replace with your API endpoint

  if (!response.ok) {
    return { notFound: true }; // Return 404 if the blog is not found
  }

  const data = await response.json();

  return {
    props: {
      blog: data.blogDetails || null,
    },
  };
};

export default BlogPage;

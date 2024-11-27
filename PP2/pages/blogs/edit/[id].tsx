import { GetServerSideProps } from 'next';
import { Button } from "@/components/ui/button";
import Layout from "@/components/ui/layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

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
  blog: Blog;
};

const EditBlog: React.FC<BlogPageProps> = ({ blog }) => {
  const [title, setTitle] = useState<string>(blog.title);
  const [description, setDescription] = useState<string>(blog.description);
  const [content, setContent] = useState<string>(blog.content);
  const [tags, setTags] = useState<string>("");
  const [templateIds, setTemplateIds] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [blogId, setBlogId] = useState<string | null>(null); // State to store blog ID
  const router = useRouter();

  useEffect(() => {
    // Extract tag names from BlogTags and update the state
    const tagNames = blog.BlogTags.map(tag => tag.tag.tagName).join(", ");
    setTags(tagNames);
    const initTemplateIds = blog.BlogTemplate.map(template => template.template.templateId).join(", ");
    setTemplateIds(initTemplateIds);
  }, []); // Run on page init


  const refreshAccessToken = async () => {
    try {
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");
      if (!token || !refreshToken) return null;

      const res = await fetch("/api/user/refresh", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Assuming token exists
          "Content-Type": "application/json", // Ensure JSON content-type is set
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        return data.token;
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        router.push("/login");
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "title") {
      setTitle(value);
    } else if (name === "description") {
      setDescription(value);
    } else if (name === "content") {
      setContent(value);
    } else if (name === "tags") {
      setTags(value);
    } else if (name === "templateIds") {
      setTemplateIds(value);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        router.push("/login");
        return;
    }
    
    if (!title || !description || !content) {
      setError("All fields are required.");
      return;
    }

    const tagArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
      const templateIdArray = templateIds
      .split(",")
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id)); // Ensure the IDs are valid numbers

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/blogs/${blog.blogId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Assuming token exists
        },
        body: JSON.stringify({
          title,
          description,
          content,
          tags: tagArray,
          templateIds: templateIdArray,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setBlogId(result.blogId); // Save the blog ID in the state
        router.push(`/blogs/${blog.blogId}`); // Redirect to the created blog page
      } else if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          const res = await fetch(`/api/blogs/${blog.blogId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Assuming token exists
            },
            body: JSON.stringify({
              title,
              description,
              content,
              tags: tagArray,
              templateIds: templateIdArray,
            }),
          });
        } else {
            setError("An error occurred while editing the blog.");
        }
      } else {
        const result = await res.json();
        setError(result.error || "Failed to edit blog.");
      }
    } catch (error) {
      setError("An error occurred while saving the blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex">
        <div className="bg-gray-150 dark:bg-gray-950 w-32 md:w-32 hidden md:block"></div>

        <div className="flex-grow bg-gray-50 dark:bg-gray-900 text-black dark:text-gray-200 py-4">
          <div className="container mx-auto px-16">
            <h2 className="text-2xl font-semibold mb-4 pt-8">Edit Blog</h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={title}
                  onChange={handleChange}
                  className="w-full p-2 mt-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-925 text-black dark:text-gray-200"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={handleChange}
                  className="w-full p-2 mt-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-925 text-black dark:text-gray-200"
                  rows={4}
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm">
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={content}
                  onChange={handleChange}
                  className="w-full p-2 mt-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-925 text-black dark:text-gray-200"
                  rows={8}
                />
              </div>
              <div>
                <label htmlFor="tags" className="block text-sm">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={tags}
                  onChange={handleChange}
                  className="w-full p-2 mt-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-925 text-black dark:text-gray-200"
                />
                <small className="text-gray-500 dark:text-gray-400 mt-2 block">
                  Enter tags separated by commas.
                </small>
              </div>
              <div>
                <label htmlFor="templateIds" className="block text-sm">
                  Linked Template IDs (comma separated)
                </label>
                <input
                  type="text"
                  id="templateIds"
                  name="templateIds"
                  value={templateIds}
                  onChange={handleChange}
                  className="w-full p-2 mt-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-925 text-black dark:text-gray-200"
                />
                <small className="text-gray-500 dark:text-gray-400 mt-2 block">
                  Enter template IDs separated by commas.
                </small>
              </div>
            </div>

            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

            {/* Flexbox container for buttons */}
            <div className="mt-6 flex justify-end space-x-4 pb-8">
              <Button
                className="text-sm py-1 px-4"
                onClick={() => router.push(`/blogs/${blog.blogId}`)}
              >
                Cancel
              </Button>
              <Button
                className="text-sm py-1 px-4"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Editing..." : "Confirm Edit"}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-150 dark:bg-gray-950 w-32 md:w-32 hidden md:block"></div>
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

export default EditBlog;

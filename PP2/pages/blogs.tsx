import { Button } from "@/components/ui/button";
import Layout from "@/components/ui/layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

type BlogTag = {
  tag: {
    tagName: string;
  };
};

type BlogTemplate = {
  template: {
    title: string;
  };
};

type Blog = {
  blogId: number;
  title: string;
  description: string,
  content: string;
  BlogTags: BlogTag[];
  BlogTemplate: BlogTemplate[];
};

type ApiResponse = {
  blogs: Blog[];
  totalPages: number;
};

const Blogs = () => {
  const router = useRouter();
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [templates, setTemplates] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Populate state from query parameters on mount
  useEffect(() => {
    const { content, title, tags, templates, page, limit } = router.query;

    if (content) setContent(content as string);
    if (title) setTitle(title as string);
    if (tags) setTags(tags as string);
    if (templates) setTemplates(templates as string);
    if (page) {
      if (Number(page) > totalPages) setPage(1);
      else setPage(Number(page));
    }
    if (limit) {
      if (Number(limit) < 1) setLimit(1);
      else setLimit(Number(limit));
    }
    console.log(content)

    fetchBlogs();
  }, [router.query]);

  const fetchBlogs = async () => {
    console.log("fetchBlogs called")
    setIsLoading(true);

    try {
      const queryParams = new URLSearchParams({
        ...(content && { content }),
        ...(title && { title }),
        ...(tags && { tags }),
        ...(templates && { templates }),
        page: page.toString(),
        limit: limit.toString(),
      });

      console.log(content)
      console.log(title)
      console.log(tags)
      console.log(templates)

      const response = await fetch(`/api/blogs/search?${queryParams.toString()}`);
      const data: ApiResponse = await response.json();

      if (response.ok) {
        setBlogs(data.blogs);
        setTotalPages(data.totalPages);
      } else {
        console.error("Error fetching blogs:", data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchBlogs();
  // }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to page 1 when new search criteria are entered
    router.push(
      {
        pathname: "/blogs",
        query: { content, title, tags, templates, page, limit },
      },
      undefined,
      { shallow: true } // Avoid full page reload
    );
  };

  return (
    <Layout>
      <div className="p-4 space-y-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search by content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="p-2 border rounded-md w-1/4"
            />
            <input
              type="text"
              placeholder="Search by title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-2 border rounded-md w-1/4"
            />
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="p-2 border rounded-md w-1/4"
            />
            <input
              type="text"
              placeholder="Templates (comma-separated)"
              value={templates}
              onChange={(e) => setTemplates(e.target.value)}
              className="p-2 border rounded-md w-1/4"
            />
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              placeholder="Limit"
              value={limit}
              onChange={(e) => {
                const newLimit = Number(e.target.value);
                // Enforce minimum limit of 1
                setLimit(Math.max(newLimit, 1));
              }}
              className="p-2 border rounded-md w-1/4"
            />
            <Button type="submit" disabled={isLoading} className="bg-blue-500 text-white rounded-md px-4 py-2">
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>

        <div className="space-y-4">
          {blogs.length === 0 && !isLoading ? (
            <div className="text-center text-gray-500">
              No results found for your search.
            </div>
          ) : (
          blogs.map((blog) => (
            <div key={blog.blogId} className="p-4 border rounded-md">
              <h2 className="text-xl font-bold">
                <Link href={`/blogs/${blog.blogId}`} className="text-blue-500 hover:underline">
                  {blog.title}
                </Link>
              </h2>
              <p>{blog.description}</p>
              <div>
                <strong>Tags:</strong> {blog.BlogTags.map((tag) => tag.tag.tagName).join(", ")}
              </div>
              <div>
                <strong>Templates:</strong> {blog.BlogTemplate.map((tmpl) => tmpl.template.title).join(", ")}
              </div>
            </div>
          ))
        )}
        </div>

        <div className="flex justify-between items-center">
          <button
            disabled={page === 1 || isLoading || totalPages === 0}
            onClick={() => {
              const newPage = Math.max(page - 1, 1); // Calculate the new page
              setPage(newPage);
              router.push(
                {
                  pathname: "/blogs",
                  query: { content, title, tags, templates, page: newPage, limit },
                },
                undefined,
                { shallow: true } // Avoid full page reload
              );
            }}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Previous
          </button>
          <span className="text-center">
            Page {totalPages === 0 ? 0 : page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages || isLoading || totalPages === 0}
            onClick={() => { 
              const newPage = Math.min(page + 1, totalPages); // Calculate the new page
              setPage(newPage);
              router.push(
                {
                  pathname: "/blogs",
                  query: { content, title, tags, templates, page: newPage, limit },
                },
                undefined,
                { shallow: true } // Avoid full page reload
              );
            }}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Next
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Blogs;
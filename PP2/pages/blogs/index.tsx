import { Button } from "@/components/ui/button";
import Layout from "@/components/ui/layout";
import { Label } from "@/components/ui/label";
import { useEffect, useState, useRef } from "react";
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
  upvotes: number;
  downvotes: number;
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
  const [activeTitle, setActiveTitle] = useState<string>("");
  const [activeTags, setActiveTags] = useState<string>("");
  const [activeTemplates, setActiveTemplates] = useState<string>("");
  const [activeContent, setActiveContent] = useState<string>("");
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

    fetchBlogs();
  }, [router.query]);

  const searchButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // Trigger the search button click on page load
    setTimeout( () => {
      if (searchButtonRef.current) {
        searchButtonRef.current.click();
      }
    }, 100);
  }, []); // Empty dependency array ensures this runs only once on page load

  const fetchBlogs = async () => {
    setIsLoading(true);

    try {
      const queryParams = new URLSearchParams({
        ...(activeContent && { content: activeContent }),
        ...(activeTitle && { title: activeTitle }),
        ...(activeTags && { tags: activeTags }),
        ...(activeTemplates && { templates: activeTemplates }),
        page: page.toString(),
        limit: limit.toString(),
      });

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveContent(content);
    setActiveTitle(title);
    setActiveTags(tags);
    setActiveTemplates(templates);
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-600 dark:text-gray-300">
            <input
              type="text"
              placeholder="Search by title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-2 border border-gray-500 rounded-md"
            />
            <input
              type="text"
              placeholder="Search by content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="p-2 border border-gray-500 rounded-md"
            />
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="p-2 border border-gray-500 rounded-md"
            />
            <input
              type="text"
              placeholder="Templates (comma-separated)"
              value={templates}
              onChange={(e) => setTemplates(e.target.value)}
              className="p-2 border border-gray-500 rounded-md"
            />
          </div>
          <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-300">
            <Label>
              Items Per Page:
            </Label>
            <input
              type="number"
              placeholder="Limit"
              value={limit}
              onChange={(e) => {
                const newLimit = Number(e.target.value);
                // Enforce minimum limit of 1
                setLimit(Math.max(newLimit, 1));
              }}
              className="p-2 border border-gray-500 rounded-md w-1/6"
            />
            <Button type="submit" disabled={isLoading} ref={searchButtonRef} >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>

        <div className="space-y-4">
          {blogs.length === 0 && !isLoading ? (
            <div className="text-center text-gray-600 dark:text-gray-300">
              No results found for your search.
            </div>
          ) : (
          blogs.map((blog) => (
            <div key={blog.blogId} className="p-4 border border-gray-500 rounded-md text-gray-600 dark:text-gray-300">
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
              <div>
                <strong>Upvotes:</strong> {blog.upvotes} 
              </div>
              <div>
                <strong>Downvotes:</strong> {blog.downvotes}
              </div>
            </div>
          ))
        )}
        </div>

        <div className="flex justify-between items-center">
          <Button
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
          >
            Previous
          </Button>
          <span className="text-gray-600 dark:text-gray-300">
            Page {totalPages === 0 ? 0 : page} of {totalPages}
          </span>
          <Button
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
          >
            Next
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Blogs;
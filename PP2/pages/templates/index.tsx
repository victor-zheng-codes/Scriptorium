import { Button } from "@/components/ui/button";
import Layout from "@/components/ui/layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

// Define the Template interface
interface Template {
  templateId: number;
  userId: number;
  content: string;
  title: string;
  description: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

const Templates = () => {
  const [templates, setTemplates] = useState<Template[]>([]); // Array of templates
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filters
  const [languageFilter, setLanguageFilter] = useState<string>("");
  const [titleFilter, setTitleFilter] = useState<string>("");
  const [descriptionFilter, setDescriptionFilter] = useState<string>("");

  const router = useRouter();

  const fetchTemplates = async (page: number) => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      page: page.toString(),
      ...(languageFilter && { language: languageFilter }),
      ...(titleFilter && { title: titleFilter }),
      ...(descriptionFilter && { description: descriptionFilter }),
    });

    console.log("params " + params)

    try {
      const res = await fetch(`/api/templates?${params.toString()}`, {
        method: "GET",
      });

      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates);
        setTotalPages(data.totalPages);
        setCurrentPage(data.page);
      } else {
        if (res.status === 401) {
          setError("Unauthorized. Please log in again.");
          router.push("/login");
        } else {
          setError("Error fetching templates.");
        }
      }
    } catch (error) {
      setError("An error occurred while fetching templates.");
    } finally {
      setLoading(false);
    }
  };

  // Debounce for filter change
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedLanguageFilter = useDebounce(languageFilter, 500);
  const debouncedTitleFilter = useDebounce(titleFilter, 500);
  const debouncedDescriptionFilter = useDebounce(descriptionFilter, 500);

  useEffect(() => {
    // Fetch templates whenever the filters or page change
    fetchTemplates(currentPage);
  }, [currentPage, debouncedLanguageFilter, debouncedTitleFilter, debouncedDescriptionFilter]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
    console.log(filterType, value)

    switch (filterType) {
      case "language":
        setLanguageFilter(value);
        break;
      case "title":
        setTitleFilter(value);
        break;
      case "description":
        setDescriptionFilter(value);
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
          <h1 className="text-2xl">Loading...</h1>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
          <h1 className="text-2xl">{error}</h1>
        </div>
      </Layout>
    );
  }

  if (!templates.length) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
          <h1 className="text-2xl">No templates found.</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-grow m-5">
        {/* Main Content Area */}
        <div className="flex-grow bg-gray-50 dark:bg-gray-900 text-black dark:text-white py-4">
          {/* Header */}
          <div className="flex justify-between items-center px-8 py-8 bg-gray-50 dark:bg-gray-900">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Code Templates
            </h1>
          </div>

          {/* Filters */}
          <div className="container mx-auto px-16 mb-8">
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Filter by language"
                value={languageFilter}
                onChange={(e) => handleFilterChange("language", e.target.value)}
                className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                placeholder="Filter by title"
                value={titleFilter}
                onChange={(e) => handleFilterChange("title", e.target.value)}
                className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                placeholder="Filter by description"
                value={descriptionFilter}
                onChange={(e) => handleFilterChange("description", e.target.value)}
                className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Templates List */}
          <div className="container mx-auto px-16">
            {templates.map((template) => (
              <div
                key={template.templateId}
                className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
              >
                <h2 className="text-2xl font-bold mb-2">{template.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {template.description}
                </p>
                <SyntaxHighlighter
                  language={template.language}
                  style={materialDark}
                  showLineNumbers
                >
                  {template.content}
                </SyntaxHighlighter>
                <p className="text-sm text-gray-500 mt-2">
                  Language: {template.language} | Created: {new Date(template.createdAt).toLocaleString()} | AuthorId: {template.userId}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-8">
            <Button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </Button>
            <span className="text-gray-600 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Templates;

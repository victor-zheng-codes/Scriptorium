import { Button } from "@/components/ui/button";
import Layout from "@/components/ui/layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  owner: {firstName: string, lastName: string, username: string}
  templatesTags: {tag: {tagName: string, tagId: number}, tagId: number, templateId: number, templateTagId: number}[]
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
  const [contentFilter, setContentFilter] = useState<string>("");
  const [tagFilter, setTagFilter] = useState<string>("");
  const [limitFilter, setLimitFilter] = useState<number>(10);

  const router = useRouter();

  const fetchTemplates = async (page: number) => {
    setLoading(true);
    setError(null);

    console.log("tags " + tagFilter)

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limitFilter.toString(),
      ...(languageFilter && { language: languageFilter }),
      ...(titleFilter && { title: titleFilter }),
      ...(descriptionFilter && { description: descriptionFilter }),
      ...(contentFilter && { content: contentFilter }),
    });

    // this can be combined with above 
    if(tagFilter){
        params.append("tags", tagFilter.toString())
    }

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
  const useDebounce = (value: any, delay: number) => {
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
  const debouncedContentFilter = useDebounce(contentFilter, 500);
  const debouncedTagFilter = useDebounce(tagFilter, 500);
  const debouncedLimitFilter = useDebounce(limitFilter, 1000);

  useEffect(() => {
    // set the filter limit
    if (limitFilter) {
      if (Number(limitFilter) < 1) setLimitFilter(1);
      else setLimitFilter(Number(limitFilter));
    }

    // Fetch templates whenever the filters or page change
    fetchTemplates(currentPage);
  }, [currentPage, debouncedLanguageFilter, debouncedTitleFilter, debouncedDescriptionFilter, debouncedContentFilter, debouncedTagFilter, debouncedLimitFilter]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
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
      case "content":
          setContentFilter(value);
          break;
      case "tags":
          setTagFilter(value);
          break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-black dark:text-gray-200">
          <h1 className="text-2xl">Loading...</h1>
        </div>
      </Layout>
    );
  }

  if (error !== null) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-black dark:text-gray-200">
          <h1 className="text-2xl">{error}</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-grow m-5">
        {/* Main Content Area */}
        <div className="flex-grow bg-gray-50 dark:bg-gray-900 text-black dark:text-gray-200 py-4">
          {/* Header */}
          <div className="flex justify-between px-8 py-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-200 pl-24">
              Code Templates
            </h1>
          </div>

          {/* Filters */}
          <div className="container mx-auto px-16 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* <input
                type="text"
                placeholder="Filter by language"
                value={languageFilter}
                onChange={(e) => handleFilterChange("language", e.target.value)}
                className="p-2 border rounded dark:bg-gray-925 dark:text-gray-200 border-gray-500"
              /> */}

               {/* Create button with shadcn Dropdown */}
            
              <input
                type="text"
                placeholder="Filter by title"
                value={titleFilter}
                onChange={(e) => handleFilterChange("title", e.target.value)}
                className="p-2 border rounded dark:bg-gray-925 dark:text-gray-200 border-gray-500"
              />
              <input
                type="text"
                placeholder="Filter by description"
                value={descriptionFilter}
                onChange={(e) => handleFilterChange("description", e.target.value)}
                className="p-2 border rounded dark:bg-gray-925 dark:text-gray-200 border-gray-500"
              />
              <input
                type="text"
                placeholder="Filter by code content"
                value={contentFilter}
                onChange={(e) => handleFilterChange("content", e.target.value)}
                className="p-2 border rounded dark:bg-gray-925 dark:text-gray-200 border-gray-500"
              />
              <input
                type="text"
                placeholder="Filter by tags"
                value={tagFilter}
                onChange={(e) => handleFilterChange("tags", e.target.value)}
                className="p-2 border rounded dark:bg-gray-925 dark:text-gray-200 border-gray-500"
              />    
              <div className="justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {/* <Button className="px-4 py-2 rounded-md focus:outline-none">
                      Filter by languages
                    </Button> */}
                    <input
                      type="text"
                      placeholder="Filter by language"
                      value={languageFilter}
                      className="p-2 border rounded dark:bg-gray-925 dark:text-gray-200 border-gray-500"
                    /> 
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 dark:bg-gray-925 dark:text-gray-200">
                  <DropdownMenuItem
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                      onClick={(e) => handleFilterChange("language", "")}
                    >
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                      onClick={(e) => handleFilterChange("language", "javascript")}
                    >
                      JavaScript
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                      onClick={(e) => handleFilterChange("language", "java")}
                    >
                      Java
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                      onClick={(e) => handleFilterChange("language", "python")}
                    >
                      Python
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                      onClick={(e) => handleFilterChange("language", "c")}
                    >
                      C
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                      onClick={(e) => handleFilterChange("language", "cpp")}
                    >
                      C++
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                      onClick={(e) => handleFilterChange("language", "go")}
                    >
                      Go
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                      onClick={(e) => handleFilterChange("language", "ruby")}
                    >
                      Ruby
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                      onClick={(e) => handleFilterChange("language", "rust")}
                    >
                      Rust
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                      onClick={(e) => handleFilterChange("language", "php")}
                    >
                      PHP
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                      onClick={(e) => handleFilterChange("language", "perl")}
                    >
                      Perl
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                </div>    
            </div>
            
          </div>

        {/* Templates List */}
        <div className="container mx-auto px-16">
        {templates.length === 0 ? (
          <div className="text-center text-xl text-gray-600 dark:text-gray-300 mt-8">
            No results match the applied filter.
          </div>
        ) : (
          templates.map((template) => (
            <div
              key={template.templateId}
              className="mb-8 p-6 bg-white dark:bg-gray-925 rounded-lg shadow-md"
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
                Language: {template.language} | Created: {new Date(template.createdAt).toLocaleString()} | Author: {template.owner.username}
              </p>
                {template.templatesTags?.length > 0 && (
                  <div>
                   <ul className="flex gap-2 mt-4">
                    {template.templatesTags.map(( tagVal ) => (
                      <li key={tagVal.tag.tagId} className="bg-gray-200 px-3 py-1 rounded-full dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                        {tagVal.tag.tagName}
                      </li>
                    ))}
                  </ul>
                </div>
                )}

              {/* buttons to edit or delete */}
              <div className="mt-4">
                  <Button
                    className="mr-2"
                    onClick={() =>
                      router.push(`/templates/${template.templateId}`)
                    }
                  >
                    More details
                  </Button>
                </div>
            </div>
          ))
        )}
      </div>
        {/* Pagination */}
        <div className="mb-4 flex justify-center items-center mt-10">
            <input
              type="number"
              placeholder="Limit"
              value={limitFilter}
              onChange={(e) => {
                const newLimit = Number(e.target.value);
                // Enforce minimum limit of 1
                setLimitFilter(Math.max(newLimit, 1));
              }}
              className="p-2 border rounded dark:bg-gray-925 dark:text-gray-200 border-gray-500 w-16"
            />
          </div>

          <div className="flex justify-between items-center mt-10 m-20">
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

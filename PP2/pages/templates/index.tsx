import { Button } from "@/components/ui/button";
import Layout from "@/components/ui/layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

import { highlight, languages } from 'prismjs';
import Editor from 'react-simple-code-editor';

import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-solarizedlight.css'; //Example style, you can use another

// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
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
  const [authorFilter, setAuthorFilter] = useState<string>("");

  // Local states for filters
  const [localTitleFilter, setLocalTitleFilter] = useState<string>(titleFilter);
  const [localDescriptionFilter, setLocalDescriptionFilter] = useState<string>(descriptionFilter);
  const [localContentFilter, setLocalContentFilter] = useState<string>(contentFilter);
  const [localTagFilter, setLocalTagFilter] = useState<string>(tagFilter);
  const [localLanguageFilter, setLocalLanguageFilter] = useState<string>(languageFilter);
  const [localAuthorFilter, setLocalAuthorFilter] = useState<string>("");

  const router = useRouter();

  const applyFilters = () => {
    setTitleFilter(localTitleFilter);
    setDescriptionFilter(localDescriptionFilter);
    setContentFilter(localContentFilter);
    setTagFilter(localTagFilter);
    setLanguageFilter(localLanguageFilter);
    setAuthorFilter(localAuthorFilter);
    setCurrentPage(0); // Reset to the first page on filter change
  };

  const fetchTemplates = async (page: number) => {
    setLoading(true);
    setError(null);

    // console.log("tags " + tagFilter)

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limitFilter.toString(),
      ...(languageFilter && { language: languageFilter }),
      ...(titleFilter && { title: titleFilter }),
      ...(descriptionFilter && { description: descriptionFilter }),
      ...(contentFilter && { content: contentFilter }),
      ...(authorFilter && { author: authorFilter }),
    });

    // this can be combined with above 
    if(tagFilter){
        params.append("tags", tagFilter.toString())
    }

    // console.log("params " + params)

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

  const debouncedLimitFilter = useDebounce(limitFilter, 1000);

  useEffect(() => {
    // set the filter limit
    if (limitFilter) {
      if (Number(limitFilter) < 10) setLimitFilter(10);
      else setLimitFilter(Number(limitFilter));
    }

    // Fetch templates whenever the filters or page change
    fetchTemplates(currentPage);
  }, [currentPage, languageFilter, titleFilter, descriptionFilter, contentFilter, tagFilter, debouncedLimitFilter]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
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
      <div className="container mx-auto px-4 py-8 px-6">
        <h1 className="text-4xl font-bold mb-8 dark:text-gray-200">Code Templates</h1>
           <div className="flex-grow bg-gray-50 dark:bg-gray-900 text-black dark:text-gray-200 py-4"> 
          {/* Filters */}
          {/* Filters */}
          <div className="container mx-auto px-16 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Filter by title */}
              <input
                type="text"
                placeholder="Filter by title"
                value={localTitleFilter}
                onChange={(e) => setLocalTitleFilter(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    applyFilters();
                  }
                }}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-925 dark:text-gray-200 border-gray-500 transition duration-200"
              />
              
              {/* Filter by description */}
              <input
                type="text"
                placeholder="Filter by description"
                value={localDescriptionFilter}
                onChange={(e) => setLocalDescriptionFilter(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    applyFilters();
                  }
                }}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-925 dark:text-gray-200 border-gray-500 transition duration-200"
              />

              {/* Filter by code content */}
              <input
                type="text"
                placeholder="Filter by code content"
                value={localContentFilter}
                onChange={(e) => setLocalContentFilter(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    applyFilters();
                  }
                }}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-925 dark:text-gray-200 border-gray-500 transition duration-200"
              />

              {/* Filter by tags */}
              <input
                type="text"
                placeholder="Filter by tags"
                value={localTagFilter}
                onChange={(e) => setLocalTagFilter(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    applyFilters();
                  }
                }}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-925 dark:text-gray-200 border-gray-500 transition duration-200"
              />

              {/* Filter by username */}
              <input
                type="text"
                placeholder="Filter by author"
                value={localAuthorFilter}
                onChange={(e) => setLocalAuthorFilter(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    applyFilters();
                  }
                }}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-925 dark:text-gray-200 border-gray-500 transition duration-200"
              />

              {/* Dropdown menu for languages */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <input
                    type="text"
                    placeholder="Filter by language"
                    value={localLanguageFilter}
                    className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-925 dark:text-gray-200 border-gray-500 transition duration-200"
                  />
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-48 dark:bg-gray-925 dark:text-gray-200">
                  {['All', 'javascript', 'java', 'python', 'c', 'cpp', 'lua', 'ruby', 'rust', 'php', 'perl'].map((language) => (
                    <DropdownMenuItem
                      key={language}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                      onClick={() => setLocalLanguageFilter(language === 'All' ? '' : language)}
                    >
                      {language === 'All' ? 'All' : language.charAt(0).toUpperCase() + language.slice(1)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Search button */}
              <div className="flex justify-center mt-4 sm:col-span-2 xl:col-span-1">
                <Button
                  onClick={applyFilters}
                  className="px-6 py-3 text-white rounded-lg hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>


        {/* Templates List */}
        <div className="container mx-auto sm:px-8 md:px-12 lg:px-16">
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
              <Editor
                  className="p-4 font-mono text-lg leading-6 bg-gray-100 dark:bg-gray-925 border border-gray-500 rounded-md resize-none placeholder-gray-400"
                  value={template.content} // Bind code state to textarea value
                  onValueChange={(e) => (e)} // Update code state on change
                  highlight={code => highlight(code, languages.js, template.language)}
                  padding={10}
                  style={{
                    fontFamily: 'monospace',
                    // fontSize: "1em",
                    pointerEvents: 'none', // Disable user interactions
                  }}
              />
              {/* <SyntaxHighlighter language={template.language} style={materialDark}>
                {template.content}
              </SyntaxHighlighter> */}
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

          <div className="flex justify-between items-center mt-10 sm:m-8 md:m-12 lg:m-16">
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

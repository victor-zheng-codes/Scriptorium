import { Button } from "@/components/ui/button";
import Layout from "@/components/ui/layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism"; // Or choose another style

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
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch("/api/templates", {
          method: "GET",
        });

        if (res.ok) {
          const data = await res.json();
          setTemplates(data.templates);
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

    fetchTemplates();
  }, [router]);

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
      <div className="flex flex-grow">
        {/* Side Bars */}
        <div className="bg-gray-150 dark:bg-gray-950 w-32 md:w-64"></div>

        {/* Main Content Area */}
        <div className="flex-grow bg-gray-50 dark:bg-gray-900 text-black dark:text-white py-4">
          {/* Header */}
          <div className="flex justify-between items-center px-8 py-8 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center space-x-4 pl-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Templates
              </h1>
            </div>
          </div>

          {/* Templates List */}
          <div className="container mx-auto px-16">
            {templates.map((template) => (
              <div
                key={template.templateId}
                className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
              >
                <h2 className="text-2xl font-bold mb-2">
                  {template.title}
                </h2>
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
                  Language: {template.language} | Created:{" "}
                  {new Date(template.createdAt).toLocaleString()}
                </p>
                <div className="mt-4">
                  <Button
                    className="mr-2"
                    onClick={() =>
                      router.push(`/templates/edit/${template.templateId}`)
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => alert("Delete feature coming soon!")}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Bars */}
        <div className="bg-gray-150 dark:bg-gray-950 w-32 md:w-64"></div>
      </div>
    </Layout>
  );
};

export default Templates;

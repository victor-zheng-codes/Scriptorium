import { useRouter } from "next/router";
import Layout from "@/components/ui/layout";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useEffect, useState } from "react";

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

interface TemplateTag {
  templateTagId: number;
  tagId: number;
  templateId: number;
}

const TemplatePage = () => {
  const [template, setTemplate] = useState<Template | null>(null); // State for template
  const [templateTags, setTemplateTags] = useState<TemplateTag[]>([]); // State for template tags
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const router = useRouter();
  const { id } = router.query; // Get the template ID from the URL

  useEffect(() => {
    if (!id) return; // If the ID is not available, exit

    const fetchTemplate = async () => {
      try {
        const res = await fetch(`/api/templates/${id}`, {
          method: "GET",
        });

        if (!res.ok) {
          setError("Error fetching template.");
          return;
        }

        const data = await res.json();
        setTemplate(data.template);
        setTemplateTags(data.templateTags);
      } catch (error) {
        console.error("Error fetching template:", error);
        setError("An error occurred while fetching template.");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id]);

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

  if (!template) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
          <h1 className="text-2xl">Template not found.</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-8 py-16">
        {/* Template Title and Metadata */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{template.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {template.description}
          </p>
          <p className="text-sm text-gray-500">
            Language: {template.language} | Created: {new Date(template.createdAt).toLocaleString()} 
          </p>
        </div>

        {/* Template Code */}
        <div className="mb-8">
          <SyntaxHighlighter
            language={template.language}
            style={materialDark}
            showLineNumbers
          >
            {template.content}
          </SyntaxHighlighter>
        </div>

        {/* Tags Section */}
        {templateTags.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Tags</h2>
            <div className="flex space-x-2">
              {templateTags.map((tag) => (
                <span
                  key={tag.templateTagId}
                  className="px-3 py-1 rounded bg-blue-500 text-white"
                >
                  Tag ID: {tag.tagId}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TemplatePage;

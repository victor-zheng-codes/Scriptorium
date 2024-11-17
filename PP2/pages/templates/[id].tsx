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

// interface TemplatePageProps {
//   template: Template;
//   templateTags: TemplateTag[];
// }

const TemplatePage = async () => {
  const [templateTags, setTemplateTags] = useState<TemplateTag[]>([]); // Array of templates
  const [template, setTemplates] = useState<Template>(); // Array of templates

  const router = useRouter()

  try {
    const res = await fetch(`/api/templates/${router.query.id}`, {
      method: "GET",
    });
    if (!res.ok) {
      return {
        notFound: true,
      };
    }
    const data = await res.json();
    
    setTemplateTags(data.templateTags);
    setTemplates(data.template);

    // return {
    //   props: {
    //     template: data.template,
    //     templateTags: data.templateTags,
    //   },
    // };
  } catch (error) {
    console.error("Error fetching template:", error);
    return {
      notFound: true,
    };
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
            Language: {template.language} | Created:{" "}
            {new Date(template.createdAt).toLocaleString()}
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

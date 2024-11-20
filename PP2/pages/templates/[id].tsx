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
  owner: { username: string };
}

interface TemplatesTags {
  templateTagId: number;
  tagId: number;
  templateId: number;
  tag: { tagName: string, tagid: number }
}

interface LinkedBlogs {
  blogId: number;
  blog: {title: string, description: string, blogId: number};
}

const TemplatePage = () => {
  const [template, setTemplate] = useState<Template | null>(null); // State for template
  const [templateTags, setTemplateTags] = useState<TemplatesTags[]>([]); // State for template tags
  const [linkedBlogs, setLinkedBlogs] = useState<LinkedBlogs[]>([]); // State for template tags
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [success, setSuccess] = useState<string | null>(null); // Success state

  // editable mode
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editableTemplate, setEditableTemplate] = useState<Template | null>(null);
  const [editableTags, setEditableTags] = useState<TemplatesTags[]>([]); // State for template tags

  // logged in user
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const router = useRouter();
  const { id } = router.query; // Get the template ID from the URL

  useEffect(() => {
    if (!id) return; // If the ID is not available, exit

    // only show erorr messages for a few seconds if they do exist
    if (error) {
      const timer = setTimeout(() => {
        setError(null); // Hide the error message after 3 seconds
      }, 3000); // 3 seconds delay

      // Cleanup timeout on component unmount or when error changes
      return () => clearTimeout(timer);
    }

    // only show success messages for a few seconds if they do exist
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null); // Hide the error message after 3 seconds
      }, 3000); // 3 seconds delay

      // Cleanup timeout on component unmount or when error changes
      return () => clearTimeout(timer);
    }

    const fetchTemplate = async () => {
      try {
        const res = await fetch(`/api/templates/${id}`, {
          method: "GET",
        });

        if (!res.ok) {
          setError("Error fetching template " +  + (await res.json())?.error || " Unknown error");
          return;
        }

        const data = await res.json();
        setTemplate(data.template);
        setLinkedBlogs(data.templateBlogs);
        console.log("linked blogs " + JSON.stringify(data.templateBlogs))
        setEditableTemplate(data.template);
        setTemplateTags(data.templateTags);
        setEditableTags(data.templateTags);

        console.log(data.templateTags)
      } catch (error) {
        setError("An error occurred while fetching template: " + error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();

    // only get the local storage status after fetching templates
    let token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true); // User is logged in, token exists
    } else {
      setIsLoggedIn(false); // User is not logged in
    }

  }, [id, error]);


  // helper function for refreshing tokens
  const refreshAccessToken = async () => {
    try {
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");
      if (!token || !refreshToken) return null;

      const res = await fetch("/api/user/refresh", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          refreshToken: refreshToken,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        return data.token;
      } else {
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        router.push("/login")
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this template?");
    if (!confirmDelete) return;

    let token = localStorage.getItem("token");

    try {
      let res = await fetch(`/api/templates/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // setSuccess("Template deleted successfully.");
        alert("Template deleted successfully.");
        router.push("/templates"); // Redirect to templates list page
      }
      
      // first check if status is 401
      if (res.status === 401){
        // handle refresh token failure
        token = await refreshAccessToken()

        // reattempt with new token
        res =  await fetch(`/api/templates/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (!res.ok) {
        setError("Error deleting templates: " + (await res.json())?.error || " contact sysadmin");
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      setError("An error occurred while deleting the template.");
    }
  };

  const handleFork = async () => {
    if (!id) return;

    let token = localStorage.getItem("token");

    try {
      let res = await fetch(`/api/templates/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();

        setTemplate(data.template);
        setSuccess("Successfully forked template with new template id " + data.templateId);

        router.push(`/templates/${data.templateId}`).then(() => {
          router.reload(); // Force a full page reload
        });
      }

      // handle refresh token failure
      if (res.status === 401) {
        token = await refreshAccessToken()

        // reattempt with new token
        res = await fetch(`/api/templates/${id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },});
      }
      
      if (!res.ok) {
        setError("Error forking template: " + (await res.json())?.error || " contact sysadmin");
      }

    } catch (error) {
      console.error("Error forking template:", error);
      setError("An error occurred while forking the template: " + error);
    }
  };

  const handleSave = async () => {
    if (!editableTemplate || !id) return;

    // console.log("sending" + JSON.stringify(editableTemplate))

    var request: any = {};
    request.title = editableTemplate.title;
    request.description = editableTemplate.description;
    request.content = editableTemplate.content;
    request.tags = editableTags.map((tag) => tag.tag.tagName);

    let requestContent = JSON.stringify(request); 

    console.log("Request params " + requestContent)

    try {
      let token = localStorage.getItem("token");
      let res = await fetch(`/api/templates/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: requestContent,
      });
      if (res.ok) {
        const updatedTemplate = await res.json();

        setTemplate(updatedTemplate);
        setIsEditMode(false);
        setSuccess("Template updated successfully.");
        router.reload()
      }

      // handle refresh token failure
      if (res.status === 401) {
        token = await refreshAccessToken()

        // reattempt with new token
        res = await fetch(`/api/templates/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: requestContent,
        });
      }

      // check if result is OK
      if (!res.ok)
      {
        setError("Error saving template: " + (await res.json())?.error || " contact sysadmin");
      }

    } catch (err) {
      setError("An error occurred while updating the template: " + err);
    }
  };

  const handleRun = async () => {
    if (!id) return;
    // let token = localStorage.getItem("token");

    try {
      router.push(`/code/${id}`)
    } catch (error) {
      console.error("Error forking template:", error);
      setError("An error occurred while forking the template: " + error);
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

  if (!template) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-black dark:text-gray-200">
          <h1 className="text-2xl">Template not found.</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Error Message at the Top */}
      {error && (<div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
      )}

      {success && (<div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
        <p className="font-bold">Success</p>
        <p>{success}</p>
      </div>
      )}

      <div className="bg-gray-50 dark:bg-gray-900 text-black dark:text-gray-200">
        {isEditMode ? (
          <div className="container mx-auto px-8 py-16">
            <div className="mb-4">
              <label className="block font-bold mb-2">Title</label>
              <input
                type="text"
                value={editableTemplate?.title || ""}
                onChange={(e) =>
                  setEditableTemplate((prev) =>
                    prev ? { ...prev, title: e.target.value } : null
                  )
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-bold mb-2">Description</label>
              <textarea
                value={editableTemplate?.description || ""}
                onChange={(e) =>
                  setEditableTemplate((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
                className="w-full px-3 py-2 border rounded"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block font-bold mb-2">Content</label>
              <textarea
                value={editableTemplate?.content || ""}
                onChange={(e) =>
                  setEditableTemplate((prev) =>
                    prev ? { ...prev, content: e.target.value } : null
                  )
                }
                className="w-full px-3 py-2 border rounded font-mono"
                rows={10}
              ></textarea>
            </div>

            {/* Tags editing */}
              <div className="mb-4">
              <label className="block font-bold mb-2">Tags</label>
              <div className="space-y-2">
                {editableTags.map((tagVal, index) => (
                  <div key={tagVal.tag.tagid} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={tagVal.tag.tagName}
                      onChange={(e) => {
                        const updatedTags = [...editableTags];
                        updatedTags[index] = {
                          ...updatedTags[index],
                          tag: { ...updatedTags[index].tag, tagName: e.target.value },
                        };
                        setEditableTags(updatedTags);
                      }}
                      className="w-full px-3 py-2 border rounded"
                    />
                    <button
                      onClick={() => {
                        setEditableTags((prevTags) =>
                          prevTags.filter((_, idx) => idx !== index)
                        );
                      }}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() =>
                  setEditableTags((prevTags) => [
                    ...prevTags,
                    {
                      templateTagId: 0,
                      tagId: 0,
                      templateId: template?.templateId || 0,
                      tag: { tagName: "", tagid: 0 },
                    },
                  ])
                }
                className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add Tag
              </button>
            </div>

              {/* Handle saves */}
            <div className="flex justify-between">

              <div className="mt-8">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Save Changes
              </button>
              </div>
              {/* Handle cancellations */}
              <div className="mt-8">
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Cancel Changes
              </button>
              </div>
            </div>
          </div>
          
        ) : 
        (
      <div className="container mx-auto px-8 py-16">
        {/* Template Title and Metadata */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{template.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {template.description}
          </p>
          <p className="text-sm text-gray-500 mb-2">
          Language: {template.language} | Author: {template.owner?.username || "Unknown"}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            Created: {new Date(template.createdAt).toLocaleString()} 
          </p>
          <p className="text-sm text-gray-500 mb-2">
            Updated: {new Date(template.updatedAt).toLocaleString()}
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

        {/* Tags Section, non editable */}
        {templateTags.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Tags</h2>
            <div className="flex space-x-2">
              {templateTags.map((tagVal) => (
                <span
                  key={tagVal.tag.tagid}
                  className="px-3 py-1 rounded bg-blue-500 text-white"
                >
                  {tagVal.tag.tagName}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Blogs Section, non editable */}
        {linkedBlogs.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 mt-4">Blogs</h2>
            <div className="flex space-x-2">
              {linkedBlogs.map((blogArray) => (
                <button
                  onClick={() => router.push(`/blogs/${blogArray.blog.blogId}`)}
                  key={blogArray.blog.blogId}
                  className="px-3 py-1 rounded bg-teal-500 text-white"
                >
                  {blogArray.blog.title}
                </button>
              ))}
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold mt-5">Actions</h2>

        {/* Action Buttons */}
        <div className="flex justify-between">
            {isLoggedIn && (
              <div className="mt-8">
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete Template
                  </button>
              </div>
            )}

          <div className="mt-8">
            <button
              onClick={handleRun}
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700">
              Execute Code
            </button>
          </div>

          {/* Fork Button */}
          {isLoggedIn && (
          <div className="mt-8">
            <button
              onClick={handleFork}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Fork Template
            </button>
          </div>)}

          {/* Edit Mode Toggle */}
          {isLoggedIn && (
          <div className="mt-8">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {isEditMode ? "Cancel Edit" : "Edit Template"}
          </button>
          </div>)}
        </div>
      </div>)}
      </div>
    </Layout>
  );
};



export default TemplatePage;

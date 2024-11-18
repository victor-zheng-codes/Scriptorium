import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/ui/layout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface User {
  username: string;
}
interface Data {
  user: User;
}

const Studio = () => {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"templates" | "blogs">(
    "templates"
  );
  const router = useRouter();

  const refreshAccessToken = async () => {
    try {
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");
      console.log(token, refreshToken)
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
        router.push("/login")
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  const checkUserLoggedIn = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/user/data", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setData(data);
      } else if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          const res = await fetch("/api/user/data", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            setData(data);
          } else {
            setError("An error occurred while fetching user data.");
            router.push("/");
          }
        }
      } else {
        setError("An error occurred while fetching user data.");
        router.push("/");
      }
    } catch (error) {
      setError("An error occurred while fetching user data.");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const handleOptionClick = (option: string) => {
    if (option === "template") {
      router.push("/create/template"); // Redirect to create template page
    } else if (option === "blog") {
      router.push("/create/blog"); // Redirect to create blog page
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-2xl dark:text-white">Loading...</h1>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-2xl dark:text-white">{error}</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-16 py-8 relative dark:bg-gray-900">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-200 mb-8 pt-2">
            Welcome {data?.user.username} to your creator studio
          </h1>

          {/* Create button with shadcn Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="px-4 py-2 rounded-md focus:outline-none">
                Create
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 dark:bg-gray-925 dark:text-gray-200">
              <DropdownMenuItem
                className="hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                onClick={() => handleOptionClick("template")}
              >
                Template
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                onClick={() => handleOptionClick("blog")}
              >
                Blog
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tabs for Templates and Blogs */}
        <div className="flex space-x-4 border-b dark:border-gray-800">
          <button
            className={`py-2 px-4 text-xl font-semibold ${
              activeTab === "templates"
                ? "border-b-2 border-blue-500 dark:border-blue-400"
                : ""
            } dark:text-white`}
            onClick={() => setActiveTab("templates")}
          >
            Templates
          </button>
          <button
            className={`py-2 px-4 text-xl font-semibold ${
              activeTab === "blogs"
                ? "border-b-2 border-blue-500 dark:border-blue-400"
                : ""
            } dark:text-white`}
            onClick={() => setActiveTab("blogs")}
          >
            Blogs
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === "templates" && (
            <div className="h-64 overflow-y-auto bg-gray-100 dark:bg-gray-925 p-4 rounded-md">
              {/* Add content related to templates here */}
              <p className="dark:text-gray-400">
                You have not published any templates...
              </p>
            </div>
          )}
          {activeTab === "blogs" && (
            <div className="h-64 overflow-y-auto bg-gray-100 dark:bg-gray-925 p-4 rounded-md">
              {/* Add content related to blogs here */}
              <p className="dark:text-gray-400">
                You have not published any blogs...
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Studio;

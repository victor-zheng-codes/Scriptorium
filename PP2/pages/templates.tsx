import { Button } from "@/components/ui/button";
import Image from "next/image";
import Layout from "@/components/ui/layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FiEdit } from "react-icons/fi"; // Import the pencil icon

// define how each template needs to look
interface Template {
  templateId: number;
  userId: number;
  content: string;
  title: string;
  description: string;
  language: string;
}

const Templates = () => {
  const [template, setTemplates] = useState<Template | null>(null);
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
          console.log(data)
          setTemplates(data.templates);
        } else {
          if (res.status === 401) {
            setError("Unauthorized. Please log in again.");
            router.push("/login");
          } else {
            setError("Error fetching profile data.");
          }
        }
      } catch (error) {
        setError("An error occurred while fetching profile data.");
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

  if (!template) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
          <h1 className="text-2xl">No user data found.</h1>
        </div>
      </Layout>
    );
  }

  // const userRole = user.isAdmin ? "Admin" : "User";
  // const avatarLink = user.avatar
  //   ? `/avatars/${user.avatar}`
  //   : "/avatars/bear.png";

  return (
    <Layout>
      <div className="flex flex-grow">
        {/* Dark Side Bars */}
        <div className="bg-gray-150 dark:bg-gray-950 w-32 md:w-64"></div>

        {/* Main Content Area */}
        <div className="flex-grow bg-gray-50 dark:bg-gray-900 text-black dark:text-white py-4">
          {/* Top Button Bar (After Sidebars) */}
          <div className="flex justify-between items-center px-8 py-8 bg-gray-50 dark:bg-gray-900">
            {/* Title on the left, aligned with profile image */}
            <div className="flex items-center space-x-4 pl-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Templates
              </h1>
            </div>

            {/* Buttons (Right Aligned) */}
            {/* <div className="flex space-x-4 ml-auto">
              <Button className="text-sm py-1 px-4">
                Logout
              </Button>
              <Button
                className="text-sm py-1 px-4"
                onClick={() => router.push("/profile/edit")}
              >
                Edit Profile
              </Button>
            </div> */}
          </div>

          {/* Profile Content */}
          <div className="container mx-auto px-16">
            {/* Profile Header */}
            <div className="relative flex items-center">
              <div className="flex-grow pl-8">
                <h1 className="text-4xl font-bold mb-2">
                  {template.title || "No Username"}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  {template.content || "No Email"}
                </p>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  {template.description}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Dark Side Bars */}
        <div className="bg-gray-150 dark:bg-gray-950 w-32 md:w-64"></div>
      </div>

    </Layout>
  );
};

export default Templates;
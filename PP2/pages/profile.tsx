import { Button } from "@/components/ui/button";
import Image from "next/image";
import Layout from "@/components/ui/layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface User {
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  avatar: string | null;
  isAdmin: boolean;
  createdAt: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
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
          setUser(data.user);
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

    fetchUserProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("/api/user/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        localStorage.removeItem("token"); // Remove token from local storage
        router.push("/"); // Redirect to home page
      }
    } catch (error) {
      setError("An error occurred while logging out.");
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

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
          <h1 className="text-2xl">No user data found.</h1>
        </div>
      </Layout>
    );
  }

  const userRole = user.isAdmin ? "Admin" : "User";
  const avatarLink = user.avatar
    ? `/avatars/${user.avatar}`
    : "/avatars/bear.png";

  return (
    <Layout>
      <div className="min-h-screen flex">
        {/* Dark Side Bars */}
        <div className="bg-gray-150 dark:bg-gray-950 w-32 md:w-64"></div>

        {/* Main Content Area */}
        <div className="flex-grow bg-gray-50 dark:bg-gray-900 text-black dark:text-white py-4">
          {/* Top Button Bar (After Sidebars) */}
          <div className="flex justify-between items-center px-8 py-8 bg-gray-50 dark:bg-gray-900">
            {/* Title on the left, aligned with profile image */}
            <div className="flex items-center space-x-4 pl-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                User Profile
              </h1>
            </div>

            {/* Buttons (Right Aligned) */}
            <div className="flex space-x-4 ml-auto">
              <Button className="text-sm py-1 px-4" onClick={handleLogout}>
                Logout
              </Button>
              <Button
                className="text-sm py-1 px-4"
                onClick={() => router.push("/profile/edit")}
              >
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="container mx-auto px-16">
            {/* Profile Header */}
            <div className="relative flex items-center">
              <div className="w-40 h-40 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <Image
                  src={avatarLink}
                  alt="Profile Picture"
                  width={160}
                  height={160}
                  className="object-cover"
                />
              </div>
              <div className="flex-grow pl-8">
                <h1 className="text-4xl font-bold mb-2">
                  {user.username || "No Username"}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  {user.email || "No Email"}
                </p>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  {userRole}
                </p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="pl-48">
              <div>
                <h2 className="text-lg font-semibold">About</h2>
                <div className="flex flex-wrap gap-8 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex">
                    <p>First Name: {user.firstName || "Not Set"}</p>
                  </div>
                  <div className="flex">
                    <p>Last Name: {user.lastName || "Not Set"}</p>
                  </div>
                  <div className="flex">
                    <p>Phone: {user.phoneNumber || "Not Set"}</p>
                  </div>
                  <div className="flex">
                    <p>
                      Member since:{" "}
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
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

export default Profile;

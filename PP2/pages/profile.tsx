import { Button } from "@/components/ui/button";
import Image from "next/image";
import Layout from "@/components/ui/layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FiEdit } from "react-icons/fi"; // Import the pencil icon

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State to control modal visibility
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null); // Track selected avatar
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null); // Track the current avatar

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
          setSelectedAvatar(data.user.avatar || "bear.png"); // Preselect current avatar
          setCurrentAvatar(data.user.avatar || "bear.png"); // Set the current avatar
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

  const handleSaveAvatar = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !selectedAvatar) return;
  
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatar: selectedAvatar }),
      });
  
      if (res.ok) {
        // Reload the page to reflect the updated avatar
        router.reload();
      } else {
        setError("Failed to update avatar.");
      }
    } catch (error) {
      setError("An error occurred while saving the avatar.");
    }
  };

  const handleEditAvatar = () => {
    setIsModalOpen(true); // Open modal on edit icon click
  };

  const closeModal = () => {
    setSelectedAvatar(currentAvatar)
    setIsModalOpen(false); // Close the modal
  };

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar); // Set selected avatar
  };

  const avatarImages = [
    "bear.png",
    "cat.png",
    "dog.png",
    "duck.png",
    "fox.png",
    "koala.png",
    "panda.png",
    "rabbit.png",
    "seal.png"
    // Add more avatar names as needed
  ];

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
              <div className="w-40 h-40 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden relative group">
                <Image
                  src={avatarLink}
                  alt="Profile Picture"
                  width={160}
                  height={160}
                  className="object-cover group-hover:opacity-50 transition-opacity duration-200"
                />
                <div
                  className="absolute cursor-pointer inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={handleEditAvatar}
                >
                  <FiEdit className="text-white text-3xl" />
                </div>
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

      {/* Modal for Avatar Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Edit Avatar
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Choose a new avatar for your profile.
            </p>

            {/* Avatar grid display */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              {avatarImages.map((avatar) => (
                <div
                  key={avatar}
                  className={`cursor-pointer border-2 p-2 rounded-lg hover:border-gray-500 ${
                    selectedAvatar === avatar ? "border-gray-500" : ""
                  }`}
                  onClick={() => handleAvatarSelect(avatar)}
                >
                  <Image
                    src={`/avatars/${avatar}`}
                    alt={avatar}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>

            {/* Save button */}
            <div className="mt-6 flex justify-between">
              <Button
                variant="default"
                onClick={closeModal}
              >
                Close
              </Button>
              <Button
                onClick={handleSaveAvatar}
              >
                Save Avatar
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Profile;
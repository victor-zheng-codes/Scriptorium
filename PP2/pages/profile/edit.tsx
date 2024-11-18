import { Button } from "@/components/ui/button";
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

const EditProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editedUser, setEditedUser] = useState<User>({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    avatar: "",
    isAdmin: false,
    createdAt: "",
  });
  const [password, setPassword] = useState<string>(""); // State for password
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // State for confirm password
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordMatchError, setPasswordMatchError] = useState<string | null>(null); // State for password mismatch error

  const router = useRouter();

  const refreshAccessToken = async () => {
    try {
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");
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
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        router.push("/login")
        return null;
      }
    } catch (error) {
      return null;
    }
  };

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
          setEditedUser(data.user);
        } else {
          if (res.status === 401) {
            const newToken = await refreshAccessToken()
            if (newToken) {
              const res = await fetch("/api/user/data", {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                setEditedUser(data.user);
              }
            }
          } else {
            setError("Error fetching profile data.");
          }
        }
      } catch (error) {
        setError("An error occurred while fetching profile data.");
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    // Validate that passwords match before submitting
    if (password !== confirmPassword) {
      setPasswordMatchError("Passwords do not match.");
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
      setPasswordMatchError(null); // Clear any previous errors
  
      const token = localStorage.getItem("token");
  
      if (!token) {
        router.push("/login");
        return;
      }
  
      // Create the payload, excluding password if it's empty
      const payload = {
        ...editedUser,
        ...(password && { password }), // Only include password if it's not empty
      };
  
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload), // Send the payload with or without password
      });
  
      if (res.ok) {
        router.push("/profile");
      } else if (res.status === 401) {
        const newToken = await refreshAccessToken()
        if (newToken) {
          const res = await fetch("/api/user/profile", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload), // Send the payload with or without password
          });
          if (res.ok) {
            router.push("/profile");
          }
        }
      } else {
        const result = await res.json();
        setError(result.error || "Failed to save changes.");
      }
    } catch (error) {
      setError("An error occurred while saving the profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-black dark:text-gray-200">
          <h1 className="text-2xl">No user data found.</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex">
      <div className="bg-gray-150 dark:bg-gray-950 w-16 md:w-32 hidden md:block"></div>

        <div className="flex-grow bg-gray-50 dark:bg-gray-900 text-black dark:text-gray-200 py-4">
          <div className="flex justify-between items-center px-8 py-8 bg-gray-50 dark:bg-gray-900">
            <div className="flex space-x-4 ml-auto">
              <Button
                className="text-sm py-1 px-4"
                onClick={() => router.push("/profile")}
              >
                Cancel
              </Button>
              <Button
                className="text-sm py-1 px-4"
                onClick={handleSave}
                disabled={loading} // Disable the button while loading
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          <div className="container mx-auto px-16">
            <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>

            {error && (
              <div className="text-red-500 text-sm mb-4">{error}</div> // Display error message
            )}

            {passwordMatchError && (
              <div className="text-red-500 text-sm mb-4">{passwordMatchError}</div> // Display password mismatch error
            )}

            <div className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={editedUser.username || ""}
                  onChange={handleChange}
                  className="w-full p-2 mt-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-925 text-black dark:text-gray-200"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editedUser.email || ""}
                  onChange={handleChange}
                  className="w-full p-2 mt-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-925 text-black dark:text-gray-200"
                />
              </div>
              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password} // Bind password state
                  onChange={(e) => setPassword(e.target.value)} // Update password state
                  className="w-full p-2 mt-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-925 text-black dark:text-gray-200"
                />
              </div>
              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword} // Bind confirm password state
                  onChange={(e) => setConfirmPassword(e.target.value)} // Update confirm password state
                  className="w-full p-2 mt-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-925 text-black dark:text-gray-200"
                />
              </div>
              <div>
                <label htmlFor="firstName" className="block text-sm">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={editedUser.firstName || ""}
                  onChange={handleChange}
                  className="w-full p-2 mt-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-925 text-black dark:text-gray-200"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={editedUser.lastName || ""}
                  onChange={handleChange}
                  className="w-full p-2 mt-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-925 text-black dark:text-gray-200"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm">
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phoneNumber" // Update this to match the state property
                  value={editedUser.phoneNumber || ""}
                  onChange={handleChange}
                  className="w-full p-2 mt-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-925 text-black dark:text-gray-200"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-150 dark:bg-gray-950 w-16 md:w-32 hidden md:block"></div>
      </div>
    </Layout>
  );
};

export default EditProfile;
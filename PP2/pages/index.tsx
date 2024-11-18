import { useEffect, useState } from "react"; // Importing hooks from React
import Layout from "../components/ui/layout"; // Importing the Layout component
import { Button } from "../components/ui/button"; // Importing the Button component
import Link from "next/link";
import { useRouter } from "next/router";

export default function Home() {
  // State to track if the user is logged in and for storing the username
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const router = useRouter();

  useEffect(() => {
    // Get the access token and refresh token from localStorage
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken && refreshToken) {
      // If both tokens exist, attempt to fetch user data
      fetchUserData();
    } else {
      setIsLoggedIn(false); // No token, user is not logged in
    }
  }, []);

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

  // Function to fetch user data and handle token expiration
  const fetchUserData = async () => {
    try {
      let firstAccessToken = localStorage.getItem("token");
      let response = await fetch("/api/user/data", {
        headers: {
          Authorization: `Bearer ${firstAccessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user?.username) {
          setIsLoggedIn(true);
          setUsername(data.user.username); // Set the username from the API response
        }
      } else if (response.status === 401) {
        // If the access token is expired, try to refresh it
        const newToken = await refreshAccessToken();

        if (newToken) {
          let response = await fetch("/api/user/data", {
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            if (data.user?.username) {
              setIsLoggedIn(true);
              setUsername(data.user.username); // Set the username from the API response
            }
          }
        } else {
          console.error("Error fetching user data:", response.status);
          setIsLoggedIn(false); // Set logged-in state to false
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoggedIn(false); // Set logged-in state to false
    }
  };

  return (
    <Layout>
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900 dark:text-gray-100">
          {isLoggedIn
            ? `Welcome ${username} to Scriptorium`
            : "Welcome to Scriptorium"}
        </h1>
        <p
          className="text-lg md:text-xl text-gray-600 mb-4 dark:text-gray-300 relative md:w-[max-content] w-full font-mono
          before:absolute before:inset-0 before:animate-typewriter
          before:bg-gray-50
          after:absolute after:inset-0 after:w-[0.125em] after:animate-caret
          after:bg-gray-900 dark:before:bg-gray-900 dark:after:text-gray-100 dark:after:bg-gray-100"
        >
          Where code execution and community innovation coexist.
        </p>

        {/* Conditionally render the button only if the user is not logged in */}
        {!isLoggedIn && (
          <Link href="/login">
            <Button className="mt-2">Get Started</Button>
          </Link>
        )}
      </div>
    </Layout>
  );
}

import { useEffect, useState } from "react"; // Importing hooks from React
import Layout from "../components/ui/layout"; // Importing the Layout component
import { Button } from "../components/ui/button"; // Importing the Button component
import Link from "next/link";

export default function Home() {
  // State to track if the user is logged in and for storing the username
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Check if the authentication token exists in localStorage (you can replace this with cookies or another method)
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true); // User is logged in, token exists

      // Fetch the user data (replace this URL with your actual API endpoint)
      fetch("/api/user/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.user.username) {
            setUsername(data.user.username); // Set the username from the API response
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      setIsLoggedIn(false); // User is not logged in
    }
  }, []);

  return (
    <Layout>
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900 dark:text-gray-100">
          {isLoggedIn ? `Welcome ${username} to Scriptorium` : "Welcome to Scriptorium"}
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
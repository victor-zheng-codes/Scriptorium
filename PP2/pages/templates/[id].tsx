import { useEffect, useState } from "react"; // Importing hooks from React
import Layout from "../..//components/ui/layout"; // Importing the Layout component
import { Button } from "../../components/ui/button"; // Importing the Button component
import Link from "next/link";
import { useRouter } from 'next/router'

export default function Home() {
  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter()

  useEffect(() => {
    // Check if the authentication token exists in localStorage (you can replace this with cookies or another method)
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true); // User is logged in, token exists
    } else {
      setIsLoggedIn(false); // User is not logged in
    }
  }, []);

  return (
    <Layout>
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center vertical-align flex-grow">
        <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-gray-100">
          Placeholder template: {router.query.id}
        </h1>
        {/* Conditionally render the button only if the user is not logged in */}
        {/* {!isLoggedIn && (
          <Link href="/login">
            <Button className="mt-2">Get Started</Button>
          </Link>
        )} */}
      </div>
    </Layout>
  );
}
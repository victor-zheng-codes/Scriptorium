import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/ui/theme-mode-toggle";

const Navbar = () => {
  const [avatar, setAvatar] = useState<string | null>(null); // To hold the avatar URL

  useEffect(() => {
    const fetchUserData = async () => {
      // Retrieve the authentication token (assuming it's stored in localStorage)
      const token = localStorage.getItem("token"); // Modify this if your token is stored elsewhere

      // If the token is not found, we can either redirect or leave avatar as null
      if (!token) {
        setAvatar(null); // No token means not logged in, no avatar
        return;
      }

      try {
        // Make the API call with the Bearer token in the Authorization header
        const response = await fetch("/api/user/data", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Add the token here
          },
        });

        if (response.ok) {
          const data = await response.json();
          // If avatar is null or empty, set to default avatar (bear.png)
          setAvatar(data.user.avatar || "bear.png");
        } else {
          console.error("Failed to fetch user data:", response.status);
          setAvatar(null); // Fallback in case of an error
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setAvatar(null); // Fallback in case of a fetch error
      }
    };

    fetchUserData();
  }, []);

  // Determine the avatar link:
  // If no avatar (null or undefined), use user.png. If avatar is available, use it, otherwise fallback to "bear.png".
  const avatarLink = avatar ? `/avatars/${avatar}` : "/avatars/user.png";

  return (
    <nav className="sticky top-0 w-full px-4 py-2 bg-gray-100 dark:bg-[#191919] text-black dark:text-white z-10">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <div className="flex-shrink-0">
          <Link href="/" passHref>
            <Button
              variant="link"
              className="text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 no-underline font-bold"
            >
              Scriptorium
            </Button>
          </Link>
        </div>

        <div className="flex-1 flex justify-center space-x-8">
          <Link href="/code" passHref>
            <Button
              variant="link"
              className="text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 no-underline"
            >
              Code
            </Button>
          </Link>
          <Link href="/templates" passHref>
            <Button
              variant="link"
              className="text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 no-underline"
            >
              Templates
            </Button>
          </Link>
          <Link href="/blogs" passHref>
            <Button
              variant="link"
              className="text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 no-underline"
            >
              Blogs
            </Button>
          </Link>
          <Link href="/create" passHref>
            <Button
              variant="link"
              className="text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 no-underline"
            >
              Create
            </Button>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Link href="/profile">
            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
              {/* Dynamically set the avatar image based on the fetched data */}
              <Image
                src={avatarLink} // Use the avatar from state or fallback to default
                alt="Profile Picture"
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
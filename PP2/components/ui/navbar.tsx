import { useState, useEffect } from "react"; // Importing hooks from React
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/ui/theme-mode-toggle";

const Navbar = () => {
  const [avatar, setAvatar] = useState<string | null>(null); // To hold the avatar URL
  const [isOpen, setIsOpen] = useState(false); // To toggle the mobile menu

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
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setAvatar(null); 
        return;
      }

      try {
        const response = await fetch("/api/user/data", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAvatar(data.user.avatar || "bear.png");
        } else if (response.status === 401) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            const response = await fetch("/api/user/data", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (response.ok) {
              const data = await response.json();
              setAvatar(data.user.avatar || "bear.png");
            } else {
              setAvatar(null);
            }
          }
        } else {
          setAvatar(null);
        }
      } catch (error) {
        setAvatar(null);
      }
    };

    fetchUserData();
  }, []);

  const avatarLink = avatar ? `/avatars/${avatar}` : "/avatars/user.png";

  // Toggle the mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="sticky top-0 w-full px-4 py-2 bg-gray-200 dark:bg-[#191919] text-black dark:text-white z-10">
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

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-black dark:text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Links for larger screens */}
        <div className="hidden md:flex flex-1 justify-center space-x-8">
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
          <Link href="/studio" passHref>
            <Button
              variant="link"
              className="text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 no-underline"
            >
              Creator Studio
            </Button>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Link href="/profile">
            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
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

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col space-y-4 mt-4 text-center">
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
          <Link href="/studio" passHref>
            <Button
              variant="link"
              className="text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 no-underline"
            >
              Creator Studio
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
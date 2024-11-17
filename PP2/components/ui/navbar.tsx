import { Button } from "@/components/ui/button"; 
import Link from "next/link"; 
import Image from "next/image"; 
import { ModeToggle } from "@/components/ui/theme-mode-toggle"; 

const Navbar = () => {
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
              <Image
                src="/avatars/bear.png"
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
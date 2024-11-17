import Layout from "../components/ui/layout"; // Importing the Layout component
import { Button } from "../components/ui/button"; // Importing the Button component
import Link from "next/link";

export default function Home() {
  return (
    <Layout>
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-gray-100">
          Welcome to Scriptorium
        </h1>
        <p
          className="text-lg text-gray-600 mb-4 dark:text-gray-300 relative w-[max-content] font-mono
before:absolute before:inset-0 before:animate-typewriter
before:bg-gray-50
after:absolute after:inset-0 after:w-[0.125em] after:animate-caret
after:bg-gray-900 dark:before:bg-gray-900 dark:after:text-gray-100 dark:after:bg-gray-100"
        >
          Where code execution and community innovation coexist.
        </p>

        {/* ShadCN's Button with grey shades */}
        <Link href="/login">
          <Button className="mt-2">Get Started</Button>
        </Link>
      </div>
    </Layout>
  );
}

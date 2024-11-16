import Layout from "../components/ui/layout"; // Importing the Layout component
import { Button } from "../components/ui/button"; // Importing the Button component
import Link from "next/link";

export default function Home() {
  return (
    <Layout>
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Welcome to Scriptorium
        </h1>
        <p className="text-lg text-gray-600 mb-4 dark:text-gray-300">
          Where code execution and community innovation coexist.
        </p>

        {/* ShadCN's Button with grey shades */}
        <Link href="\login">
        <Button>
          Get Started
        </Button>
        </Link>
      </div>
    </Layout>
  );
}
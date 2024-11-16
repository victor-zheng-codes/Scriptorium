import Layout from "../components/ui/layout"; // Importing the Layout component
import { Button } from "../components/ui/button"; // Importing the Button component

export default function Home() {
  return (
    <Layout>
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Welcome to Scriptorium
        </h1>
        <p className="text-lg text-gray-600 mb-4 dark:text-gray-300">
          Where code execution and community innovation coexist.
        </p>

        {/* ShadCN's Button with grey shades */}
        <Button>
          Get Started
        </Button>
      </div>
    </Layout>
  );
}
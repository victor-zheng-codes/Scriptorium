import Layout from "../components/ui/layout"; // Importing the Layout component
import {Button} from "../components/ui/button"; // Importing the Button component
import Link from "next/link";

export default function Custom404() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          404
        </h1>
        <p className="text-lg text-gray-600 mb-4 dark:text-gray-300 p-5">
          Sorry, page not found.
        </p>

        {/* ShadCN's Button with grey shades */}
        <Link href="/">
        <Button>
          Return Home
        </Button>
        </Link>
      </div>
    </Layout>
  );}
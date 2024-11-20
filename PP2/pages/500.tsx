import Layout from "../components/ui/layout"; // Importing the Layout component
import {Button} from "../components/ui/button"; // Importing the Button component
import Link from "next/link";

export default function Custom404() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          500 - Server-side error occurred
        </h1>

        {/* ShadCN's Button with grey shades */}
        <Link href="/">
        <Button>
          Return Home
        </Button>
        </Link>
      </div>
    </Layout>
  );}
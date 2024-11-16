import { Button } from "@/components/ui/button"; 
import Image from "next/image"; 
import Layout from "@/components/ui/layout";

const Profile = () => {
  return (
    <Layout>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        {/* Profile Header with Edit button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          <Button>
            Edit Profile
          </Button>
        </div>

        {/* Profile Content */}
        <div className="flex items-center space-x-8">
          {/* Profile Picture */}
          <div className="w-48 h-48 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <Image
              src="/avatars/bear.png"
              alt="Profile Picture"
              width={192}
              height={192}
              className="object-cover"
            />
          </div>

          {/* Profile Information */}
          <div className="flex-1">
            <div className="space-y-4">
              <div className="text-lg font-semibold">John Doe</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                johndoe@example.com
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Software Developer
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Location: San Francisco, CA
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Member since: 2020
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default Profile;
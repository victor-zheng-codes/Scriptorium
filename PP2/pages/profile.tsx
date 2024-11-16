import Image from 'next/image';
import Layout from '@/components/ui/layout';

const ProfileTab = () => {
  return (
    <Layout>
        <div className="flex items-center space-x-4 p-4 border-b">
        {/* Profile Picture */}
        <div className="w-20 h-20 rounded-full overflow-hidden">
            <Image
            src="/avatars/bear.png" // Path to your image in the public folder
            alt="Profile Picture"
            width={80}
            height={80}
            className="object-cover"
            />
        </div>

        {/* Profile Information */}
        <div>
            <h2 className="text-2xl font-semibold">John Doe</h2>
            <p className="text-sm text-gray-500">Software Developer</p>
            <p className="text-sm text-gray-700 mt-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.
            </p>
        </div>
        </div>
    </Layout>
  );
};

export default ProfileTab;
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Layout from "@/components/ui/layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          router.push('/login');
          return;
        }

        const res = await fetch('/api/user/data', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          if (res.status === 401) {
            setError('Unauthorized. Please log in again.');
            router.push('/login');  // Redirect to login if unauthorized
          } else {
            setError('Error fetching profile data.');
          }
        }
      } catch (error) {
        setError('An error occurred while fetching profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
          <div className="max-w-screen-xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-4">Profile</h1>
            <div>Loading...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
          <div className="max-w-screen-xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-4">Profile</h1>
            <div>{error}</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
          <div className="max-w-screen-xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-4">Profile</h1>
            <div>No user data found.</div>
          </div>
        </div>
      </Layout>
    );
  }

  const userRole = user.isAdmin === true ? "Admin" : "User";
  let avatarLink = null;
  if (user.avatar === null) {
    avatarLink = "/avatars/" + user.avatar;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
        <div className="max-w-screen-xl mx-auto px-6 py-8 space-y-8">
          {/* Profile Header */}
          <div className="relative flex items-center space-x-8 mb-8">
            <div className="w-40 h-40 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <Image
                src={avatarLink || "/avatars/bear.png"}
                alt="Profile Picture"
                width={160}
                height={160}
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{user.username || 'No Username'}</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">{user.email || 'No Email'}</p>
              <p className="text-xl text-gray-600 dark:text-gray-300">{userRole}</p>
            </div>
            {/* Edit Profile Button */}
            <Button className="absolute top-4 right-4 text-sm py-1 px-4">Edit Profile</Button>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* About Section */}
            <div className="md:col-span-1 space-y-4">
              <h2 className="text-lg font-semibold">About</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">First Name: {user.firstName || 'Not Set'}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Last Name: {user.lastName || 'Not Set'}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Phone Number: {user.phone || 'Not Set'}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>

            {/* Additional Info */}
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm text-gray-600 dark:text-gray-300">
                {/* Mock-up of recent activity */}
                No recent activity yet.
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/ui/layout";

interface User {
  username: string;
}
interface Data {
  user: User;
}

const Studio = () => {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  // Function to fetch user data and check if logged in
  const checkUserLoggedIn = async () => {
    try {
      // Retrieve the token from local storage
      const token = localStorage.getItem("token");

      if (!token) {
        // Redirect to login if no token exists
        router.push("/login");
        return;
      }

      // Send the token in the Authorization header
      const res = await fetch("/api/user/data", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Redirect to login if the request fails
        const data = await res.json();
        setData(data);
      } else if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          const res = await fetch("/api/user/data", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            // Redirect to login if the request fails
            const data = await res.json();
            setData(data);
          } else {
            setError("An error occurred while fetching user data.");
            router.push("/"); // Redirect to login on error
          }
        }
      } else {
        setError("An error occurred while fetching user data.");
        router.push("/"); // Redirect to login on error
      }
    } catch (error) {
      setError("An error occurred while fetching user data.");
      router.push("/"); // Redirect to login on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-2xl">Loading...</h1>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-2xl">{error}</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-16 py-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 pt-2">
          Welcome {data?.user.username} to your creator studio
        </h1>
        {/* Additional content for the creator studio can go here */}
      </div>
    </Layout>
  );
};

export default Studio;

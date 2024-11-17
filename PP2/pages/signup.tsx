import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link"; // Import Link for navigation

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password, firstName, lastName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Signup failed.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      // Redirect to login page or another page after successful signup
      router.push("/login");
    } catch (err) {
      setError("An error occurred during signup.");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md dark:bg-[#191919]">
          <CardHeader>
            <CardTitle className="dark:text-gray-400">Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label className="dark:text-gray-400">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="dark:bg-[#2e2e2e] dark:border-[#3a3a3a] text-black dark:text-white"
                />
              </div>
              <div>
                <Label className="dark:text-gray-400">Username</Label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  required
                  className="dark:bg-[#2e2e2e] dark:border-[#3a3a3a] text-black dark:text-white"
                />
              </div>
              <div>
                <Label className="dark:text-gray-400">Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choose a password"
                  required
                  className="dark:bg-[#2e2e2e] dark:border-[#3a3a3a] text-black dark:text-white"
                />
              </div>
              <div>
                <Label className="dark:text-gray-400">First Name</Label>
                <Input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  required
                  className="dark:bg-[#2e2e2e] dark:border-[#3a3a3a] text-black dark:text-white"
                />
              </div>
              <div>
                <Label className="dark:text-gray-400">Last Name</Label>
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  required
                  className="dark:bg-[#2e2e2e] dark:border-[#3a3a3a] text-black dark:text-white"
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-4">
            <Button onClick={handleSignup} disabled={loading} className="w-full dark:bg-[#4a4a4a] dark:text-white">
              {loading ? "Signing up..." : "Sign Up"}
            </Button>

            {/* Login link placed below the signup button */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-500 hover:text-blue-400">
                  Login
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Signup;
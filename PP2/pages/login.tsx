import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Login failed.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      const { accessToken, refreshToken } = data;

      // Store tokens in local storage (or you could use cookies)
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Redirect to profile or another page after login
      router.push("/profile");
    } catch (err) {
      setError("An error occurred during login.");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md dark:bg-[#191919]">
          <CardHeader>
            <CardTitle className="dark:text-gray-400">Login</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <form onSubmit={handleLogin} className="space-y-4">
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
                <Label className="dark:text-gray-400">Password</Label>
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="dark:bg-[#2e2e2e] dark:border-[#3a3a3a] text-black dark:text-white"
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button onClick={handleLogin} disabled={loading} className="w-full dark:bg-[#4a4a4a] dark:text-white">
              {loading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
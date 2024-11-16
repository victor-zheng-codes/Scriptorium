import { useTheme } from "next-themes"; // Import next-themes hook
import dynamic from "next/dynamic"; // For dynamic import

// Dynamically import icons to avoid SSR mismatch
const Moon = dynamic(() => import("lucide-react").then((mod) => mod.Moon), { ssr: false });
const Sun = dynamic(() => import("lucide-react").then((mod) => mod.Sun), { ssr: false });

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {theme === "dark" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
}
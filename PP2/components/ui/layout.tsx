import { ReactNode } from "react"; // Import ReactNode for typing children
import { ThemeProvider } from "next-themes"; // Ensure ThemeProvider is imported correctly
import Navbar from "./navbar"; // Assuming Navbar is correctly imported

interface LayoutProps {
  children: ReactNode; // Explicitly type children as ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Navbar />

      {/* Ensure the content below the navbar does not shift */}
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </main>
    </ThemeProvider>
  );
};

export default Layout;
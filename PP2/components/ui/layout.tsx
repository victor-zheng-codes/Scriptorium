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
      {/* Make the layout a flex container */}
      <main className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col">
        <Navbar />
        {/* Ensure the children container grows to fill the remaining space */}
        <div className="flex-grow flex flex-col">{children}</div>
      </main>
    </ThemeProvider>
  );
};

export default Layout;
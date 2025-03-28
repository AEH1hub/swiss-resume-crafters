
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  className,
  fullWidth = false 
}) => {
  const [mounted, setMounted] = useState(false);
  
  // Prevent layout shifts by waiting for component to mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={cn(
        "flex-1 transition-all",
        mounted ? "animate-fade-in" : "opacity-0",
        fullWidth ? "w-full" : "container mx-auto px-4 md:px-6",
        className
      )}>
        <div className="min-h-[200px]">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

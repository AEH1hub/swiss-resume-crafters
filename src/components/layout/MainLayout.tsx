
import React from "react";
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
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={cn(
        "flex-1 transition-all animate-fade-in",
        fullWidth ? "w-full" : "container mx-auto px-4 md:px-6",
        className
      )}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

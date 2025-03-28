
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "../mode-toggle";
import { Menu, X, LogOut, User, FileText, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setIsLoading(false);
    };

    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully"
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log out",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateResume = () => {
    if (session) {
      navigate("/templates");
    } else {
      navigate("/signup");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-bold transition-all hover:opacity-80"
            >
              <span className="text-swiss-red">SVWISS</span>
              <span className="bg-swiss-red text-white px-1">RESUME</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-swiss-red ${
                location.pathname === "/" ? "text-swiss-red" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/templates"
              className={`text-sm font-medium transition-colors hover:text-swiss-red ${
                location.pathname === "/templates" ? "text-swiss-red" : ""
              }`}
            >
              Templates
            </Link>
            <Link
              to="/pricing"
              className={`text-sm font-medium transition-colors hover:text-swiss-red ${
                location.pathname === "/pricing" ? "text-swiss-red" : ""
              }`}
            >
              Pricing
            </Link>
            <Link
              to="/jobs"
              className={`text-sm font-medium transition-colors hover:text-swiss-red ${
                location.pathname === "/jobs" ? "text-swiss-red" : ""
              }`}
            >
              <Briefcase className="inline-block mr-1 h-4 w-4" />
              Jobs
            </Link>
            
            <Button 
              onClick={handleCreateResume}
              variant="outline" 
              size="sm"
              className="flex items-center"
            >
              <FileText className="mr-2 h-4 w-4" />
              Create Resume
            </Button>
            
            <ModeToggle />
            
            {isLoading ? (
              <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ) : session && session.user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-swiss-red hover:bg-swiss-red/90">Sign up</Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-4 py-5 space-y-4 bg-white dark:bg-gray-900 shadow-lg border-t">
            <Link
              to="/"
              className={`block py-2 text-sm font-medium transition-colors hover:text-swiss-red ${
                location.pathname === "/" ? "text-swiss-red" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/templates"
              className={`block py-2 text-sm font-medium transition-colors hover:text-swiss-red ${
                location.pathname === "/templates" ? "text-swiss-red" : ""
              }`}
            >
              Templates
            </Link>
            <Link
              to="/pricing"
              className={`block py-2 text-sm font-medium transition-colors hover:text-swiss-red ${
                location.pathname === "/pricing" ? "text-swiss-red" : ""
              }`}
            >
              Pricing
            </Link>
            <Link
              to="/jobs"
              className={`block py-2 text-sm font-medium transition-colors hover:text-swiss-red ${
                location.pathname === "/jobs" ? "text-swiss-red" : ""
              }`}
            >
              <Briefcase className="inline-block mr-1 h-4 w-4" />
              Jobs
            </Link>
            
            <Button 
              onClick={handleCreateResume}
              className="w-full justify-start my-2"
              variant="outline"
              size="sm"
            >
              <FileText className="mr-2 h-4 w-4" />
              Create Resume
            </Button>
            
            {isLoading ? (
              <div className="h-9 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ) : session && session.user ? (
              <div className="pt-2 flex flex-col space-y-2">
                <Link to="/dashboard" className="w-full">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  className="w-full justify-start" 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            ) : (
              <div className="pt-2 flex flex-col space-y-2">
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="w-full" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup" className="w-full">
                  <Button className="w-full bg-swiss-red hover:bg-swiss-red/90" size="sm">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

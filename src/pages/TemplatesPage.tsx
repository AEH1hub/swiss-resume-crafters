
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ResumeTemplateCard from "@/components/ResumeTemplateCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  is_premium: boolean;
  tier: "free" | "professional" | "enterprise";
}

const TemplatesPage = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data, error } = await supabase
          .from('templates')
          .select('*')
          .order('name');

        if (error) {
          throw error;
        }

        // Create improved template data with better descriptions and assigned tiers
        const improvedTemplates: Template[] = [
          {
            id: "modern",
            name: "Modern",
            description: "A clean and contemporary resume that balances professionalism with modern design elements",
            thumbnail: "/placeholder.svg",
            is_premium: false,
            tier: "free"
          },
          {
            id: "professional",
            name: "Professional",
            description: "Elegant design for corporate settings with clear section organization and readability",
            thumbnail: "/placeholder.svg",
            is_premium: true,
            tier: "professional"
          },
          {
            id: "creative",
            name: "Creative",
            description: "Bold, distinctive layout for creative industries to showcase your personality and talents",
            thumbnail: "/placeholder.svg",
            is_premium: true,
            tier: "professional"
          },
          {
            id: "executive",
            name: "Executive",
            description: "Premium design for senior professionals with sophisticated styling and strategic content layout",
            thumbnail: "/placeholder.svg",
            is_premium: true,
            tier: "enterprise"
          },
          {
            id: "simple",
            name: "Simple",
            description: "Minimalist design with focus on content, perfect for traditional industries and academia",
            thumbnail: "/placeholder.svg",
            is_premium: false,
            tier: "free"
          },
          {
            id: "helvetica",
            name: "Helvetica",
            description: "Swiss-inspired clean design with the iconic Helvetica font for a truly timeless look",
            thumbnail: "/placeholder.svg",
            is_premium: false,
            tier: "free"
          },
          {
            id: "zurich",
            name: "Zürich",
            description: "Inspired by Swiss precision, featuring geometric elements and clear typography",
            thumbnail: "/placeholder.svg",
            is_premium: true,
            tier: "professional"
          },
          {
            id: "amadou",
            name: "Amadou Style",
            description: "Colorful, modern design with skill section visualization and unique header elements",
            thumbnail: "/lovable-uploads/d881cc78-f182-4e68-a8c1-20488d0b91fe.png",
            is_premium: false,
            tier: "free"
          },
          {
            id: "amadou-pro",
            name: "Amadou Professional",
            description: "Enhanced version of Amadou Style with premium layout and advanced skill visualization",
            thumbnail: "/lovable-uploads/d881cc78-f182-4e68-a8c1-20488d0b91fe.png",
            is_premium: true,
            tier: "professional"
          },
          {
            id: "amadou-enterprise",
            name: "Amadou Executive",
            description: "Top-tier Amadou template with exclusive design elements for executive positions",
            thumbnail: "/lovable-uploads/d881cc78-f182-4e68-a8c1-20488d0b91fe.png",
            is_premium: true,
            tier: "enterprise"
          }
        ];
        
        setTemplates(improvedTemplates);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch templates",
          variant: "destructive",
        });
        
        // Fallback to our improved templates if the database fetch fails
        const fallbackTemplates: Template[] = [
          {
            id: "modern",
            name: "Modern",
            description: "A clean and contemporary resume that balances professionalism with modern design elements",
            thumbnail: "/placeholder.svg",
            is_premium: false,
            tier: "free"
          },
          {
            id: "professional",
            name: "Professional",
            description: "Elegant design for corporate settings with clear section organization and readability",
            thumbnail: "/placeholder.svg",
            is_premium: true,
            tier: "professional"
          },
          {
            id: "amadou",
            name: "Amadou Style",
            description: "Colorful, modern design with skill section visualization and unique header elements",
            thumbnail: "/lovable-uploads/d881cc78-f182-4e68-a8c1-20488d0b91fe.png",
            is_premium: false,
            tier: "free"
          }
        ];
        
        setTemplates(fallbackTemplates);
      } finally {
        setIsLoading(false);
      }
    };

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      
      // Debug auth state
      console.log("Current auth session:", data.session ? "Logged in" : "Not logged in");
    };

    fetchTemplates();
    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [toast]);

  const handleTemplateSelect = (template: Template) => {
    if (template.is_premium && (!session || !session.user)) {
      toast({
        title: "Premium Template",
        description: "Please sign up or log in to use premium templates",
      });
      navigate("/login");
      return;
    }

    if (template.is_premium) {
      // In a real app, you'd check if the user has a premium subscription here
      // For now, let's assume all logged-in users can access premium templates
      navigate(`/editor?template=${template.name}`);
    } else {
      navigate(`/editor?template=${template.name}`);
    }
    
    // Log selection for debugging
    console.log(`Selected template: ${template.name} (tier: ${template.tier})`);
  };
  
  const filteredTemplates = selectedTier === "all" 
    ? templates 
    : templates.filter(template => template.tier === selectedTier);

  return (
    <MainLayout>
      <div className="py-12 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Resume Templates</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose from our collection of professionally designed templates to create your perfect resume.
          </p>
        </div>

        <div className="container mx-auto px-4">
          <Tabs 
            defaultValue="all" 
            value={selectedTier}
            onValueChange={setSelectedTier}
            className="mb-8"
          >
            <TabsList className="mx-auto flex justify-center">
              <TabsTrigger value="all">All Templates</TabsTrigger>
              <TabsTrigger value="free">Free</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-swiss-red" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="flex">
                  <ResumeTemplateCard
                    name={template.name}
                    description={template.description}
                    isPremium={template.is_premium}
                    tier={template.tier}
                    onClick={() => handleTemplateSelect(template)}
                    className="w-full h-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default TemplatesPage;

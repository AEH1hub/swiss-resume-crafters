
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  is_premium: boolean;
}

const TemplatesPage = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
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

        setTemplates(data || []);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch templates",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    fetchTemplates();
    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
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
      return;
    }

    if (template.is_premium) {
      // In a real app, you'd check if the user has a premium subscription here
      // For now, let's assume all logged-in users can access premium templates
      navigate(`/editor?template=${template.name}`);
    } else {
      navigate(`/editor?template=${template.name}`);
    }
  };

  return (
    <MainLayout>
      <div className="py-12 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Resume Templates</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose from our collection of professionally designed templates to create your perfect resume.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-swiss-red" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="overflow-hidden group">
                <div className="relative">
                  <img 
                    src={template.thumbnail || "/placeholder.svg"} 
                    alt={template.name} 
                    className="w-full h-56 object-cover"
                  />
                  {template.is_premium && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                      <Lock className="w-3 h-3 mr-1" />
                      Premium
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleTemplateSelect(template)}
                  >
                    Use This Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TemplatesPage;

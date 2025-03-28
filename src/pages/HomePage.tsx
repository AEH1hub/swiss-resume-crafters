import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ChevronRight, FileText, Sparkles, Users } from "lucide-react";
import ResumeTemplateCard from "@/components/ResumeTemplateCard";
import { supabase } from "@/integrations/supabase/client";

const features = [
  {
    title: "Professional Templates",
    description: "Access premium Swiss-style resume templates designed by HR professionals",
    icon: FileText
  },
  {
    title: "Smart Editor",
    description: "Intuitive drag-and-drop interface with real-time preview",
    icon: Sparkles
  },
  {
    title: "Career Insights",
    description: "Get tailored feedback to improve your resume's effectiveness",
    icon: Users
  }
];

const pricingTiers = [
  {
    name: "Free",
    price: "0",
    features: [
      "1 resume template",
      "Basic editing tools",
      "PDF export",
      "7-day access"
    ],
    cta: "Start Free",
    popular: false
  },
  {
    name: "Professional",
    price: "15",
    features: [
      "10+ premium templates",
      "Advanced editing tools",
      "Multiple export formats",
      "Cloud storage",
      "Remove branding"
    ],
    cta: "Start Pro",
    popular: true
  },
  {
    name: "Enterprise",
    price: "39",
    features: [
      "All Professional features",
      "Custom templates",
      "Priority support",
      "Team management",
      "Advanced analytics"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

const HomePage = () => {
  const [activeTemplate, setActiveTemplate] = useState(0);
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTemplate((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    if (session && session.user) {
      navigate('/editor');
    } else {
      navigate('/signup');
    }
  };

  return (
    <MainLayout fullWidth>
      <section className="relative hero-pattern overflow-hidden pt-16 md:pt-24 pb-12 md:pb-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-20">
            <div className="inline-block bg-swiss-red/10 text-swiss-red px-4 py-1.5 rounded-full text-sm font-medium mb-6 animate-fade-in">
              Perfect for Swiss professionals & job seekers
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              <span className="text-swiss-red">SVWISS RESUME</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 animate-fade-in">
              "Our goal is to provide every worker—regardless of industry—with an easy-to-use, professional resume building tool."
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button size="lg" className="w-full sm:w-auto" onClick={handleGetStarted}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Link to="/templates">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Templates
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
              <ResumeTemplateCard 
                name="Modern" 
                isActive={activeTemplate === 0} 
                onClick={() => setActiveTemplate(0)} 
              />
              <ResumeTemplateCard 
                name="Professional" 
                isPremium={true}
                isActive={activeTemplate === 1} 
                onClick={() => setActiveTemplate(1)} 
              />
              <ResumeTemplateCard 
                name="Amadou Style" 
                isActive={activeTemplate === 2} 
                onClick={() => setActiveTemplate(2)} 
              />
            </div>
            
            <div className="mt-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Featured Resume Example</h2>
              <div className="max-w-2xl mx-auto border rounded-lg shadow-lg overflow-hidden">
                <img 
                  src="/lovable-uploads/d881cc78-f182-4e68-a8c1-20488d0b91fe.png"
                  alt="Amadou Resume Sample" 
                  className="w-full object-contain" 
                />
              </div>
              <div className="mt-4">
                <Link to="/templates">
                  <Button className="mt-4 bg-swiss-red hover:bg-swiss-red/90">
                    Create Your Resume Like This
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Features designed for <span className="highlight-underline">success</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Everything you need to create a professional resume that gets noticed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 rounded-full bg-swiss-red/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-swiss-red" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              How it works
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Three simple steps to your perfect resume
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              {
                step: "1",
                title: "Choose a template",
                description: "Browse our collection of professional Swiss-style resume templates"
              },
              {
                step: "2",
                title: "Add your content",
                description: "Fill in your details with our easy-to-use editor and real-time guidance"
              },
              {
                step: "3",
                title: "Download & share",
                description: "Export your resume in multiple formats or share online with a custom link"
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="relative flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-swiss-red text-white flex items-center justify-center text-xl font-bold mb-6">
                  {item.step}
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-6 left-[calc(100%_-_24px)] w-[calc(100%_-_48px)] h-[2px] bg-gray-200 dark:bg-gray-700"></div>
                )}
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Simple, transparent pricing
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Choose the plan that works for your career goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <div 
                key={index} 
                className={`rounded-xl overflow-hidden border ${
                  tier.popular ? 'border-swiss-red shadow-lg relative' : 'border-gray-200 dark:border-gray-700'
                } bg-white dark:bg-gray-800 transition-all hover:shadow-lg`}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-0 bg-swiss-red text-white px-3 py-1 text-xs font-medium">
                    Most Popular
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-bold">CHF {tier.price}</span>
                    {tier.price !== "0" && <span className="text-gray-500 dark:text-gray-400 ml-2">/month</span>}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-swiss-red flex-shrink-0 mr-2" />
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    onClick={handleGetStarted}
                    className={`w-full ${tier.popular ? 'bg-swiss-red hover:bg-swiss-red/90' : 'bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
                    variant={tier.popular ? "default" : "outline"}
                  >
                    {tier.cta}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-swiss-red rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to advance your career?
                </h2>
                <p className="text-white/90 text-lg mb-8">
                  Join thousands of Swiss professionals who have improved their job prospects with our platform.
                </p>
                <Button 
                  size="lg" 
                  className="bg-white text-swiss-red hover:bg-white/90"
                  onClick={handleGetStarted}
                >
                  Get Started Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white"></div>
              <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-white"></div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;

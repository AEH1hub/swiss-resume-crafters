
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ChevronRight, FileText, Sparkles, Users } from "lucide-react";
import { useState, useEffect } from "react";

// Resume template mockup image component
const ResumeTemplateImage = ({ className = "" }: { className?: string }) => (
  <div className={`rounded-lg shadow-lg overflow-hidden ${className}`}>
    <div className="bg-white dark:bg-gray-800 h-full w-full p-4 flex flex-col">
      <div className="flex justify-between items-start mb-5">
        <div className="space-y-2">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-3 w-24 bg-gray-100 dark:bg-gray-600 rounded"></div>
        </div>
        <div className="h-12 w-12 rounded-full bg-swiss-red"></div>
      </div>
      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <div className="h-4 w-20 bg-swiss-red rounded"></div>
          <div className="h-3 w-full bg-gray-100 dark:bg-gray-600 rounded"></div>
          <div className="h-3 w-full bg-gray-100 dark:bg-gray-600 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-20 bg-swiss-red rounded"></div>
          <div className="h-3 w-full bg-gray-100 dark:bg-gray-600 rounded"></div>
          <div className="h-3 w-4/5 bg-gray-100 dark:bg-gray-600 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-20 bg-swiss-red rounded"></div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded"></div>
            <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded"></div>
            <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded"></div>
            <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

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
  
  // Auto-rotate templates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTemplate((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MainLayout fullWidth>
      {/* Hero Section */}
      <section className="relative hero-pattern overflow-hidden pt-16 md:pt-24 pb-12 md:pb-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-20">
            <div className="inline-block bg-swiss-red/10 text-swiss-red px-4 py-1.5 rounded-full text-sm font-medium mb-6 animate-fade-in">
              Perfect for Swiss professionals & job seekers
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              Craft your perfect resume with
              <span className="text-swiss-red"> Swiss</span> precision
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 animate-fade-in">
              Professional templates, intuitive editor, and expert guidance to help you stand out in the Swiss job market.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/templates">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Templates
                </Button>
              </Link>
            </div>
          </div>

          {/* Resume Templates Display */}
          <div className="relative mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
              <ResumeTemplateImage className={`transition-all duration-500 transform ${activeTemplate === 0 ? 'scale-105 z-10 shadow-xl' : 'scale-95 opacity-80'}`} />
              <ResumeTemplateImage className={`transition-all duration-500 transform ${activeTemplate === 1 ? 'scale-105 z-10 shadow-xl' : 'scale-95 opacity-80'}`} />
              <ResumeTemplateImage className={`transition-all duration-500 transform ${activeTemplate === 2 ? 'scale-105 z-10 shadow-xl' : 'scale-95 opacity-80'}`} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* How It Works */}
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

      {/* Pricing Preview */}
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
                  <Link to="/signup">
                    <Button 
                      className={`w-full ${tier.popular ? '' : 'bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
                      variant={tier.popular ? "default" : "outline"}
                    >
                      {tier.cta}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
                <Link to="/signup">
                  <Button size="lg" className="bg-white text-swiss-red hover:bg-white/90">
                    Get Started Today
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            {/* Background patterns */}
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

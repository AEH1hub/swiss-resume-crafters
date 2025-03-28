
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  X, 
  Package, 
  Briefcase, 
  LucideIcon, 
  Users, 
  FileText, 
  Download, 
  Clock, 
  CheckCircle2, 
  Shield 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PricingFeature {
  name: string;
  tiers: Record<string, boolean | string>;
  icon?: LucideIcon;
}

const PricingPage = () => {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [billingInterval, setBillingInterval] = useState<"monthly" | "annual">("monthly");
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
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

  const handleSelectPlan = (planId: string) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to subscribe to a plan",
      });
      navigate("/login");
      return;
    }

    // For now, just navigate to templates
    navigate("/templates");
    
    // In a real implementation, you would:
    // 1. Redirect to a Stripe checkout page
    // 2. Process the payment
    // 3. Update the user's subscription status in the database
  };

  const features: PricingFeature[] = [
    {
      name: "Resume Templates",
      tiers: {
        free: "3 templates",
        pro: "15+ templates",
        enterprise: "All templates + custom designs"
      },
      icon: FileText
    },
    {
      name: "Resume Downloads",
      tiers: {
        free: "2 per month",
        pro: "Unlimited",
        enterprise: "Unlimited"
      },
      icon: Download
    },
    {
      name: "Access Period",
      tiers: {
        free: "7 days",
        pro: "Unlimited",
        enterprise: "Unlimited"
      },
      icon: Clock
    },
    {
      name: "Resume Versions",
      tiers: {
        free: "1 version",
        pro: "Multiple versions",
        enterprise: "Unlimited versions"
      },
      icon: FileText
    },
    {
      name: "Photo Option",
      tiers: {
        free: true,
        pro: true,
        enterprise: true
      },
      icon: CheckCircle2
    },
    {
      name: "Advanced Formatting",
      tiers: {
        free: false,
        pro: true,
        enterprise: true
      },
      icon: CheckCircle2
    },
    {
      name: "Remove Branding",
      tiers: {
        free: false,
        pro: true,
        enterprise: true
      },
      icon: Shield
    },
    {
      name: "Team Accounts",
      tiers: {
        free: false,
        pro: false,
        enterprise: "Up to 5 users"
      },
      icon: Users
    }
  ];

  const pricingTiers = [
    {
      id: "free",
      name: "Free",
      description: "Essential tools for your job search",
      price: { monthly: "0", annual: "0" },
      buttonText: "Get Started",
      buttonVariant: "outline",
    },
    {
      id: "pro",
      name: "Professional",
      description: "Everything you need for professional resumes",
      price: { monthly: "2.99", annual: "29.99" },
      buttonText: "Subscribe",
      buttonVariant: "default",
      mostPopular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Advanced features for teams and organizations",
      price: { monthly: "4.99", annual: "49.99" },
      buttonText: "Contact Sales",
      buttonVariant: "outline",
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Pricing Plans
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Choose the perfect plan for your resume building needs
          </p>
          
          <div className="flex justify-center items-center space-x-3 mb-8">
            <Label 
              htmlFor="billing-switch"
              className={billingInterval === "monthly" ? "font-semibold" : "text-gray-500 dark:text-gray-400"}
            >
              Monthly
            </Label>
            <Switch 
              id="billing-switch" 
              checked={billingInterval === "annual"}
              onCheckedChange={(checked) => setBillingInterval(checked ? "annual" : "monthly")}
            />
            <Label 
              htmlFor="billing-switch"
              className={billingInterval === "annual" ? "font-semibold" : "text-gray-500 dark:text-gray-400"}
            >
              Yearly
              <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                Save 20%
              </Badge>
            </Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier) => (
              <div
                key={tier.id}
                className={`rounded-xl overflow-hidden border ${
                  tier.mostPopular
                    ? "border-swiss-red shadow-lg relative"
                    : "border-gray-200 dark:border-gray-700"
                } bg-white dark:bg-gray-800 transition-all hover:shadow-lg flex flex-col`}
              >
                {tier.mostPopular && (
                  <div className="absolute top-0 right-0 bg-swiss-red text-white px-3 py-1 text-xs font-medium">
                    Most Popular
                  </div>
                )}
                <div className="p-6 flex-grow">
                  <div className="flex items-center gap-3">
                    {tier.id === "free" && <Package className="h-6 w-6 text-gray-400" />}
                    {tier.id === "pro" && <Briefcase className="h-6 w-6 text-swiss-red" />}
                    {tier.id === "enterprise" && <Users className="h-6 w-6 text-blue-500" />}
                    <h3 className="text-xl font-semibold">{tier.name}</h3>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mt-2 mb-4">
                    {tier.description}
                  </p>
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-bold">
                      {tier.price[billingInterval] === "0" 
                        ? "Free" 
                        : `CHF ${tier.price[billingInterval]}`}
                    </span>
                    {tier.price[billingInterval] !== "0" && (
                      <span className="text-gray-500 dark:text-gray-400 ml-2">
                        /{billingInterval === "monthly" ? "month" : "year"}
                      </span>
                    )}
                  </div>
                  <Button 
                    onClick={() => handleSelectPlan(tier.id)}
                    className={`w-full ${
                      tier.mostPopular 
                        ? "bg-swiss-red hover:bg-swiss-red/90" 
                        : ""
                    }`}
                    variant={tier.buttonVariant as any}
                  >
                    {tier.buttonText}
                  </Button>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                  <h4 className="text-sm font-semibold mb-3">WHAT'S INCLUDED</h4>
                  <ul className="space-y-3">
                    {features.map((feature) => {
                      const value = feature.tiers[tier.id];
                      return (
                        <li key={feature.name} className="flex items-start">
                          {value ? (
                            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                          ) : (
                            <X className="h-5 w-5 text-gray-400 flex-shrink-0 mr-2" />
                          )}
                          <span className="text-gray-600 dark:text-gray-300">
                            {typeof value === "string" ? `${feature.name}: ${value}` : feature.name}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto mt-16 bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">How does the free plan work?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our free plan allows you to create up to 3 different resumes using our basic templates.
                You can download up to 2 resumes per month and your account remains active for 7 days.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, you can upgrade, downgrade, or cancel your subscription at any time. Changes will take
                effect at the end of your current billing cycle.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We offer a 7-day money-back guarantee for all paid plans. If you're not satisfied with our
                service, contact us within 7 days of your purchase for a full refund.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We accept all major credit cards, PayPal, and bank transfers for Swiss residents.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PricingPage;

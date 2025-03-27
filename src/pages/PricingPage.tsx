
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import { Check, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Pricing data
const pricingPlans = {
  monthly: [
    {
      id: "free",
      name: "Free",
      description: "For individuals trying out our platform",
      price: "0",
      features: [
        { text: "1 resume template", available: true },
        { text: "Basic editing tools", available: true },
        { text: "PDF export", available: true },
        { text: "7-day access", available: true },
        { text: "Resume watermark", available: false },
        { text: "Custom sections", available: false },
        { text: "Priority support", available: false },
      ],
      popular: false,
      cta: "Start Free",
      ctaLink: "/signup"
    },
    {
      id: "pro",
      name: "Professional",
      description: "For job seekers wanting to stand out",
      price: "15",
      features: [
        { text: "All Free features", available: true },
        { text: "10+ premium templates", available: true },
        { text: "Advanced editing tools", available: true },
        { text: "Multiple export formats", available: true },
        { text: "Remove watermark", available: true },
        { text: "Custom sections", available: true },
        { text: "Priority email support", available: true },
      ],
      popular: true,
      cta: "Start Pro",
      ctaLink: "/signup"
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For teams and organizations",
      price: "39",
      features: [
        { text: "All Professional features", available: true },
        { text: "Custom templates", available: true },
        { text: "Team management", available: true },
        { text: "Advanced analytics", available: true },
        { text: "API access", available: true },
        { text: "Dedicated account manager", available: true },
        { text: "24/7 phone support", available: true },
      ],
      popular: false,
      cta: "Contact Sales",
      ctaLink: "/contact"
    }
  ],
  yearly: [
    {
      id: "free",
      name: "Free",
      description: "For individuals trying out our platform",
      price: "0",
      features: [
        { text: "1 resume template", available: true },
        { text: "Basic editing tools", available: true },
        { text: "PDF export", available: true },
        { text: "7-day access", available: true },
        { text: "Resume watermark", available: false },
        { text: "Custom sections", available: false },
        { text: "Priority support", available: false },
      ],
      popular: false,
      cta: "Start Free",
      ctaLink: "/signup"
    },
    {
      id: "pro",
      name: "Professional",
      description: "For job seekers wanting to stand out",
      price: "150",
      priceNote: "12.50/mo, save 17%",
      features: [
        { text: "All Free features", available: true },
        { text: "10+ premium templates", available: true },
        { text: "Advanced editing tools", available: true },
        { text: "Multiple export formats", available: true },
        { text: "Remove watermark", available: true },
        { text: "Custom sections", available: true },
        { text: "Priority email support", available: true },
      ],
      popular: true,
      cta: "Start Pro",
      ctaLink: "/signup"
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For teams and organizations",
      price: "390",
      priceNote: "32.50/mo, save 17%",
      features: [
        { text: "All Professional features", available: true },
        { text: "Custom templates", available: true },
        { text: "Team management", available: true },
        { text: "Advanced analytics", available: true },
        { text: "API access", available: true },
        { text: "Dedicated account manager", available: true },
        { text: "24/7 phone support", available: true },
      ],
      popular: false,
      cta: "Contact Sales",
      ctaLink: "/contact"
    }
  ]
};

// FAQ data
const faqs = [
  {
    question: "Can I change plans later?",
    answer: "Yes, you can upgrade, downgrade, or cancel your plan at any time. If you upgrade, your new features will be available immediately. If you downgrade, the changes will apply at the end of your current billing cycle."
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 14-day money-back guarantee for all paid plans. If you're not satisfied with our service within the first 14 days, you can request a full refund, no questions asked."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), as well as PayPal and TWINT for Swiss customers."
  },
  {
    question: "Can I use Swiss Resume for my company?",
    answer: "Absolutely! Our Enterprise plan is designed specifically for teams and organizations that need to create multiple resumes. It includes features like team management, advanced analytics, and dedicated support."
  },
  {
    question: "How many resumes can I create?",
    answer: "On the Free plan, you can create 1 resume. The Professional plan allows unlimited resumes, while the Enterprise plan adds team management capabilities for multiple users."
  },
  {
    question: "What happens when my subscription ends?",
    answer: "When your subscription ends, your account will revert to the Free plan. You'll still have access to your resumes, but premium features will be disabled. You can download or export your resumes before your subscription ends to ensure you have copies."
  }
];

const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  return (
    <MainLayout>
      <div className="py-12 md:py-24">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Choose the right plan for your career
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            All plans include a free 7-day trial to test the full suite of features
          </p>
          <Tabs 
            defaultValue="monthly" 
            value={billingPeriod}
            onValueChange={(value) => setBillingPeriod(value as "monthly" | "yearly")}
            className="inline-flex mx-auto"
          >
            <TabsList className="grid w-[300px] grid-cols-2">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">
                Yearly
                <span className="ml-2 bg-swiss-red text-white text-xs px-2 py-0.5 rounded-full">
                  Save 17%
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {pricingPlans[billingPeriod].map((plan) => (
            <Card 
              key={plan.id}
              className={`relative flex flex-col h-full transition-all ${
                plan.popular ? 'border-swiss-red shadow-lg scale-105 z-10' : 'border-gray-200 dark:border-gray-800'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-swiss-red text-white px-4 py-1 text-xs font-medium rounded-bl-lg rounded-tr-lg">
                  Most Popular
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {plan.description}
                </p>
              </CardHeader>
              
              <CardContent className="flex-1">
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">CHF {plan.price}</span>
                  {plan.price !== "0" && (
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      {billingPeriod === "monthly" ? "/month" : "/year"}
                    </span>
                  )}
                </div>
                
                {plan.priceNote && (
                  <p className="text-sm text-swiss-red mb-6">
                    {plan.priceNote}
                  </p>
                )}
                
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mt-0.5">
                        {feature.available ? (
                          <Check className="h-5 w-5 text-swiss-red flex-shrink-0" />
                        ) : (
                          <div className="h-5 w-5 flex items-center justify-center flex-shrink-0">
                            <div className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                          </div>
                        )}
                      </div>
                      <span className={`ml-3 ${feature.available ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="mt-auto">
                <Link to={plan.ctaLink} className="w-full">
                  <Button 
                    className={`w-full ${plan.popular ? '' : 'bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* Features Comparison */}
        <div className="mt-24 max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Compare features
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-4 px-4 font-medium">Feature</th>
                  <th className="text-center py-4 px-4 font-medium">Free</th>
                  <th className="text-center py-4 px-4 font-medium bg-gray-50 dark:bg-gray-800">Professional</th>
                  <th className="text-center py-4 px-4 font-medium">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Number of resumes", free: "1", pro: "Unlimited", enterprise: "Unlimited" },
                  { feature: "Templates", free: "1", pro: "10+", enterprise: "Custom" },
                  { feature: "PDF export", free: "✓", pro: "✓", enterprise: "✓" },
                  { feature: "DOCX export", free: "—", pro: "✓", enterprise: "✓" },
                  { feature: "HTML export", free: "—", pro: "✓", enterprise: "✓" },
                  { feature: "Resume watermark", free: "✓", pro: "—", enterprise: "—" },
                  { feature: "Custom sections", free: "—", pro: "✓", enterprise: "✓" },
                  { feature: "AI suggestions", free: "—", pro: "Basic", enterprise: "Advanced" },
                  { feature: "Team management", free: "—", pro: "—", enterprise: "✓" },
                  { feature: "Analytics", free: "—", pro: "Basic", enterprise: "Advanced" },
                  { feature: "Priority support", free: "—", pro: "Email", enterprise: "Dedicated" },
                ].map((row, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-4 px-4 text-sm flex items-center">
                      {row.feature}
                      {["AI suggestions", "Analytics"].includes(row.feature) && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="ml-1.5 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                                <HelpCircle className="h-4 w-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {row.feature === "AI suggestions" 
                                ? "Our AI helps improve your resume with content suggestions and formatting tips." 
                                : "Track resume views, downloads, and other performance metrics."}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </td>
                    <td className="text-center py-4 px-4 text-sm">
                      {row.free === "✓" ? (
                        <Check className="h-5 w-5 text-swiss-red mx-auto" />
                      ) : row.free === "—" ? (
                        <div className="h-5 w-5 flex items-center justify-center mx-auto">
                          <div className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                        </div>
                      ) : (
                        row.free
                      )}
                    </td>
                    <td className="text-center py-4 px-4 text-sm bg-gray-50 dark:bg-gray-800">
                      {row.pro === "✓" ? (
                        <Check className="h-5 w-5 text-swiss-red mx-auto" />
                      ) : row.pro === "—" ? (
                        <div className="h-5 w-5 flex items-center justify-center mx-auto">
                          <div className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                        </div>
                      ) : (
                        row.pro
                      )}
                    </td>
                    <td className="text-center py-4 px-4 text-sm">
                      {row.enterprise === "✓" ? (
                        <Check className="h-5 w-5 text-swiss-red mx-auto" />
                      ) : row.enterprise === "—" ? (
                        <div className="h-5 w-5 flex items-center justify-center mx-auto">
                          <div className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                        </div>
                      ) : (
                        row.enterprise
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* FAQs */}
        <div className="mt-24 max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Frequently asked questions
          </h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Still have questions? We're here to help.
            </p>
            <Link to="/contact">
              <Button variant="outline">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PricingPage;

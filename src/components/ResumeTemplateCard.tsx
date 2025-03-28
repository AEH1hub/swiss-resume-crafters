
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface ResumeTemplateCardProps {
  name: string;
  isPremium?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  description?: string;
  tier?: "free" | "professional" | "enterprise";
}

const ResumeTemplateCard = ({ 
  name, 
  isPremium = false, 
  isActive = false, 
  onClick,
  className = "",
  description = "",
  tier = "free"
}: ResumeTemplateCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPhoto, setShowPhoto] = useState(true);

  // Enhanced color schemes based on tier with more visual excitement
  const tierColors = {
    free: {
      badge: "bg-gray-500",
      accent: "bg-gray-400",
      hover: "shadow-gray-200",
      gradient: "from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800",
      dark: "bg-gray-700"
    },
    professional: {
      badge: "bg-swiss-red",
      accent: "bg-swiss-red",
      hover: "shadow-swiss-red/20",
      gradient: "from-swiss-red/10 to-swiss-red/30 dark:from-swiss-red/30 dark:to-swiss-red/40",
      dark: "bg-swiss-red/80"
    },
    enterprise: {
      badge: "bg-yellow-500",
      accent: "bg-yellow-500",
      hover: "shadow-yellow-200",
      gradient: "from-yellow-50 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-700/40",
      dark: "bg-yellow-700"
    }
  };

  // Added a new palette that will be used for Amadou style templates
  const amadouPalette = {
    free: {
      primary: "bg-blue-100 dark:bg-blue-900/30",
      secondary: "bg-blue-200 dark:bg-blue-800/40",
      accent: "bg-blue-500 dark:bg-blue-600"
    },
    professional: {
      primary: "bg-purple-100 dark:bg-purple-900/30",
      secondary: "bg-purple-200 dark:bg-purple-800/40",
      accent: "bg-purple-500 dark:bg-purple-600"
    },
    enterprise: {
      primary: "bg-amber-100 dark:bg-amber-900/30",
      secondary: "bg-amber-200 dark:bg-amber-800/40",
      accent: "bg-amber-500 dark:bg-amber-600"
    }
  };
  
  // Added a new palette for international resume styles
  const internationalPalette = {
    free: {
      primary: "bg-teal-100 dark:bg-teal-900/30",
      secondary: "bg-teal-200 dark:bg-teal-800/40",
      accent: "bg-teal-500 dark:bg-teal-600",
      header: "bg-gradient-to-r from-teal-400 to-cyan-400"
    },
    professional: {
      primary: "bg-fuchsia-100 dark:bg-fuchsia-900/30",
      secondary: "bg-fuchsia-200 dark:bg-fuchsia-800/40",
      accent: "bg-fuchsia-500 dark:bg-fuchsia-600",
      header: "bg-gradient-to-r from-violet-500 to-fuchsia-500"
    },
    enterprise: {
      primary: "bg-emerald-100 dark:bg-emerald-900/30",
      secondary: "bg-emerald-200 dark:bg-emerald-800/40",
      accent: "bg-emerald-500 dark:bg-emerald-600",
      header: "bg-gradient-to-r from-emerald-400 to-cyan-400"
    }
  };

  // Determine if this is Amadou style template
  const isAmadouStyle = name.toLowerCase().includes('amadou');
  
  // Determine if this is International style template
  const isInternationalStyle = name.toLowerCase().includes('international');
  
  // Choose the right color scheme based on template type
  const colors = tierColors[tier];
  const amadouColors = amadouPalette[tier];
  const internationalColors = internationalPalette[tier];

  return (
    <Card 
      className={`overflow-hidden cursor-pointer transition-all duration-300 ${
        isActive ? 'ring-2 ring-swiss-red shadow-lg scale-105' : 
        isHovered ? `shadow-lg ${colors.hover}` : 'hover:shadow-md'
      } ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        <div className="relative">
          {isPremium && (
            <Badge className={`absolute top-2 right-2 z-10 ${tier === 'professional' ? 'bg-swiss-red text-white hover:bg-swiss-red/90' : 'bg-yellow-500 text-black hover:bg-yellow-600'}`}>
              {tier === 'enterprise' ? 'Enterprise' : 'Premium'}
            </Badge>
          )}
          
          {isInternationalStyle ? (
            /* International Style Template Preview */
            <div className={`bg-white dark:bg-gray-800 h-full w-full p-6 flex flex-col min-h-[200px] ${isHovered ? 'transform transition-transform duration-300 scale-[1.02]' : ''}`}>
              <div className={`w-full ${internationalColors.header} rounded-t-lg p-4`}>
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="h-5 w-32 bg-white/80 dark:bg-white/70 rounded"></div>
                    <div className="h-3 w-28 bg-white/60 dark:bg-white/50 rounded"></div>
                  </div>
                  {showPhoto && (
                    <div className={`h-14 w-14 rounded-full border-2 ${internationalColors.accent} border-white/90`}></div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-row h-full">
                <div className={`w-1/3 ${internationalColors.primary} p-3 space-y-3`}>
                  <div className={`h-4 w-full ${internationalColors.accent} rounded mb-2`}></div>
                  <div className="space-y-1">
                    <div className="h-2 bg-white/70 dark:bg-white/30 rounded"></div>
                    <div className="h-2 bg-white/70 dark:bg-white/30 rounded"></div>
                  </div>
                  
                  <div className={`h-4 w-full ${internationalColors.accent} rounded mb-2 mt-4`}></div>
                  <div className="flex flex-wrap gap-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`h-5 w-16 rounded-full ${internationalColors.secondary} flex items-center justify-center`}>
                        <div className="h-2 w-10 bg-white/50 dark:bg-white/20 rounded"></div>
                      </div>
                    ))}
                  </div>
                  
                  <div className={`h-4 w-full ${internationalColors.accent} rounded mb-2 mt-4`}></div>
                  <div className="flex flex-col gap-1">
                    {[1, 2].map(i => (
                      <div key={i} className="flex items-center space-x-1">
                        <div className={`h-3 w-3 rounded-full ${internationalColors.accent}`}></div>
                        <div className="h-2 w-16 bg-white/70 dark:bg-white/30 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="w-2/3 bg-white dark:bg-gray-800 p-3 space-y-3">
                  <div className={`h-4 w-20 ${internationalColors.accent} rounded mb-2`}></div>
                  <div className="space-y-1">
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded"></div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded"></div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded w-4/5"></div>
                  </div>
                  
                  <div className={`h-4 w-24 ${internationalColors.accent} rounded mb-2 mt-4`}></div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div>
                        <div className="h-3 w-24 bg-gray-200 dark:bg-gray-600 font-medium rounded"></div>
                        <div className="h-2 w-20 bg-gray-100 dark:bg-gray-700 rounded mt-1"></div>
                      </div>
                      <div className="h-2 w-16 bg-gray-100 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded"></div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded w-4/5"></div>
                  </div>
                  
                  <div className={`h-4 w-24 ${internationalColors.accent} rounded mb-2 mt-4`}></div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-3 w-28 bg-gray-200 dark:bg-gray-600 font-medium rounded"></div>
                      <div className="h-2 w-16 bg-gray-100 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium text-center">{name}</p>
                {description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">{description}</p>
                )}
              </div>
            </div>
          ) : isAmadouStyle ? (
            /* Amadou Style Template Preview */
            <div className={`bg-white dark:bg-gray-800 h-full w-full p-6 flex flex-col min-h-[200px] ${isHovered ? 'transform transition-transform duration-300 scale-[1.02]' : ''}`}>
              <div className={`w-full ${amadouColors.primary} rounded-t-lg p-4`}>
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="h-5 w-28 bg-white/50 dark:bg-white/20 rounded"></div>
                    <div className="h-3 w-20 bg-white/30 dark:bg-white/10 rounded"></div>
                  </div>
                  {showPhoto && (
                    <div className={`h-12 w-12 rounded-full border-2 ${amadouColors.accent} border-white/70`}></div>
                  )}
                </div>
              </div>
              
              <div className="flex-1 bg-white dark:bg-gray-800 p-4 space-y-3">
                <div className={`h-3 w-full ${amadouColors.secondary} rounded`}></div>
                <div className={`h-3 w-full ${amadouColors.secondary} rounded`}></div>
                
                <div className="grid grid-cols-1 gap-3 mt-3">
                  <div className="space-y-1">
                    <div className={`h-4 w-20 ${amadouColors.accent} rounded`}></div>
                    <div className="grid grid-cols-1 gap-1">
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded"></div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className={`h-4 w-20 ${amadouColors.accent} rounded`}></div>
                    <div className="grid grid-cols-1 gap-1">
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded"></div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className={`h-4 w-20 ${amadouColors.accent} rounded mb-2`}></div>
                  <div className="flex flex-wrap gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`h-6 w-12 rounded-full ${amadouColors.secondary} flex items-center justify-center`}>
                        <div className="h-2 w-6 bg-white/50 dark:bg-white/20 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium text-center">{name}</p>
                {description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">{description}</p>
                )}
              </div>
            </div>
          ) : (
            /* Standard Template Preview */
            <div className={`bg-white dark:bg-gray-800 h-full w-full p-6 flex flex-col min-h-[200px] ${isHovered ? 'transform transition-transform duration-300 scale-[1.02]' : ''}`}>
              <div className="flex justify-between items-start mb-5">
                <div className="space-y-2">
                  <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 w-24 bg-gray-100 dark:bg-gray-600 rounded"></div>
                </div>
                <div className={`h-12 w-12 rounded-full ${colors.accent}`}></div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className={`h-4 w-20 ${colors.accent} rounded`}></div>
                  <div className="h-3 w-full bg-gray-100 dark:bg-gray-600 rounded"></div>
                  <div className="h-3 w-full bg-gray-100 dark:bg-gray-600 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className={`h-4 w-20 ${colors.accent} rounded`}></div>
                  <div className="h-3 w-full bg-gray-100 dark:bg-gray-600 rounded"></div>
                  <div className="h-3 w-4/5 bg-gray-100 dark:bg-gray-600 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className={`h-4 w-20 ${colors.accent} rounded`}></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded"></div>
                    <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium text-center">{name}</p>
                {description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">{description}</p>
                )}
              </div>
            </div>
          )}

          {/* Overlay gradient that shows on hover */}
          {isHovered && (
            <div className={`absolute inset-0 bg-gradient-to-b ${colors.gradient} opacity-20 transition-opacity duration-300`}></div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeTemplateCard;

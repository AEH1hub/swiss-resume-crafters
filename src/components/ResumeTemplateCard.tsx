
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

  // Color schemes based on tier
  const tierColors = {
    free: {
      badge: "bg-gray-500",
      accent: "bg-gray-400",
      hover: "shadow-gray-200",
    },
    professional: {
      badge: "bg-swiss-red",
      accent: "bg-swiss-red",
      hover: "shadow-swiss-red/20",
    },
    enterprise: {
      badge: "bg-yellow-500",
      accent: "bg-yellow-500",
      hover: "shadow-yellow-200",
    }
  };

  const colors = tierColors[tier];

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
            <Badge className={`absolute top-2 right-2 ${tier === 'professional' ? 'bg-swiss-red text-white hover:bg-swiss-red/90' : 'bg-yellow-500 text-black hover:bg-yellow-600'}`}>
              {tier === 'enterprise' ? 'Enterprise' : 'Premium'}
            </Badge>
          )}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeTemplateCard;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Globe } from "lucide-react";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
];

export default function LanguageSelection() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLanguageSelect = (langCode) => {
    setSelectedLanguage(langCode);
  };

  const handleContinue = async () => {
    if (!selectedLanguage) return;
    
    setIsLoading(true);
    try {
      // Try to get current user or create account
      try {
        const user = await User.me();
        await User.updateMyUserData({ preferred_language: selectedLanguage });
      } catch (error) {
        // User not logged in, redirect to login
        await User.loginWithRedirect(window.location.origin + createPageUrl("Onboarding"));
        return;
      }
      
      navigate(createPageUrl("Onboarding"));
    } catch (error) {
      console.error("Error saving language:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 fade-in">
        {/* Header */}
        <div className="space-y-4">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Choose Your Language
          </h1>
          <p className="text-gray-600">
            Select your preferred language for the best experience
          </p>
        </div>

        {/* Language Options */}
        <div className="space-y-3">
          {languages.map((lang) => (
            <Card 
              key={lang.code}
              className={`cursor-pointer transition-all duration-200 card-hover ${
                selectedLanguage === lang.code 
                  ? 'ring-2 ring-orange-500 bg-orange-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleLanguageSelect(lang.code)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="text-lg font-medium text-gray-900">
                      {lang.name}
                    </span>
                  </div>
                  {selectedLanguage === lang.code && (
                    <Check className="w-5 h-5 text-orange-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <div className="pt-4">
          <Button 
            onClick={handleContinue}
            disabled={!selectedLanguage || isLoading}
            className="btn-primary w-full h-14 text-lg font-semibold rounded-2xl shadow-lg disabled:opacity-50"
          >
            {isLoading ? "Setting up..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
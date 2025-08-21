import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, MessageCircle, FileText, Mic } from "lucide-react";

const onboardingSteps = [
  {
    icon: MessageCircle,
    title: "Ask Me Anything",
    description: "Type or speak your question naturally. No need to learn special commands - just ask like you would a friend.",
    visual: "💬"
  },
  {
    icon: FileText,
    title: "Show Me What You See",
    description: "Take a screenshot or upload a photo of your screen. I'll help you understand what you're looking at.",
    visual: "📱"
  },
  {
    icon: Mic,
    title: "Step-by-Step Guidance",
    description: "When you need detailed help, I'll guide you through each step with clear instructions and visuals.",
    visual: "✨"
  }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      await User.updateMyUserData({ onboarding_completed: true });
      navigate(createPageUrl("Home"));
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const step = onboardingSteps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 fade-in">
        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index <= currentStep ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
          <CardContent className="p-8 space-y-6">
            {/* Visual */}
            <div className="text-6xl">{step.visual}</div>
            
            {/* Icon */}
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <step.icon className="w-8 h-8 text-orange-500" />
            </div>

            {/* Title & Description */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">
                {step.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 h-12 px-6 rounded-2xl"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>

          <span className="text-sm text-gray-500">
            {currentStep + 1} of {onboardingSteps.length}
          </span>

          <Button
            onClick={handleNext}
            disabled={isLoading}
            className="btn-primary flex items-center space-x-2 h-12 px-6 rounded-2xl"
          >
            <span>
              {currentStep === onboardingSteps.length - 1 ? 
                (isLoading ? "Finishing..." : "Get Started") : 
                "Next"
              }
            </span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
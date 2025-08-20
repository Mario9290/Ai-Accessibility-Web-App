import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, RotateCw, Volume2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { GenerateImage } from "@/integrations/Core";

export default function TaskStep({ step, onNavigate, onRepeat, isFirstStep, isLastStep }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  useEffect(() => {
    const generate = async () => {
      if (step.visual_description) {
        setIsImageLoading(true);
        setImageUrl(null);
        try {
          // A more descriptive prompt for better, consistent images
          const prompt = `A clear, simple, minimalist illustration for a smartphone screen showing the action: "${step.visual_description}". Style: Duolingo inspired, friendly, simple icons, flat design, no text unless essential.`;
          const result = await GenerateImage({ prompt });
          setImageUrl(result.url);
        } catch (error) {
          console.error("Failed to generate image:", error);
          // Fallback to text if image generation fails
          setImageUrl(null);
        } finally {
          setIsImageLoading(false);
        }
      }
    };
    generate();
  }, [step.visual_description]);

  return (
    <div className="w-full max-w-md flex flex-col items-center space-y-8 fade-in">
      {/* Visual Aid */}
      <Card className="w-full h-64 bg-gray-50 border border-gray-200 rounded-3xl flex items-center justify-center shadow-inner overflow-hidden">
        <CardContent className="p-0 w-full h-full flex items-center justify-center">
          {isImageLoading ? (
            <div className="flex flex-col items-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p>Creating visual guide...</p>
            </div>
          ) : imageUrl ? (
            <img src={imageUrl} alt={step.visual_description} className="w-full h-full object-contain" />
          ) : (
            <p className="text-2xl text-gray-400 p-6">{step.visual_description || "Visual Aid"}</p>
          )}
        </CardContent>
      </Card>
      
      {/* Instruction */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 leading-tight">
          {step.instruction}
        </h2>
        
        <Button
          variant="outline"
          onClick={onRepeat}
          className="rounded-full flex items-center space-x-2"
        >
          <Volume2 className="w-4 h-4" />
          <span>Play Instruction</span>
        </Button>
      </div>

      {/* Navigation */}
      <div className="w-full flex justify-between items-center pt-8">
        <Button
          onClick={() => onNavigate("back")}
          disabled={isFirstStep}
          className="h-16 w-16 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        
        <Button
          onClick={onRepeat}
          className="h-14 w-14 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <RotateCw className="w-5 h-5" />
        </Button>
        
        <Button
          onClick={() => onNavigate("next")}
          className="h-16 w-16 rounded-full btn-primary"
        >
          <ArrowRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
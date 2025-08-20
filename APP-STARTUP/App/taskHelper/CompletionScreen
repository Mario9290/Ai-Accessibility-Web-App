import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Frown } from "lucide-react";

export default function CompletionScreen({ onFeedback }) {
  return (
    <div className="w-full max-w-md flex flex-col items-center space-y-8 fade-in">
      {/* Visual */}
      <Card className="w-full h-64 bg-green-50 border border-green-200 rounded-3xl flex items-center justify-center shadow-inner">
        <CardContent className="p-6 text-center">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-12 h-12 text-white" />
          </div>
        </CardContent>
      </Card>
      
      {/* Text */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 leading-tight">
          Great job!
        </h2>
        <p className="text-gray-600">
          Did this solve your problem? Your feedback helps me learn.
        </p>
      </div>
      
      {/* Feedback Buttons */}
      <div className="w-full flex flex-col space-y-3 pt-8">
        <Button
          onClick={() => onFeedback(true)}
          className="btn-primary h-16 rounded-2xl text-lg font-semibold"
        >
          <Check className="w-5 h-5 mr-2" />
          Yes, it worked!
        </Button>
        
        <Button
          onClick={() => onFeedback(false)}
          variant="outline"
          className="h-16 rounded-2xl text-lg font-semibold"
        >
          <Frown className="w-5 h-5 mr-2" />
          No, I need more help
        </Button>
      </div>
    </div>
  );
}
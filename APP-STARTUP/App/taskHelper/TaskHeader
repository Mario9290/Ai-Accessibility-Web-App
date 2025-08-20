import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function TaskHeader({ title, currentStep, totalSteps, onClose, isCompletion }) {
  const progressValue = isCompletion ? 100 : (currentStep / totalSteps) * 100;

  return (
    <div className="bg-white shadow-sm p-4 w-full">
      <div className="flex items-center space-x-4 max-w-md mx-auto">
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900 truncate">
            {title}
          </h1>
          {!isCompletion && (
            <p className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
      <Progress value={progressValue} className="mt-2 h-1 bg-orange-100 [&>div]:bg-orange-500" />
    </div>
  );
}
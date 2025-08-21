import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { SavedTask } from "@/entities/SavedTask";
import { ChatMessage } from "@/entities/ChatMessage";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import TaskHeader from "../components/taskhelper/TaskHeader";
import TaskStep from "../components/taskhelper/TaskStep";
import CompletionScreen from "../components/taskhelper/CompletionScreen";

export default function TaskHelper() {
  const [task, setTask] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    initializeTask();
  }, [location.search]);

  const initializeTask = async () => {
    setIsLoading(true);
    setTask(null);
    setError(null);
    
    const urlParams = new URLSearchParams(location.search);
    const taskId = urlParams.get("taskId");
    const mode = urlParams.get("mode");

    try {
      if (taskId) {
        await loadTaskFromId(taskId);
      } else if (mode === "create") {
        await generateTaskFromChat();
      } else {
        throw new Error("Invalid task mode.");
      }
    } catch (e) {
      console.error(e);
      setError("Could not load the task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTaskFromId = async (taskId) => {
    const savedTask = await SavedTask.get(taskId);
    if (!savedTask) throw new Error("Task not found.");
    setTask(savedTask);
  };

  const generateTaskFromChat = async () => {
    const lastAiMessage = (await ChatMessage.filter({ is_user: false }, "-created_date", 1))[0];
    if (!lastAiMessage) throw new Error("No recent AI message found to create a task.");

    const taskSchema = SavedTask.schema();
    delete taskSchema.properties.completion_count; // Not needed for generation
    delete taskSchema.properties.language;

    const prompt = `Based on the following user request and AI response, generate a step-by-step guide for a non-tech-savvy user. The output must be a valid JSON object matching this schema: ${JSON.stringify(taskSchema)}.

AI Response: "${lastAiMessage.message}"

Keep instructions extremely simple. The title should be a clear action. Provide a simple visual_description and audio_text for each step.`;

    const generatedData = await InvokeLLM({
      prompt: prompt,
      response_json_schema: taskSchema,
    });

    if (generatedData) {
      setTask({ ...generatedData, isNew: true });
    } else {
      throw new Error("Failed to generate task from conversation.");
    }
  };
  
  const handleNavigation = (direction) => {
    if (direction === "next" && currentStep < task.steps.length) {
      setCurrentStep(currentStep + 1);
    } else if (direction === "back" && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRepeat = () => {
    const step = task.steps[currentStep];
    if (step && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(step.audio_text || step.instruction);
      speechSynthesis.speak(utterance);
    }
  };

  const handleClose = () => {
    navigate(createPageUrl("Home"));
  };
  
  const handleCompletion = async (success) => {
    if (success) {
      try {
        if (task.isNew) {
          await SavedTask.create(task);
        } else {
          await SavedTask.update(task.id, { completion_count: (task.completion_count || 1) + 1 });
        }
        
        const user = await User.me();
        await User.updateMyUserData({ total_tasks_completed: (user.total_tasks_completed || 0) + 1 });

        navigate(createPageUrl("SavedTasks"));
      } catch (e) {
        console.error("Error saving task completion:", e);
        navigate(createPageUrl("Home"));
      }
    } else {
      // Offer to go back to chat for more help
      navigate(createPageUrl("Chat") + "?prompt=I still need help with this task.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <p className="mt-4 text-gray-600">Preparing your guide...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white p-6 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => navigate(createPageUrl("Home"))}>Go to Home</Button>
      </div>
    );
  }
  
  const isCompletionStep = currentStep === task.steps.length;

  return (
    <div className="h-screen bg-white flex flex-col">
      <TaskHeader 
        title={task.title}
        currentStep={currentStep + 1}
        totalSteps={task.steps.length}
        onClose={handleClose}
        isCompletion={isCompletionStep}
      />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        {isCompletionStep ? (
          <CompletionScreen onFeedback={handleCompletion} />
        ) : (
          <TaskStep
            step={task.steps[currentStep]}
            onNavigate={handleNavigation}
            onRepeat={handleRepeat}
            isFirstStep={currentStep === 0}
            isLastStep={currentStep === task.steps.length - 1}
          />
        )}
      </div>
    </div>
  );
}
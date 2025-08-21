import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MessageCircle, Upload, ChevronRight, Sparkles } from "lucide-react";

const suggestedPrompts = [
  "How do I turn on Do Not Disturb?",
  "Help me send a photo to my family",
  "How do I make text bigger on my phone?",
  "Show me how to update my apps",
  "How do I connect to WiFi?",
  "Help me backup my photos"
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
    setGreeting(getGreeting());
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      navigate(createPageUrl("Welcome"));
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const handleInputMethod = (method) => {
    navigate(createPageUrl("Chat") + `?input=${method}`);
  };

  const handlePromptSelect = (prompt) => {
    navigate(createPageUrl("Chat") + `?prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-6">
      <div className="max-w-md mx-auto space-y-8 fade-in">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto pulse-gentle">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {greeting}!
            </h1>
            <p className="text-gray-600 mt-1">
              What do you need help with today?
            </p>
          </div>
        </div>

        {/* Input Methods */}
        <div className="space-y-4">
          <Card 
            className="cursor-pointer card-hover bg-white shadow-lg border-0 rounded-3xl overflow-hidden"
            onClick={() => handleInputMethod("voice")}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Mic className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Speak to AI</h3>
                  <p className="text-sm text-gray-600">Ask your question out loud</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer card-hover bg-white shadow-lg border-0 rounded-3xl overflow-hidden"
            onClick={() => handleInputMethod("text")}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Type a Question</h3>
                  <p className="text-sm text-gray-600">Write what you need help with</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer card-hover bg-white shadow-lg border-0 rounded-3xl overflow-hidden"
            onClick={() => handleInputMethod("file")}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Upload a File</h3>
                  <p className="text-sm text-gray-600">Share a screenshot or photo</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suggested Prompts */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 text-center">
            Popular Questions
          </h2>
          <div className="space-y-2">
            {suggestedPrompts.map((prompt, index) => (
              <Card 
                key={index}
                className="cursor-pointer card-hover bg-white border border-gray-100 rounded-2xl"
                onClick={() => handlePromptSelect(prompt)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700">{prompt}</p>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
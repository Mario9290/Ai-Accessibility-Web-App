import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { ChatMessage } from "@/entities/ChatMessage";
import { InvokeLLM, UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, Upload, ArrowLeft, Play } from "lucide-react";

import VoiceInput from "../components/chat/VoiceInput";
import FileUpload from "../components/chat/FileUpload";
import MessageBubble from "../components/chat/MessageBubble";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inputMethod, setInputMethod] = useState("text");
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
    loadMessages();
    checkUrlParams();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      navigate(createPageUrl("Welcome"));
    }
  };

  const loadMessages = async () => {
    try {
      const chatMessages = await ChatMessage.list("-created_date", 50);
      setMessages(chatMessages.reverse());
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const checkUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const inputType = urlParams.get("input");
    const prompt = urlParams.get("prompt");
    
    if (inputType) {
      setInputMethod(inputType);
    }
    
    if (prompt) {
      setInputText(prompt);
      handleSendMessage(prompt, "text");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (message, type, fileUrl = null) => {
    if (!message.trim() && !fileUrl) return;
    
    setIsLoading(true);
    
    try {
      // Save user message
      const userMessage = await ChatMessage.create({
        message: message || "Uploaded file",
        is_user: true,
        input_type: type,
        file_url: fileUrl,
        language: user?.preferred_language || "en"
      });

      setMessages(prev => [...prev, userMessage]);
      setInputText("");

      // Prepare AI prompt
      let aiPrompt = `You are a helpful AI assistant designed to help non-tech-savvy users with everyday smartphone tasks. 
      User's preferred language: ${user?.preferred_language || "en"}
      
      Respond in a friendly, supportive, and clear manner. Use simple language and be encouraging.
      
      User's message: ${message}`;

      if (fileUrl) {
        aiPrompt += `\n\nUser has uploaded a file: ${fileUrl}`;
      }

      aiPrompt += `\n\nIf the user's question involves multiple steps or a complex process, suggest that they might want to use the "Task Helper Mode" for step-by-step guidance.`;

      // Get AI response
      const aiResponse = await InvokeLLM({
        prompt: aiPrompt,
        file_urls: fileUrl ? [fileUrl] : undefined
      });

      // Check if AI suggests task helper mode
      const suggestsTaskHelper = aiResponse.toLowerCase().includes("task helper") || 
                               aiResponse.toLowerCase().includes("step-by-step") ||
                               aiResponse.toLowerCase().includes("guide you through");

      // Save AI message
      const aiMessage = await ChatMessage.create({
        message: aiResponse,
        is_user: false,
        input_type: "text",
        suggested_task_helper: suggestsTaskHelper,
        language: user?.preferred_language || "en"
      });

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error sending message:", error);
      // Show error message to user
      const errorMessage = await ChatMessage.create({
        message: "I'm sorry, I encountered an error. Please try again.",
        is_user: false,
        input_type: "text",
        language: user?.preferred_language || "en"
      });
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleSendMessage(inputText, "text");
    }
  };

  const handleVoiceMessage = (transcript) => {
    if (transcript) {
      handleSendMessage(transcript, "voice");
    }
  };

  const handleFileUpload = async (file) => {
    try {
      const { file_url } = await UploadFile({ file });
      handleSendMessage("", "file", file_url);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleStartTaskHelper = () => {
    navigate(createPageUrl("TaskHelper") + "?mode=create");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(createPageUrl("Home"))}
          className="rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900">AI Assistant</h1>
          <p className="text-sm text-gray-500">Ask me anything</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Hi! I'm here to help you with your phone. 
              What would you like to learn today?
            </p>
          </div>
        )}
        
        {messages.map((message) => (
          <MessageBubble 
            key={message.id} 
            message={message}
            onStartTaskHelper={handleStartTaskHelper}
          />
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="message-bubble message-ai">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        {/* Input Method Selector */}
        <div className="flex justify-center space-x-2 mb-4">
          <Button
            variant={inputMethod === "text" ? "default" : "outline"}
            size="sm"
            onClick={() => setInputMethod("text")}
            className="rounded-full"
          >
            Text
          </Button>
          <Button
            variant={inputMethod === "voice" ? "default" : "outline"}
            size="sm"
            onClick={() => setInputMethod("voice")}
            className="rounded-full"
          >
            <Mic className="w-4 h-4 mr-1" />
            Voice
          </Button>
          <Button
            variant={inputMethod === "file" ? "default" : "outline"}
            size="sm"
            onClick={() => setInputMethod("file")}
            className="rounded-full"
          >
            <Upload className="w-4 h-4 mr-1" />
            File
          </Button>
        </div>

        {/* Input Components */}
        {inputMethod === "text" && (
          <form onSubmit={handleTextSubmit} className="flex space-x-2">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your question here..."
              className="flex-1 min-h-[44px] max-h-32 rounded-2xl border-gray-300 resize-none"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleTextSubmit(e);
                }
              }}
            />
            <Button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="btn-primary rounded-full h-11 w-11 p-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        )}

        {inputMethod === "voice" && (
          <VoiceInput onVoiceMessage={handleVoiceMessage} />
        )}

        {inputMethod === "file" && (
          <FileUpload onFileUpload={handleFileUpload} />
        )}
      </div>
    </div>
  );
}
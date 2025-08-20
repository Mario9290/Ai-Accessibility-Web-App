import React from "react";
import { Button } from "@/components/ui/button";
import { User, Bot, ExternalLink, Play } from "lucide-react";

export default function MessageBubble({ message, onStartTaskHelper }) {
  const isUser = message.is_user;
  
  const handlePlayAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message.message);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-2 max-w-[85%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-orange-500' : 'bg-gray-200'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-gray-600" />
          )}
        </div>
        
        {/* Message Content */}
        <div className="space-y-2">
          <div className={`message-bubble ${isUser ? 'message-user' : 'message-ai'}`}>
            {message.file_url && (
              <div className="mb-2">
                <a 
                  href={message.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>View uploaded file</span>
                </a>
              </div>
            )}
            
            <p className="whitespace-pre-wrap">{message.message}</p>
            
            {message.input_type === "voice" && (
              <div className="flex items-center space-x-1 text-xs opacity-70 mt-1">
                <span>🎤 Voice message</span>
              </div>
            )}
          </div>
          
          {/* AI Message Actions */}
          {!isUser && (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlayAudio}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                <Play className="w-3 h-3 mr-1" />
                Play
              </Button>
              
              {message.suggested_task_helper && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onStartTaskHelper}
                  className="text-xs bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100"
                >
                  Start Task Helper
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
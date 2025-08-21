import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MessageCircle, BookOpen, Settings, Home } from "lucide-react";

const navigationItems = [
  {
    title: "Home",
    url: createPageUrl("Home"),
    icon: Home,
  },
  {
    title: "Assistant",
    url: createPageUrl("Chat"),
    icon: MessageCircle,
  },
  {
    title: "Saved Tasks",
    url: createPageUrl("SavedTasks"),
    icon: BookOpen,
  },
  {
    title: "Settings", 
    url: createPageUrl("Settings"),
    icon: Settings,
  },
];

export default function Layout({ children }) {
  const location = useLocation();
  
  // Hide navigation on welcome and onboarding screens
  const hideNavigation = [
    createPageUrl("Welcome"),
    createPageUrl("LanguageSelection"),
    createPageUrl("Onboarding"),
    createPageUrl("TaskHelper")
  ].includes(location.pathname);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <style>{`
        :root {
          --primary: #FF6B35;
          --primary-light: #FFB299;
          --gray-50: #F8F9FA;
          --gray-100: #E9ECEF;
          --gray-200: #DEE2E6;
          --gray-600: #6C757D;
          --gray-900: #212529;
        }
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .btn-primary {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
          transition: all 0.2s ease;
        }
        
        .btn-primary:hover {
          background: #E5562C;
          border-color: #E5562C;
          transform: translateY(-1px);
        }
        
        .card-hover {
          transition: all 0.3s ease;
        }
        
        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 107, 53, 0.15);
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-in;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .pulse-gentle {
          animation: pulseGentle 2s infinite;
        }
        
        @keyframes pulseGentle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .message-bubble {
          border-radius: 18px;
          padding: 12px 16px;
          margin: 8px 0;
          max-width: 80%;
          word-wrap: break-word;
        }
        
        .message-user {
          background: var(--primary);
          color: white;
          margin-left: auto;
        }
        
        .message-ai {
          background: var(--gray-50);
          color: var(--gray-900);
          margin-right: auto;
        }
      `}</style>
      
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      
      {!hideNavigation && (
        <nav className="bg-white border-t border-gray-200 px-4 py-2 safe-area-padding-bottom">
          <div className="flex justify-around items-center max-w-md mx-auto">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'text-orange-500 bg-orange-50' 
                      : 'text-gray-600 hover:text-orange-500'
                  }`}
                >
                  <item.icon className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
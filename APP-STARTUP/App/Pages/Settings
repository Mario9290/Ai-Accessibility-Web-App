import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, Globe, LogOut, User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
];

export default function Settings() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      navigate(createPageUrl("Welcome"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (newLanguage) => {
    setIsUpdating(true);
    try {
      await User.updateMyUserData({ preferred_language: newLanguage });
      setUser(prev => ({ ...prev, preferred_language: newLanguage }));
    } catch (error) {
      console.error("Error updating language:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      navigate(createPageUrl("Welcome"));
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-6">
        <div className="max-w-md mx-auto space-y-4 pt-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-32 bg-gray-200 rounded-3xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-6">
      <div className="max-w-md mx-auto space-y-6 fade-in">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
            <SettingsIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Customize your experience</p>
          </div>
        </div>

        {/* Profile Section */}
        <Card className="bg-white shadow-lg border-0 rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <UserIcon className="w-5 h-5 text-gray-600" />
              <span>Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user?.full_name}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tasks Completed</span>
                <span className="font-semibold text-orange-500">
                  {user?.total_tasks_completed || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card className="bg-white shadow-lg border-0 rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-gray-600" />
              <span>Language</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Preferred Language
              </label>
              <Select
                value={user?.preferred_language || "en"}
                onValueChange={handleLanguageChange}
                disabled={isUpdating}
              >
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center space-x-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="bg-white shadow-lg border-0 rounded-3xl">
          <CardContent className="p-6">
            <div className="text-center space-y-3">
              <h3 className="font-semibold text-gray-900">AI Helper</h3>
              <p className="text-sm text-gray-600">
                Your friendly assistant for everyday phone tasks
              </p>
              <p className="text-xs text-gray-500">Version 1.0.0</p>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <div className="pt-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full h-14 text-red-600 border-red-200 hover:bg-red-50 rounded-2xl"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
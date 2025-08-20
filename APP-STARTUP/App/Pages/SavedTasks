import React, { useState, useEffect } from "react";
import { SavedTask } from "@/entities/SavedTask";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const categoryColors = {
  settings: "bg-blue-100 text-blue-800",
  apps: "bg-green-100 text-green-800",
  communication: "bg-purple-100 text-purple-800",
  photos: "bg-pink-100 text-pink-800",
  general: "bg-gray-100 text-gray-800"
};

export default function SavedTasks() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserAndTasks();
  }, []);

  const loadUserAndTasks = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      
      const savedTasks = await SavedTask.filter(
        { created_by: userData.email },
        "-created_date"
      );
      setTasks(savedTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTaskSelect = (task) => {
    navigate(createPageUrl("TaskHelper") + `?taskId=${task.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-6">
        <div className="max-w-md mx-auto space-y-4 pt-8">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
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
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Saved Tasks</h1>
            <p className="text-gray-600">
              {tasks.length} tasks you've completed
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search your saved tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-2xl border-gray-200"
          />
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card className="bg-white shadow-lg border-0 rounded-3xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No saved tasks yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Complete your first task to see it here
                </p>
                <Button
                  onClick={() => navigate(createPageUrl("Chat"))}
                  className="btn-primary rounded-2xl"
                >
                  Ask AI Assistant
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card
                key={task.id}
                className="cursor-pointer card-hover bg-white shadow-lg border-0 rounded-3xl"
                onClick={() => handleTaskSelect(task)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                        <Badge className={`${categoryColors[task.category]} text-xs`}>
                          {task.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{task.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Completed {task.completion_count} times</span>
                        </div>
                        <span>{task.steps?.length || 0} steps</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
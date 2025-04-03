
// This is a new file with the correct implementation
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, MoreHorizontal } from "lucide-react";
import { useUserAuth } from "@/contexts/AuthContext";
import { type Roadmap, type RoadmapStep } from "@/services/portfolio";
import { usePortfolioAPI } from "@/services/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface LearningRoadmapProps {
  className?: string;
}

export function LearningRoadmap({ className = "" }: LearningRoadmapProps) {
  const { userId } = useUserAuth();
  const { getUserRoadmap, updateRoadmapStepWithToast, generateRoadmapWithToast } = usePortfolioAPI();
  
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      if (!userId) return;
      
      try {
        const roadmapData = await getUserRoadmap(userId);
        setRoadmap(roadmapData);
      } catch (error) {
        console.error("Error fetching roadmap:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [userId, getUserRoadmap]);

  const handleGenerateRoadmap = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const newRoadmap = await generateRoadmapWithToast(userId);
      setRoadmap(newRoadmap);
    } catch (error) {
      console.error("Error generating roadmap:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStepStatus = async (roadmapId: string, stepId: number, status: 'completed' | 'in-progress' | 'pending') => {
    if (!userId) return;
    
    try {
      const success = await updateRoadmapStepWithToast(roadmapId, stepId, status);
      if (success && roadmap) {
        // Update the local state to reflect the change
        const updatedSteps = roadmap.steps.map(step => {
          if (step.id === stepId) {
            return { ...step, status };
          }
          return step;
        });
        
        // Calculate new progress
        const totalSteps = updatedSteps.length;
        const completedSteps = updatedSteps.filter(step => step.status === 'completed').length;
        const newProgress = Math.round((completedSteps / totalSteps) * 100);
        
        setRoadmap({
          ...roadmap,
          steps: updatedSteps,
          progress: newProgress
        });
      }
    } catch (error) {
      console.error("Error updating step status:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 text-white">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500 text-white">In Progress</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Pending</Badge>;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Learning Roadmap</CardTitle>
          <CardDescription>Your personalized learning journey</CardDescription>
        </div>
        {roadmap && (
          <Badge variant="outline" className="ml-2">
            {roadmap.progress}% Complete
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : roadmap && roadmap.steps.length > 0 ? (
          <div className="space-y-4">
            {roadmap.steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${step.status === 'completed' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'}`}>
                  {step.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Clock className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{step.title}</h4>
                    {getStatusBadge(step.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.description}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    {step.link && (
                      <Button size="sm" variant="outline" className="text-xs" asChild>
                        <a href={step.link} target="_blank" rel="noopener noreferrer">
                          View Resource
                        </a>
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => updateStepStatus(roadmap.id, step.id, 'completed')}
                        >
                          Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => updateStepStatus(roadmap.id, step.id, 'in-progress')}
                        >
                          Mark as In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => updateStepStatus(roadmap.id, step.id, 'pending')}
                        >
                          Mark as Pending
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              No learning roadmap found. Generate a personalized roadmap to guide your learning journey.
            </p>
            <Button onClick={handleGenerateRoadmap}>
              Generate Roadmap
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

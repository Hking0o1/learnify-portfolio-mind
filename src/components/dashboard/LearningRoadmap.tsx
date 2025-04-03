
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '@/contexts/AuthContext';
import { type Roadmap, type RoadmapStep, usePortfolioAPI } from '@/services/api';
import { CheckCircle, Circle, Clock, ArrowRight } from 'lucide-react';

interface LearningRoadmapProps {
  className?: string;
}

export const LearningRoadmap = ({ className }: LearningRoadmapProps) => {
  const { userId } = useUserAuth();
  const navigate = useNavigate();
  const { portfolioAPI, updateRoadmapStepWithToast, generateRoadmapWithToast } = usePortfolioAPI();
  
  const [loading, setLoading] = useState(true);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        let userRoadmap = await portfolioAPI.getUserRoadmap(userId);
        
        if (!userRoadmap) {
          // Generate a roadmap if none exists
          userRoadmap = await generateRoadmapWithToast(userId);
        }
        
        setRoadmap(userRoadmap);
      } catch (error) {
        console.error('Error fetching roadmap:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoadmap();
  }, [userId]);

  const handleNavigate = (link: string) => {
    navigate(link);
  };
  
  const handleUpdateStatus = async (stepId: number, status: 'completed' | 'in-progress' | 'pending') => {
    if (!roadmap?.id) return;
    
    try {
      const success = await updateRoadmapStepWithToast(roadmap.id, stepId, status);
      
      if (success) {
        // Update local state
        setRoadmap(prev => {
          if (!prev) return prev;
          
          const updatedSteps = prev.steps.map(step => {
            if (step.id === stepId) {
              return { ...step, status };
            }
            return step;
          });
          
          // Calculate progress
          const totalSteps = updatedSteps.length;
          const completedSteps = updatedSteps.filter(step => step.status === 'completed').length;
          const progress = Math.round((completedSteps / totalSteps) * 100);
          
          return {
            ...prev,
            steps: updatedSteps,
            progress
          };
        });
      }
    } catch (error) {
      console.error('Error updating roadmap step:', error);
    }
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };
  
  const getStepStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
            Completed
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
            In Progress
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
            Pending
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="skeleton h-7 w-3/4"></CardTitle>
          <CardDescription className="skeleton h-5 w-1/2"></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3 p-3 border rounded-md">
                <div className="skeleton h-8 w-8 rounded-full"></div>
                <div className="flex-1">
                  <div className="skeleton h-5 w-3/4 mb-2"></div>
                  <div className="skeleton h-4 w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!roadmap) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Learning Roadmap</CardTitle>
          <CardDescription>Your personalized learning journey</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No roadmap found. Let's create a personalized learning path for you.
          </p>
          <Button 
            onClick={() => userId && generateRoadmapWithToast(userId)
              .then(result => setRoadmap(result))}
          >
            Create Roadmap
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{roadmap.title}</CardTitle>
            <CardDescription>{roadmap.description}</CardDescription>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
            {roadmap.progress}% Complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-0">
        <Progress value={roadmap.progress} className="h-2 mb-6" />
        
        <div className="space-y-4">
          {roadmap.steps.map((step: RoadmapStep) => (
            <div 
              key={step.id} 
              className={`flex items-start gap-3 p-3 rounded-md transition-all ${
                step.status === 'completed' 
                  ? 'bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30' 
                  : step.status === 'in-progress'
                  ? 'bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30'
                  : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="mt-1">
                {getStepStatusIcon(step.status)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{step.title}</h4>
                  {getStepStatusBadge(step.status)}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {step.description}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex gap-2">
                    {step.status !== 'completed' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUpdateStatus(step.id, 'completed')}
                      >
                        Mark Complete
                      </Button>
                    )}
                    {step.status === 'pending' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUpdateStatus(step.id, 'in-progress')}
                      >
                        Start
                      </Button>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleNavigate(step.link)}
                  >
                    <ArrowRight className="h-4 w-4 mr-1" />
                    Go
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <Button variant="outline" className="ml-auto" onClick={() => navigate('/portfolio')}>
          View Your Skills Portfolio
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

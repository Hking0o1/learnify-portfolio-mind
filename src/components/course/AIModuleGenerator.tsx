
import React, { useState } from 'react';
import { generateModulesWithAI } from '@/services/api';
import { moduleAPI } from '@/services/modules';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIModuleGeneratorProps {
  courseId: string;
  courseTitle: string;
  courseDescription: string;
  onSuccess?: () => void;
}

export const AIModuleGenerator = ({
  courseId,
  courseTitle: defaultTitle,
  courseDescription: defaultDescription,
  onSuccess
}: AIModuleGeneratorProps) => {
  const [courseTitle, setCourseTitle] = useState(defaultTitle);
  const [courseDescription, setCourseDescription] = useState(defaultDescription);
  const [numModules, setNumModules] = useState(3);
  const [difficultyLevel, setDifficultyLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // Generate modules with AI
      const modules = await generateModulesWithAI(
        {
          courseTitle,
          courseDescription,
          numModules,
          difficultyLevel
        },
        courseId
      );
      
      // Create the modules in the database
      for (const module of modules) {
        await moduleAPI.createModule(module);
      }
      
      toast({
        title: "Success",
        description: `Generated ${modules.length} modules for your course`,
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error generating modules:', error);
      toast({
        title: "Error",
        description: "Failed to generate modules. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          AI Module Generator
        </CardTitle>
        <CardDescription>
          Use AI to automatically generate course modules based on your course details
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="course-title">Course Title</Label>
          <Input
            id="course-title"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="e.g., Machine Learning Fundamentals"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="course-description">Course Description</Label>
          <Textarea
            id="course-description"
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            placeholder="Provide a detailed description of your course"
            rows={3}
          />
          <p className="text-sm text-muted-foreground">
            The more detailed your description, the better the generated modules will be
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="num-modules">Number of Modules</Label>
            <Input
              id="num-modules"
              type="number"
              min={1}
              max={10}
              value={numModules}
              onChange={(e) => setNumModules(parseInt(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select 
              value={difficultyLevel} 
              onValueChange={(value) => setDifficultyLevel(value as 'Beginner' | 'Intermediate' | 'Advanced')}
            >
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || !courseTitle || !courseDescription}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Modules...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Modules with AI
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

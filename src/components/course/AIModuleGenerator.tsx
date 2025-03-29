
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, BookOpen } from 'lucide-react';
import { generateModulesWithAI, saveGeneratedModules, GeneratedModule } from '@/services/ai-modules';

interface AIModuleGeneratorProps {
  courseId: string;
  courseTitle: string;
  courseDescription: string;
  onSuccess?: (modules: any[]) => void;
}

const AIModuleGenerator = ({ courseId, courseTitle, courseDescription, onSuccess }: AIModuleGeneratorProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [numModules, setNumModules] = useState(3);
  const [difficultyLevel, setDifficultyLevel] = useState('intermediate');
  const [generatedModules, setGeneratedModules] = useState<GeneratedModule[]>([]);
  const [customCourseTitle, setCustomCourseTitle] = useState(courseTitle);
  const [customCourseDescription, setCustomCourseDescription] = useState(courseDescription);

  const handleGenerateModules = async () => {
    setIsGenerating(true);
    try {
      const result = await generateModulesWithAI({
        courseTitle: customCourseTitle || courseTitle,
        courseDescription: customCourseDescription || courseDescription,
        numModules,
        difficultyLevel
      });
      
      if (result && result.modules) {
        setGeneratedModules(result.modules);
        toast({
          title: "Blog Modules Generated",
          description: `${result.modules.length} detailed blog modules generated successfully.`,
        });
      }
    } catch (error) {
      console.error("Error generating modules:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate blog modules. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveModules = async () => {
    if (!generatedModules.length) return;
    
    setIsSaving(true);
    try {
      const savedModules = await saveGeneratedModules(courseId, generatedModules);
      toast({
        title: "Blog Modules Saved",
        description: `${savedModules.length} blog modules saved to your course.`,
      });
      
      if (onSuccess) {
        onSuccess(savedModules);
      }
      
      // Clear generated modules after saving
      setGeneratedModules([]);
    } catch (error) {
      console.error("Error saving modules:", error);
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save blog modules. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-500" />
          AI Blog Module Generator
        </CardTitle>
        <CardDescription>
          Use AI to quickly generate detailed blog-style modules and learning materials
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!generatedModules.length ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="customTitle">Course Title</Label>
              <Input 
                id="customTitle" 
                value={customCourseTitle} 
                onChange={(e) => setCustomCourseTitle(e.target.value)}
                placeholder="Enter course title for AI generation"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customDescription">Course Description</Label>
              <Textarea 
                id="customDescription" 
                value={customCourseDescription} 
                onChange={(e) => setCustomCourseDescription(e.target.value)}
                placeholder="Enter detailed course description for better AI blog results"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numModules">Number of Blog Modules</Label>
                <Input 
                  id="numModules" 
                  type="number" 
                  min={1} 
                  max={10} 
                  value={numModules} 
                  onChange={(e) => setNumModules(parseInt(e.target.value) || 3)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="difficultyLevel">Difficulty Level</Label>
                <select
                  id="difficultyLevel"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(e.target.value)}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <h3 className="font-medium">Generated Blog Modules</h3>
            <div className="border rounded-md divide-y max-h-96 overflow-y-auto">
              {generatedModules.map((module, index) => (
                <div key={index} className="p-4">
                  <h4 className="font-medium">{module.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                  
                  {module.materials && module.materials.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-sm font-medium mb-2">Blog Materials:</h5>
                      <ul className="text-sm space-y-1 pl-5 list-disc">
                        {module.materials.map((material, idx) => (
                          <li key={idx}>
                            <span className="font-medium">{material.title}</span>
                            <span className="text-xs text-muted-foreground ml-2">({material.type})</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t p-4">
        {!generatedModules.length ? (
          <Button 
            onClick={handleGenerateModules} 
            disabled={isGenerating}
            className="w-full flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating Blog Modules...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Blog Modules with AI</span>
              </>
            )}
          </Button>
        ) : (
          <div className="flex w-full gap-4">
            <Button 
              variant="outline" 
              onClick={() => setGeneratedModules([])}
              disabled={isSaving}
              className="flex-1"
            >
              Start Over
            </Button>
            <Button 
              onClick={handleSaveModules} 
              disabled={isSaving}
              className="flex-1 flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving to Course...</span>
                </>
              ) : (
                <span>Save Blog Modules to Course</span>
              )}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default AIModuleGenerator;

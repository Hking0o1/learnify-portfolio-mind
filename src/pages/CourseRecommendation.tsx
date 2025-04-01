
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUserAuth } from "@/contexts/AuthContext";
import { Check, Loader2, Brain, BookOpen, LucideBook } from "lucide-react";
import { generatePersonalizedCourse } from "@/services/ai-recommendation";

interface Question {
  id: number;
  question: string;
  type: "text" | "multiChoice" | "slider";
  options?: string[];
}

const CourseRecommendation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userId } = useUserAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourseId, setGeneratedCourseId] = useState<string | null>(null);

  const questions: Question[] = [
    { id: 1, question: "What are your learning goals?", type: "text" },
    { id: 2, question: "What's your current skill level in this subject?", type: "multiChoice", options: ["Beginner", "Intermediate", "Advanced", "Expert"] },
    { id: 3, question: "Which topics are you most interested in?", type: "text" },
    { id: 4, question: "How much time can you dedicate to learning each week?", type: "multiChoice", options: ["1-2 hours", "3-5 hours", "6-10 hours", "10+ hours"] },
    { id: 5, question: "What's your preferred learning style?", type: "multiChoice", options: ["Reading", "Interactive exercises", "Project-based", "Discussion-based"] },
  ];

  const handleAnswer = (id: number, answer: string | number) => {
    setAnswers((prev) => ({ ...prev, [id]: answer }));
  };

  const goToNextQuestion = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      generateRecommendation();
    }
  };

  const goToPreviousQuestion = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const generateRecommendation = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to generate course recommendations",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Format the answers for the AI
      const formattedAnswers = Object.entries(answers).map(([qId, answer]) => {
        const question = questions.find(q => q.id === parseInt(qId));
        return {
          question: question?.question || "",
          answer
        };
      });

      // Call the AI service to generate a personalized course
      const result = await generatePersonalizedCourse(userId, formattedAnswers);
      
      if (result?.courseId) {
        setGeneratedCourseId(result.courseId);
        toast({
          title: "Success!",
          description: "Your personalized learning path has been created!",
        });
      }
    } catch (error) {
      console.error("Error generating course recommendation:", error);
      toast({
        title: "Error",
        description: "Failed to generate course recommendation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderQuestion = () => {
    const q = questions[currentStep];
    if (!q) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{q.question}</h3>
        
        {q.type === "text" && (
          <Textarea
            placeholder="Type your answer here..."
            value={answers[q.id] as string || ""}
            onChange={(e) => handleAnswer(q.id, e.target.value)}
            className="min-h-[100px]"
          />
        )}
        
        {q.type === "multiChoice" && q.options && (
          <div className="grid grid-cols-1 gap-2">
            {q.options.map((option) => (
              <Button
                key={option}
                variant={answers[q.id] === option ? "default" : "outline"}
                className="justify-start"
                onClick={() => handleAnswer(q.id, option)}
              >
                {answers[q.id] === option && <Check className="mr-2 h-4 w-4" />}
                {option}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (generatedCourseId) {
    return (
      <Layout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-green-200 dark:border-green-900">
            <CardHeader className="bg-green-50 dark:bg-green-900/20">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6" />
                Your Personalized Learning Path is Ready!
              </CardTitle>
              <CardDescription>
                We've created a custom learning experience just for you based on your answers.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <LucideBook className="h-16 w-16 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Your personalized course is ready!</h3>
                <p className="text-muted-foreground mb-6">
                  We've created a tailored learning path with AI-generated content just for you.
                </p>
                <Button 
                  size="lg" 
                  onClick={() => navigate(`/courses/${generatedCourseId}`)}
                >
                  Start Learning Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Personalized Learning Assessment
            </CardTitle>
            <CardDescription>
              Answer a few questions to help us create a personalized learning plan for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Question {currentStep + 1} of {questions.length}</span>
                <span className="text-sm text-muted-foreground">{Math.round(((currentStep + 1) / questions.length) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-300" 
                  style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }} 
                />
              </div>
            </div>
            
            {renderQuestion()}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline"
              onClick={goToPreviousQuestion}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button 
              onClick={goToNextQuestion}
              disabled={answers[questions[currentStep]?.id] === undefined || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating your course...
                </>
              ) : currentStep === questions.length - 1 ? (
                "Generate My Course"
              ) : (
                "Next"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default CourseRecommendation;


import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, Clock, Target, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

const Assessment = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [assessment, setAssessment] = useState<any>(null);
  
  // Mock assessment data - in a real app, this would be fetched from an API
  useEffect(() => {
    // Simulate loading assessment data
    setTimeout(() => {
      const mockAssessment = {
        id: assessmentId,
        title: "Comprehensive Skills Assessment",
        description: "This assessment will evaluate your skills across technical, business, and leadership domains to identify growth opportunities.",
        estimatedDuration: "30 minutes",
        focusAreas: ["Machine Learning", "Data Analysis", "Leadership"],
        questions: [
          {
            id: 1,
            question: "How would you approach a complex machine learning problem with limited training data?",
            skillArea: "Machine Learning",
            options: [
              "Use transfer learning from a related domain",
              "Collect more data before proceeding",
              "Use simple models with regularization",
              "Apply data augmentation techniques"
            ]
          },
          {
            id: 2,
            question: "What statistical approach would you use to identify outliers in a multivariate dataset?",
            skillArea: "Data Analysis",
            options: [
              "Z-score normalization",
              "Mahalanobis distance",
              "Isolation forests",
              "Box plot visualization"
            ]
          },
          {
            id: 3,
            question: "When leading a team through a challenging project, how do you maintain motivation?",
            skillArea: "Leadership",
            options: [
              "Regular recognition of small wins",
              "Clear communication of project vision",
              "Individual coaching sessions",
              "Team-building activities"
            ]
          },
          {
            id: 4,
            question: "How would you approach risk assessment for a financial project?",
            skillArea: "Risk Assessment",
            options: [
              "Monte Carlo simulations",
              "Expert judgment and historical data",
              "SWOT analysis",
              "Sensitivity analysis"
            ]
          },
          {
            id: 5,
            question: "Which approach would you use to optimize a data pipeline for big data processing?",
            skillArea: "Data Engineering",
            options: [
              "Implement parallel processing",
              "Use columnar storage formats",
              "Apply incremental data processing",
              "Optimize query execution plans"
            ]
          }
        ]
      };
      
      setAssessment(mockAssessment);
      setLoading(false);
    }, 1500);
  }, [assessmentId]);

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < (assessment?.questions?.length || 0) - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Submit assessment
      toast({
        title: "Assessment Submitted",
        description: "Your responses have been recorded. You'll receive feedback soon.",
      });
      
      // Navigate back to portfolio or show results
      setTimeout(() => {
        window.location.href = "/portfolio";
      }, 2000);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">Loading your personalized assessment...</p>
        </div>
      </Layout>
    );
  }

  if (!assessment) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold mb-4">Assessment Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn't find the assessment you're looking for.
          </p>
          <Button asChild>
            <Link to="/portfolio">Return to Portfolio</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const question = assessment.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <Link 
              to="/portfolio" 
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-2"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Portfolio
            </Link>
            <h1 className="text-3xl font-bold">{assessment.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{assessment.description}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <Brain className="mr-1 h-4 w-4" />
              AI-Powered
            </Badge>
            <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
              <Clock className="mr-1 h-4 w-4" />
              {assessment.estimatedDuration}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1">
            <Progress value={progress} className="h-2" />
          </div>
          <div className="text-sm font-medium">
            {currentQuestion + 1}/{assessment.questions.length}
          </div>
        </div>

        <Card className="border-none shadow-md">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <Badge className="mb-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  {question.skillArea}
                </Badge>
                <CardTitle className="text-xl">{question.question}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={answers[question.id] || ""} 
              onValueChange={(value) => handleAnswer(question.id, value)}
            >
              <div className="space-y-4">
                {question.options.map((option: string, index: number) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  </motion.div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button 
              onClick={handleNext}
              disabled={!answers[question.id]}
            >
              {currentQuestion < assessment.questions.length - 1 ? "Next Question" : "Submit Assessment"}
            </Button>
          </CardFooter>
        </Card>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Focus Areas</h3>
          <div className="flex flex-wrap gap-2">
            {assessment.focusAreas.map((area: string, index: number) => (
              <Badge key={index} variant="outline" className="bg-transparent">
                <Target className="mr-1 h-3 w-3" />
                {area}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Assessment;

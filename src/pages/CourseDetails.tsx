
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, ChevronDown, ChevronRight, Clock, Download, FileText, Play, Star, Video } from "lucide-react";

// Define the types for our data
interface Module {
  id: number;
  title: string;
  description: string;
  duration: string;
  materials: Material[];
  isCompleted: boolean;
}

interface Material {
  id: number;
  title: string;
  type: "video" | "document" | "quiz";
  duration?: string;
  url: string;
  isCompleted: boolean;
}

// Mock courses data
const coursesData = [
  {
    id: 1,
    title: "Machine Learning Fundamentals",
    instructor: "Dr. Alex Johnson",
    rating: 4.8,
    reviews: 245,
    level: "Beginner",
    duration: "8 weeks",
    category: "Machine Learning",
    image: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    enrolled: true,
    progress: 65,
    popularity: 98,
    match: 95,
    description: "Learn the fundamentals of machine learning, from basic algorithms to advanced applications. This course covers supervised and unsupervised learning, neural networks, and practical implementation.",
    modules: [
      {
        id: 1,
        title: "Introduction to Machine Learning",
        description: "Understanding the basics of ML and its applications",
        duration: "1 week",
        isCompleted: true,
        materials: [
          {
            id: 101,
            title: "What is Machine Learning?",
            type: "video",
            duration: "15:30",
            url: "#video-1",
            isCompleted: true
          },
          {
            id: 102,
            title: "History and Evolution of ML",
            type: "document",
            url: "#document-1",
            isCompleted: true
          },
          {
            id: 103,
            title: "Applications of Machine Learning",
            type: "video",
            duration: "20:45",
            url: "#video-2",
            isCompleted: true
          }
        ]
      },
      {
        id: 2,
        title: "Supervised Learning Algorithms",
        description: "Exploring classification and regression techniques",
        duration: "2 weeks",
        isCompleted: true,
        materials: [
          {
            id: 201,
            title: "Linear Regression Explained",
            type: "video",
            duration: "25:10",
            url: "#video-3",
            isCompleted: true
          },
          {
            id: 202,
            title: "Decision Trees and Random Forests",
            type: "video",
            duration: "30:22",
            url: "#video-4",
            isCompleted: true
          },
          {
            id: 203,
            title: "Support Vector Machines",
            type: "document",
            url: "#document-2",
            isCompleted: false
          },
          {
            id: 204,
            title: "Week 2 Quiz",
            type: "quiz",
            url: "#quiz-1",
            isCompleted: true
          }
        ]
      },
      {
        id: 3,
        title: "Unsupervised Learning",
        description: "Clustering and dimensionality reduction techniques",
        duration: "1.5 weeks",
        isCompleted: false,
        materials: [
          {
            id: 301,
            title: "K-means Clustering",
            type: "video",
            duration: "22:15",
            url: "#video-5",
            isCompleted: false
          },
          {
            id: 302,
            title: "Hierarchical Clustering Methods",
            type: "document",
            url: "#document-3",
            isCompleted: false
          },
          {
            id: 303,
            title: "Principal Component Analysis",
            type: "video",
            duration: "28:40",
            url: "#video-6",
            isCompleted: false
          }
        ]
      },
      {
        id: 4,
        title: "Neural Networks Basics",
        description: "Introduction to neural networks and deep learning",
        duration: "2 weeks",
        isCompleted: false,
        materials: [
          {
            id: 401,
            title: "Perceptrons and Neural Network Architecture",
            type: "video",
            duration: "35:20",
            url: "#video-7",
            isCompleted: false
          },
          {
            id: 402,
            title: "Activation Functions",
            type: "document",
            url: "#document-4",
            isCompleted: false
          },
          {
            id: 403,
            title: "Backpropagation Explained",
            type: "video",
            duration: "40:15",
            url: "#video-8",
            isCompleted: false
          },
          {
            id: 404,
            title: "Week 4 Quiz",
            type: "quiz",
            url: "#quiz-2",
            isCompleted: false
          }
        ]
      },
      {
        id: 5,
        title: "Practical Applications and Projects",
        description: "Real-world applications and hands-on projects",
        duration: "1.5 weeks",
        isCompleted: false,
        materials: [
          {
            id: 501,
            title: "Image Classification with TensorFlow",
            type: "video",
            duration: "45:30",
            url: "#video-9",
            isCompleted: false
          },
          {
            id: 502,
            title: "Project Guidelines",
            type: "document",
            url: "#document-5",
            isCompleted: false
          },
          {
            id: 503,
            title: "Final Project Submission",
            type: "quiz",
            url: "#quiz-3",
            isCompleted: false
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Advanced Data Analysis",
    instructor: "Prof. Sarah Williams",
    rating: 4.6,
    reviews: 189,
    level: "Advanced",
    duration: "10 weeks",
    category: "Data Analysis",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    enrolled: true,
    progress: 42,
    popularity: 85,
    match: 88,
    description: "Master advanced techniques in data analysis. This course teaches statistical methods, data visualization, and predictive modeling for complex datasets.",
    modules: [
      {
        id: 1,
        title: "Advanced Statistical Methods",
        description: "In-depth study of statistical analysis techniques",
        duration: "2 weeks",
        isCompleted: true,
        materials: [
          {
            id: 101,
            title: "Probability Distributions Review",
            type: "video",
            duration: "30:15",
            url: "#video-1",
            isCompleted: true
          },
          {
            id: 102,
            title: "Hypothesis Testing in Practice",
            type: "document",
            url: "#document-1",
            isCompleted: true
          }
        ]
      },
      {
        id: 2,
        title: "Time Series Analysis",
        description: "Methods for analyzing time-dependent data",
        duration: "3 weeks",
        isCompleted: false,
        materials: [
          {
            id: 201,
            title: "Introduction to Time Series",
            type: "video",
            duration: "25:40",
            url: "#video-2",
            isCompleted: true
          },
          {
            id: 202,
            title: "ARIMA Models",
            type: "video",
            duration: "35:10",
            url: "#video-3",
            isCompleted: false
          }
        ]
      }
    ]
  }
];

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("content");
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchCourse = () => {
      setLoading(true);
      const foundCourse = coursesData.find(c => c.id === Number(courseId));
      
      if (foundCourse) {
        setCourse(foundCourse);
        // Expand the first module by default
        if (foundCourse.modules && foundCourse.modules.length > 0) {
          setExpandedModules([foundCourse.modules[0].id]);
          // Set the first material as current by default
          if (foundCourse.modules[0].materials && foundCourse.modules[0].materials.length > 0) {
            setCurrentMaterial(foundCourse.modules[0].materials[0]);
          }
        }
      }
      
      setLoading(false);
    };

    fetchCourse();
  }, [courseId]);

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId) 
        : [...prev, moduleId]
    );
  };

  const handleMaterialClick = (material: Material) => {
    setCurrentMaterial(material);
  };

  const getCompletionPercentage = (module: Module) => {
    if (!module.materials.length) return 0;
    const completedMaterials = module.materials.filter(m => m.isCompleted).length;
    return Math.round((completedMaterials / module.materials.length) * 100);
  };

  const getTotalCompletionPercentage = () => {
    if (!course || !course.modules) return 0;
    
    let totalMaterials = 0;
    let completedMaterials = 0;
    
    course.modules.forEach((module: Module) => {
      totalMaterials += module.materials.length;
      completedMaterials += module.materials.filter(m => m.isCompleted).length;
    });
    
    return totalMaterials ? Math.round((completedMaterials / totalMaterials) * 100) : 0;
  };

  const renderMaterialContent = () => {
    if (!currentMaterial) return null;

    switch(currentMaterial.type) {
      case 'video':
        return (
          <div className="bg-gray-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
            <div className="text-center">
              <Play className="h-16 w-16 text-white/80 mx-auto mb-2" />
              <p className="text-white/80">Video: {currentMaterial.title}</p>
              {currentMaterial.duration && (
                <p className="text-white/60 text-sm mt-1">Duration: {currentMaterial.duration}</p>
              )}
            </div>
          </div>
        );
      
      case 'document':
        return (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-4">
              <FileText className="h-10 w-10 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium mb-2">{currentMaterial.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  This is a document that contains important information related to the course.
                </p>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download Document
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 'quiz':
        return (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-4">{currentMaterial.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Complete this quiz to test your knowledge and track your progress.
            </p>
            <Button>Start Quiz</Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading course...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="space-y-4 text-center py-12">
          <h2 className="text-2xl font-bold">Course Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400">The course you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/courses')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Course Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-6"
        >
          <div className="md:w-3/5">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4"
              onClick={() => navigate('/courses')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Button>
            
            <h1 className="text-3xl font-bold tracking-tight mb-2">{course.title}</h1>
            
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
              <p>Instructor: <span className="font-medium text-foreground">{course.instructor}</span></p>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                <span className="font-medium text-foreground">{course.rating}</span>
                <span className="ml-1">({course.reviews} reviews)</span>
              </div>
              <span className="mx-2">•</span>
              <Badge variant="outline" className="ml-1">
                {course.level}
              </Badge>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {course.description}
            </p>
            
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-gray-500" />
                <span className="text-sm">{course.duration}</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1 text-gray-500" />
                <span className="text-sm">{course.modules.length} Modules</span>
              </div>
            </div>
          </div>
          
          <div className="md:w-2/5">
            <div className="relative h-64 rounded-lg overflow-hidden">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            
            <Card className="mt-4">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Course Progress</span>
                    <span className="text-sm font-medium">{getTotalCompletionPercentage()}%</span>
                  </div>
                  <Progress value={getTotalCompletionPercentage()} className="h-2" />
                </div>
                
                <Button className="w-full mb-3">Continue Learning</Button>
                <Button variant="outline" className="w-full">Download Materials</Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
        
        {/* Course Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="w-full md:w-auto grid grid-cols-3">
            <TabsTrigger value="content">Course Content</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Module list sidebar */}
              <Card className="md:col-span-1 overflow-hidden border-0 shadow-md">
                <CardHeader className="bg-blue-50 dark:bg-blue-950/20 pb-3">
                  <CardTitle className="text-lg">Course Modules</CardTitle>
                  <CardDescription>
                    {course.modules.length} modules • {getTotalCompletionPercentage()}% complete
                  </CardDescription>
                </CardHeader>
                
                <ScrollArea className="h-[calc(100vh-400px)]">
                  <div className="p-4">
                    {course.modules.map((module: Module) => (
                      <Collapsible
                        key={module.id}
                        open={expandedModules.includes(module.id)}
                        className="mb-4 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
                      >
                        <CollapsibleTrigger asChild>
                          <div 
                            className={`p-4 flex items-start justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/20 ${
                              expandedModules.includes(module.id) ? 'bg-gray-50 dark:bg-gray-900/20' : ''
                            }`}
                            onClick={() => toggleModule(module.id)}
                          >
                            <div className="flex-1 pr-4">
                              <div className="flex items-center gap-2">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                  module.isCompleted 
                                    ? 'bg-green-500 text-white' 
                                    : 'border border-gray-300 dark:border-gray-700 text-gray-500'
                                }`}>
                                  {module.isCompleted ? '✓' : module.id}
                                </div>
                                <h3 className="font-medium">{module.title}</h3>
                              </div>
                              <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{module.duration}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {getCompletionPercentage(module)}%
                              </span>
                              <div className="text-gray-500">
                                {expandedModules.includes(module.id) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </div>
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <div className="px-4 pb-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                              {module.description}
                            </p>
                            
                            <div className="border-t border-gray-200 dark:border-gray-800 pt-3 space-y-2">
                              {module.materials.map((material) => (
                                <div 
                                  key={material.id}
                                  className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
                                    currentMaterial?.id === material.id 
                                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                  }`}
                                  onClick={() => handleMaterialClick(material)}
                                >
                                  {material.type === 'video' && <Video className="h-4 w-4 flex-shrink-0" />}
                                  {material.type === 'document' && <FileText className="h-4 w-4 flex-shrink-0" />}
                                  {material.type === 'quiz' && <BookOpen className="h-4 w-4 flex-shrink-0" />}
                                  
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{material.title}</p>
                                    {material.duration && (
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {material.duration}
                                      </p>
                                    )}
                                  </div>
                                  
                                  {material.isCompleted && (
                                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                      <div className="text-white text-[10px]">✓</div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
              
              {/* Content viewer */}
              <div className="md:col-span-2 space-y-4">
                {currentMaterial ? (
                  <>
                    <Card className="border-0 shadow-md overflow-hidden">
                      <CardHeader className="pb-3 border-b">
                        <div className="flex items-center justify-between">
                          <CardTitle>{currentMaterial.title}</CardTitle>
                          <Badge variant={currentMaterial.isCompleted ? "outline" : "secondary"}>
                            {currentMaterial.isCompleted ? "Completed" : "In Progress"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        {renderMaterialContent()}
                      </CardContent>
                    </Card>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" className="gap-2">
                        Previous
                      </Button>
                      <Button className="gap-2">
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-gray-500 dark:text-gray-400">
                      Select a material from the list to view its content
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Course Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Description</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {course.description}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">What You'll Learn</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 text-green-500">✓</div>
                        <p>Understand core machine learning concepts and algorithms</p>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 text-green-500">✓</div>
                        <p>Build and train neural networks from scratch</p>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 text-green-500">✓</div>
                        <p>Apply ML techniques to real-world problems</p>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 text-green-500">✓</div>
                        <p>Evaluate and improve model performance</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Student Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    Reviews will be displayed here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CourseDetails;

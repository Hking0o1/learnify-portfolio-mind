import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Check, FileText, Folder, Play, PlusCircle, Trophy } from "lucide-react";
import { useUserAuth } from "@/contexts/AuthContext";

// Define specific string literals for material types
type MaterialType = "video" | "document" | "quiz";

// Define interfaces with proper types
interface Material {
  id: number;
  title: string;
  type: MaterialType;
  url: string;
  duration?: string;
  isCompleted: boolean;
}

interface Module {
  id: number;
  title: string;
  description: string;
  progress: number;
  materials: Material[];
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  description: string;
  thumbnail: string;
  modules: Module[];
  progress: number;
  level: string;
  duration: string;
  enrolledStudents: number;
  category: string;
  tags: string[];
  rating: number;
  reviews: number;
}

// Mock data for course details
const coursesData: Course[] = [
  {
    id: "1",
    title: "Machine Learning Fundamentals",
    instructor: "Dr. Sarah Johnson",
    description: "Learn the core concepts and techniques of machine learning with practical examples.",
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fG1hY2hpbmUlMjBsZWFybmluZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
    modules: [
      {
        id: 1,
        title: "Introduction to Machine Learning",
        description: "Understand the basic concepts and types of machine learning algorithms.",
        progress: 100,
        materials: [
          {
            id: 1,
            title: "What is Machine Learning?",
            type: "video",
            url: "https://example.com/videos/intro-ml",
            duration: "15:30",
            isCompleted: true
          },
          {
            id: 2,
            title: "Types of Machine Learning",
            type: "document",
            url: "https://example.com/docs/ml-types",
            isCompleted: true
          },
          {
            id: 3,
1 title: "Knowledge Check",
            type: "quiz",
            url: "https://example.com/quizzes/ml-intro",
            isCompleted: true
          }
        ]
      },
      {
        id: 2,
        title: "Supervised Learning",
        description: "Explore supervised learning algorithms and their applications.",
        progress: 60,
        materials: [
          {
            id: 4,
            title: "Regression Algorithms",
            type: "video",
            url: "https://example.com/videos/regression",
            duration: "22:15",
            isCompleted: true
          },
          {
            id: 5,
            title: "Classification Algorithms",
            type: "video",
            url: "https://example.com/videos/classification",
            duration: "18:45",
            isCompleted: true
          },
          {
            id: 6,
            title: "Practical Examples",
            type: "document",
            url: "https://example.com/docs/supervised-examples",
            isCompleted: false
          },
          {
            id: 7,
            title: "Supervised Learning Quiz",
            type: "quiz",
            url: "https://example.com/quizzes/supervised",
            isCompleted: false
          }
        ]
      },
      {
        id: 3,
        title: "Unsupervised Learning",
        description: "Learn clustering, dimensionality reduction, and other unsupervised techniques.",
        progress: 0,
        materials: [
          {
            id: 8,
            title: "Clustering Algorithms",
            type: "video",
            url: "https://example.com/videos/clustering",
            duration: "20:10",
            isCompleted: false
          },
          {
            id: 9,
            title: "Dimensionality Reduction",
            type: "video",
            url: "https://example.com/videos/dimension-reduction",
            duration: "16:30",
            isCompleted: false
          },
          {
            id: 10,
            title: "Unsupervised Learning Applications",
            type: "document",
            url: "https://example.com/docs/unsupervised-apps",
            isCompleted: false
          },
          {
            id: 11,
            title: "Module Assessment",
            type: "quiz",
            url: "https://example.com/quizzes/unsupervised",
            isCompleted: false
          }
        ]
      }
    ],
    progress: 40,
    level: "Intermediate",
    duration: "6 weeks",
    enrolledStudents: 1243,
    category: "Data Science",
    tags: ["Machine Learning", "AI", "Data Science", "Python"],
    rating: 4.7,
    reviews: 389
  }
];

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [activeMaterial, setActiveMaterial] = useState<Material | null>(null);
  const { toast } = useToast();
  const { isInstructor } = useUserAuth();

  useEffect(() => {
    const loadCourse = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const foundCourse = coursesData.find(c => c.id === courseId);
        
        if (foundCourse) {
          setCourse(foundCourse);
          if (foundCourse.modules.length > 0) {
            setSelectedModule(foundCourse.modules[0]);
            if (foundCourse.modules[0].materials.length > 0) {
              setActiveMaterial(foundCourse.modules[0].materials[0]);
            }
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load course details",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [courseId, toast]);

  const handleModuleSelect = (module: Module) => {
    setSelectedModule(module);
    if (module.materials.length > 0) {
      setActiveMaterial(module.materials[0]);
    } else {
      setActiveMaterial(null);
    }
  };

  const handleMaterialSelect = (material: Material) => {
    setActiveMaterial(material);
  };

  const markAsCompleted = (material: Material) => {
    if (course && selectedModule) {
      const updatedCourse = { ...course };
      const moduleIndex = updatedCourse.modules.findIndex(m => m.id === selectedModule.id);
      
      if (moduleIndex !== -1) {
        const materialIndex = updatedCourse.modules[moduleIndex].materials.findIndex(m => m.id === material.id);
        
        if (materialIndex !== -1) {
          const updatedMaterial: Material = {
            ...updatedCourse.modules[moduleIndex].materials[materialIndex],
            isCompleted: true
          };
          
          updatedCourse.modules[moduleIndex].materials[materialIndex] = updatedMaterial;
          
          const completedCount = updatedCourse.modules[moduleIndex].materials.filter(m => m.isCompleted).length;
          const totalCount = updatedCourse.modules[moduleIndex].materials.length;
          updatedCourse.modules[moduleIndex].progress = Math.round((completedCount / totalCount) * 100);
          
          const moduleProgressSum = updatedCourse.modules.reduce((sum, module) => sum + module.progress, 0);
          updatedCourse.progress = Math.round(moduleProgressSum / updatedCourse.modules.length);
          
          setCourse(updatedCourse);
          
          setSelectedModule(updatedCourse.modules[moduleIndex]);
          setActiveMaterial(updatedMaterial);
          
          toast({
            title: "Progress Updated",
            description: "Material marked as completed",
          });
        }
      }
    }
  };

  const renderMaterialContent = () => {
    if (!activeMaterial) return null;

    switch (activeMaterial.type) {
      case "video":
        return (
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Play className="h-16 w-16 text-primary/60 mb-4" />
                <p className="text-white">Video: {activeMaterial.title}</p>
                {activeMaterial.duration && (
                  <p className="text-gray-400 text-sm mt-2">Duration: {activeMaterial.duration}</p>
                )}
              </div>
            </div>
          </div>
        );
      case "document":
        return (
          <div className="rounded-lg overflow-hidden border border-border p-6">
            <div className="flex items-center mb-4">
              <FileText className="h-8 w-8 text-blue-500 mr-3" />
              <h3 className="text-xl font-medium">{activeMaterial.title}</h3>
            </div>
            <p className="text-muted-foreground">
              This is a document resource. Click the button below to view it.
            </p>
            <Button className="mt-4" variant="outline">
              View Document
            </Button>
          </div>
        );
      case "quiz":
        return (
          <div className="rounded-lg overflow-hidden border border-border p-6">
            <div className="flex items-center mb-4">
              <Trophy className="h-8 w-8 text-amber-500 mr-3" />
              <h3 className="text-xl font-medium">{activeMaterial.title}</h3>
            </div>
            <p className="text-muted-foreground">
              Test your knowledge with this quiz. Complete it to progress in the course.
            </p>
            <Button className="mt-4" variant="default">
              Start Quiz
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-8">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-64 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Skeleton className="h-80 w-full" />
            </div>
            <div className="md:col-span-2">
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
          <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/courses">Browse Courses</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" asChild className="mr-2">
              <Link to="/courses">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">{course.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            {isInstructor && (
              <Button asChild>
                <Link to={`/add-module/${course.id}`}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Module
                </Link>
              </Button>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="px-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="content">Course Content</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                      <div className="space-y-6">
                        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div>
                          <h2 className="text-xl font-semibold mb-2">About This Course</h2>
                          <p className="text-muted-foreground">{course.description}</p>
                        </div>
                        
                        <div>
                          <h2 className="text-xl font-semibold mb-4">What You'll Learn</h2>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {course.modules.map(module => (
                              <li key={module.id} className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span>{module.title}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-1">
                      <Card>
                        <CardHeader>
                          <CardTitle>Course Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Instructor</p>
                            <p className="font-medium">{course.instructor}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-muted-foreground">Level</p>
                            <p className="font-medium">{course.level}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-muted-foreground">Duration</p>
                            <p className="font-medium">{course.duration}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-muted-foreground">Category</p>
                            <p className="font-medium">{course.category}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-muted-foreground">Students Enrolled</p>
                            <p className="font-medium">{course.enrolledStudents.toLocaleString()}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-muted-foreground">Rating</p>
                            <div className="flex items-center">
                              <span className="font-medium mr-2">{course.rating}</span>
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <span key={i} className={`text-lg ${i < Math.floor(course.rating) ? "text-yellow-500" : "text-gray-300"}`}>★</span>
                                ))}
                              </div>
                              <span className="ml-2 text-sm text-muted-foreground">({course.reviews})</span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-muted-foreground">Tags</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {course.tags.map((tag, index) => (
                                <Badge key={index} variant="outline">{tag}</Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="content" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Modules</h2>
                        <Badge variant="outline" className="font-normal">
                          {Math.round(course.progress)}% Complete
                        </Badge>
                      </div>
                      
                      <Progress value={course.progress} className="h-2" />
                      
                      <div className="space-y-2">
                        {course.modules.map(module => (
                          <Card 
                            key={module.id} 
                            className={`cursor-pointer transition-all hover:border-primary ${selectedModule?.id === module.id ? 'border-primary' : ''}`}
                            onClick={() => handleModuleSelect(module)}
                          >
                            <CardHeader className="p-4">
                              <div className="flex justify-between items-center">
                                <CardTitle className="text-base">{module.title}</CardTitle>
                                <Badge variant="outline">
                                  {module.progress}%
                                </Badge>
                              </div>
                              <CardDescription className="line-clamp-2">
                                {module.description}
                              </CardDescription>
                            </CardHeader>
                            <CardFooter className="p-4 pt-0 flex justify-between text-sm">
                              <span className="text-muted-foreground flex items-center">
                                <Folder className="h-4 w-4 mr-1" /> 
                                {module.materials.length} materials
                              </span>
                              <Progress value={module.progress} className="w-20 h-1.5" />
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      {selectedModule ? (
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-xl font-semibold mb-2">{selectedModule.title}</h2>
                            <p className="text-muted-foreground">{selectedModule.description}</p>
                          </div>
                          
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Materials</h3>
                            <div className="grid grid-cols-1 gap-3">
                              {selectedModule.materials.map(material => (
                                <div
                                  key={material.id}
                                  className={`p-3 border rounded-lg cursor-pointer transition-all flex justify-between items-center ${activeMaterial?.id === material.id ? 'border-primary bg-primary/5' : ''} ${material.isCompleted ? 'border-green-300 dark:border-green-800' : ''}`}
                                  onClick={() => handleMaterialSelect(material)}
                                >
                                  <div className="flex items-center">
                                    {material.type === 'video' && <Play className="h-4 w-4 mr-3 text-blue-500" />}
                                    {material.type === 'document' && <FileText className="h-4 w-4 mr-3 text-amber-500" />}
                                    {material.type === 'quiz' && <Trophy className="h-4 w-4 mr-3 text-green-500" />}
                                    <div>
                                      <p className="font-medium">{material.title}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {material.type.charAt(0).toUpperCase() + material.type.slice(1)}
                                        {material.duration ? ` • ${material.duration}` : ''}
                                      </p>
                                    </div>
                                  </div>
                                  {material.isCompleted && (
                                    <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
                                      <Check className="h-3 w-3 mr-1" /> 
                                      Completed
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-medium">
                                {activeMaterial ? activeMaterial.title : 'Select a material'}
                              </h3>
                              {activeMaterial && !activeMaterial.isCompleted && (
                                <Button onClick={() => markAsCompleted(activeMaterial)} size="sm">
                                  <Check className="h-4 w-4 mr-2" /> Mark as Completed
                                </Button>
                              )}
                            </div>
                            
                            {renderMaterialContent()}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-xl font-medium mb-2">Select a Module</h3>
                          <p className="text-muted-foreground">
                            Choose a module from the left to view its content
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default CourseDetails;

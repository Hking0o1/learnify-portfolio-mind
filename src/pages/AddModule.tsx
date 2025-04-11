
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useUserAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModuleForm } from "@/components/course/ModuleForm";
import AIModuleGenerator from "@/components/course/AIModuleGenerator";
import { courseAPI } from "@/services/api";

const AddModule = () => {
  const { courseId } = useParams<{courseId: string}>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isInstructor } = useUserAuth();
  const [activeTab, setActiveTab] = useState("manual");
  const [courseData, setCourseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) {
        console.error("No course ID provided");
        setIsLoading(false);
        return;
      }
      
      try {
        console.log("Fetching course data for ID:", courseId);
        const course = await courseAPI.getCourse(courseId);
        console.log("Course data fetched:", course);
        setCourseData(course);
      } catch (error) {
        console.error("Error fetching course:", error);
        toast({
          title: "Error",
          description: "Failed to fetch course details",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourseData();
  }, [courseId, toast]);
  
  const handleModuleSuccess = () => {
    toast({
      title: "Success",
      description: "Module added successfully. Redirecting to course page...",
    });
    
    setTimeout(() => {
      navigate(`/courses/${courseId}`);
    }, 1500);
  };
  
  if (!isInstructor) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You don't have permission to add modules.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/dashboard")}>
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!courseId) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>
                No course ID was provided.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/dashboard")}>
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Add Module to Course</h1>
            <p className="text-muted-foreground">
              Create a new module with learning materials
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate(`/courses/${courseId}`)}>
            Cancel
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-6 grid-cols-1"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="manual">Manual Creation</TabsTrigger>
              <TabsTrigger value="ai">AI Generation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual">
              <ModuleForm 
                courseId={courseId} 
                onSuccess={handleModuleSuccess}
              />
            </TabsContent>
            
            <TabsContent value="ai">
              {courseData ? (
                <AIModuleGenerator
                  courseId={courseId}
                  courseTitle={courseData.title}
                  courseDescription={courseData.description}
                  onSuccess={handleModuleSuccess}
                />
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-60">
                    <p className="text-muted-foreground">
                      {isLoading ? "Loading course data..." : "Course data not available"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AddModule;

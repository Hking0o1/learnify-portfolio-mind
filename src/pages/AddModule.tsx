
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useUserAuth } from "@/contexts/AuthContext";
import { Plus, Trash2, FileVideo, FileText, HelpCircle } from "lucide-react";

// Material types
type MaterialType = "video" | "document" | "quiz";

interface Material {
  id: number;
  title: string;
  type: MaterialType;
  url: string;
  duration?: string;
}

const AddModule = () => {
  const { courseId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isInstructor } = useUserAuth();
  
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [materials, setMaterials] = useState<Material[]>([]);
  const [currentMaterial, setCurrentMaterial] = useState<Material>({
    id: 1,
    title: "",
    type: "video",
    url: "",
    duration: "",
  });

  const handleAddMaterial = () => {
    if (!currentMaterial.title || !currentMaterial.url) {
      toast({
        title: "Error",
        description: "Material title and URL are required.",
        variant: "destructive",
      });
      return;
    }

    setMaterials([...materials, { ...currentMaterial, id: Date.now() }]);
    setCurrentMaterial({
      id: Date.now() + 1,
      title: "",
      type: "video" as MaterialType,
      url: "",
      duration: "",
    });
  };

  const handleRemoveMaterial = (id: number) => {
    setMaterials(materials.filter((material) => material.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!moduleTitle) {
      toast({
        title: "Error",
        description: "Module title is required.",
        variant: "destructive",
      });
      return;
    }

    if (materials.length === 0) {
      toast({
        title: "Error",
        description: "Add at least one material to the module.",
        variant: "destructive",
      });
      return;
    }

    // In a real application, this would send the data to your backend
    console.log("Module Data:", {
      courseId,
      title: moduleTitle,
      description: moduleDescription,
      materials,
    });

    toast({
      title: "Module Added!",
      description: "Your module has been successfully added to the course.",
    });

    // Navigate back to course details
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
          {/* Module Information */}
          <Card>
            <CardHeader>
              <CardTitle>Module Information</CardTitle>
              <CardDescription>
                Define the basics of this learning module
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="moduleTitle" className="text-sm font-medium">
                    Module Title
                  </label>
                  <Input
                    id="moduleTitle"
                    placeholder="e.g. Introduction to JavaScript"
                    value={moduleTitle}
                    onChange={(e) => setModuleTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="moduleDescription" className="text-sm font-medium">
                    Module Description
                  </label>
                  <Textarea
                    id="moduleDescription"
                    placeholder="What will students learn in this module?"
                    value={moduleDescription}
                    onChange={(e) => setModuleDescription(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Add Module Materials */}
          <Card>
            <CardHeader>
              <CardTitle>Module Materials</CardTitle>
              <CardDescription>
                Add videos, documents, and quizzes to your module
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Material Form */}
                <div className="space-y-4 p-4 border rounded-md">
                  <h3 className="font-medium">Add New Material</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="materialTitle" className="text-sm font-medium">
                        Material Title
                      </label>
                      <Input
                        id="materialTitle"
                        placeholder="e.g. Introduction Video"
                        value={currentMaterial.title}
                        onChange={(e) => setCurrentMaterial({ ...currentMaterial, title: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="materialType" className="text-sm font-medium">
                        Material Type
                      </label>
                      <select
                        id="materialType"
                        className="w-full p-2 rounded-md border border-input bg-background"
                        value={currentMaterial.type}
                        onChange={(e) => setCurrentMaterial({ ...currentMaterial, type: e.target.value as MaterialType })}
                      >
                        <option value="video">Video</option>
                        <option value="document">Document</option>
                        <option value="quiz">Quiz</option>
                      </select>
                    </div>

                    {currentMaterial.type === "video" && (
                      <div className="space-y-2">
                        <label htmlFor="materialDuration" className="text-sm font-medium">
                          Duration
                        </label>
                        <Input
                          id="materialDuration"
                          placeholder="e.g. 15:30"
                          value={currentMaterial.duration || ""}
                          onChange={(e) => setCurrentMaterial({ ...currentMaterial, duration: e.target.value })}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="materialUrl" className="text-sm font-medium">
                      Material URL
                    </label>
                    <Input
                      id="materialUrl"
                      placeholder="https://example.com/video.mp4"
                      value={currentMaterial.url}
                      onChange={(e) => setCurrentMaterial({ ...currentMaterial, url: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      {currentMaterial.type === "video" && "Provide a URL to your video content (YouTube, Vimeo, etc.)"}
                      {currentMaterial.type === "document" && "Link to a PDF, presentation, or other document resource"}
                      {currentMaterial.type === "quiz" && "Link to an external quiz or assessment"}
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={handleAddMaterial}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Material
                  </Button>
                </div>

                {/* Materials List */}
                <div>
                  <h3 className="font-medium mb-4">Materials in This Module ({materials.length})</h3>
                  
                  {materials.length === 0 ? (
                    <div className="text-center p-6 border rounded-md border-dashed">
                      <p className="text-muted-foreground">No materials added yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {materials.map((material) => (
                        <div key={material.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center space-x-3">
                            {material.type === "video" && <FileVideo className="h-5 w-5 text-blue-500" />}
                            {material.type === "document" && <FileText className="h-5 w-5 text-green-500" />}
                            {material.type === "quiz" && <HelpCircle className="h-5 w-5 text-orange-500" />}
                            
                            <div>
                              <p className="font-medium">{material.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {material.type}
                                {material.duration && ` • ${material.duration}`}
                              </p>
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveMaterial(material.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6">
              <Button variant="outline" onClick={() => navigate(`/courses/${courseId}`)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!moduleTitle || materials.length === 0}>
                Save Module
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AddModule;

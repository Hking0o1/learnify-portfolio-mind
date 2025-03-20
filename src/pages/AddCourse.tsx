
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUserAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { courseAPI, useAPI } from "@/services/api";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Form schema
const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  level: z.string(),
  category: z.string(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Price must be a valid number" }),
  thumbnail: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  duration: z.string(),
});

const AddCourse = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isInstructor } = useUserAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { withToast } = useAPI();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      level: "beginner",
      category: "programming",
      price: "0",
      thumbnail: "",
      duration: "4 weeks",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Convert price to number for the API
      const courseData = {
        ...values,
        price: parseFloat(values.price),
      };
      
      // Call the API service
      const result = await withToast(
        () => courseAPI.createCourse(courseData),
        "Course created successfully!",
        "Failed to create course"
      );
      
      if (result) {
        // Navigate to instructor dashboard after successful creation
        setTimeout(() => {
          navigate("/instructor");
        }, 1500);
      }
    } catch (error) {
      console.error("Error creating course:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isInstructor) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You don't have permission to create courses.
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
            <h1 className="text-2xl font-bold tracking-tight">Create New Course</h1>
            <p className="text-muted-foreground">
              Fill in the details to create a new course
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/instructor")}>
            Cancel
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
              <CardDescription>
                Enter the basic information about your course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Advanced JavaScript Concepts" {...field} />
                        </FormControl>
                        <FormDescription>
                          Choose a clear and descriptive title for your course.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe what students will learn in this course..." 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a detailed description of the course content and objectives.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty Level</FormLabel>
                          <FormControl>
                            <select
                              className="w-full p-2 rounded-md border border-input bg-background"
                              {...field}
                            >
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                              <option value="expert">Expert</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course Category</FormLabel>
                          <FormControl>
                            <select
                              className="w-full p-2 rounded-md border border-input bg-background"
                              {...field}
                            >
                              <option value="programming">Programming</option>
                              <option value="design">Design</option>
                              <option value="business">Business</option>
                              <option value="marketing">Marketing</option>
                              <option value="finance">Finance</option>
                              <option value="personal-development">Personal Development</option>
                              <option value="data-science">Data Science</option>
                              <option value="ai-ml">AI & Machine Learning</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course Price (USD)</FormLabel>
                          <FormControl>
                            <Input placeholder="29.99" type="text" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter 0 for free courses.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course Duration</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 4 weeks" {...field} />
                          </FormControl>
                          <FormDescription>
                            Expected time to complete the course.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="thumbnail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thumbnail URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormDescription>
                          Provide a URL for your course thumbnail image.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button type="button" variant="outline" onClick={() => form.reset()} disabled={isSubmitting}>
                      Reset
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Creating..." : "Create Course"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AddCourse;

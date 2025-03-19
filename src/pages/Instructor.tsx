
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, MessageSquare, FileText, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Mock data
const courses = [
  {
    id: 1,
    title: "Machine Learning Fundamentals",
    students: 124,
    rating: 4.8,
    status: "Published",
    lastUpdated: "2 days ago"
  },
  {
    id: 2,
    title: "Data Analysis with Python",
    students: 89,
    rating: 4.6,
    status: "Published",
    lastUpdated: "1 week ago"
  },
  {
    id: 3,
    title: "AI for Portfolio Management",
    students: 56,
    rating: 4.5,
    status: "Draft",
    lastUpdated: "3 days ago"
  }
];

const Instructor = () => {
  const [activeTab, setActiveTab] = useState("courses");
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Courses",
      value: "12",
      icon: <BookOpen className="h-4 w-4 text-blue-600" />,
    },
    {
      title: "Total Students",
      value: "1,248",
      icon: <Users className="h-4 w-4 text-green-600" />,
    },
    {
      title: "Messages",
      value: "28",
      icon: <MessageSquare className="h-4 w-4 text-orange-600" />,
    },
    {
      title: "Materials",
      value: "86",
      icon: <FileText className="h-4 w-4 text-purple-600" />,
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Instructor Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your courses, students, and learning materials
            </p>
          </div>
          <Button onClick={() => {}}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Course
          </Button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-muted">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Course Management</CardTitle>
                  <CardDescription>
                    Manage your existing courses or create new ones
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Input 
                    placeholder="Search courses..." 
                    className="max-w-[200px]" 
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 p-4 font-medium border-b">
                    <div className="col-span-2">Course Name</div>
                    <div>Students</div>
                    <div>Rating</div>
                    <div>Status</div>
                    <div>Actions</div>
                  </div>
                  {courses.map((course) => (
                    <div 
                      key={course.id} 
                      className="grid grid-cols-6 p-4 border-b items-center hover:bg-muted/50"
                    >
                      <div className="col-span-2 font-medium">
                        {course.title}
                        <p className="text-xs text-muted-foreground">Updated {course.lastUpdated}</p>
                      </div>
                      <div>{course.students}</div>
                      <div>{course.rating}</div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          course.status === "Published" 
                            ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                        }`}>
                          {course.status}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>
                  View and manage students enrolled in your courses
                </CardDescription>
              </CardHeader>
              <CardContent className="h-96 flex items-center justify-center border-t">
                <p className="text-muted-foreground">Student management interface will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Analytics</CardTitle>
                <CardDescription>
                  View performance metrics for your courses
                </CardDescription>
              </CardHeader>
              <CardContent className="h-96 flex items-center justify-center border-t">
                <p className="text-muted-foreground">Analytics dashboard will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Learning Materials</CardTitle>
                <CardDescription>
                  Manage your course materials and resources
                </CardDescription>
              </CardHeader>
              <CardContent className="h-96 flex items-center justify-center border-t">
                <p className="text-muted-foreground">Learning materials management interface will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Instructor;

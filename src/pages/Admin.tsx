
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, BookOpen, Users, BarChart, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Users",
      value: "2,856",
      change: "+12%",
      icon: <Users className="h-4 w-4 text-blue-600" />,
    },
    {
      title: "Active Courses",
      value: "148",
      change: "+4%",
      icon: <BookOpen className="h-4 w-4 text-green-600" />,
    },
    {
      title: "Instructors",
      value: "64",
      change: "+8%",
      icon: <User className="h-4 w-4 text-orange-600" />,
    },
    {
      title: "Revenue",
      value: "$48,560",
      change: "+16%",
      icon: <BarChart className="h-4 w-4 text-purple-600" />,
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage courses, users, and platform settings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Platform Settings
            </Button>
            <Button size="sm">
              <Shield className="mr-2 h-4 w-4" />
              Access Control
            </Button>
          </div>
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
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-muted">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Overview</CardTitle>
                <CardDescription>
                  Monitor key metrics and performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent className="h-96 flex items-center justify-center border-t">
                <p className="text-muted-foreground">Analytics dashboard will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Management</CardTitle>
                <CardDescription>
                  Add, edit or remove courses
                </CardDescription>
              </CardHeader>
              <CardContent className="h-96 flex items-center justify-center border-t">
                <p className="text-muted-foreground">Course management interface will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage students, instructors and administrators
                </CardDescription>
              </CardHeader>
              <CardContent className="h-96 flex items-center justify-center border-t">
                <p className="text-muted-foreground">User management interface will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>
                  View detailed reports and export data
                </CardDescription>
              </CardHeader>
              <CardContent className="h-96 flex items-center justify-center border-t">
                <p className="text-muted-foreground">Reports interface will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;

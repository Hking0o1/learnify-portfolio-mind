
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  BookOpen,
  Calendar,
  Clock,
  MessageSquare,
  Play,
  Star,
  TrendingUp,
  Trophy,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Dashboard = () => {
  const courses = [
    {
      id: 1,
      title: "Machine Learning Fundamentals",
      progress: 65,
      image: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      instructor: "Dr. Alex Johnson",
      lastActivity: "Yesterday",
      nextLesson: "Neural Networks Basics",
      badge: "Trending",
    },
    {
      id: 2,
      title: "Advanced Data Analysis",
      progress: 42,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      instructor: "Prof. Sarah Williams",
      lastActivity: "3 days ago",
      nextLesson: "Time Series Analysis",
    },
    {
      id: 3,
      title: "Portfolio Management Strategies",
      progress: 89,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      instructor: "Michael Chen",
      lastActivity: "Today",
      nextLesson: "Risk Assessment Techniques",
      badge: "New",
    },
  ];

  const recommendations = [
    {
      id: 4,
      title: "Python for Data Science",
      image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      instructor: "Emily Parker",
      match: 98,
    },
    {
      id: 5,
      title: "Financial Portfolio Analysis",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      instructor: "Robert Smith",
      match: 92,
    },
    {
      id: 6,
      title: "Deep Learning Applications",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      instructor: "Lisa Wong",
      match: 87,
    },
  ];

  const achievements = [
    {
      id: 1,
      title: "Machine Learning Pioneer",
      icon: <Trophy className="h-5 w-5 text-yellow-500" />,
      awarded: "Last week",
    },
    {
      id: 2,
      title: "Consistent Learner",
      icon: <Calendar className="h-5 w-5 text-green-500" />,
      awarded: "2 days ago",
    },
    {
      id: 3,
      title: "Analytical Thinker",
      icon: <BarChart className="h-5 w-5 text-blue-500" />,
      awarded: "Today",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Portfolio Analysis Workshop",
      date: "Tomorrow, 2:00 PM",
      type: "Workshop",
    },
    {
      id: 2,
      title: "Data Science Office Hours",
      date: "Wednesday, 4:00 PM",
      type: "Office Hours",
    },
    {
      id: 3,
      title: "Machine Learning Study Group",
      date: "Friday, 6:00 PM",
      type: "Study Group",
    },
  ];

  const stats = [
    {
      title: "Hours Learned",
      value: "48",
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      change: "+12% from last month",
      trend: "up",
    },
    {
      title: "Courses Completed",
      value: "7",
      icon: <BookOpen className="h-5 w-5 text-green-500" />,
      change: "+2 since last login",
      trend: "up",
    },
    {
      title: "Skill Growth",
      value: "24%",
      icon: <TrendingUp className="h-5 w-5 text-purple-500" />,
      change: "Portfolio analysis skills",
      trend: "up",
    },
    {
      title: "Community Engagement",
      value: "12",
      icon: <MessageSquare className="h-5 w-5 text-yellow-500" />,
      change: "Discussions participated",
      trend: "neutral",
    },
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Welcome back, John! Here's what's happening with your learning journey.
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Friends
            </Button>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Play className="h-4 w-4" />
              Resume Learning
            </Button>
          </div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={item}>
              <Card className="border-none shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p
                    className={`text-xs ${
                      stat.trend === "up"
                        ? "text-green-500"
                        : stat.trend === "down"
                        ? "text-red-500"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <Tabs defaultValue="inProgress" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3 mb-6">
            <TabsTrigger value="inProgress">In Progress</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          <TabsContent value="inProgress">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {courses.map((course, index) => (
                <motion.div key={course.id} variants={item}>
                  <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="relative h-48">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      {course.badge && (
                        <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          {course.badge}
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-semibold text-lg">
                          {course.title}
                        </h3>
                        <p className="text-gray-200 text-sm">{course.instructor}</p>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {course.progress}% Complete
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Last activity: {course.lastActivity}
                        </span>
                      </div>
                      <Progress value={course.progress} className="h-2 mb-4" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm">
                          Next: <span className="font-medium">{course.nextLesson}</span>
                        </span>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Continue
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
          <TabsContent value="recommended">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {recommendations.map((course, index) => (
                <motion.div key={course.id} variants={item}>
                  <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="relative h-48">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute top-4 right-4 bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Star className="h-3 w-3" fill="white" /> {course.match}% Match
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-semibold text-lg">
                          {course.title}
                        </h3>
                        <p className="text-gray-200 text-sm">{course.instructor}</p>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        Recommended based on your learning pattern and portfolio needs.
                      </p>
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Enroll Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
          <TabsContent value="achievements">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="border-none shadow-md">
                  <CardHeader>
                    <CardTitle>Recent Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {achievements.map((achievement) => (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                        >
                          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            {achievement.icon}
                          </div>
                          <div>
                            <h4 className="font-medium">{achievement.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Awarded {achievement.awarded}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="border-none shadow-md">
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingEvents.map((event) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{event.title}</h4>
                            <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                              {event.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            {event.date}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Card className="border-none shadow-md overflow-hidden">
          <CardHeader className="pb-0">
            <CardTitle>Learning Network</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex flex-col items-center space-y-2"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`https://i.pravatar.cc/150?img=${20+i}`} />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">User {i}</span>
                </div>
              ))}
              <div className="flex flex-col items-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-gray-500" />
                </div>
                <span className="text-sm font-medium">Add Friends</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;

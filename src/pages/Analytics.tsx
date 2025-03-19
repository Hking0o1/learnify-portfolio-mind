import { Layout } from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, Calendar, Clock, Share2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

const Analytics = () => {
  // Learning time data
  const learningTimeData = [
    { name: "Mon", minutes: 45 },
    { name: "Tue", minutes: 30 },
    { name: "Wed", minutes: 60 },
    { name: "Thu", minutes: 90 },
    { name: "Fri", minutes: 75 },
    { name: "Sat", minutes: 120 },
    { name: "Sun", minutes: 40 },
  ];

  // Progress by subject data
  const subjectProgressData = [
    { subject: "Machine Learning", score: 78, lastWeek: 70 },
    { subject: "Data Analysis", score: 85, lastWeek: 80 },
    { subject: "Risk Assessment", score: 68, lastWeek: 62 },
    { subject: "Financial Planning", score: 72, lastWeek: 68 },
    { subject: "Portfolio Management", score: 65, lastWeek: 58 },
  ];

  // Skill radar data
  const skillRadarData = [
    {
      subject: "Technical Skills",
      A: 85,
      B: 65,
      fullMark: 100,
    },
    {
      subject: "Analysis",
      A: 78,
      B: 60,
      fullMark: 100,
    },
    {
      subject: "Creativity",
      A: 62,
      B: 55,
      fullMark: 100,
    },
    {
      subject: "Communication",
      A: 88,
      B: 70,
      fullMark: 100,
    },
    {
      subject: "Problem Solving",
      A: 82,
      B: 68,
      fullMark: 100,
    },
    {
      subject: "Leadership",
      A: 68,
      B: 60,
      fullMark: 100,
    },
  ];

  // Learning pattern scatter data
  const learningPatternData = [
    { hour: 9, day: "Monday", intensity: 80, size: 8 },
    { hour: 14, day: "Monday", intensity: 55, size: 5 },
    { hour: 20, day: "Monday", intensity: 70, size: 7 },
    { hour: 10, day: "Tuesday", intensity: 40, size: 4 },
    { hour: 16, day: "Tuesday", intensity: 85, size: 8 },
    { hour: 8, day: "Wednesday", intensity: 75, size: 7 },
    { hour: 13, day: "Wednesday", intensity: 50, size: 5 },
    { hour: 19, day: "Wednesday", intensity: 90, size: 9 },
    { hour: 11, day: "Thursday", intensity: 65, size: 6 },
    { hour: 15, day: "Thursday", intensity: 80, size: 8 },
    { hour: 21, day: "Thursday", intensity: 45, size: 4 },
    { hour: 9, day: "Friday", intensity: 60, size: 6 },
    { hour: 14, day: "Friday", intensity: 75, size: 7 },
    { hour: 18, day: "Friday", intensity: 85, size: 8 },
    { hour: 10, day: "Saturday", intensity: 90, size: 9 },
    { hour: 15, day: "Saturday", intensity: 95, size: 9 },
    { hour: 11, day: "Sunday", intensity: 70, size: 7 },
    { hour: 16, day: "Sunday", intensity: 60, size: 6 },
  ];

  // Track days data
  const streakData = [
    { name: "Week 1", streak: 5 },
    { name: "Week 2", streak: 7 },
    { name: "Week 3", streak: 4 },
    { name: "Week 4", streak: 6 },
    { name: "Week 5", streak: 7 },
    { name: "Week 6", streak: 5 },
    { name: "Week 7", streak: 6 },
    { name: "Week 8", streak: 7 },
  ];

  // Completion rate data
  const completionRateData = [
    { name: "Jan", rate: 65 },
    { name: "Feb", rate: 70 },
    { name: "Mar", rate: 68 },
    { name: "Apr", rate: 75 },
    { name: "May", rate: 82 },
    { name: "Jun", rate: 78 },
    { name: "Jul", rate: 85 },
    { name: "Aug", rate: 88 },
    { name: "Sep", rate: 90 },
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
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // Custom day orderer for scatter chart
  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const dayValue = (day: string) => dayOrder.indexOf(day) + 1;

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Learning Analytics</h1>
            <p className="text-gray-500 dark:text-gray-400">
              AI-powered insights into your learning patterns and progress
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Last 30 Days
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Zap className="h-4 w-4" />
              Get Insights
            </Button>
          </div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div variants={item} className="col-span-2">
            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Daily Learning Time</CardTitle>
                    <CardDescription>Hours spent learning each day</CardDescription>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    This Week
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={learningTimeData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis unit="min" />
                    <Tooltip formatter={(value) => [`${value} min`, "Learning Time"]} />
                    <Legend />
                    <Bar
                      dataKey="minutes"
                      name="Learning Time"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-none shadow-md h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Weekly Streak</CardTitle>
                    <CardDescription>Consecutive learning days</CardDescription>
                  </div>
                  <Badge className="flex items-center gap-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <Clock className="h-3 w-3" /> Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={streakData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 7]} />
                    <Tooltip formatter={(value) => [`${value} days`, "Streak"]} />
                    <Line
                      type="monotone"
                      dataKey="streak"
                      name="Learning Streak"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3 mb-6">
            <TabsTrigger value="progress">Subject Progress</TabsTrigger>
            <TabsTrigger value="patterns">Learning Patterns</TabsTrigger>
            <TabsTrigger value="skills">Skill Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="progress">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <motion.div variants={item}>
                <Card className="border-none shadow-md">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Subject Progress</CardTitle>
                        <CardDescription>Score improvement by subject</CardDescription>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800">
                        <Brain className="h-3 w-3 mr-1" />
                        ML Analyzed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={subjectProgressData}
                        layout="vertical"
                        margin={{
                          top: 20,
                          right: 30,
                          left: 100,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis
                          type="category"
                          dataKey="subject"
                          tick={{ width: 100 }}
                        />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="lastWeek"
                          name="Last Week"
                          fill="#94a3b8"
                          radius={[0, 0, 0, 0]}
                          barSize={16}
                        />
                        <Bar
                          dataKey="score"
                          name="Current"
                          fill="#3b82f6"
                          radius={[0, 4, 4, 0]}
                          barSize={16}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card className="border-none shadow-md">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Completion Rate</CardTitle>
                        <CardDescription>Course completion trend over time</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={completionRateData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} unit="%" />
                        <Tooltip formatter={(value) => [`${value}%`, "Completion Rate"]} />
                        <defs>
                          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                          </linearGradient>
                        </defs>
                        <Line
                          type="monotone"
                          dataKey="rate"
                          name="Completion Rate"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          dot={{ r: 4, fill: "#3b82f6" }}
                          activeDot={{ r: 6 }}
                          fillOpacity={1}
                          fill="url(#colorUv)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="patterns">
            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Learning Pattern Analysis</CardTitle>
                    <CardDescription>
                      When and how intensely you learn throughout the week
                    </CardDescription>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800">
                    <Brain className="h-3 w-3 mr-1" />
                    AI Analyzed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{
                      top: 20,
                      right: 30,
                      bottom: 20,
                      left: 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      dataKey="hour"
                      name="Time of Day"
                      unit="h"
                      domain={[6, 22]}
                    />
                    <YAxis
                      type="number"
                      dataKey={(entry) => dayValue(entry.day)}
                      name="Day"
                      domain={[1, 7]}
                      tickFormatter={(value) => dayOrder[Number(value) - 1]}
                    />
                    <ZAxis
                      type="number"
                      dataKey="size"
                      range={[40, 500]}
                      name="Intensity"
                    />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      formatter={(value, name, props) => {
                        if (name === "Time of Day") return `${value}:00`;
                        if (name === "Day") return dayOrder[Number(value) - 1];
                        if (name === "Intensity") return `${props.payload.intensity}%`;
                        return value;
                      }}
                    />
                    <Legend />
                    <Scatter
                      name="Learning Sessions"
                      data={learningPatternData}
                      fill="#3b82f6"
                      shape="circle"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Skills Radar</CardTitle>
                    <CardDescription>
                      Comparison of your current skills vs. industry average
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 h-96 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Your Skills"
                      dataKey="A"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.5}
                    />
                    <Radar
                      name="Industry Average"
                      dataKey="B"
                      stroke="#94a3b8"
                      fill="#94a3b8"
                      fillOpacity={0.3}
                    />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="border-none shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>AI Learning Insights</CardTitle>
                <CardDescription>
                  Personalized recommendations based on your learning patterns
                </CardDescription>
              </div>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800">
                <Brain className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Optimal Learning Times
                </h3>
                <p className="text-blue-700 dark:text-blue-300">
                  Your data shows you're most productive between 9-11 AM and 3-5 PM. 
                  Consider scheduling challenging courses during these times for optimal retention.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                <h3 className="text-lg font-medium text-purple-800 dark:text-purple-200 mb-2">
                  Learning Style Analysis
                </h3>
                <p className="text-purple-700 dark:text-purple-300">
                  Your engagement patterns suggest you learn best through visual and interactive content. 
                  We recommend courses with simulations and practical exercises for better engagement.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-2">
                  Growth Opportunity
                </h3>
                <p className="text-green-700 dark:text-green-300">
                  Based on your portfolio goals and current skill trends, focusing on advanced risk assessment 
                  techniques would complement your existing strengths in data analysis and machine learning.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Analytics;


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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { format, subDays } from "date-fns";

// Utility function to filter data by date range
const filterDataByDays = (data, days) => {
  if (!data || data.length === 0) return [];
  if (days <= 0) return data;
  
  // For demo purposes, we'll simulate filtering by returning a subset of data
  return data.slice(-days);
};

const Analytics = () => {
  const { toast } = useToast();
  const { userId } = useUserAuth();
  const [timeRange, setTimeRange] = useState(30); // Default 30 days
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [insightsDialogOpen, setInsightsDialogOpen] = useState(false);
  const [generatedInsights, setGeneratedInsights] = useState(null);

  // Learning time data
  const learningTimeData = [
    { name: "Mon", minutes: 45, date: format(subDays(new Date(), 6), 'yyyy-MM-dd') },
    { name: "Tue", minutes: 30, date: format(subDays(new Date(), 5), 'yyyy-MM-dd') },
    { name: "Wed", minutes: 60, date: format(subDays(new Date(), 4), 'yyyy-MM-dd') },
    { name: "Thu", minutes: 90, date: format(subDays(new Date(), 3), 'yyyy-MM-dd') },
    { name: "Fri", minutes: 75, date: format(subDays(new Date(), 2), 'yyyy-MM-dd') },
    { name: "Sat", minutes: 120, date: format(subDays(new Date(), 1), 'yyyy-MM-dd') },
    { name: "Sun", minutes: 40, date: format(new Date(), 'yyyy-MM-dd') },
  ];

  // Filter data based on selected time range
  const filteredLearningTimeData = filterDataByDays(learningTimeData, timeRange);

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
    { name: "Week 1", streak: 5, date: format(subDays(new Date(), 56), 'yyyy-MM-dd') },
    { name: "Week 2", streak: 7, date: format(subDays(new Date(), 49), 'yyyy-MM-dd') },
    { name: "Week 3", streak: 4, date: format(subDays(new Date(), 42), 'yyyy-MM-dd') },
    { name: "Week 4", streak: 6, date: format(subDays(new Date(), 35), 'yyyy-MM-dd') },
    { name: "Week 5", streak: 7, date: format(subDays(new Date(), 28), 'yyyy-MM-dd') },
    { name: "Week 6", streak: 5, date: format(subDays(new Date(), 21), 'yyyy-MM-dd') },
    { name: "Week 7", streak: 6, date: format(subDays(new Date(), 14), 'yyyy-MM-dd') },
    { name: "Week 8", streak: 7, date: format(subDays(new Date(), 7), 'yyyy-MM-dd') },
  ];

  // Filter streak data based on selected time range
  const filteredStreakData = filterDataByDays(streakData, timeRange);

  // Completion rate data
  const completionRateData = [
    { name: "Jan", rate: 65, date: format(subDays(new Date(), 270), 'yyyy-MM-dd') },
    { name: "Feb", rate: 70, date: format(subDays(new Date(), 240), 'yyyy-MM-dd') },
    { name: "Mar", rate: 68, date: format(subDays(new Date(), 210), 'yyyy-MM-dd') },
    { name: "Apr", rate: 75, date: format(subDays(new Date(), 180), 'yyyy-MM-dd') },
    { name: "May", rate: 82, date: format(subDays(new Date(), 150), 'yyyy-MM-dd') },
    { name: "Jun", rate: 78, date: format(subDays(new Date(), 120), 'yyyy-MM-dd') },
    { name: "Jul", rate: 85, date: format(subDays(new Date(), 90), 'yyyy-MM-dd') },
    { name: "Aug", rate: 88, date: format(subDays(new Date(), 60), 'yyyy-MM-dd') },
    { name: "Sep", rate: 90, date: format(subDays(new Date(), 30), 'yyyy-MM-dd') },
  ];

  // Filter completion rate data
  const filteredCompletionRateData = filterDataByDays(completionRateData, timeRange);

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

  // Handler for changing time range
  const handleTimeRangeChange = (days) => {
    setTimeRange(days);
    toast({
      title: `Showing data for last ${days} days`,
      description: `Analytics view updated with data from ${format(subDays(new Date(), days), 'MMM dd, yyyy')} to ${format(new Date(), 'MMM dd, yyyy')}`,
    });
  };

  // Handler for sharing analytics
  const handleShareAnalytics = async () => {
    setIsSharing(true);
    try {
      // In a real app, this would generate a shareable URL or export to PDF
      const shareableUrl = `https://example.com/shared-analytics/${userId}?token=${Date.now()}`;
      
      // Copy URL to clipboard
      await navigator.clipboard.writeText(shareableUrl);
      
      toast({
        title: "Analytics Shared",
        description: "Shareable link has been copied to your clipboard",
      });
    } catch (error) {
      console.error('Error sharing analytics:', error);
      toast({
        variant: "destructive",
        title: "Share Failed",
        description: "There was a problem generating your shareable link",
      });
    } finally {
      setIsSharing(false);
    }
  };

  // Handler for generating insights
  const handleGenerateInsights = async () => {
    setIsGeneratingInsights(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate personalized insights based on the data
      const insights = {
        optimalLearningTime: {
          title: "Optimal Learning Times",
          description: "Your data shows you're most productive between 9-11 AM and 3-5 PM. Consider scheduling challenging courses during these times for optimal retention.",
          priority: "high"
        },
        skillGaps: {
          title: "Skill Gap Analysis",
          description: "While you excel in Data Analysis (85%) and Machine Learning (78%), your Risk Assessment skills (68%) could use improvement. Consider focusing on risk management courses to balance your skill portfolio.",
          priority: "medium"
        },
        learningPattern: {
          title: "Learning Style Analysis",
          description: "Your engagement patterns suggest you learn best through visual and interactive content. We recommend courses with simulations and practical exercises for better engagement.",
          priority: "high"
        },
        consistencyMetric: {
          title: "Consistency Improvements",
          description: "Your learning consistency has improved by 35% in the last month. Keep up the regular study sessions as they're proving effective for your retention and progress.",
          priority: "medium"
        },
        growthOpportunity: {
          title: "Growth Opportunity",
          description: "Based on your portfolio goals and current skill trends, focusing on advanced risk assessment techniques would complement your existing strengths in data analysis and machine learning.",
          priority: "high"
        }
      };
      
      setGeneratedInsights(insights);
      setInsightsDialogOpen(true);
      
      toast({
        title: "AI Insights Generated",
        description: "Personalized insights based on your learning patterns are ready",
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      toast({
        variant: "destructive",
        title: "Insights Generation Failed",
        description: "There was a problem analyzing your learning data",
      });
    } finally {
      setIsGeneratingInsights(false);
    }
  };

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
            <Button 
              variant={timeRange === 30 ? "default" : "outline"} 
              className={`flex items-center gap-2 ${timeRange === 30 ? "bg-blue-600" : ""}`}
              onClick={() => handleTimeRangeChange(30)}
            >
              <Calendar className="h-4 w-4" />
              Last 30 Days
            </Button>
            <Button 
              variant={timeRange === 90 ? "default" : "outline"}
              className={`flex items-center gap-2 ${timeRange === 90 ? "bg-blue-600" : ""}`}
              onClick={() => handleTimeRangeChange(90)}
            >
              <Calendar className="h-4 w-4" />
              Last 90 Days
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleShareAnalytics}
              isLoading={isSharing}
              loadingText="Sharing..."
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={handleGenerateInsights}
              isLoading={isGeneratingInsights}
              loadingText="Analyzing..."
            >
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
                    data={filteredLearningTimeData}
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
                    data={filteredStreakData}
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
                        data={filteredCompletionRateData}
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

      {/* AI Insights Dialog */}
      <Dialog open={insightsDialogOpen} onOpenChange={setInsightsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>AI-Generated Learning Insights</DialogTitle>
            <DialogDescription>
              Personalized recommendations based on your learning patterns and progress
            </DialogDescription>
          </DialogHeader>
          
          {generatedInsights && (
            <div className="space-y-6 mt-4">
              {Object.entries(generatedInsights).map(([key, insight]) => (
                <div 
                  key={key}
                  className={`p-4 rounded-lg ${
                    insight.priority === 'high' 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                      : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">
                      {insight.title}
                    </h3>
                    {insight.priority === 'high' && (
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        High Priority
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    {insight.description}
                  </p>
                </div>
              ))}

              <div className="flex justify-end gap-4 pt-4">
                <Button 
                  variant="outline"
                  onClick={() => setInsightsDialogOpen(false)}
                >
                  Close
                </Button>
                <Button>
                  <Share2 className="h-4 w-4 mr-1" />
                  Share Insights
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Analytics;

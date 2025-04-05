
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActionButtons } from "@/components/dashboard/ActionButtons";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import { CalendarClock, BookOpen, BookText, Zap, Trophy, CheckCircle2 } from "lucide-react";
import { type UserProgress, progressAPI, useProgressAPI } from "@/services/api";
import { motion } from "framer-motion";
import { LearningRoadmap } from "@/components/dashboard/LearningRoadmap";

// Update UserProgress interface if needed
interface EnhancedUserProgress extends UserProgress {
  title?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userId, fullName } = useUserAuth();
  const { getUserProgress } = useProgressAPI();
  const [userProgress, setUserProgress] = useState<EnhancedUserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      return;
    }

    const fetchUserProgress = async () => {
      try {
        const progress = await getUserProgress(userId);
        // Add title property if it doesn't exist
        const enhancedProgress = progress.map(item => ({
          ...item,
          title: `Course ${item.course_id?.substring(0, 5) || 'Unknown'}`
        }));
        setUserProgress(enhancedProgress || []);
      } catch (error) {
        console.error("Error fetching user progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, [isAuthenticated, userId, getUserProgress]);

  const totalCourses = userProgress.length;
  const completedCourses = userProgress.filter(course => course.progress_percentage === 100).length;
  const coursesInProgress = userProgress.filter(course => course.progress_percentage > 0 && course.progress_percentage < 100).length;

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{getTimeOfDayGreeting()}, {fullName || "Student"}</h1>
            <p className="text-muted-foreground">
              Here's your learning progress and recommendations
            </p>
          </div>
          <ActionButtons />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Courses Enrolled
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCourses}</div>
                  <p className="text-xs text-muted-foreground">
                    Courses in your learning path
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <BookText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{coursesInProgress}</div>
                  <p className="text-xs text-muted-foreground">
                    Active courses you're taking
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedCourses}</div>
                  <p className="text-xs text-muted-foreground">
                    Courses successfully completed
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Next Goal</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5 Days</div>
                  <p className="text-xs text-muted-foreground">
                    Until your next certificate
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LearningRoadmap className="md:col-span-1" />

          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
              <CardDescription>
                Track your active course progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-5 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : userProgress.length > 0 ? (
                <div className="space-y-4">
                  {userProgress.map((course) => (
                    <motion.div
                      key={course.id}
                      variants={item}
                      className="space-y-2 cursor-pointer"
                      onClick={() => navigate(`/courses/${course.course_id}`)}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium truncate" style={{ maxWidth: '70%' }}>
                          {course.title || "Course Title"}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {course.progress_percentage}%
                        </span>
                      </div>
                      <Progress value={course.progress_percentage} className="h-2" />
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <CalendarClock className="h-3 w-3 mr-1" />
                          Last accessed: {new Date(course.last_accessed).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Zap className="h-3 w-3 mr-1" />
                          {course.progress_percentage < 100 ? "Continue" : "Review"}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    You haven't enrolled in any courses yet.
                  </p>
                  <button
                    onClick={() => navigate("/courses")}
                    className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Browse Courses
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

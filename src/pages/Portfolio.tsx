
import { Layout } from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  BarChart,
  Brain,
  Download,
  FileText,
  LineChart,
  Share2,
  Sparkles,
  Target,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart as RechartArea, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart as RechartBar, Bar, LineChart as RechartLine, Line } from "recharts";
import { usePortfolioAPI } from "@/services/api";
import { useUserAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { type Recommendation } from "@/services/portfolio";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Portfolio = () => {
  const { userId } = useUserAuth();
  const navigate = useNavigate();
  const { 
    exportPortfolioWithToast,
    sharePortfolioWithToast,
    getRecommendationsWithToast,
    startAssessmentWithToast,
    getUserSkills
  } = usePortfolioAPI();
  
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);
  const [isStartingAssessment, setIsStartingAssessment] = useState(false);
  const [skillGroups, setSkillGroups] = useState([]);
  const [learningProgress, setLearningProgress] = useState([]);
  const [skillDistribution, setSkillDistribution] = useState([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState<'line' | 'area' | 'bar'>('area');
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [certDialogOpen, setCertDialogOpen] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) return;
      
      try {
        const portfolioData = await getUserSkills(userId);
        setSkillGroups(portfolioData.skillGroups || []);
        setLearningProgress(portfolioData.learningProgress || []);
        setSkillDistribution(portfolioData.skillDistribution || []);
        setUserDataLoaded(true);
      } catch (error) {
        console.error('Failed to load user portfolio data:', error);
      }
    };
    
    loadUserData();
  }, [userId, getUserSkills]);

  const growthOpportunities = [
    {
      id: 1,
      skill: "Advanced ML Algorithms",
      description: "Expand knowledge in advanced machine learning algorithms and applications",
      match: 92,
      courses: 3,
    },
    {
      id: 2,
      skill: "Risk Management",
      description: "Develop deeper expertise in financial risk assessment methodologies",
      match: 87,
      courses: 2,
    },
    {
      id: 3,
      skill: "Leadership Development",
      description: "Enhance team leadership and project management capabilities",
      match: 81,
      courses: 4,
    },
  ];

  const certifications = [
    {
      id: 1,
      name: "Machine Learning Specialist",
      issuer: "Data Science Academy",
      date: "June 2023",
      credentialID: "ML-2023-078",
      image: "/placeholder.svg",
      description: "This certification validates expertise in machine learning algorithms, model evaluation, and practical implementation of ML solutions.",
      skills: ["Neural Networks", "Data Preprocessing", "Model Evaluation", "Python"],
      issueDate: "2023-06-15",
      expiryDate: "2026-06-15"
    },
    {
      id: 2,
      name: "Financial Portfolio Analysis",
      issuer: "Finance Institute",
      date: "February 2023",
      credentialID: "FPA-2023-124",
      image: "/placeholder.svg",
      description: "Demonstrates proficiency in analyzing financial portfolios, risk assessment, and investment strategies.",
      skills: ["Financial Modeling", "Risk Analysis", "Asset Allocation", "Statistical Analysis"],
      issueDate: "2023-02-10",
      expiryDate: "2026-02-10"
    },
    {
      id: 3,
      name: "Advanced Data Analysis",
      issuer: "Analytics Association",
      date: "November 2022",
      credentialID: "ADA-2022-342",
      image: "/placeholder.svg", 
      description: "Certifies advanced knowledge in data analysis methodologies, statistical techniques, and data visualization.",
      skills: ["Statistical Modeling", "Data Visualization", "Hypothesis Testing", "R Programming"],
      issueDate: "2022-11-05",
      expiryDate: "2025-11-05"
    },
  ];

  const skillProgressData = skillGroups.flatMap(group =>
    group.skills.map(skill => ({
      name: skill.name,
      value: skill.level,
      category: group.name
    }))
  ).sort((a, b) => b.value - a.value).slice(0, 10);

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

  // Button handlers
  const handleExportPortfolio = async (format: 'pdf' | 'json') => {
    if (!userId) return;
    
    setIsExporting(true);
    try {
      await exportPortfolioWithToast(userId, format);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSharePortfolio = async () => {
    if (!userId) return;
    
    setIsSharing(true);
    try {
      // For simplicity, just sharing via URL
      await sharePortfolioWithToast(userId, 'url');
    } catch (error) {
      console.error('Share error:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleGetRecommendations = async () => {
    if (!userId) return;
    
    setIsGeneratingRecommendations(true);
    try {
      const personalizedRecommendations = await getRecommendationsWithToast(userId);
      setRecommendations(personalizedRecommendations);
      console.log('Personalized recommendations:', personalizedRecommendations);
    } catch (error) {
      console.error('Recommendations error:', error);
    } finally {
      setIsGeneratingRecommendations(false);
    }
  };

  const handleStartAssessment = async () => {
    if (!userId) return;
    
    setIsStartingAssessment(true);
    try {
      const result = await startAssessmentWithToast(userId);
      console.log('Assessment started:', result);
      
      if (result.success && result.redirectUrl) {
        navigate(result.redirectUrl);
      }
    } catch (error) {
      console.error('Assessment error:', error);
    } finally {
      setIsStartingAssessment(false);
    }
  };

  const handleExploreOpportunity = (opportunityId: number) => {
    console.log(`Exploring opportunity ${opportunityId}`);
    navigate(`/courses/${opportunityId}`);
  };
  
  const handleViewCertification = (cert) => {
    setSelectedCertification(cert);
    setCertDialogOpen(true);
  };

  const COLORS = ["#3b82f6", "#6366f1", "#8b5cf6"];

  // Render chart based on selected type
  const renderLearningProgressChart = () => {
    switch (selectedChartType) {
      case 'line':
        return (
          <RechartLine
            data={learningProgress}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone" 
              dataKey="progress"
              name="Skill Progress"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4, fill: "#3b82f6" }}
              activeDot={{ r: 6 }}
            />
          </RechartLine>
        );
      case 'bar':
        return (
          <RechartBar
            data={learningProgress}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="progress" 
              name="Skill Progress" 
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
          </RechartBar>
        );
      case 'area':
      default:
        return (
          <RechartArea
            data={learningProgress}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="progress"
              name="Skill Progress"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#progressGradient)"
            />
          </RechartArea>
        );
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Skills Portfolio</h1>
            <p className="text-gray-500 dark:text-gray-400">
              AI-powered analysis of your skills and learning progress
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => handleExportPortfolio('pdf')}
              isLoading={isExporting}
              loadingText="Exporting..."
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleSharePortfolio}
              isLoading={isSharing}
              loadingText="Sharing..."
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={handleGetRecommendations}
              isLoading={isGeneratingRecommendations}
              loadingText="Generating..."
            >
              <Sparkles className="h-4 w-4" />
              Get Recommendations
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-1 lg:col-span-2 border-none shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Skills Assessment</CardTitle>
                  <CardDescription>
                    Your current skill levels based on course completions and assessments
                  </CardDescription>
                </div>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800">
                  <Zap className="h-3 w-3 mr-1" />
                  ML Analyzed
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-8"
              >
                {skillGroups.map((group, groupIndex) => (
                  <motion.div key={groupIndex} variants={item} className="space-y-4">
                    <h3 className="font-medium text-lg">{group.name}</h3>
                    <div className="space-y-4">
                      {group.skills.map((skill, skillIndex) => (
                        <div key={skillIndex} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{skill.name}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {skill.level}%
                            </span>
                          </div>
                          <Progress value={skill.level} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Skill Distribution</CardTitle>
              <CardDescription>
                Breakdown of your skill categories
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pt-0">
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={skillDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {skillDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="border-none shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Learning Progress</CardTitle>
                  <CardDescription>
                    Your skill development journey over time
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={selectedChartType === 'line' ? 'default' : 'outline'} 
                    size="sm" 
                    className={`h-8 ${selectedChartType === 'line' ? 'bg-blue-600' : ''}`}
                    onClick={() => setSelectedChartType('line')}
                  >
                    <LineChart className="h-4 w-4 mr-1" />
                    Line
                  </Button>
                  <Button 
                    variant={selectedChartType === 'area' ? 'default' : 'outline'} 
                    size="sm" 
                    className={`h-8 ${selectedChartType === 'area' ? 'bg-blue-600' : ''}`}
                    onClick={() => setSelectedChartType('area')}
                  >
                    <AreaChart className="h-4 w-4 mr-1" />
                    Area
                  </Button>
                  <Button 
                    variant={selectedChartType === 'bar' ? 'default' : 'outline'} 
                    size="sm" 
                    className={`h-8 ${selectedChartType === 'bar' ? 'bg-blue-600' : ''}`}
                    onClick={() => setSelectedChartType('bar')}
                  >
                    <BarChart className="h-4 w-4 mr-1" />
                    Bar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 h-80">
              <ResponsiveContainer width="100%" height="100%">
                {renderLearningProgressChart()}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="growth" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3 mb-6">
            <TabsTrigger value="growth">Growth Opportunities</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="topSkills">Top Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="growth">
            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>AI-Recommended Growth Areas</CardTitle>
                    <CardDescription>
                      Personalized recommendations based on your portfolio and career goals
                    </CardDescription>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800">
                    <Brain className="h-3 w-3 mr-1" />
                    ML Powered
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  {(recommendations.length > 0 ? recommendations : growthOpportunities).map((opportunity) => (
                    <motion.div key={opportunity.id} variants={item}>
                      <Card className="h-full border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{opportunity.title || opportunity.skill}</CardTitle>
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              {opportunity.match}% Match
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            {opportunity.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {opportunity.type || `${opportunity.courses} related courses`}
                            </span>
                            <Button 
                              size="sm" 
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleExploreOpportunity(opportunity.id)}
                            >
                              <ArrowRight className="h-4 w-4 mr-1" />
                              Explore
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certifications">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Your Certifications</CardTitle>
                <CardDescription>
                  Achievements and credentials that validate your skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {certifications.map((cert, index) => (
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{cert.name}</h4>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {cert.date}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          Issued by {cert.issuer}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Credential ID: {cert.credentialID}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewCertification(cert)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="topSkills">
            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Top 10 Skills</CardTitle>
                    <CardDescription>
                      Your highest rated skills across all categories
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartBar
                    data={skillProgressData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Proficiency Level" fill="#3b82f6" />
                  </RechartBar>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="border-none shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Personalized Learning Recommendations</CardTitle>
                <CardDescription>
                  Based on portfolio analysis and industry trends
                </CardDescription>
              </div>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800">
                <Target className="h-3 w-3 mr-1" />
                Personalized
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-6 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Complete your portfolio assessment to receive personalized recommendations for courses, projects, and career paths.
              </p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleStartAssessment}
                isLoading={isStartingAssessment}
                loadingText="Setting up..."
              >
                Start Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Certification View Dialog */}
      <Dialog open={certDialogOpen} onOpenChange={setCertDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedCertification && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedCertification.name}</DialogTitle>
                <DialogDescription>
                  Issued by {selectedCertification.issuer} on {selectedCertification.date}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <img 
                    src={selectedCertification.image} 
                    alt={`${selectedCertification.name} Certificate`}
                    className="h-48 object-contain"
                  />
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedCertification.description}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Skills Validated</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCertification.skills.map((skill, i) => (
                      <Badge key={i} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">Issue Date</h4>
                    <p className="text-sm">{selectedCertification.issueDate}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">Expiry Date</h4>
                    <p className="text-sm">{selectedCertification.expiryDate}</p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">Credential ID</h4>
                  <p className="text-sm font-mono">{selectedCertification.credentialID}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setCertDialogOpen(false)}>
                  Close
                </Button>
                <Button>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Portfolio;

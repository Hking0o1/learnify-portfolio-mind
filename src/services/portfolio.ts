
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Skill {
  id?: string;
  name: string;
  level: number;
  category?: string;
}

export interface SkillGroup {
  id?: string;
  name: string;
  skills: Skill[];
}

export interface GrowthOpportunity {
  id: string;
  skill: string;
  description: string;
  match: number;
  courses: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialID: string;
  image?: string;
  description?: string;
  issueDate?: string;
  expiryDate?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  match: number;
  type: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  estimatedDuration?: string;
  focusAreas?: string[];
  questions?: {
    id: number;
    question: string;
    skillArea: string;
  }[];
}

export interface PortfolioData {
  skillGroups: SkillGroup[];
  learningProgress: { name: string; progress: number }[];
  skillDistribution: { name: string; value: number }[];
}

export interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  link: string;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  steps: RoadmapStep[];
  progress: number;
}

// Mock data for development
const mockData = {
  skillGroups: [
    { 
      id: "1", 
      name: "Technical Skills", 
      skills: [
        { id: "1", name: "JavaScript", level: 40, category: "Programming" },
        { id: "2", name: "Python", level: 30, category: "Programming" },
        { id: "3", name: "Data Analysis", level: 25, category: "Data Science" }
      ]
    },
    {
      id: "2",
      name: "Business Skills",
      skills: [
        { id: "4", name: "Project Management", level: 50, category: "Management" },
        { id: "5", name: "Communication", level: 65, category: "Soft Skills" }
      ]
    }
  ],
  learningProgress: [
    { name: "Jan", progress: 20 },
    { name: "Feb", progress: 30 },
    { name: "Mar", progress: 40 },
    { name: "Apr", progress: 50 },
    { name: "May", progress: 60 },
    { name: "Jun", progress: 70 }
  ],
  skillDistribution: [
    { name: "Programming", value: 40 },
    { name: "Management", value: 30 },
    { name: "Design", value: 20 },
    { name: "Data Science", value: 10 }
  ]
};

export const portfolioAPI = {
  // Get user skills portfolio
  getUserSkills: async (userId: string): Promise<PortfolioData> => {
    try {
      console.log("Fetching skills data for user:", userId);
      
      // For development, use mock data for now
      console.log("Using mock data for now");
      return mockData;
      
      // TODO: Uncomment when database is properly set up
      /*
      // First, check if user has a skills profile
      const { data: userSkillsData, error: userSkillsError } = await supabase
        .from('user_skills')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      // If no profile exists, create one
      if (userSkillsError || !userSkillsData) {
        console.log("Creating new user skills profile");
        const { data: newUserSkills, error: createError } = await supabase
          .from('user_skills')
          .insert([{ user_id: userId }])
          .select()
          .single();
        
        if (createError) {
          console.error("Error creating user skills:", createError);
          throw createError;
        }
        
        userSkillsData = newUserSkills;
        
        // Generate default skill groups
        await createDefaultSkillData(userSkillsData.id);
      }
      
      // Now fetch all skill data
      const { data: skillGroups, error: skillsError } = await supabase
        .from('skill_groups')
        .select(`
          id,
          name,
          skills (
            id,
            name,
            level,
            category
          )
        `)
        .eq('user_skills_id', userSkillsData.id);
      
      if (skillsError) {
        console.error("Error fetching skill groups:", skillsError);
        throw skillsError;
      }
      
      // Fetch learning progress
      const { data: learningProgress, error: progressError } = await supabase
        .from('learning_progress')
        .select('month, progress')
        .eq('user_skills_id', userSkillsData.id)
        .order('month', { ascending: true });
      
      if (progressError) {
        console.error("Error fetching learning progress:", progressError);
        throw progressError;
      }
      
      // Fetch skill distribution
      const { data: skillDistribution, error: distributionError } = await supabase
        .from('skill_distribution')
        .select('category, percentage')
        .eq('user_skills_id', userSkillsData.id);
      
      if (distributionError) {
        console.error("Error fetching skill distribution:", distributionError);
        throw distributionError;
      }
      
      // Format the data for the frontend
      const formattedProgress = (learningProgress || []).map(item => ({
        name: item.month,
        progress: item.progress
      }));
      
      const formattedDistribution = (skillDistribution || []).map(item => ({
        name: item.category,
        value: item.percentage
      }));
      
      return {
        skillGroups: skillGroups || [],
        learningProgress: formattedProgress,
        skillDistribution: formattedDistribution
      };
      */
    } catch (error) {
      console.error('Error in getUserSkills:', error);
      // Return empty data structure on error
      return {
        skillGroups: [],
        learningProgress: [],
        skillDistribution: []
      };
    }
  },
  
  // Get growth opportunities
  getGrowthOpportunities: async (userId: string): Promise<GrowthOpportunity[]> => {
    try {
      // For demo, return mock data
      return [
        {
          id: "1",
          skill: "Advanced ML Algorithms",
          description: "Expand knowledge in advanced machine learning algorithms and applications",
          match: 92,
          courses: 3,
        },
        {
          id: "2",
          skill: "Risk Management",
          description: "Develop deeper expertise in financial risk assessment methodologies",
          match: 87,
          courses: 2,
        },
        {
          id: "3",
          skill: "Leadership Development",
          description: "Enhance team leadership and project management capabilities",
          match: 81,
          courses: 4,
        },
      ];
    } catch (error) {
      console.error('Error in getGrowthOpportunities:', error);
      return [];
    }
  },
  
  // Get user certifications
  getUserCertifications: async (userId: string): Promise<Certification[]> => {
    try {
      // For demo, return mock data
      return [
        {
          id: "1",
          name: "Machine Learning Specialist",
          issuer: "Data Science Academy",
          date: "June 2023",
          credentialID: "ML-2023-078",
          image: "/placeholder.svg",
          description: "This certification validates expertise in machine learning algorithms, model evaluation, and practical implementation of ML solutions.",
          issueDate: "2023-06-15",
          expiryDate: "2026-06-15"
        },
        {
          id: "2",
          name: "Financial Portfolio Analysis",
          issuer: "Finance Institute",
          date: "February 2023",
          credentialID: "FPA-2023-124",
          image: "/placeholder.svg",
          description: "Demonstrates proficiency in analyzing financial portfolios, risk assessment, and investment strategies.",
          issueDate: "2023-02-10",
          expiryDate: "2026-02-10"
        }
      ];
    } catch (error) {
      console.error('Error in getUserCertifications:', error);
      return [];
    }
  },
  
  // Export portfolio as PDF/JSON
  exportPortfolio: async (userId: string, format: 'pdf' | 'json') => {
    // In a real application, this would generate and return a file
    // For now, we'll create a simulated file for demonstration
    try {
      // Get all user data
      const [skills, certifications, growth] = await Promise.all([
        portfolioAPI.getUserSkills(userId),
        portfolioAPI.getUserCertifications(userId),
        portfolioAPI.getGrowthOpportunities(userId)
      ]);
      
      const portfolioData = {
        userId,
        skills,
        certifications,
        growthOpportunities: growth,
        exportDate: new Date().toISOString(),
      };
      
      // Simulate file creation
      const filename = `portfolio_${userId}_${new Date().toISOString()}.${format}`;
      
      if (format === 'json') {
        // Create and download JSON file
        const fileData = JSON.stringify(portfolioData, null, 2);
        const blob = new Blob([fileData], { type: 'application/json' });
        
        // Create download link and trigger download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // In a real application, this would generate a PDF
        // For demo purposes, just logging
        console.log(`Exporting PDF: ${filename}`);
        // Simulate PDF download with a timeout
        return new Promise(resolve => {
          setTimeout(() => {
            const link = document.createElement('a');
            link.href = '/placeholder.svg'; // Using placeholder for demo
            link.download = filename.replace('pdf', 'svg');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            resolve(true);
          }, 1500);
        });
      }
      
      return { success: true, filename };
    } catch (error) {
      console.error('Error exporting portfolio:', error);
      return { success: false, error: (error as Error).message };
    }
  },
  
  // Share portfolio via URL or email
  sharePortfolio: async (userId: string, method: 'url' | 'email', recipient?: string) => {
    // In a real application, this would create a shareable link or send an email
    try {
      // Generate a unique token for sharing
      const token = `share_${Math.random().toString(36).substring(2, 15)}`;
      
      const shareableUrl = `${window.location.origin}/shared-portfolio/${token}`;
      
      if (method === 'url') {
        // Copy URL to clipboard
        navigator.clipboard.writeText(shareableUrl)
          .catch(err => console.error('Could not copy URL: ', err));
        
        return { success: true, url: shareableUrl };
      } else if (method === 'email' && recipient) {
        // In a real application, this would send an email with the URL
        console.log(`Sharing portfolio via email to ${recipient} with URL: ${shareableUrl}`);
        
        return { success: true, recipient, url: shareableUrl };
      }
      
      return { success: false, error: 'Invalid share method or missing recipient' };
    } catch (error) {
      console.error('Error sharing portfolio:', error);
      return { success: false, error: (error as Error).message };
    }
  },
  
  // Start skill assessment
  startAssessment: async (userId: string) => {
    try {
      console.log("Starting personalized assessment for user:", userId);
      
      return {
        success: true,
        assessmentId: `assessment_${Date.now()}`,
        redirectUrl: `/assessment/${Date.now()}`,
        title: 'Comprehensive Skills Assessment',
        description: 'Evaluate your current skills',
        estimatedDuration: '15-20 minutes',
        focusAreas: ['Technical Skills', 'Soft Skills', 'Domain Knowledge']
      };
    } catch (error) {
      console.error("Error in startAssessment:", error);
      // Return minimal fallback data
      return {
        success: false,
        error: "Failed to create assessment session",
        assessmentId: `assess_${Date.now()}`,
        redirectUrl: `/assessment/${Date.now()}`
      };
    }
  },
  
  // Get personalized recommendations
  getRecommendations: async (userId: string): Promise<Recommendation[]> => {
    try {
      console.log("Getting personalized recommendations for user:", userId);
      
      // Return mock recommendations for development
      return [
        {
          id: "1",
          title: "Advanced Machine Learning Course",
          description: "This comprehensive course will take your ML skills to the next level with practical projects",
          match: 95,
          type: "Course"
        },
        {
          id: "2",
          title: "Data Visualization Workshop",
          description: "Learn to create impactful visualizations to communicate complex data insights effectively",
          match: 88,
          type: "Workshop"
        },
        {
          id: "3",
          title: "Project Management Certification",
          description: "Get certified in agile project management methodologies to lead technical teams",
          match: 82,
          type: "Certification"
        }
      ];
    } catch (error) {
      console.error("Error in getRecommendations:", error);
      // Return empty array on error
      return [];
    }
  },

  // Get user roadmap
  getUserRoadmap: async (userId: string): Promise<Roadmap | null> => {
    try {
      console.log("Getting roadmap for user:", userId);
      
      // For demo, return mock roadmap
      return {
        id: "roadmap_1",
        title: "Full-Stack Developer Path",
        description: "Comprehensive roadmap to becoming a proficient full-stack developer",
        steps: [
          {
            id: 1,
            title: "JavaScript Fundamentals",
            description: "Master core JavaScript concepts and modern ES6+ features",
            status: 'completed',
            link: "https://javascript.info/"
          },
          {
            id: 2,
            title: "React Framework",
            description: "Learn component-based UI development with React",
            status: 'in-progress',
            link: "https://reactjs.org/"
          },
          {
            id: 3,
            title: "Backend Development with Node.js",
            description: "Build scalable server-side applications with Node.js and Express",
            status: 'pending',
            link: "https://nodejs.org/"
          },
          {
            id: 4,
            title: "Database Design & Management",
            description: "Master SQL and NoSQL database concepts",
            status: 'pending',
            link: "https://university.mongodb.com/"
          }
        ],
        progress: 35
      };
    } catch (error) {
      console.error("Error getting user roadmap:", error);
      return null;
    }
  },
  
  // Generate roadmap for new user
  generateUserRoadmap: async (userId: string): Promise<Roadmap | null> => {
    try {
      console.log("Generating roadmap for user:", userId);
      
      // In a real application, this would call the edge function
      // For now, return a mock roadmap
      return {
        id: "new_roadmap_1",
        title: "Personalized Learning Path",
        description: "Your customized journey based on your goals and current skills",
        steps: [
          {
            id: 1,
            title: "Foundation Skills",
            description: "Master the fundamental concepts for your learning path",
            status: 'pending',
            link: "https://example.com/foundations"
          },
          {
            id: 2,
            title: "Intermediate Concepts",
            description: "Build upon your foundation with more advanced topics",
            status: 'pending',
            link: "https://example.com/intermediate"
          },
          {
            id: 3,
            title: "Advanced Techniques",
            description: "Learn cutting-edge techniques in your field",
            status: 'pending',
            link: "https://example.com/advanced"
          },
          {
            id: 4,
            title: "Practical Projects",
            description: "Apply your knowledge through hands-on projects",
            status: 'pending',
            link: "https://example.com/projects"
          }
        ],
        progress: 0
      };
    } catch (error) {
      console.error("Error in generateUserRoadmap:", error);
      return null;
    }
  },
  
  // Update roadmap step status
  updateRoadmapStep: async (roadmapId: string, stepId: number, status: 'completed' | 'in-progress' | 'pending'): Promise<boolean> => {
    try {
      console.log(`Updating step ${stepId} to ${status} in roadmap ${roadmapId}`);
      // In a real application, this would update the database
      
      // Return success for the demo
      return true;
    } catch (error) {
      console.error("Error updating roadmap step:", error);
      return false;
    }
  }
};

// Custom hook for portfolio operations with toast notifications
export const usePortfolioAPI = () => {
  const { toast } = useToast();
  
  return {
    ...portfolioAPI,
    
    // Export portfolio with toast notification
    exportPortfolioWithToast: async (userId: string, format: 'pdf' | 'json') => {
      try {
        toast({
          title: "Exporting Portfolio",
          description: `Preparing your portfolio in ${format.toUpperCase()} format...`,
        });
        
        const result = await portfolioAPI.exportPortfolio(userId, format);
        
        toast({
          title: "Export Complete",
          description: `Your portfolio has been exported successfully.`,
        });
        
        return result;
      } catch (error) {
        console.error("Error exporting portfolio:", error);
        toast({
          title: "Export Failed",
          description: "There was a problem exporting your portfolio. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    
    // Share portfolio with toast notification
    sharePortfolioWithToast: async (userId: string, method: 'url' | 'email', recipient?: string) => {
      try {
        const result = await portfolioAPI.sharePortfolio(userId, method, recipient);
        
        if (result.success) {
          if (method === 'url') {
            toast({
              title: "Share Link Created",
              description: "Portfolio link has been copied to your clipboard.",
            });
          } else {
            toast({
              title: "Portfolio Shared",
              description: `Your portfolio has been shared with ${recipient}.`,
            });
          }
        } else {
          toast({
            title: "Share Failed",
            description: result.error || "Failed to share your portfolio. Please try again.",
            variant: "destructive",
          });
        }
        
        return result;
      } catch (error) {
        console.error("Error sharing portfolio:", error);
        toast({
          title: "Share Failed",
          description: "There was a problem sharing your portfolio. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    
    // Get recommendations with toast notification
    getRecommendationsWithToast: async (userId: string) => {
      try {
        toast({
          title: "Generating Recommendations",
          description: "Analyzing your skills and learning patterns...",
        });
        
        const result = await portfolioAPI.getRecommendations(userId);
        
        toast({
          title: "Recommendations Ready",
          description: "Your personalized recommendations have been generated.",
        });
        
        return result;
      } catch (error) {
        console.error("Error generating recommendations:", error);
        toast({
          title: "Recommendation Failed",
          description: "There was a problem generating your recommendations. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    
    // Start assessment with toast notification
    startAssessmentWithToast: async (userId: string) => {
      try {
        toast({
          title: "Setting Up Assessment",
          description: "Preparing your personalized skills assessment...",
        });
        
        const result = await portfolioAPI.startAssessment(userId);
        
        if (result.success) {
          toast({
            title: "Assessment Ready",
            description: "Your personalized skills assessment has been created. You can begin now.",
          });
        } else {
          toast({
            title: "Setup Failed",
            description: result.error || "There was a problem setting up your assessment.",
            variant: "destructive",
          });
        }
        
        return result;
      } catch (error) {
        console.error("Error starting assessment:", error);
        toast({
          title: "Setup Failed",
          description: "There was a problem setting up your assessment. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    
    // Generate roadmap with toast notification
    generateRoadmapWithToast: async (userId: string) => {
      try {
        toast({
          title: "Creating Your Roadmap",
          description: "Generating a personalized learning roadmap...",
        });
        
        const result = await portfolioAPI.generateUserRoadmap(userId);
        
        if (result) {
          toast({
            title: "Roadmap Created",
            description: "Your personalized learning roadmap is ready.",
          });
        } else {
          toast({
            title: "Roadmap Creation Failed",
            description: "There was a problem creating your roadmap. Please try again.",
            variant: "destructive",
          });
        }
        
        return result;
      } catch (error) {
        console.error("Error generating roadmap:", error);
        toast({
          title: "Roadmap Creation Failed",
          description: "There was a problem creating your roadmap. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    
    // Update roadmap step with toast notification
    updateRoadmapStepWithToast: async (roadmapId: string, stepId: number, status: 'completed' | 'in-progress' | 'pending') => {
      try {
        const result = await portfolioAPI.updateRoadmapStep(roadmapId, stepId, status);
        
        if (result) {
          toast({
            title: "Progress Updated",
            description: "Your learning roadmap has been updated.",
          });
        } else {
          toast({
            title: "Update Failed",
            description: "There was a problem updating your progress. Please try again.",
            variant: "destructive",
          });
        }
        
        return result;
      } catch (error) {
        console.error("Error updating roadmap step:", error);
        toast({
          title: "Update Failed",
          description: "There was a problem updating your progress. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    
    getUserRoadmap: portfolioAPI.getUserRoadmap
  };
};

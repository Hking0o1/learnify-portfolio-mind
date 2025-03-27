
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Skill {
  name: string;
  level: number;
  category?: string;
}

export interface SkillGroup {
  name: string;
  skills: Skill[];
}

export interface GrowthOpportunity {
  id: number;
  skill: string;
  description: string;
  match: number;
  courses: number;
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  date: string;
  credentialID: string;
}

export interface Recommendation {
  id: number;
  title: string;
  description: string;
  match: number;
  type: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  estimatedDuration: string;
  focusAreas: string[];
  questions: {
    id: number;
    question: string;
    skillArea: string;
  }[];
}

export const portfolioAPI = {
  // Get user skills portfolio
  getUserSkills: async (userId: string) => {
    // In a real application, this would fetch from the database
    // For demo purposes, returning mock data
    return {
      skillGroups: [
        {
          name: "Technical Skills",
          skills: [
            { name: "Machine Learning", level: 78 },
            { name: "Data Analysis", level: 85 },
            { name: "Python", level: 92 },
            { name: "SQL", level: 70 },
            { name: "Statistical Modeling", level: 65 },
          ],
        },
        {
          name: "Business Skills",
          skills: [
            { name: "Portfolio Management", level: 68 },
            { name: "Risk Assessment", level: 72 },
            { name: "Financial Analysis", level: 65 },
            { name: "Strategic Planning", level: 60 },
          ],
        },
        {
          name: "Soft Skills",
          skills: [
            { name: "Communication", level: 88 },
            { name: "Problem Solving", level: 82 },
            { name: "Teamwork", level: 75 },
            { name: "Leadership", level: 68 },
          ],
        },
      ],
      learningProgress: [
        { name: "Jan", progress: 25 },
        { name: "Feb", progress: 30 },
        { name: "Mar", progress: 35 },
        { name: "Apr", progress: 40 },
        { name: "May", progress: 48 },
        { name: "Jun", progress: 52 },
        { name: "Jul", progress: 60 },
        { name: "Aug", progress: 65 },
        { name: "Sep", progress: 68 },
      ],
      skillDistribution: [
        { name: "Technical", value: 45 },
        { name: "Business", value: 30 },
        { name: "Soft Skills", value: 25 },
      ]
    };
  },
  
  // Get growth opportunities
  getGrowthOpportunities: async (userId: string) => {
    // Mock data for demo purposes
    return [
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
  },
  
  // Get user certifications
  getUserCertifications: async (userId: string) => {
    // Mock data for demo purposes
    return [
      {
        id: 1,
        name: "Machine Learning Specialist",
        issuer: "Data Science Academy",
        date: "June 2023",
        credentialID: "ML-2023-078",
      },
      {
        id: 2,
        name: "Financial Portfolio Analysis",
        issuer: "Finance Institute",
        date: "February 2023",
        credentialID: "FPA-2023-124",
      },
      {
        id: 3,
        name: "Advanced Data Analysis",
        issuer: "Analytics Association",
        date: "November 2022",
        credentialID: "ADA-2022-342",
      },
    ];
  },
  
  // Export portfolio as PDF/JSON
  exportPortfolio: async (userId: string, format: 'pdf' | 'json') => {
    // In a real application, this would generate and return a file
    // For demo purposes, simulating the process
    const portfolioData = {
      userId,
      skills: await portfolioAPI.getUserSkills(userId),
      certifications: await portfolioAPI.getUserCertifications(userId),
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
  },
  
  // Share portfolio via URL or email
  sharePortfolio: async (userId: string, method: 'url' | 'email', recipient?: string) => {
    // In a real application, this would create a shareable link or send an email
    // For demo purposes, simulating the process
    const shareableUrl = `https://example.com/shared-portfolio/${userId}?token=${Date.now()}`;
    
    if (method === 'url') {
      // Copy URL to clipboard
      navigator.clipboard.writeText(shareableUrl)
        .catch(err => console.error('Could not copy URL: ', err));
      
      return { success: true, url: shareableUrl };
    } else if (method === 'email' && recipient) {
      // In a real application, this would send an email with the URL
      console.log(`Sharing portfolio with ${recipient} via email: ${shareableUrl}`);
      return { success: true, recipient, url: shareableUrl };
    }
    
    return { success: false, error: 'Invalid share method or missing recipient' };
  },
  
  // Start skill assessment
  startAssessment: async (userId: string) => {
    try {
      console.log("Starting personalized assessment for user:", userId);
      
      // Get user skills for personalization
      const userSkillsData = await portfolioAPI.getUserSkills(userId);
      
      // Call the edge function to get a personalized assessment
      const { data, error } = await supabase.functions.invoke('personalized-portfolio', {
        body: { 
          userId, 
          requestType: 'assessment',
          userSkills: userSkillsData
        }
      });
      
      if (error) {
        console.error("Error getting personalized assessment:", error);
        throw error;
      }
      
      console.log("Received personalized assessment:", data);
      
      const assessment = data.assessment || {
        id: `assess_${Date.now()}`,
        title: "Comprehensive Skills Assessment",
        description: "This assessment will evaluate your current skills and identify growth opportunities.",
        redirectUrl: `/assessment/${Date.now()}`
      };
      
      return {
        success: true,
        assessmentId: assessment.id,
        redirectUrl: `/assessment/${assessment.id}`,
        title: assessment.title,
        description: assessment.description,
        estimatedDuration: assessment.estimatedDuration,
        focusAreas: assessment.focusAreas
      };
    } catch (error) {
      console.error("Error in startAssessment:", error);
      return {
        success: false,
        error: "Failed to create assessment session",
        assessmentId: `assess_${Date.now()}`,
        redirectUrl: `/assessment/${Date.now()}`
      };
    }
  },
  
  // Get personalized recommendations
  getRecommendations: async (userId: string) => {
    try {
      console.log("Getting personalized recommendations for user:", userId);
      
      // Get user skills for personalization
      const userSkillsData = await portfolioAPI.getUserSkills(userId);
      
      // Call the edge function to get personalized recommendations
      const { data, error } = await supabase.functions.invoke('personalized-portfolio', {
        body: { 
          userId, 
          requestType: 'recommendations',
          userSkills: userSkillsData
        }
      });
      
      if (error) {
        console.error("Error getting personalized recommendations:", error);
        throw error;
      }
      
      console.log("Received personalized recommendations:", data);
      
      // Return the recommendations from the edge function or fall back to defaults
      return data.recommendations || [
        {
          id: 1,
          title: "Advanced Machine Learning Course",
          description: "Deep dive into neural networks and reinforcement learning",
          match: 95,
          type: "course"
        },
        {
          id: 2,
          title: "Financial Risk Management Certification",
          description: "Industry-recognized certification for risk professionals",
          match: 87,
          type: "certification"
        },
        {
          id: 3,
          title: "Team Leadership Workshop",
          description: "Practical skills for leading technical teams",
          match: 82,
          type: "workshop"
        }
      ];
    } catch (error) {
      console.error("Error in getRecommendations:", error);
      // Return default recommendations if the edge function fails
      return [
        {
          id: 1,
          title: "Advanced Machine Learning Course",
          description: "Deep dive into neural networks and reinforcement learning",
          match: 95,
          type: "course"
        },
        {
          id: 2,
          title: "Financial Risk Management Certification",
          description: "Industry-recognized certification for risk professionals",
          match: 87,
          type: "certification"
        },
        {
          id: 3,
          title: "Team Leadership Workshop",
          description: "Practical skills for leading technical teams",
          match: 82,
          type: "workshop"
        }
      ];
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
          variant: "default",
        });
        
        const result = await portfolioAPI.exportPortfolio(userId, format);
        
        toast({
          title: "Export Complete",
          description: `Your portfolio has been exported successfully.`,
          variant: "default",
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
              variant: "default",
            });
          } else {
            toast({
              title: "Portfolio Shared",
              description: `Your portfolio has been shared with ${recipient}.`,
              variant: "default",
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
          variant: "default",
        });
        
        const result = await portfolioAPI.getRecommendations(userId);
        
        toast({
          title: "Recommendations Ready",
          description: "Your personalized recommendations have been generated.",
          variant: "default",
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
          variant: "default",
        });
        
        const result = await portfolioAPI.startAssessment(userId);
        
        if (result.success) {
          toast({
            title: "Assessment Ready",
            description: "Your personalized skills assessment has been created. You can begin now.",
            variant: "default",
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
    }
  };
};

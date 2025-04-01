
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
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialID: string;
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
    try {
      const { data: userSkills, error } = await supabase
        .from('user_skills')
        .select(`
          skill_groups (
            id,
            name,
            skills (
              id,
              name,
              level,
              category
            )
          ),
          learning_progress (
            month,
            progress
          ),
          skill_distribution (
            category,
            percentage
          )
        `)
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user skills:', error);
        // Return empty data structure for now
        return {
          skillGroups: [],
          learningProgress: [],
          skillDistribution: []
        };
      }
      
      return {
        skillGroups: userSkills?.skill_groups || [],
        learningProgress: userSkills?.learning_progress || [],
        skillDistribution: userSkills?.skill_distribution || []
      };
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
  getGrowthOpportunities: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('growth_opportunities')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching growth opportunities:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getGrowthOpportunities:', error);
      return [];
    }
  },
  
  // Get user certifications
  getUserCertifications: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching certifications:', error);
        return [];
      }
      
      return data || [];
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
      return { success: false, error: error.message };
    }
  },
  
  // Share portfolio via URL or email
  sharePortfolio: async (userId: string, method: 'url' | 'email', recipient?: string) => {
    // In a real application, this would create a shareable link or send an email
    try {
      // Generate a unique token for sharing
      const { data: shareData, error } = await supabase
        .from('portfolio_shares')
        .insert([
          { user_id: userId, recipient_email: recipient, method }
        ])
        .select('token')
        .single();
      
      if (error) throw error;
      
      const shareableUrl = `${window.location.origin}/shared-portfolio/${shareData.token}`;
      
      if (method === 'url') {
        // Copy URL to clipboard
        navigator.clipboard.writeText(shareableUrl)
          .catch(err => console.error('Could not copy URL: ', err));
        
        return { success: true, url: shareableUrl };
      } else if (method === 'email' && recipient) {
        // In a real application, this would send an email with the URL
        const { error: emailError } = await supabase.functions.invoke('send-email', {
          body: { recipient, subject: 'Portfolio Shared With You', url: shareableUrl }
        });
        
        if (emailError) throw emailError;
        
        return { success: true, recipient, url: shareableUrl };
      }
      
      return { success: false, error: 'Invalid share method or missing recipient' };
    } catch (error) {
      console.error('Error sharing portfolio:', error);
      return { success: false, error: error.message };
    }
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
      
      // Create assessment entry in database
      const { data: assessmentData, error: createError } = await supabase
        .from('assessments')
        .insert([{
          user_id: userId,
          title: data.assessment?.title || 'Comprehensive Skills Assessment',
          description: data.assessment?.description || 'Evaluate your current skills',
          status: 'created'
        }])
        .select()
        .single();
        
      if (createError) throw createError;
      
      return {
        success: true,
        assessmentId: assessmentData.id,
        redirectUrl: `/assessment/${assessmentData.id}`,
        title: assessmentData.title,
        description: assessmentData.description,
        estimatedDuration: data.assessment?.estimatedDuration || '15-20 minutes',
        focusAreas: data.assessment?.focusAreas || []
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
  getRecommendations: async (userId: string) => {
    try {
      console.log("Getting personalized recommendations for user:", userId);
      
      // Get recommendations from database
      const { data: recommendations, error } = await supabase
        .from('recommendations')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      // If no recommendations exist, create them
      if (!recommendations || recommendations.length === 0) {
        // Get user skills for personalization
        const userSkillsData = await portfolioAPI.getUserSkills(userId);
        
        // Call the edge function to get personalized recommendations
        const { data, error: funcError } = await supabase.functions.invoke('personalized-portfolio', {
          body: { 
            userId, 
            requestType: 'recommendations',
            userSkills: userSkillsData
          }
        });
        
        if (funcError) throw funcError;
        
        // Save recommendations to database
        if (data.recommendations && data.recommendations.length > 0) {
          const recsToInsert = data.recommendations.map((rec: any) => ({
            user_id: userId,
            title: rec.title,
            description: rec.description,
            match: rec.match,
            type: rec.type
          }));
          
          const { data: insertedRecs, error: insertError } = await supabase
            .from('recommendations')
            .insert(recsToInsert)
            .select();
            
          if (insertError) throw insertError;
          
          return insertedRecs;
        }
      }
      
      return recommendations || [];
    } catch (error) {
      console.error("Error in getRecommendations:", error);
      // Return empty array on error
      return [];
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

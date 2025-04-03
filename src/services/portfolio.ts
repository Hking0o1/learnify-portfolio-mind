
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

export const portfolioAPI = {
  // Get user skills portfolio
  getUserSkills: async (userId: string): Promise<PortfolioData> => {
    try {
      console.log("Fetching skills data for user:", userId);
      
      // First, check if user has a skills profile
      let { data: userSkillsData, error: userSkillsError } = await supabase
        .from('user_skills')
        .select('id')
        .eq('user_id', userId)
        .single();
      
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
      const { data, error } = await supabase
        .from('growth_opportunities')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching growth opportunities:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getGrowthOpportunities:', error);
      return [];
    }
  },
  
  // Get user certifications
  getUserCertifications: async (userId: string): Promise<Certification[]> => {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching certifications:', error);
        throw error;
      }
      
      // Map database fields to interface
      return (data || []).map(cert => ({
        id: cert.id,
        name: cert.name,
        issuer: cert.issuer,
        date: cert.date,
        credentialID: cert.credential_id,
        image: cert.image,
        description: cert.description,
        issueDate: cert.issue_date,
        expiryDate: cert.expiry_date
      }));
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
      
      // Save the share info in the database
      const { data: shareData, error } = await supabase
        .from('portfolio_shares')
        .insert([
          { 
            user_id: userId, 
            recipient_email: recipient, 
            method,
            token
          }
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
      
      // Create assessment entry in database
      const { data: assessmentData, error: createError } = await supabase
        .from('assessments')
        .insert([{
          user_id: userId,
          title: 'Comprehensive Skills Assessment',
          description: 'Evaluate your current skills',
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
      
      // Get recommendations from database
      const { data: recommendations, error } = await supabase
        .from('recommendations')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      // If no recommendations exist, create them
      if (!recommendations || recommendations.length === 0) {
        // Call the edge function to get personalized recommendations
        const { data, error: funcError } = await supabase.functions.invoke('personalized-portfolio', {
          body: { 
            userId, 
            requestType: 'recommendations'
          }
        });
        
        if (funcError) throw funcError;
        
        // Save recommendations to database
        if (data?.recommendations && data.recommendations.length > 0) {
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
  },

  // Get user roadmap
  getUserRoadmap: async (userId: string): Promise<Roadmap | null> => {
    try {
      console.log("Getting roadmap for user:", userId);
      
      const { data, error } = await supabase
        .from('user_roadmap')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No roadmap found
          console.log("No roadmap found, generating one");
          return null;
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error("Error getting user roadmap:", error);
      return null;
    }
  },
  
  // Generate roadmap for new user
  generateUserRoadmap: async (userId: string): Promise<Roadmap | null> => {
    try {
      console.log("Generating roadmap for user:", userId);
      
      const { data, error } = await supabase.functions.invoke('generate-roadmap', {
        body: { userId }
      });
      
      if (error) {
        console.error("Error generating roadmap:", error);
        throw error;
      }
      
      return data?.roadmap || null;
    } catch (error) {
      console.error("Error in generateUserRoadmap:", error);
      return null;
    }
  },
  
  // Update roadmap step status
  updateRoadmapStep: async (roadmapId: string, stepId: number, status: 'completed' | 'in-progress' | 'pending'): Promise<boolean> => {
    try {
      // First get the current roadmap
      const { data: roadmap, error: fetchError } = await supabase
        .from('user_roadmap')
        .select('steps, progress')
        .eq('id', roadmapId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Update the specific step in the steps array
      const updatedSteps = roadmap.steps.map((step: RoadmapStep) => {
        if (step.id === stepId) {
          return { ...step, status };
        }
        return step;
      });
      
      // Calculate progress percentage
      const totalSteps = updatedSteps.length;
      const completedSteps = updatedSteps.filter((step: RoadmapStep) => step.status === 'completed').length;
      const progress = Math.round((completedSteps / totalSteps) * 100);
      
      // Update the roadmap
      const { error: updateError } = await supabase
        .from('user_roadmap')
        .update({ 
          steps: updatedSteps,
          progress
        })
        .eq('id', roadmapId);
      
      if (updateError) throw updateError;
      
      return true;
    } catch (error) {
      console.error("Error updating roadmap step:", error);
      return false;
    }
  }
};

// Helper function to create default skill data for a new user
async function createDefaultSkillData(userSkillsId: string) {
  try {
    // Create default skill groups
    const skillGroups = [
      { name: "Technical Skills", skills: [
        { name: "JavaScript", level: 40, category: "Programming" },
        { name: "Python", level: 30, category: "Programming" },
        { name: "Data Analysis", level: 25, category: "Data Science" }
      ]},
      { name: "Business Skills", skills: [
        { name: "Project Management", level: 50, category: "Management" },
        { name: "Communication", level: 65, category: "Soft Skills" }
      ]},
      { name: "Design Skills", skills: [
        { name: "UI/UX Design", level: 20, category: "Design" }
      ]}
    ];
    
    // Insert skill groups and their skills
    for (const group of skillGroups) {
      // Insert skill group
      const { data: skillGroup, error: groupError } = await supabase
        .from('skill_groups')
        .insert([{ 
          user_skills_id: userSkillsId,
          name: group.name
        }])
        .select()
        .single();
      
      if (groupError) {
        console.error("Error creating skill group:", groupError);
        continue;
      }
      
      // Insert skills for this group
      for (const skill of group.skills) {
        await supabase
          .from('skills')
          .insert([{
            skill_group_id: skillGroup.id,
            name: skill.name,
            level: skill.level,
            category: skill.category
          }]);
      }
    }
    
    // Create default learning progress data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const progressData = months.map((month, index) => ({
      user_skills_id: userSkillsId,
      month,
      progress: 20 + (index * 10) // Simple progression for demo
    }));
    
    await supabase
      .from('learning_progress')
      .insert(progressData);
    
    // Create default skill distribution
    const distributionData = [
      { user_skills_id: userSkillsId, category: "Programming", percentage: 40 },
      { user_skills_id: userSkillsId, category: "Management", percentage: 30 },
      { user_skills_id: userSkillsId, category: "Design", percentage: 20 },
      { user_skills_id: userSkillsId, category: "Data Science", percentage: 10 }
    ];
    
    await supabase
      .from('skill_distribution')
      .insert(distributionData);
    
  } catch (error) {
    console.error("Error creating default skill data:", error);
  }
}

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
    }
  };
};

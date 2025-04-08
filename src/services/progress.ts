
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserProgress {
  id: string;
  user_id: string;
  course_id: string;
  progress_percentage: number;
  last_module_id: string;
  last_material_id: string;
  last_accessed: string;
  course_title?: string; // Add this to match the EnhancedUserProgress interface in Dashboard.tsx
}

export const progressAPI = {
  // Get progress for a specific user
  getUserProgress: async (userId: string): Promise<UserProgress[]> => {
    const { data, error } = await supabase
      .from('user_progress')
      .select(`
        *,
        courses:course_id (
          title
        )
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // Transform the data to include course_title from the joined table
    return data.map(item => ({
      ...item,
      course_title: item.courses?.title
    }));
  },
  
  // Update progress for a user on a specific course
  updateProgress: async (progressData: Partial<UserProgress>): Promise<UserProgress> => {
    if (!progressData.id) {
      throw new Error('Progress ID is required for updating');
    }
    
    const { data, error } = await supabase
      .from('user_progress')
      .update(progressData)
      .eq('id', progressData.id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Create new progress entry
  createProgress: async (progressData: Omit<UserProgress, 'id'>): Promise<UserProgress> => {
    const { data, error } = await supabase
      .from('user_progress')
      .insert([progressData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Get a specific progress entry
  getProgressForCourse: async (userId: string, courseId: string): Promise<UserProgress | null> => {
    const { data, error } = await supabase
      .from('user_progress')
      .select(`
        *,
        courses:course_id (
          title
        )
      `)
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle(); // Use maybeSingle instead of single to handle case where no record exists
    
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      ...data,
      course_title: data.courses?.title
    };
  }
};

// Custom hook for progress operations with toast notifications
export const useProgressAPI = () => {
  const { toast } = useToast();
  
  return {
    ...progressAPI,
    
    // Get progress with toast on error
    getUserProgress: async (userId: string): Promise<UserProgress[]> => {
      try {
        return await progressAPI.getUserProgress(userId);
      } catch (error) {
        console.error("Error fetching user progress:", error);
        toast({
          title: "Error",
          description: "Failed to fetch your learning progress",
          variant: "destructive",
        });
        return [];
      }
    },
    
    // Update progress with toast notifications
    updateProgressWithToast: async (progressData: Partial<UserProgress>): Promise<UserProgress | null> => {
      try {
        const result = await progressAPI.updateProgress(progressData);
        toast({
          title: "Progress Updated",
          description: "Your learning progress has been updated",
        });
        return result;
      } catch (error) {
        console.error("Error updating progress:", error);
        toast({
          title: "Error",
          description: "Failed to update your learning progress",
          variant: "destructive",
        });
        return null;
      }
    },
    
    // Create progress with toast notifications
    createProgressWithToast: async (progressData: Omit<UserProgress, 'id'>): Promise<UserProgress | null> => {
      try {
        const result = await progressAPI.createProgress(progressData);
        toast({
          title: "Progress Started",
          description: "You've started a new course",
        });
        return result;
      } catch (error) {
        console.error("Error creating progress:", error);
        toast({
          title: "Error",
          description: "Failed to start tracking your progress for this course",
          variant: "destructive",
        });
        return null;
      }
    }
  };
};

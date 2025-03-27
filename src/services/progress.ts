
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserProgress {
  id?: string;
  user_id: string;
  course_id: string;
  last_module_id?: string;
  last_material_id?: string;
  progress_percentage: number;
  last_accessed: string;
}

export const progressAPI = {
  // Get user progress for all courses
  getUserProgress: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .order('last_accessed', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Get user progress for a specific course
  getCourseProgress: async (userId: string, courseId: string) => {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows returned"
    return data;
  },
  
  // Resume learning (get the last accessed module/material)
  resumeLearning: async (userId: string) => {
    try {
      // Get the most recently accessed course
      const { data, error } = await supabase
        .from('user_progress')
        .select('*, courses(*), modules(*), materials(*)')
        .eq('user_id', userId)
        .order('last_accessed', { ascending: false })
        .limit(1)
        .single();
        
      if (error) throw error;
      
      // For demo purposes, if no data exists, return a mock course
      if (!data) {
        return {
          course_id: "1",
          course_title: "Machine Learning Fundamentals",
          module_id: "1",
          material_id: "1"
        };
      }
      
      return {
        course_id: data.course_id,
        course_title: data.courses?.title || "Course",
        module_id: data.last_module_id,
        material_id: data.last_material_id
      };
    } catch (error) {
      console.error('Error resuming learning:', error);
      // Return a fallback course for demo purposes
      return {
        course_id: "1",
        course_title: "Machine Learning Fundamentals",
        module_id: "1",
        material_id: "1"
      };
    }
  },
  
  // Update user progress
  updateProgress: async (progressData: UserProgress) => {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert(progressData)
      .select();
    
    if (error) throw error;
    return data[0];
  }
};

// Custom hook for progress operations with toast notifications
export const useProgressAPI = () => {
  const { toast } = useToast();
  
  return {
    ...progressAPI,
    
    // Resume learning with toast
    resumeLearningWithToast: async (userId: string) => {
      try {
        const result = await progressAPI.resumeLearning(userId);
        return result;
      } catch (error) {
        console.error("Error resuming learning:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to resume learning",
          variant: "destructive",
        });
        throw error;
      }
    }
  };
};

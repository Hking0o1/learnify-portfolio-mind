
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Course API
export const courseAPI = {
  // Get all courses
  getAllCourses: async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*');
    
    if (error) throw error;
    return data;
  },
  
  // Get a single course by ID
  getCourse: async (courseId: string) => {
    const { data, error } = await supabase
      .from('courses')
      .select('*, modules(*), reviews(*)')
      .eq('id', courseId)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Create a new course
  createCourse: async (courseData: any) => {
    const { data, error } = await supabase
      .from('courses')
      .insert([courseData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Update an existing course
  updateCourse: async (courseId: string, courseData: any) => {
    const { data, error } = await supabase
      .from('courses')
      .update(courseData)
      .eq('id', courseId)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Delete a course
  deleteCourse: async (courseId: string) => {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);
    
    if (error) throw error;
    return { success: true };
  },

  // Add a module to a course
  addModule: async (courseId: string, moduleData: any) => {
    const { data, error } = await supabase
      .from('modules')
      .insert([{ ...moduleData, course_id: courseId }])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Add material to a module
  addMaterial: async (moduleId: string, materialData: any) => {
    const { data, error } = await supabase
      .from('materials')
      .insert([{ ...materialData, module_id: moduleId }])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // Add a review to a course
  addReview: async (courseId: string, userId: string, reviewData: { rating: number, comment: string }) => {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{ 
        course_id: courseId, 
        user_id: userId, 
        rating: reviewData.rating, 
        comment: reviewData.comment 
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // Reply to a review
  replyToReview: async (reviewId: string, instructorId: string, reply: string) => {
    const { data, error } = await supabase
      .from('review_replies')
      .insert([{ 
        review_id: reviewId, 
        instructor_id: instructorId, 
        reply: reply 
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // Get average rating for a course
  getAverageRating: async (courseId: string) => {
    const { data, error } = await supabase
      .rpc('get_average_rating', { course_id: courseId });
    
    if (error) throw error;
    return data || 0;
  }
};

// User API (for ML features)
export const userAPI = {
  // Get course recommendations
  getRecommendations: async (userId: string) => {
    const { data, error } = await supabase
      .rpc('get_course_recommendations', { user_id: userId });
    
    if (error) throw error;
    return data || [];
  },
  
  // Get personalized learning path
  getLearningPath: async (userId: string, courseId: string) => {
    const { data, error } = await supabase
      .rpc('get_learning_path', { user_id: userId, course_id: courseId });
    
    if (error) throw error;
    return data || [];
  },
  
  // Predict course completion time
  predictCompletionTime: async (userId: string, courseId: string) => {
    const { data, error } = await supabase
      .rpc('predict_completion_time', { user_id: userId, course_id: courseId });
    
    if (error) throw error;
    return data || { estimated_days: 30 }; // Default fallback
  },
  
  // Analyze student performance
  analyzePerformance: async (userId: string) => {
    const { data, error } = await supabase
      .rpc('analyze_performance', { user_id: userId });
    
    if (error) throw error;
    return data || {};
  }
};

// Custom hook for API calls with toast notifications
import { useToast } from "@/hooks/use-toast";

export const useAPI = () => {
  const { toast } = useToast();
  
  // Wrapper function to add toast notifications to API calls
  const withToast = async <T,>(
    apiCall: () => Promise<T>,
    successMessage: string,
    errorMessage: string = "Operation failed"
  ): Promise<T | null> => {
    try {
      const result = await apiCall();
      toast({
        title: "Success",
        description: successMessage,
      });
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : errorMessage;
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return null;
    }
  };
  
  return { withToast };
};

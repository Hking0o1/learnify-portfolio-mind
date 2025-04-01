
import { supabase } from '@/integrations/supabase/client';
import { GeneratedModule } from './ai-modules';

interface QuestionAnswer {
  question: string;
  answer: string | number;
}

interface RecommendationResult {
  courseId: string;
  title: string;
  modules: GeneratedModule[];
}

export const generatePersonalizedCourse = async (
  userId: string,
  answers: QuestionAnswer[]
): Promise<RecommendationResult> => {
  try {
    console.log("Generating personalized course for user:", userId);
    
    // Call the Edge Function to generate a personalized course
    const { data, error } = await supabase.functions.invoke('personalized-course', {
      body: { userId, answers },
    });

    if (error) {
      console.error('Error generating personalized course:', error);
      throw new Error(error.message || 'Failed to generate personalized course');
    }

    console.log("Received personalized course data:", data);
    return data;
  } catch (error) {
    console.error('Error in generatePersonalizedCourse:', error);
    throw error;
  }
};

export const savePersonalizedCourse = async (
  userId: string,
  courseData: {
    title: string;
    description: string;
    level: string;
    category: string;
  },
  modules: GeneratedModule[]
): Promise<string> => {
  try {
    // First create the course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert([{
        title: courseData.title,
        description: courseData.description,
        instructor_id: userId, // The AI is technically the instructor, but we assign it to the user
        status: 'Published',
        level: courseData.level,
        category: courseData.category,
        price: 0, // Personalized courses are free
        students: 0,
        rating: 0
      }])
      .select()
      .single();

    if (courseError) throw courseError;
    
    if (!course || !course.id) {
      throw new Error("Failed to create course");
    }
    
    // Then save the modules
    for (const moduleData of modules) {
      // Create module
      const { data: module, error: moduleError } = await supabase
        .from('modules')
        .insert([{
          title: moduleData.title,
          description: moduleData.description,
          position: moduleData.position,
          course_id: course.id
        }])
        .select()
        .single();
        
      if (moduleError) throw moduleError;
      
      if (!module || !module.id) continue;
      
      // Create materials for this module
      if (moduleData.materials && moduleData.materials.length > 0) {
        const materialsToInsert = moduleData.materials.map((material, index) => ({
          title: material.title,
          type: material.type || 'document',
          content: material.content,
          position: index,
          module_id: module.id
        }));
        
        await supabase
          .from('materials')
          .insert(materialsToInsert);
      }
    }
    
    // Automatically enroll the user in this course by creating a progress record
    await supabase
      .from('user_progress')
      .insert([{
        user_id: userId,
        course_id: course.id,
        progress_percentage: 0
      }]);
      
    return course.id;
  } catch (error) {
    console.error('Error saving personalized course:', error);
    throw error;
  }
};

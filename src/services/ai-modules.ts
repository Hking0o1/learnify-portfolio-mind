
import { supabase } from '@/integrations/supabase/client';
import { Module } from './modules';

interface GenerateModulesParams {
  courseTitle: string;
  courseDescription: string;
  numModules: number;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface GeneratedModuleResponse {
  modules: {
    title: string;
    description: string;
    position: number;
    materials: {
      title: string;
      type: string;
      content: string;
    }[];
  }[];
}

export const generateModulesWithAI = async (
  params: GenerateModulesParams,
  courseId: string
): Promise<Module[]> => {
  try {
    // Call the Supabase Edge Function to generate modules
    const { data, error } = await supabase.functions.invoke('generate-module', {
      body: params,
    });

    if (error) {
      console.error('Error calling generate-module function:', error);
      throw error;
    }

    // Process the generated modules into the format expected by the app
    const response = data as GeneratedModuleResponse;
    
    // Map the generated modules to the Module format expected by our application
    const modulesToCreate: Module[] = response.modules.map(moduleData => ({
      title: moduleData.title,
      description: moduleData.description,
      position: moduleData.position,
      course_id: courseId
    }));

    return modulesToCreate;
  } catch (error) {
    console.error('Error generating modules with AI:', error);
    throw error;
  }
};

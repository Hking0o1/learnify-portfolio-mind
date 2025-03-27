
import { supabase } from '@/integrations/supabase/client';

export interface GeneratedModule {
  title: string;
  description: string;
  position: number;
  materials: {
    title: string;
    type: string;
    content: string;
  }[];
}

export interface ModuleGenerationParams {
  courseTitle: string;
  courseDescription: string;
  numModules: number;
  difficultyLevel: string;
}

// Generate modules using AI via Edge Function
export const generateModulesWithAI = async (params: ModuleGenerationParams): Promise<{ modules: GeneratedModule[] }> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-module', {
      body: params,
    });

    if (error) {
      console.error('Error generating modules:', error);
      throw new Error(error.message || 'Failed to generate modules');
    }

    return data;
  } catch (error) {
    console.error('Error in generateModulesWithAI:', error);
    throw error;
  }
};

// Save AI-generated modules to the database
export const saveGeneratedModules = async (courseId: string, generatedModules: GeneratedModule[]) => {
  try {
    const savedModules = [];

    // Save each module and its materials
    for (const moduleData of generatedModules) {
      // Create the module
      const { data: module, error: moduleError } = await supabase
        .from('modules')
        .insert([{
          title: moduleData.title,
          description: moduleData.description,
          position: moduleData.position,
          course_id: courseId
        }])
        .select()
        .single();

      if (moduleError) throw moduleError;

      // Create materials for this module
      if (moduleData.materials && moduleData.materials.length > 0) {
        const materialsToInsert = moduleData.materials.map((material, index) => ({
          title: material.title, // Title is required
          type: material.type || 'document',
          content: material.content,
          position: index,
          module_id: module.id
        }));

        const { data: materials, error: materialsError } = await supabase
          .from('materials')
          .insert(materialsToInsert)
          .select();

        if (materialsError) throw materialsError;

        // Combine module with its materials
        savedModules.push({
          ...module,
          materials
        });
      } else {
        savedModules.push(module);
      }
    }

    return savedModules;
  } catch (error) {
    console.error('Error saving generated modules:', error);
    throw error;
  }
};

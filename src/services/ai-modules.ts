
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
    console.log("Sending parameters to AI:", params);
    
    const { data, error } = await supabase.functions.invoke('generate-module', {
      body: params,
    });

    if (error) {
      console.error('Error generating modules:', error);
      throw new Error(error.message || 'Failed to generate modules');
    }

    if (!data || !data.modules) {
      throw new Error('No modules returned from generation service');
    }

    console.log("Received AI-generated modules:", data);
    return data;
  } catch (error) {
    console.error('Error in generateModulesWithAI:', error);
    throw error;
  }
};

// Save AI-generated modules to the database
export const saveGeneratedModules = async (courseId: string, generatedModules: GeneratedModule[]) => {
  try {
    console.log("Starting to save generated modules for courseId:", courseId);
    const savedModules = [];

    if (!courseId) {
      throw new Error('Course ID is required to save modules');
    }

    if (!generatedModules || !Array.isArray(generatedModules) || generatedModules.length === 0) {
      throw new Error('No valid modules to save');
    }

    // Save each module and its materials
    for (const moduleData of generatedModules) {
      console.log(`Saving module: ${moduleData.title}`);
      
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

      if (moduleError) {
        console.error("Error saving module:", moduleError);
        throw moduleError;
      }

      console.log(`Module saved with ID: ${module.id}`);
      
      // Create materials for this module
      if (moduleData.materials && moduleData.materials.length > 0) {
        const materialsToInsert = moduleData.materials.map((material, index) => ({
          title: material.title, 
          type: material.type || 'document',
          content: material.content,
          position: index,
          module_id: module.id
        }));

        console.log(`Saving ${materialsToInsert.length} materials for module ${module.id}`);
        
        const { data: materials, error: materialsError } = await supabase
          .from('materials')
          .insert(materialsToInsert)
          .select();

        if (materialsError) {
          console.error("Error saving materials:", materialsError);
          throw materialsError;
        }

        console.log(`Saved ${materials.length} materials successfully`);
        
        // Combine module with its materials
        savedModules.push({
          ...module,
          materials
        });
      } else {
        console.log("No materials to save for this module");
        savedModules.push(module);
      }
    }

    console.log(`Successfully saved ${savedModules.length} modules`);
    return savedModules;
  } catch (error) {
    console.error('Error saving generated modules:', error);
    throw error;
  }
};

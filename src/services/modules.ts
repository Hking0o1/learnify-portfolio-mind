
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Module {
  id?: string;
  title: string;
  description: string;
  position: number;
  course_id: string;
}

export interface Material {
  id?: string;
  title: string;
  type: 'video' | 'document' | 'quiz';
  content: string;
  position: number;
  module_id: string;
}

export const moduleAPI = {
  // Get all modules for a course
  getModules: async (courseId: string) => {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .eq('course_id', courseId)
      .order('position', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  
  // Get a single module with its materials
  getModule: async (moduleId: string) => {
    const { data, error } = await supabase
      .from('modules')
      .select('*, materials(*)')
      .eq('id', moduleId)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Create a new module
  createModule: async (moduleData: Module) => {
    const { data, error } = await supabase
      .from('modules')
      .insert([moduleData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Update an existing module
  updateModule: async (moduleId: string, moduleData: Partial<Module>) => {
    const { data, error } = await supabase
      .from('modules')
      .update(moduleData)
      .eq('id', moduleId)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Delete a module
  deleteModule: async (moduleId: string) => {
    const { error } = await supabase
      .from('modules')
      .delete()
      .eq('id', moduleId);
    
    if (error) throw error;
    return { success: true };
  },
  
  // Add material to a module
  addMaterial: async (material: Material) => {
    const { data, error } = await supabase
      .from('materials')
      .insert([material])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Get all materials for a module
  getMaterials: async (moduleId: string) => {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('module_id', moduleId)
      .order('position', { ascending: true });
    
    if (error) throw error;
    return data;
  }
};

// Custom hook for module operations with toast notifications
export const useModuleAPI = () => {
  const { toast } = useToast();
  
  const createModuleWithToast = async (moduleData: Module) => {
    try {
      const result = await moduleAPI.createModule(moduleData);
      toast({
        title: "Success",
        description: "Module created successfully",
      });
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create module";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return null;
    }
  };
  
  const updateModuleWithToast = async (moduleId: string, moduleData: Partial<Module>) => {
    try {
      const result = await moduleAPI.updateModule(moduleId, moduleData);
      toast({
        title: "Success",
        description: "Module updated successfully",
      });
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update module";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return null;
    }
  };
  
  const deleteModuleWithToast = async (moduleId: string) => {
    try {
      await moduleAPI.deleteModule(moduleId);
      toast({
        title: "Success",
        description: "Module deleted successfully",
      });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete module";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return false;
    }
  };
  
  return {
    createModule: createModuleWithToast,
    updateModule: updateModuleWithToast,
    deleteModule: deleteModuleWithToast,
    ...moduleAPI,
  };
};

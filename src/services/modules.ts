
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Module {
  id?: string;
  title: string;
  description: string;
  position: number;
  course_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface Material {
  id?: string;
  title: string;
  type: string;
  content: string;
  position: number;
  module_id: string;
  created_at?: string;
  updated_at?: string;
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
  
  // Get a single module by ID
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
  addMaterial: async (moduleId: string, materialData: Omit<Material, 'module_id'>) => {
    const { data, error } = await supabase
      .from('materials')
      .insert([{ ...materialData, module_id: moduleId }])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Update a material
  updateMaterial: async (materialId: string, materialData: Partial<Material>) => {
    const { data, error } = await supabase
      .from('materials')
      .update(materialData)
      .eq('id', materialId)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  // Delete a material
  deleteMaterial: async (materialId: string) => {
    const { error } = await supabase
      .from('materials')
      .delete()
      .eq('id', materialId);
    
    if (error) throw error;
    return { success: true };
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
  
  return {
    ...moduleAPI,
    
    // Create module with toast
    createModuleWithToast: async (moduleData: Module) => {
      try {
        const result = await moduleAPI.createModule(moduleData);
        toast({
          title: "Module created",
          description: "The module has been created successfully",
        });
        return result;
      } catch (error) {
        console.error("Error creating module:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to create module",
          variant: "destructive",
        });
        throw error;
      }
    },
    
    // Update module with toast
    updateModuleWithToast: async (moduleId: string, moduleData: Partial<Module>) => {
      try {
        const result = await moduleAPI.updateModule(moduleId, moduleData);
        toast({
          title: "Module updated",
          description: "The module has been updated successfully",
        });
        return result;
      } catch (error) {
        console.error("Error updating module:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to update module",
          variant: "destructive",
        });
        throw error;
      }
    },
    
    // Delete module with toast
    deleteModuleWithToast: async (moduleId: string) => {
      try {
        await moduleAPI.deleteModule(moduleId);
        toast({
          title: "Module deleted",
          description: "The module has been deleted successfully",
        });
        return { success: true };
      } catch (error) {
        console.error("Error deleting module:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to delete module",
          variant: "destructive",
        });
        throw error;
      }
    },
    
    // Add material with toast
    addMaterialWithToast: async (moduleId: string, materialData: Omit<Material, 'module_id'>) => {
      try {
        const result = await moduleAPI.addMaterial(moduleId, materialData);
        toast({
          title: "Material added",
          description: "The material has been added successfully",
        });
        return result;
      } catch (error) {
        console.error("Error adding material:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to add material",
          variant: "destructive",
        });
        throw error;
      }
    }
  };
};

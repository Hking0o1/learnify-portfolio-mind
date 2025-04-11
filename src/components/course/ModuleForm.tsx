
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModuleAPI, Module } from '@/services/modules';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SaveIcon, XIcon } from 'lucide-react';

interface ModuleFormProps {
  courseId: string;
  existingModule?: Module;
  onSuccess?: (module: Module) => void;
}

export const ModuleForm = ({ courseId, existingModule, onSuccess }: ModuleFormProps) => {
  const isEditing = !!existingModule;
  const navigate = useNavigate();
  const moduleAPI = useModuleAPI();
  
  const [formData, setFormData] = useState<Partial<Module>>({
    title: existingModule?.title || '',
    description: existingModule?.description || '',
    position: existingModule?.position || 0,
    course_id: courseId,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log("Submitting form data:", formData);
      let result;
      if (isEditing && existingModule?.id) {
        result = await moduleAPI.updateModuleWithToast(existingModule.id, formData);
      } else {
        // Ensure we're passing a complete Module object for creation
        const moduleData = formData as Module;
        result = await moduleAPI.createModuleWithToast(moduleData);
      }
      
      if (result && onSuccess) {
        onSuccess(result);
      } else if (result) {
        navigate(`/courses/${courseId}`);
      }
    } catch (error) {
      console.error('Error saving module:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Module' : 'Add New Module'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Module title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              placeholder="Module description"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              name="position"
              type="number"
              value={formData.position || 0}
              onChange={handleNumberChange}
              min={0}
            />
            <p className="text-sm text-muted-foreground">
              The order in which this module appears in the course
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(`/courses/${courseId}`)}
          >
            <XIcon className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>Loading...</>
            ) : (
              <>
                <SaveIcon className="mr-2 h-4 w-4" />
                {isEditing ? 'Update Module' : 'Create Module'}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};


import { useToast } from "@/hooks/use-toast";

// Base URLs for our different backends
const EXPRESS_API_URL = import.meta.env.VITE_EXPRESS_API_URL || 'http://localhost:5000/api';
const FLASK_API_URL = import.meta.env.VITE_FLASK_API_URL || 'http://localhost:5001/api';

// Generic fetch utility with error handling
const fetchWithErrorHandling = async (url: string, options: RequestInit) => {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Express Backend API Service (for course management)
export const courseAPI = {
  // Get all courses
  getAllCourses: async () => {
    return fetchWithErrorHandling(`${EXPRESS_API_URL}/courses`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
  },
  
  // Get a single course by ID
  getCourse: async (courseId: string) => {
    return fetchWithErrorHandling(`${EXPRESS_API_URL}/courses/${courseId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
  },
  
  // Create a new course
  createCourse: async (courseData: any) => {
    return fetchWithErrorHandling(`${EXPRESS_API_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData)
    });
  },
  
  // Update an existing course
  updateCourse: async (courseId: string, courseData: any) => {
    return fetchWithErrorHandling(`${EXPRESS_API_URL}/courses/${courseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData)
    });
  },
  
  // Delete a course
  deleteCourse: async (courseId: string) => {
    return fetchWithErrorHandling(`${EXPRESS_API_URL}/courses/${courseId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
  },

  // Add a module to a course
  addModule: async (courseId: string, moduleData: any) => {
    return fetchWithErrorHandling(`${EXPRESS_API_URL}/courses/${courseId}/modules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(moduleData)
    });
  },
  
  // Add material to a module
  addMaterial: async (courseId: string, moduleId: string, materialData: any) => {
    return fetchWithErrorHandling(`${EXPRESS_API_URL}/courses/${courseId}/modules/${moduleId}/materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(materialData)
    });
  }
};

// Flask Backend API Service (for ML algorithms)
export const mlAPI = {
  // Get course recommendations
  getRecommendations: async (userId: string) => {
    return fetchWithErrorHandling(`${FLASK_API_URL}/recommendations/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
  },
  
  // Get personalized learning path
  getLearningPath: async (userId: string, courseId: string) => {
    return fetchWithErrorHandling(`${FLASK_API_URL}/learning-path`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, courseId })
    });
  },
  
  // Predict course completion time
  predictCompletionTime: async (userId: string, courseId: string) => {
    return fetchWithErrorHandling(`${FLASK_API_URL}/predict-completion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, courseId })
    });
  },
  
  // Analyze student performance
  analyzePerformance: async (userId: string) => {
    return fetchWithErrorHandling(`${FLASK_API_URL}/analyze-performance/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Custom hook for API calls with toast notifications
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

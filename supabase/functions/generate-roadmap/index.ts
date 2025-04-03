
// Follow this setup guide to integrate the Deno runtime and Supabase functions:
// https://supabase.com/docs/guides/functions
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type RoadmapStep = {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  link: string;
};

type Roadmap = {
  title: string;
  description: string;
  steps: RoadmapStep[];
  progress: number;
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged-in user
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default when deployed to Supabase
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default when deployed to Supabase
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );
    
    // Get the JSON request body
    const { userId } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Generating roadmap for user: ${userId}`);
    
    // Generate a personalized roadmap
    // In a real application, this would analyze user data and skills
    // For this demo, we'll create a generic roadmap
    const roadmap: Roadmap = {
      title: "Personalized Learning Path",
      description: "Your customized journey based on your goals and current skills",
      steps: [
        {
          id: 1,
          title: "Foundation Skills",
          description: "Master the fundamental concepts for your learning path",
          status: 'pending',
          link: "https://example.com/foundations"
        },
        {
          id: 2,
          title: "Intermediate Concepts",
          description: "Build upon your foundation with more advanced topics",
          status: 'pending',
          link: "https://example.com/intermediate"
        },
        {
          id: 3,
          title: "Advanced Techniques",
          description: "Learn cutting-edge techniques in your field",
          status: 'pending',
          link: "https://example.com/advanced"
        },
        {
          id: 4,
          title: "Practical Projects",
          description: "Apply your knowledge through hands-on projects",
          status: 'pending',
          link: "https://example.com/projects"
        }
      ],
      progress: 0
    };
    
    // Save the roadmap to the database
    const { data: insertedRoadmap, error: insertError } = await supabaseClient
      .from('user_roadmap')
      .insert({
        user_id: userId,
        title: roadmap.title,
        description: roadmap.description,
        steps: roadmap.steps,
        progress: roadmap.progress
      })
      .select()
      .single();
      
    if (insertError) {
      console.error("Error inserting roadmap:", insertError);
      throw new Error(`Failed to save roadmap: ${insertError.message}`);
    }
    
    console.log("Roadmap generated and saved successfully:", insertedRoadmap.id);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        roadmap: insertedRoadmap 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in generate-roadmap function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

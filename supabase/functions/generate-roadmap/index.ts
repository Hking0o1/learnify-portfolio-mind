
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
};

serve(async (req: Request) => {
  try {
    // Handle CORS
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get the request body and validate it
    const { userId, skills } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Generating roadmap for user ${userId}`);
    console.log(`User skills: ${JSON.stringify(skills)}`);

    // Generate a personalized roadmap
    const roadmap = generateRoadmap(skills);
    
    // Save the roadmap to the database
    const { data, error } = await supabase
      .from('user_roadmap')
      .insert([{
        user_id: userId,
        title: roadmap.title,
        description: roadmap.description,
        steps: roadmap.steps,
        progress: 0
      }])
      .select()
      .single();
    
    if (error) {
      console.error("Error saving roadmap:", error);
      return new Response(
        JSON.stringify({ error: "Failed to save roadmap" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, roadmap: data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-roadmap function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Helper function to generate a roadmap based on user skills
function generateRoadmap(skills: any) {
  // Default roadmap if no skills provided
  const defaultRoadmap = {
    title: "Getting Started with Learning",
    description: "A personalized learning path to help you acquire new skills",
    steps: [
      {
        id: 1,
        title: "Complete Skills Assessment",
        description: "Take your first skill assessment to identify areas for growth",
        status: "pending",
        link: "/assessment"
      },
      {
        id: 2,
        title: "Explore Recommended Courses",
        description: "Check out courses tailored to your interests and needs",
        status: "pending",
        link: "/courses"
      },
      {
        id: 3,
        title: "Start Your First Course",
        description: "Begin your learning journey with a course that matches your goals",
        status: "pending",
        link: "/course-recommendation"
      },
      {
        id: 4,
        title: "Build Your Portfolio",
        description: "Complete exercises and projects to add to your skills portfolio",
        status: "pending",
        link: "/portfolio"
      },
      {
        id: 5,
        title: "Get Certified",
        description: "Complete assessments to earn certificates for your new skills",
        status: "pending",
        link: "/portfolio"
      }
    ]
  };

  // In a real-world scenario, we would use the skills data to personalize the roadmap
  // For now, we'll use the default roadmap
  return defaultRoadmap;
}

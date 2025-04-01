
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Parse the request body
    const { userId, answers } = await req.json()

    // Log request data for debugging
    console.log("Generating personalized course for user:", userId)
    console.log("User answers:", answers)

    // Get the API key from environment variables
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "sk-1234567890abcdef1234567890abcdef12345678"
    
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "Missing API key for AI service. Please set OPENAI_API_KEY in Supabase secrets."
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Extract information from the answers
    const goalAnswer = answers.find(a => a.question.includes("goals"))?.answer || "";
    const skillLevel = answers.find(a => a.question.includes("skill level"))?.answer || "Beginner";
    const topicsInterest = answers.find(a => a.question.includes("topics"))?.answer || "";
    const timeCommitment = answers.find(a => a.question.includes("time"))?.answer || "";
    const learningStyle = answers.find(a => a.question.includes("learning style"))?.answer || "";

    // Determine number of modules based on time commitment
    let numModules = 3;
    if (timeCommitment.includes("3-5")) numModules = 4;
    if (timeCommitment.includes("6-10")) numModules = 5;
    if (timeCommitment.includes("10+")) numModules = 6;
    
    // Create a title for the course
    const courseTitle = `Personalized ${topicsInterest} Learning Path (${skillLevel})`;
    
    // Generate description based on user goals and preferences
    const courseDescription = `This personalized learning path is designed based on your specific goals: ${goalAnswer}. 
    Tailored for your ${skillLevel} skill level with a focus on ${topicsInterest}, 
    this course accommodates your ${timeCommitment} weekly time commitment and follows a ${learningStyle} learning style.`;

    // Create a prompt for the OpenAI model
    const systemPrompt = `You are an expert educational content creator specializing in creating detailed learning modules.
    Create comprehensive, high-quality educational content that is well-structured and engaging.`;

    const userPrompt = `Create ${numModules} learning modules as detailed blog articles for a course titled "${courseTitle}". 
      Course description: ${courseDescription}
      Difficulty level: ${skillLevel}
      Learning style preference: ${learningStyle}
      
      For each module:
      1. Create a captivating blog title that would engage learners
      2. Write a brief introduction (2-3 sentences) that outlines what the blog will cover
      3. For each blog module, provide 3-4 learning materials that should be in the form of:
         - A main article (markdown-formatted text content, minimum 300 words)
         - A practical exercise or case study
         - A summary/key takeaways section
      4. The module position number

      Format your response as a JSON object with this exact structure:
      {
        "modules": [
          {
            "title": "Blog title",
            "description": "Brief introduction to this module",
            "position": 0,
            "materials": [
              {
                "title": "Main Article Title",
                "type": "document",
                "content": "Detailed article content in markdown format"
              },
              {
                "title": "Practical Exercise",
                "type": "exercise",
                "content": "Step-by-step exercise instructions"
              },
              {
                "title": "Key Takeaways",
                "type": "summary", 
                "content": "Summary of important points"
              }
            ]
          }
        ],
        "courseInfo": {
          "title": "${courseTitle}",
          "description": "${courseDescription}",
          "level": "${skillLevel}",
          "category": "Personalized"
        }
      }
      
      Ensure all content is educational, informative, and directly related to the course topic.
      Content should be complete enough that a reader could learn the concepts without additional resources.`;

    // Using OpenAI API for text generation
    console.log("Sending request to OpenAI API")
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4096
      })
    });

    const data = await response.json();
    
    // Process the OpenAI response
    try {
      console.log("Received response from OpenAI")
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        throw new Error("Invalid response from OpenAI API");
      }
      
      const content = data.choices[0].message.content;
      let aiResult;
      
      try {
        // Try to parse the response as JSON
        aiResult = JSON.parse(content);
      } catch (parseError) {
        console.error("Error parsing JSON from OpenAI response:", parseError);
        
        // Try to extract JSON from the text response
        const jsonMatch = content.match(/{[\s\S]*}/);
        if (jsonMatch) {
          aiResult = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Could not extract valid JSON from response");
        }
      }
      
      console.log("Processed AI result:", aiResult);
      
      // Connect to Supabase using the REST API to save the course
      const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
      const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
      
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error("Missing Supabase credentials");
      }
      
      // Create the course
      const courseResponse = await fetch(`${SUPABASE_URL}/rest/v1/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          title: aiResult.courseInfo.title,
          description: aiResult.courseInfo.description,
          instructor_id: userId,
          status: 'Published',
          level: aiResult.courseInfo.level,
          category: aiResult.courseInfo.category,
          price: 0,
          students: 0,
          rating: 0
        })
      });
      
      const courseData = await courseResponse.json();
      if (!courseResponse.ok || !courseData || courseData.length === 0) {
        throw new Error("Failed to create course");
      }
      
      const courseId = courseData[0].id;
      console.log("Created course with ID:", courseId);
      
      // Create the modules and materials
      for (const moduleData of aiResult.modules) {
        // Create module
        const moduleResponse = await fetch(`${SUPABASE_URL}/rest/v1/modules`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            title: moduleData.title,
            description: moduleData.description,
            position: moduleData.position,
            course_id: courseId
          })
        });
        
        const moduleResult = await moduleResponse.json();
        if (!moduleResponse.ok || !moduleResult || moduleResult.length === 0) {
          console.error("Failed to create module:", moduleData.title);
          continue;
        }
        
        const moduleId = moduleResult[0].id;
        console.log("Created module with ID:", moduleId);
        
        // Create materials for this module
        if (moduleData.materials && moduleData.materials.length > 0) {
          for (let i = 0; i < moduleData.materials.length; i++) {
            const material = moduleData.materials[i];
            await fetch(`${SUPABASE_URL}/rest/v1/materials`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
              },
              body: JSON.stringify({
                title: material.title,
                type: material.type || 'document',
                content: material.content,
                position: i,
                module_id: moduleId
              })
            });
          }
        }
      }
      
      // Automatically enroll the user in this course
      await fetch(`${SUPABASE_URL}/rest/v1/user_progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          user_id: userId,
          course_id: courseId,
          progress_percentage: 0
        })
      });
      
      // Return the result
      return new Response(
        JSON.stringify({
          courseId,
          title: aiResult.courseInfo.title,
          modules: aiResult.modules
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error("Error processing AI response or saving to database:", error);
      
      return new Response(
        JSON.stringify({
          error: "Failed to process or save the personalized course",
          details: error.message
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error("Function error:", error.message);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to generate personalized course", 
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

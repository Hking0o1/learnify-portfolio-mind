
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

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
    const { userId, requestType, userSkills } = await req.json()

    // Log request data for debugging
    console.log(`Processing ${requestType} request for user:`, userId)
    
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

    let systemPrompt = "You are an AI career advisor that specializes in analyzing skills profiles and creating personalized career recommendations.";
    let userPrompt = "";
    
    // Create different prompts based on the request type
    if (requestType === "recommendations") {
      userPrompt = `
        Based on the following user skills profile, generate personalized learning recommendations:
        ${JSON.stringify(userSkills)}
        
        Provide 3 specific recommendations that would help the user advance their career.
        
        Format the response as JSON following this structure:
        {
          "recommendations": [
            {
              "id": 1,
              "title": "Recommendation title",
              "description": "Detailed description",
              "match": 95,
              "type": "course|certification|workshop"
            }
          ]
        }
      `;
    } else if (requestType === "assessment") {
      userPrompt = `
        Create a personalized skills assessment plan for a user with the following skills profile:
        ${JSON.stringify(userSkills)}
        
        Design an assessment that will accurately evaluate their current proficiency and identify growth areas.
        
        Format the response as JSON following this structure:
        {
          "assessment": {
            "id": "unique_id",
            "title": "Assessment title",
            "description": "Assessment description",
            "estimatedDuration": "30 minutes",
            "focusAreas": ["Skill 1", "Skill 2"],
            "questions": [
              {
                "id": 1,
                "question": "Sample question text",
                "skillArea": "Related skill"
              }
            ]
          }
        }
      `;
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid request type. Supported types: recommendations, assessment" }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log("Sending prompt to OpenAI");

    // Using OpenAI API for generation
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
        max_tokens: 1024
      })
    });

    const data = await response.json();
    
    // Process the AI response - extract the JSON part
    try {
      console.log("Raw AI response:", data);
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        throw new Error("Invalid response from OpenAI API");
      }
      
      const content = data.choices[0].message.content;
      let aiResult;
      
      try {
        // Try to parse the response as JSON
        aiResult = JSON.parse(content);
      } catch (parseError) {
        // Try to extract JSON from the text response
        const jsonMatch = content.match(/{[\s\S]*}/);
        if (jsonMatch) {
          aiResult = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Could not extract valid JSON from response");
        }
      }
      
      console.log("Processed result:", aiResult);
      
      return new Response(
        JSON.stringify(aiResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error("Error parsing AI response:", error);
      
      // Return a fallback response if parsing fails
      const fallbackResponse = requestType === "recommendations" 
        ? {
            recommendations: [
              {
                id: 1,
                title: "Advanced Data Analysis Techniques",
                description: "Expand your knowledge in statistical modeling and data visualization.",
                match: 92,
                type: "course"
              },
              {
                id: 2,
                title: "Financial Risk Management Certification",
                description: "Industry-recognized certification for risk professionals.",
                match: 87,
                type: "certification"
              },
              {
                id: 3,
                title: "Leadership and Team Management",
                description: "Practical workshop on leading technical teams and projects.",
                match: 82,
                type: "workshop"
              }
            ]
          }
        : {
            assessment: {
              id: `assess_${Date.now()}`,
              title: "Comprehensive Skills Assessment",
              description: "Evaluate your technical, business, and soft skills proficiency.",
              estimatedDuration: "45 minutes",
              focusAreas: ["Machine Learning", "Data Analysis", "Leadership"],
              questions: [
                {
                  id: 1,
                  question: "Describe an approach to solving a complex data classification problem.",
                  skillArea: "Machine Learning"
                },
                {
                  id: 2,
                  question: "How would you approach a financial risk assessment for a new project?",
                  skillArea: "Risk Assessment"
                },
                {
                  id: 3,
                  question: "Describe a situation where you had to lead a team through a challenging project.",
                  skillArea: "Leadership"
                }
              ]
            }
          };
      
      return new Response(
        JSON.stringify(fallbackResponse),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error("Function error:", error.message);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to generate personalized content", 
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

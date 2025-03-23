
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
    const { courseTitle, courseDescription, numModules, difficultyLevel } = await req.json()

    // Log request data for debugging
    console.log("Generating modules for course:", courseTitle)
    console.log("Description:", courseDescription)
    console.log("Number of modules:", numModules)
    console.log("Difficulty level:", difficultyLevel)

    // Create a prompt for the AI model
    const prompt = `
      Create ${numModules} learning modules for a course titled "${courseTitle}". 
      Course description: ${courseDescription}
      Difficulty level: ${difficultyLevel}
      
      For each module, provide:
      1. A descriptive title
      2. A brief description (2-3 sentences)
      3. 3-4 key learning materials with titles and types (video, document, or quiz)
      4. The module position number
      
      Format the response as JSON following this structure:
      {
        "modules": [
          {
            "title": "Module title",
            "description": "Module description",
            "position": 0,
            "materials": [
              {
                "title": "Material title",
                "type": "video|document|quiz", 
                "content": "Brief content description"
              }
            ]
          }
        ]
      }
    `

    // Using Hugging Face Inference API for text generation
    const HF_API_KEY = Deno.env.get("HF_API_KEY")
    
    if (!HF_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "Missing API key for Hugging Face. Please set HF_API_KEY in Supabase secrets."
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Using Mistral model that's good for structured generation
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${HF_API_KEY}`
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 2048,
            temperature: 0.7,
            top_p: 0.9,
            return_full_text: false
          }
        })
      }
    )

    const data = await response.json()
    
    // Process the AI response - extract the JSON part
    let moduleData
    try {
      // Extract JSON from text response
      console.log("Raw AI response:", data)
      
      // Attempt to find and parse JSON in the response
      const responseText = data[0]?.generated_text || ""
      const jsonMatch = responseText.match(/```json([\s\S]*?)```/) || 
                        responseText.match(/{[\s\S]*}/) || 
                        [null, responseText]
      
      let jsonStr = jsonMatch[1] || jsonMatch[0] || ""
      jsonStr = jsonStr.trim()
      
      // If the JSON is wrapped in backticks, remove them
      if (jsonStr.startsWith("```") && jsonStr.endsWith("```")) {
        jsonStr = jsonStr.substring(3, jsonStr.length - 3).trim()
      }
      
      moduleData = JSON.parse(jsonStr)
      console.log("Processed modules:", moduleData)
    } catch (error) {
      console.error("Error parsing AI response:", error)
      console.log("Response data:", data)
      
      // Fallback to simple modules if parsing fails
      moduleData = {
        modules: Array.from({ length: numModules }, (_, i) => ({
          title: `Module ${i + 1}: Introduction to ${courseTitle} Part ${i + 1}`,
          description: `This module introduces key concepts related to ${courseTitle}.`,
          position: i,
          materials: [
            {
              title: `Introduction to ${courseTitle} - Part ${i + 1}`,
              type: "video",
              content: "Video introduction to the core concepts."
            },
            {
              title: `${courseTitle} Documentation`,
              type: "document",
              content: "Detailed explanation of the concepts covered in this module."
            },
            {
              title: `${courseTitle} Knowledge Check`,
              type: "quiz",
              content: "A quiz to test your understanding of the material."
            }
          ]
        }))
      }
    }

    // Return the generated modules
    return new Response(
      JSON.stringify(moduleData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error("Function error:", error.message)
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to generate modules", 
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

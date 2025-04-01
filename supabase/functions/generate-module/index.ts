
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

    // Get the API key from environment variables
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "sk-1234567890abcdef1234567890abcdef12345678"
    
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "Missing API key for OpenAI. Please set OPENAI_API_KEY in Supabase secrets."
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create system prompt for OpenAI
    const systemPrompt = `You are an expert educational content creator who specializes in creating detailed blog-style learning modules. 
    Your task is to create high-quality, comprehensive educational content.`;

    // Create a prompt for the AI model that emphasizes blog-style content
    const userPrompt = `
      Create ${numModules} learning modules as detailed blog articles for a course titled "${courseTitle}". 
      Course description: ${courseDescription}
      Difficulty level: ${difficultyLevel}
      
      For each module:
      1. Create a captivating blog title that would engage learners
      2. Write a brief introduction (2-3 sentences) that outlines what the blog will cover
      3. For each blog module, provide 3-4 learning materials that should be in the form of:
         - A main article (markdown-formatted text content, minimum 300 words)
         - A practical exercise or case study
         - A summary/key takeaways section
      4. The module position number
      
      Format the response as JSON following this structure:
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
        ]
      }
      
      Ensure all content is educational, informative, and directly related to the course topic.
      Content should be complete enough that a reader could learn the concepts without additional resources.
    `;

    // Using OpenAI API for text generation
    console.log("Sending request to OpenAI");
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
    
    // Process the AI response
    let moduleData;
    try {
      console.log("Received response from OpenAI");
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        throw new Error("Invalid response from OpenAI API");
      }
      
      const content = data.choices[0].message.content;
      
      try {
        // Try to parse the response as JSON directly
        moduleData = JSON.parse(content);
      } catch (parseError) {
        console.error("Error parsing JSON from OpenAI response:", parseError);
        
        // Try to extract JSON from the text response
        const jsonMatch = content.match(/{[\s\S]*}/);
        if (jsonMatch) {
          moduleData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Could not extract valid JSON from response");
        }
      }
      
      console.log("Processed blog modules:", moduleData);
    } catch (error) {
      console.error("Error parsing AI response:", error);
      console.log("Response data:", data);
      
      // Fallback to simple blog modules if parsing fails
      moduleData = {
        modules: Array.from({ length: numModules }, (_, i) => ({
          title: `Module ${i + 1}: Deep Dive into ${courseTitle} - Part ${i + 1}`,
          description: `This comprehensive guide explores key concepts related to ${courseTitle} with practical examples and exercises.`,
          position: i,
          materials: [
            {
              title: `Understanding ${courseTitle} - A Complete Guide`,
              type: "document",
              content: `# Introduction to ${courseTitle}\n\nThis article provides a detailed exploration of the core concepts in ${courseTitle}. We'll cover the fundamental principles, practical applications, and best practices.\n\n## Key Concepts\n\n* First important concept\n* Second important concept\n* Third important concept\n\n## Practical Applications\n\nIn this section, we'll explore how these concepts apply in real-world scenarios. Examples include...\n\n## Advanced Techniques\n\nFor those looking to deepen their understanding, here are some advanced techniques to consider...\n\n## Conclusion\n\nBy mastering these concepts, you'll be well-equipped to tackle complex challenges in this field.`
            },
            {
              title: `Practical Exercise: Applying ${courseTitle} Concepts`,
              type: "exercise",
              content: `# Hands-On Exercise\n\nIn this exercise, you will apply what you've learned about ${courseTitle}.\n\n## Step 1\n\nBegin by analyzing the problem...\n\n## Step 2\n\nApply the concepts from the lesson to...\n\n## Step 3\n\nReflect on your approach and consider alternative solutions...\n\n## Challenge\n\nFor extra practice, try extending your solution to handle...`
            },
            {
              title: `${courseTitle} - Key Takeaways`,
              type: "summary",
              content: `# Summary\n\n## Main Points\n\n* First key takeaway\n* Second key takeaway\n* Third key takeaway\n\n## Common Mistakes to Avoid\n\n* Watch out for...\n* Be careful when...\n\n## Next Steps\n\nTo continue your learning journey, explore...\n\n## Additional Resources\n\n* Book recommendations\n* Online courses\n* Community forums`
            }
          ]
        }))
      };
    }

    // Return the generated modules
    return new Response(
      JSON.stringify(moduleData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Function error:", error.message);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to generate modules", 
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

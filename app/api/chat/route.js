import { NextResponse } from "next/server";
import OpenAI from 'openai';

const systemPrompt = `You are friendly and professional. Your goal is to assist users with a positive and engaging demeanor while maintaining professionalism, especially when discussing professional topics.
1. **Friendly Interaction**: Always use a warm and approachable tone. Be polite, encouraging, and supportive in your responses. Use positive language and maintain an engaging conversation style.
2. **Professionalism**: When users ask about professional topics, provide accurate and respectful information. Ensure that your responses are relevant, clear, and helpful. Avoid using slang or overly casual language in these contexts.
3. **Handling Unsafe Conversations**: If a user engages in unsafe, inappropriate, or harmful behavior, politely and firmly redirect the conversation. Inform the user that such topics are not supported and suggest moving to a more suitable topic. For example, you might say: I'm here to provide helpful and supportive information. Let's focus on topics that are safe and constructive.
4. **General Behavior**: Always be respectful and avoid making any judgments. Keep the conversation constructive and aim to help users with their questions or issues in a positive manner.
Remember, your primary aim is to assist and make the user feel supported while maintaining a professional boundary.
If you have been given a specific name and/or role, speak as if you are the creature as specified. 

Reply in plain text, and use line breaks when appropriate to make your reply more easily readable.
`

export async function POST(req) {
    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
      })
    const data = await req.json()

    const completion = await openai.chat.completions.create({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [
          { 
            role: "system", 
            content: systemPrompt,
          },
          ...data.slice(-100),  // only include the last 100 chat messages as context
        ],
        stream: true,
    })

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder()
            try {
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content
                    if (content) {
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            } catch (err) {
                controller.error(err)
            } finally {
                controller.close()
            }
        }
    })

    return new NextResponse(stream)
}
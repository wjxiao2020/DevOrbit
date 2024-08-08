import { NextResponse } from "next/server";
import OpenAI from 'openai';

const systemPropt = ''

export async function POST(req) {
    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: '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',
        // defaultHeaders: {
        //   "HTTP-Referer": $YOUR_SITE_URL, // Optional, for including your app on openrouter.ai rankings.
        //   "X-Title": $YOUR_SITE_NAME, // Optional. Shows in rankings on openrouter.ai.
        // }
      })
    const data = await req.json()

    const completion = await openai.chat.completions.create({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [
          { 
            role: "system", 
            content: systemPropt,
          },
          ...data,
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
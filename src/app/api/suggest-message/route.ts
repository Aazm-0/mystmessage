import { google } from '@ai-sdk/google';
// import { generateText } from 'ai';
import { streamText } from 'ai'

export async function POST(req: Request) {
  try {
    const {messages} = await req.json()

    const result = streamText({
      model: google('gemini-2.5-pro'),
      messages
  })

  return Response.json({
    data: result.toUIMessageStreamResponse()
  },{status: 200})
    // const { text } = await generateText({
    //   model: google('gemini-2.5-pro'),
    //   prompt: "Give a friendly question to a new friend",
    // });
    
    // return Response.json({ message: text });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
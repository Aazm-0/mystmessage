import { google } from '@ai-sdk/google';
// import { generateText } from 'ai';
import { ModelMessage, streamText } from 'ai'

// This protocol that is being used is https streaming so the input wiill be given through
// useCHat config in react 
// The data will be sent back in chunks as it is being processed 
// The api line will be open until all data has successfully been transfered over 

export async function POST(req: Request) {
  try {
    // The prompt that is being used is important so you know how to deal with it in the front end
    const messages: ModelMessage[] = [{
      role: "user",
      content: "Generate 3 fun, engaging questions for anonymous messaging. Separate each question with ||. Example format: Question1||Question2||Question3"
    }]

    const result = await streamText({
      model: google('gemini-2.5-pro'),
      messages,
      maxOutputTokens: 1000, 
      temperature: 0.7 
    })

    return result.toUIMessageStreamResponse()
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
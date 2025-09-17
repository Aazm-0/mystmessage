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
      const messages : ModelMessage[] = [{
        role: "user",
        content: "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."
      }] 

      const result = streamText({
        model: google('gemini-2.5-pro'),
        messages,
        maxOutputTokens: 200
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
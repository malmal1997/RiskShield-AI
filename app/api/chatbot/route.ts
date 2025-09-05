import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { error: "Google Generative AI API key not configured." },
        { status: 500 }
      );
    }

    const result = await streamText({
      model: google("gemini-1.5-flash"),
      messages,
      system: `You are a helpful AI assistant for RiskShield AI, a platform for risk assessment and compliance management.
      Answer questions about the platform's features, risk management concepts, compliance standards (like SOC 2, ISO 27001, GDPR), and general cybersecurity.
      Keep your responses concise and helpful. If a question is outside your knowledge base or the context of RiskShield AI, politely decline to answer.`,
    });

    // The 'ai' SDK's streamText returns a ReadableStream.
    // We need to convert it to a format that can be consumed by the client.
    // For simplicity, I'll collect the stream and return a single JSON response.
    // In a real-time chat, you might stream directly to the client.
    let fullResponse = "";
    for await (const chunk of result.textStream) {
      fullResponse += chunk;
    }

    return NextResponse.json({ response: fullResponse });

  } catch (error) {
    console.error("Error in chatbot API:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred." },
      { status: 500 }
    );
  }
}

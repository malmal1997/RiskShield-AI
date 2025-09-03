"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatbotProps {
  onAiCannotHelp: () => void;
}

export function AIChatbot({ onAiCannotHelp }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  const [feedbackMessageCount, setFeedbackMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const FEEDBACK_THRESHOLD = 2; // Show feedback prompt after 2 AI messages

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);
    setShowFeedbackPrompt(false); // Hide feedback prompt when new message is sent

    // Scroll to bottom immediately after user sends message
    setTimeout(scrollToBottom, 0); 

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = { role: "assistant", content: data.response };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      setFeedbackMessageCount((prevCount) => prevCount + 1);

      // Scroll to bottom after AI response
      setTimeout(scrollToBottom, 0);

    } catch (error) {
      console.error("Error sending message to AI:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "Sorry, I'm having trouble connecting to the AI. Please try again later." },
      ]);
      setTimeout(scrollToBottom, 0); // Scroll even on error message
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (feedbackMessageCount >= FEEDBACK_THRESHOLD && !isLoading && messages.length > 0 && messages[messages.length - 1].role === "assistant") {
      setShowFeedbackPrompt(true);
    }
  }, [feedbackMessageCount, isLoading, messages]);

  const handleFeedback = (helpful: boolean) => {
    if (!helpful) {
      onAiCannotHelp();
    }
    setShowFeedbackPrompt(false);
    setFeedbackMessageCount(0); // Reset count after feedback
  };

  return (
    <Card className="w-full max-w-lg mx-auto h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-blue-600" />
          <span>AI Assistant</span>
        </CardTitle>
        <CardDescription>Ask questions about RiskGuard AI, risk assessments, or compliance.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 p-4">
        <ScrollArea className="flex-1 p-4 border rounded-md mb-4 bg-gray-50">
          <div className="space-y-4">
            {/* Removed the conditional rendering for the initial placeholder message */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && <Bot className="h-6 w-6 text-blue-600 flex-shrink-0" />}
                <div
                  className={`p-3 rounded-lg max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && <User className="h-6 w-6 text-gray-600 flex-shrink-0" />}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start space-x-3">
                <Bot className="h-6 w-6 text-blue-600 animate-bounce" />
                <div className="p-3 rounded-lg bg-gray-200 text-gray-800 rounded-bl-none">
                  <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />
                  Typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {showFeedbackPrompt && (
          <div className="flex flex-col items-center p-3 bg-blue-50 border border-blue-200 rounded-md mb-4">
            <p className="text-sm font-medium text-blue-800 mb-2">Was this helpful?</p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleFeedback(true)}>
                <ThumbsUp className="h-4 w-4 mr-1" /> Yes
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleFeedback(false)}>
                <ThumbsDown className="h-4 w-4 mr-1" /> No
              </Button>
            </div>
          </div>
        )}

        <div className="flex space-x-2 mt-auto">
          <Input
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !isLoading) {
                sendMessage();
              }
            }}
            disabled={isLoading}
          />
          <Button onClick={sendMessage} disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          className="mt-4 w-full text-blue-600 border-blue-200 hover:bg-blue-50"
          onClick={onAiCannotHelp}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Still need help? Submit a ticket
        </Button>
      </CardContent>
    </Card>
  );
}
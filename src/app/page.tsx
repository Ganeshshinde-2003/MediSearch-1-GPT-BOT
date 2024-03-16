"use client";

import { useEffect, useState, useRef } from "react";
import ChatInputField from "./components/chat";
import styles from "./chatpage.module.css";
import OpenAI from "openai";
import ChatUI from "./components/chatUI";

function submitModelRequest(
  currentQuestion: string,
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  setMessages: (messages: OpenAI.Chat.ChatCompletionMessageParam[]) => void,
  setLoading: (loading: boolean) => void
) {
  setLoading(true);
  const newMessage: OpenAI.Chat.ChatCompletionMessageParam = {
    role: "user",
    content: currentQuestion,
  };
  const newMessages = [...messages, newMessage];
  setMessages(newMessages);

  fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages: newMessages }),
  })
    .then((response) => {
      if (response.body) {
        const reader = response.body.getReader();
        let responseText = "";
        const stream = new ReadableStream({
          async start(controller) {
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                break;
              }
              const chunk = new TextDecoder().decode(value);
              responseText += chunk;
              setMessages([
                ...newMessages,
                { role: "assistant", content: responseText },
              ]);
              controller.enqueue(value);
            }
            controller.close();
            reader.releaseLock();
          },
        });
        return new Response(stream);
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    })
    .finally(() => {
      setLoading(false);
    });
}

export default function ChatPage() {
  const [messages, setMessages] = useState<
    OpenAI.Chat.ChatCompletionMessageParam[]
  >([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const scrollableBoxRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (scrollableBoxRef.current) {
      scrollableBoxRef.current.scrollTop =
        scrollableBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <main className={styles.mainContainer}>
      <div className={styles.chatBox}>
        {messages.length === 0 ? (
          <p className={styles.centerText}>MediSearch AI bot is here for you...</p>
        ) : (
          <div className={styles.scrollableBox} ref={scrollableBoxRef}>
            {messages.map((message, index) => {
              return (
                <ChatUI
                  key={index}
                  role={message.role}
                  content={message.content}
                />
              );
            })}
          </div>
        )}
      </div>
      {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.glowingDot}></div>
          </div>)}
      <ChatInputField
        onSearchButtonClick={(currentQuestion: string) => {
          submitModelRequest(currentQuestion, messages, setMessages, setLoading);
        }}
        currentQuestion={currentQuestion}
        setCurrentQuestion={setCurrentQuestion}
      />
    </main>
  );
}

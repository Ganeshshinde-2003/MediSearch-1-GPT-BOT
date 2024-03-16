import React from 'react';
import styles from './chat.module.css'; 
import { ChatCompletionContentPart } from 'ai/prompts';

interface MessageProps {
  role: "function" | "user" | "assistant" | "system" | "tool";
  content: string | ChatCompletionContentPart[] | null | undefined;
}

const ChatUI: React.FC<MessageProps> = ({ role, content }) => {
  const getMessageContent = () => {
    if (typeof content === 'string') {
      return content;
    } else {
      return '';
    }
  };

  const getMessageClassName = () => {
    return `${styles.message} ${role === 'user' ? styles.userMessage : styles.assistantMessage}`;
  };

  return (
    <span className={getMessageClassName()}>
      {getMessageContent()}
    </span>
  );
};

export default ChatUI;

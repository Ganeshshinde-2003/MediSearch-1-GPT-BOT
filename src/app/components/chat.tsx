import React from 'react';
import styles from './chat.module.css';

interface ChatBoxProps {
  currentQuestion: string;
  setCurrentQuestion: (question: string) => void;
  onSearchButtonClick: (question: string) => void;
}

const ChatInputField: React.FC<ChatBoxProps> = ({ currentQuestion, setCurrentQuestion, onSearchButtonClick }) => {
  const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentQuestion(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && currentQuestion.trim() !== "") {
      event.preventDefault();
      submitQuestion();
    }
  };

  const submitQuestion = () => {
    if (currentQuestion.trim() !== "") {
      onSearchButtonClick(currentQuestion);
      setCurrentQuestion("");
    }
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Ask a question ..."
        className={styles.chatInput}
        value={currentQuestion}
        onChange={handleQuestionChange}
        onKeyPress={handleKeyPress}
      />
      <button className={styles.searchButton} onClick={submitQuestion}>
        <svg className={styles.sendIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </div>
  );
};

export default ChatInputField;

import React from 'react';
import useTypingAnimation from './useTypingAnimation ';

const AnimatedText: React.FC<{ text: string }> = ({ text }) => {
  const animatedText = useTypingAnimation(text, 10);
  return <p style={{ whiteSpace: "pre-wrap" }}>{animatedText}</p>;
};

export default AnimatedText;

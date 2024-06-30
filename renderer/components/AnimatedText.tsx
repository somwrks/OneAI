import React from 'react';
import useTypingAnimation from './useTypingAnimation ';

const AnimatedText: React.FC<{ text: string, speed: number }> = ({ text,speed }) => {
  const animatedText = useTypingAnimation(text,speed);
  return <p style={{ whiteSpace: "pre-wrap" }}>{animatedText}</p>;
};

export default AnimatedText;

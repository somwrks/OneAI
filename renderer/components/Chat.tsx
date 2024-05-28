import React, { useState, useEffect, ChangeEvent } from 'react';

const ChatPage: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>('openai');
  const [chatHistory, setChatHistory] = useState<string>('');
  const [newPrompt, setNewPrompt] = useState<string>('');


  const handleModelChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value);
  };

  const handleNewPromptChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNewPrompt(event.target.value);
  };

  const handleSendQuestion = async () => {
    try {
      const response = await fetch(`/api/${selectedModel}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: newPrompt }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        const newChatHistory = `${chatHistory}\n${newPrompt}\n${data.response}`;
        setChatHistory(newChatHistory);
      } else {
        console.error('Failed to send question');
      }
    } catch (error) {
      console.error('Error while sending question:', error);
    }
  };
  

  return (
    <div>
      <div className='flex  flex-col w-full h-full gap-5 p-5'>
        <select className='bg-gray-700 w-full p-3' value={selectedModel} onChange={handleModelChange}>
          <option value="gpt-3.5-turbo">OpenAI</option>
          <option value="gemini-1.5-flash">Gemini</option>
          <option value="perplexity">Perplexity</option>
          <option value="claude">Claude</option>
          <option value="gooseai">GooseAI</option>
          <option value="llama">LLama</option>
        </select>
        <textarea
  className='my-4 py-2 px-4 w-64 text-md bg-gray-900'
  value={newPrompt}
  
  onChange={handleNewPromptChange}
  rows={5}
  cols={20}
/>        <button onClick={handleSendQuestion}>Send Question</button>
      </div>
      <div>
        <p>{chatHistory}</p>
      </div>
    </div>
  );
};

export default ChatPage;

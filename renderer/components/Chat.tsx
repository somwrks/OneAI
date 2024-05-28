import React, { useState, useEffect, ChangeEvent } from 'react';
import { ipcRenderer } from 'electron';

const ChatPage: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>('openai');
  const [chatHistory, setChatHistory] = useState<string>('');
  const [newPrompt, setNewPrompt] = useState<string>('');

  useEffect(() => {
    // Initialize the chat history file
    const chatHistoryFile = 'chat_history.txt';
    const readChatHistory = async () => {
      try {
        const response = await ipcRenderer.invoke('read-file', chatHistoryFile);
        setChatHistory(response);
      } catch (error) {
        console.error(error);
      }
    };
    readChatHistory();
  }, []);

  const handleModelChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value);
  };

  const handleNewPromptChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPrompt(event.target.value);
  };

  const handleSendQuestion = async () => {
    // Send the new prompt to the backend API
    try {
      const response = await fetch(`http://localhost:3000/api/${selectedModel}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: newPrompt }),
      });

      if (response.ok) {
        const newChatHistory = `${chatHistory}\n${newPrompt}`;
        setChatHistory(newChatHistory);
        // Save the updated chat history to the file
        await ipcRenderer.invoke('write-file', 'chat_history.txt', newChatHistory);
      } else {
        console.error('Failed to send question');
      }
    } catch (error) {
      console.error('Error while sending question:', error);
    }
  };

  return (
    <div>
      <div>
        <select value={selectedModel} onChange={handleModelChange}>
          <option value="openai">OpenAI</option>
          <option value="gemini">Gemini</option>
          <option value="perplexity">Perplexity</option>
          <option value="claude">Claude</option>
          <option value="gooseai">GooseAI</option>
          <option value="llama">LLama</option>
        </select>
        <input type="text" value={newPrompt} onChange={handleNewPromptChange} />
        <button onClick={handleSendQuestion}>Send Question</button>
      </div>
      <div>
        <p>{chatHistory}</p>
      </div>
    </div>
  );
};

export default ChatPage;

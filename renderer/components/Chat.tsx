import React, { useState, useEffect, ChangeEvent } from "react";
import templates from "../public/template.json";
type Prompt = {
  title: string;
  type: string;
  techstack: string;
  purpose: string;
  directory: string;
};
const ChatPage: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>("openai");
  const [chatHistory, setChatHistory] = useState<string>("");
  const [prompt, setPrompt] = useState<Prompt>({
    title: "",
    type: "",
    techstack: "",
    purpose: "",
    directory: "",
  });
  const [start, setStart] = useState(false);
  const [template, setTemplate] = useState<any>(0);
  const handleModelChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value);
  };

  const filterchat = (data: any) => {};
  const readchat = async () => {
    try {
      const response = await fetch(`/api/readchat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file:prompt.title }),
      });
      if (response.ok) {
        const data = await response.json();
        filterchat(data.response);
        setChatHistory(data.response);
      } else {
        console.error("Wrong response from server");
      }
    } catch (error) {
      console.error("Error while sending question:", error);
    }
  };
  if(start){
    useEffect(() => {
      const intervalId = setInterval(() => {
        readchat();
      }, 1000);
  
      return () => clearInterval(intervalId);
    }, []);

  }

  const handleSendQuestion = (title: string) => async () => {
    try {
      const response = await fetch(`/api/${selectedModel}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt,part:title, template: templates[template] }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // const newChatHistory = `${chatHistory}\n${prompt}\n${data.response}`;
        // setChatHistory(newChatHistory);
      } else {
        console.error("Failed to send question");
      }
    } catch (error) {
      console.error("Error while sending question:", error);
    }
  };

  return (
    <div>
      <div className="flex  flex-col w-full items-center h-full gap-5 p-5">
        <select
          className="bg-gray-700 w-2/3 p-3"
          value={selectedModel}
          onChange={handleModelChange}
        >
          <option disabled value="gpt-3.5-turbo">
            OpenAI
          </option>
          <option value="gemini-1.5-flash">Gemini</option>
          <option disabled value="perplexity">
            Perplexity
          </option>
          <option disabled value="claude">
            Claude
          </option>
          <option disabled value="gooseai">
            GooseAI
          </option>
          <option value="llama3-70b">LLama</option>
        </select>
        <div className="flex flex-col w-2/3 items-center gap-y-5">
          {start ? (
            <>
              <div className="flex flex-row w-full justify-between ">
                <div className="flex flex-col w-full">
                  {" "}
                  <button
                    className="p-3 bg-gray-500 w-1/5 rounded-md "
                    onClick={() => {
                      setStart(false);
                      setPrompt({
                        title: "",
                        type: "",
                        techstack: "",
                        purpose: "",
                        directory: "",
                      });
                    }}
                  >
                    Go back
                  </button>
                </div>
                <div className="flex w-full">
                  <select
                    className="bg-gray-700 w-2/3 p-3"
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                  >
                    {templates.map((e, i) => (
                      <option value={i}>Template {i}</option>
                    ))}
                  </select>
                </div>
              </div>
              {templates.map((t, index) =>
                index === template ? (
                  <div key={index}>
                    {t.headings.map((text, subIndex) => (
                      <div key={subIndex} className="flex-col flex gap-y-5">
                        <div className="flex text-2xl">{text.title}</div>
                        <div className="flex text-md border text-gray-300 border-gray-600 p-4">
                          {text.description}
                        </div>
                        <div className="flex flex-col items-end w-full">
                          <button
                            className="p-3 bg-gray-500 w-1/5 rounded-md "
                            onClick={handleSendQuestion(text.title)}
                          >
                            Generate
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null
              )}
            </>
          ) : (
            <>
              <div className="flex-col flex gap-y-4 text-blue-800 text-xl">
                <input
                  className="p-2 "
                  type="text"
                  placeholder="Project Title"
                  value={prompt.title}
                  onChange={(e) =>
                    setPrompt({ ...prompt, title: e.target.value })
                  }
                />
                <input
                  className="p-2"
                  type="text"
                  placeholder="Type of Project"
                  value={prompt.type}
                  onChange={(e) =>
                    setPrompt({ ...prompt, type: e.target.value })
                  }
                />
                <input
                  className="p-2"
                  type="text"
                  placeholder="Purpose of Project"
                  value={prompt.purpose}
                  onChange={(e) =>
                    setPrompt({ ...prompt, purpose: e.target.value })
                  }
                />
                <input
                  className="p-2"
                  type="text"
                  placeholder="Techstack of Project"
                  value={prompt.techstack}
                  onChange={(e) =>
                    setPrompt({ ...prompt, techstack: e.target.value })
                  }
                />
                <input
                  className="p-2"
                  type="text"
                  placeholder="Directory of Project"
                  value={prompt.directory}
                  onChange={(e) =>
                    setPrompt({ ...prompt, directory: e.target.value })
                  }
                />
              </div>
              {Object.values(prompt).every((value) => value.trim() !== "") && (
                <button
                  onClick={() => setStart(true)}
                  className="p-3 bg-gray-500 w-1/5 rounded-md "
                >
                  Next
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <div>
        <p>{chatHistory}</p>
      </div>
    </div>
  );
};

export default ChatPage;

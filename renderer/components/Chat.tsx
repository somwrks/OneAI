import React, { useState, useEffect, ChangeEvent } from "react";
import templates from "../public/template.json";
type Prompt = {
  title: string;
  type: string;
  techstack: string;
  purpose: string;
  directory: string;
};
type Heading = {
  title: string;
  description: string;
};

type ReadmeData = {
  headings: Heading[];
};

const initialReadme: ReadmeData[] = [
  {
    headings: [
      { title: "# Title", description: "" },
      { title: "## Overview", description: "" },
      { title: "## Dependencies", description: "" },
      { title: "## Usage", description: "" },
      { title: "## Code Structure", description: "" },
      { title: "## Folder Structure", description: "" },
      { title: "## License", description: "" },
    ],
  },
];
const ChatPage: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>("openai");
  const [readme, setReadme] = useState<ReadmeData[]>(initialReadme);
  const [prompt, setPrompt] = useState<Prompt>({
    title: "",
    type: "",
    techstack: "",
    purpose: "",
    directory: "",
  });
  const [regenerate, setRegenerate] = useState(false)
  const [start, setStart] = useState(false);
  const [template, setTemplate] = useState<number>(0);
  const [Generate, setGenerate] = useState(false);
  const handleModelChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value);
  };

  const streamFileData = async () => {
    try {
      const response = await fetch(`/api/readfile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: prompt.title }),
      });

      if (response.ok) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let partialData = "";

        while (true) {
          const { value, done } = await reader?.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value);
          partialData += chunk;

          const data = JSON.parse(partialData);
          setReadme(data);
        }
      } else {
        alert("Wrong response from server");
      }
    } catch (error) {
      alert("Error while sending question:"+error);
    }
  };
  const [apiKey, setApiKey] = useState<string>(process.env.GEMINI_API_KEY)
  const handleSave = async () => {
    console.log(readme)
    try {
      const response = await fetch(`/api/savefile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: readme, dir: prompt.directory,title:prompt.title }),
      });

      if (response.ok) {
       
      } else {
        alert("Wrong response from server");
      }
    } catch (error) {
      alert("Error while sending question:"+error);
    }
  };
  

  useEffect(() => {
    if (Generate) {
      streamFileData();
      setGenerate(false);
    }
  }, [Generate]);

  const handleSendQuestion = async () => {
    const tasks = templates.flatMap((t) =>
      t.headings.map(async (text) => {
        const requestBody = {
          prompt,
          part: text.title,
          template: templates[template],
          apiKey:apiKey
        };

        try {
          const response = await fetch(`/api/${selectedModel}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          });
          if (response.ok) {
            setGenerate(true);
    setRegenerate(true)
            const data = await response.json();
          } else {
            alert("Failed to send question, Status:"+response.status);
            const errorData = await response.json();
            alert("Error Details:"+errorData); 
          }
        } catch (error) {
          alert("Error while sending question:"+error);
        }
      })
    );

    await Promise.all(tasks);
  };

  return (
    <div>
      <div className="flex flex-col w-full items-center h-full gap-5 p-5">
        <select
          className="bg-gray-700 w-2/3 p-3"
          value={selectedModel}
          onChange={handleModelChange}
        >
          <option  value="gpt-3.5-turbo">
          gpt-3.5-turbo
          </option>
          <option value="gemini-1.5-flash">gemini-1.5-flash</option>
          <option  value="llama3-70b">llama3-70b</option>
          <option disabled value="perplexity">
            Perplexity
          </option>
          <option disabled value="claude">
            Claude
          </option>
          <option disabled value="gooseai">
            GooseAI
          </option>
         
        </select>
        <input
                  className="bg-gray-700 w-2/3 p-3"
                  type="text"
                  placeholder="Enter API KEY"
                  value={apiKey}
                  disabled={!Generate&&regenerate}
                  onChange={(e) =>
                    setApiKey(e.target.value)
                  }
                />
        <div className="flex flex-col w-2/3 items-center gap-y-5">
          {start ? (
            <>
              <div className="flex flex-row w-full justify-between">
                <div className="flex flex-col w-full">
                  <button
                    className="p-3 bg-gray-500 w-1/5 rounded-md"
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
                    onChange={(e) => setTemplate(Number(e.target.value))}
                  >
                    {templates.map((_, i) => (
                      <option key={i} value={i}>
                        Template {i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {templates.map((t, index) =>
                index === template ? (
                  <div key={index}>
                    {t.headings.map((text, subIndex) => {
                      return (
                        <div key={subIndex} className="flex-col flex gap-y-5">
                          <div className="flex text-2xl">{text.title}</div>
                          <div className="flex text-md border text-gray-300 border-gray-600 p-4">
                            {readme[index]?.headings.find(
                              (e) => e.title === text.title
                            )?.description || text.description}
                          </div>
                          <div className="flex flex-col items-end w-full">
                            {subIndex == t.headings.length - 1 && (
                              <><button
                                className="p-3 bg-gray-500 w-1/5 rounded-md"
                                onClick={handleSendQuestion}
                              >
                                {regenerate ? "Regenrate" : "Generate"}
                              </button>
                              {!Generate&&regenerate&&<button
                                className="p-3 bg-gray-500 w-1/5 rounded-md"
                                onClick={handleSave}
                              >
                                 Save
                                </button>
                                }
                                </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null
              )}
            </>
          ) : (
            <>
              <div className="flex-col w-full flex gap-y-4 text-blue-800 text-xl">
                <input
                  className="p-2"
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
                  className="p-3 bg-gray-500 w-1/5 rounded-md"
                >
                  Next
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

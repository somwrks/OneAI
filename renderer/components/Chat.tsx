import React, { ChangeEvent, useState } from "react";
import templates from "../public/template.json";
import ModelSelector from "./ModelSelector";
import PromptForm from "./PromptForm";
import TemplateDisplay from "./TemplateDisplay";
import LoadingOverlay from "./LoadingOverlay";
import { SignOutButton } from "@clerk/clerk-react";
import { Prompt, ReadmeData } from "./types";

const initialReadme: ReadmeData[] = [
  {
    headings: [
      { title: "# Title", description: "" },
      { title: "## Overview", description: "" },
      { title: "## Dependencies", description: "" },
      { title: "## Usage", description: "" },
      { title: "## Code Structure", description: "" },
      { title: "## License", description: "" },
    ],
  },
];

const ChatPage: React.FC = () => {
  const [typedDescription, setTypedDescription] = useState("");
  const [selectedModel, setSelectedModel] = useState<string>("gemini-1.5-flash");
  const [loading, setLoading] = useState(false);
  const [readme, setReadme] = useState<ReadmeData[]>(initialReadme);
  const [prompt, setPrompt] = useState<Prompt>({
    title: "",
    type: "",
    techstack: "",
    purpose: "",
    contribute: "",
    directory: "",
  });
  const [regenerate, setRegenerate] = useState(false);
  const [start, setStart] = useState(false);
  const [template, setTemplate] = useState<number>(0);
  const [generate, setGenerate] = useState(false);
  const [apiKey, setApiKey] = useState<string>(process.env.GEMINI_API_KEY || "");
  const [save, setSave] = useState(false);

  const handleModelChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const model = event.target.value;
    setSelectedModel(model);
    switch (model) {
      case "gpt-3.5-turbo":
        setApiKey(process.env.OPENAI_API_KEY);
        break;
      case "gemini-1.5-flash":
        setApiKey(process.env.GEMINI_API_KEY);
        break;
      case "llama3-70b":
        setApiKey(process.env.LLAMA_API_KEY);
        break;
      case "claude-3-5-sonnet-20240620":
        setApiKey(process.env.CLAUDE_API_KEY);
        break;
      default:
        break;
    }
  };

  const handleTypingEffect = (data: ReadmeData[]) => {
    const fullText =
      data[0]?.headings.map((heading) => heading.description).join("\n") || "";
    let index = 0;

    const intervalId = setInterval(() => {
      if (index < fullText.length) {
        setTypedDescription((prev) => prev + fullText[index]);
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, 50); // Adjust typing speed here

    setReadme(data);
  };

  const streamFileData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/readfile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: prompt.title }),
      });

      if (response.ok && !loading) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let partialData = "";
        let completeData = "";

        while (true) {
          const { value, done } = (await reader?.read()) || {};
          if (done) break;

          const chunk = decoder.decode(value);
          partialData += chunk;

          try {
            completeData = JSON.parse(partialData);
            if (
              Array.isArray(completeData) &&
              completeData.every((item) => "headings" in item)
            ) {
              handleTypingEffect(completeData);
              partialData = ""; // Reset partialData if JSON parsing is successful
            }
          } catch (e) {
            // JSON parsing error is ignored here as it may be due to incomplete data
          }
        }

        setLoading(false);
      }
    } catch (error) {
      alert("Error while receiving question:" + error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/savefile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: readme,
          dir: prompt.directory,
          title: prompt.title,
        }),
      });
      const response1 = await fetch(`/api/deletejson`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: prompt.title }),
      });

      if (response.ok &&response1.ok && !loading) {
        setSave(true);
        setLoading(false);
      }
    } catch (error) {}
  };

  const handleQuit = async () => {

    window.ipc?.openDirectory(prompt.directory);

    setStart(false);
    setRegenerate(false);
    setGenerate(false);
    setSave(false);
    setPrompt({
      title: "",
      type: "",
      techstack: "",
      purpose: "",
      directory: "",
      contribute:"",
    });
  };

  const handleSendQuestion = async () => {
    setLoading(true);


    const response1 = await fetch(`/api/refine`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({prompt,apiKey}),
    });
      const data1 = await response1.json();
      const nestedJson = JSON.parse(data1.response.replace(/```json|```/g, ''));
      setPrompt(nestedJson)
      
    const tasks = templates.flatMap((t) =>
      t.headings.map(async (text) => {
        const requestBody = {
          prompt,
          part: text.title,
          template: templates[template],
          apiKey: apiKey,
        };

        try {
          const response = await fetch(`/api/${selectedModel}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          });
          if (response.ok) {
            streamFileData();
            setGenerate(true);
            const data = await response.json();
          } else {
            setRegenerate(false);
          }
        } catch (error) {
          alert("Error with API key");
        }
      })
    );

    await Promise.all(tasks);
    setLoading(false);
    setRegenerate(true);
  };
//   const fetchRepoFiles = async (repoLink: string) => {
//     try {
//       const response = await fetch(`/api/fetchRepo`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ repoLink }),
//       });
//       if (response.ok) {
//         const files = await response.json();
//         let fileListString = '';

//         for (const file of files) {
//           if (file.type === "file") {
//             const fileContent = await fetch(file.download_url);
//             const content = await fileContent.text();
//             const fileLines = content.split('\n');
//             const snippet = fileLines.length > 5
//               ? fileLines.slice(0, 5).join('\n') + '\n...'
//               : fileLines.join('\n');
//             fileListString += `${file.path}\n${snippet}\n\n`;
//           }
//         }
// console.log(fileListString)
//         const updatedPrompt = { ...prompt, fileListString };
//         setPrompt(updatedPrompt);
//       }
//     } catch (error) {
//       console.error("Error fetching repository files:", error);
//     }
//   };
  
  return (
    <div>
      {loading && <LoadingOverlay />}
      <div className="flex flex-col w-full items-center h-full gap-5 p-5">
        <ModelSelector
          selectedModel={selectedModel}
          handleModelChange={handleModelChange}
          apiKey={apiKey}
          setApiKey={setApiKey}
          generate={generate}
          regenerate={regenerate}
        />
        <div className="flex flex-col w-2/3 items-center gap-y-5">
          {start ? (
            !save ? (
              <TemplateDisplay
              setStart={setStart}
                template={template}
                setTemplate={setTemplate}
                templates={templates}
                readme={readme}
                handleSendQuestion={handleSendQuestion}
                handleSave={handleSave}
                regenerate={regenerate}
              />
            ) : (
              <button
                className="p-3 bg-gray-500 w-1/5 rounded-md"
                onClick={handleQuit}
              >
                Open Saved File
              </button>
            )
          ) : (
            <PromptForm prompt={prompt} setPrompt={setPrompt} setStart={setStart} />
          )}
        </div>
        <div className="flex p-2 bg-gray-400 flex-col w-1/2 ">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

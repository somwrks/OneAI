import React from "react";
import { Prompt } from "./types";

type PromptFormProps = {
  prompt: Prompt;
  setPrompt: (prompt: Prompt) => void;
  setStart: (start: boolean) => void;
};

const PromptForm: React.FC<PromptFormProps> = ({ prompt, setPrompt, setStart }) => {
  return (
    <>
      <div className="flex-col w-full flex gap-y-4 text-blue-800 text-md">
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
        <input
          className="p-2"
          type="text"
          placeholder="Cannot Contribute | Ask to Contrbute | How to contribute"
          value={prompt.contribute}
          onChange={(e) =>
            setPrompt({ ...prompt, contribute: e.target.value })
          }
        />
      </div>
      {Object.values(prompt).every((value) => value.trim() !== "") && (
        <button
          onClick={() => setStart(true)}
          className="p-3 bg-gray-500 w-1/5 cursor-pointer rounded-md"
        >
          Next
        </button>
      )}
    </>
  );
};

export default PromptForm;

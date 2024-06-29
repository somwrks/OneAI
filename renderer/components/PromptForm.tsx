import React, { useState } from "react";
import { Prompt } from "./types";

const frontendOptions = {
  Website: ["Next.js", "React", "Vue", "Angular"],
  Mobile_App: ["React Native", "Flutter", "Ionic"]
};

const backendOptions = {
  Website: ["Node.js", "Django", "Flask", "Serverless"],
  Mobile_App: ["Node.js", "Django", "Flask", "Serverless"]
};

const databaseOptions = {
  Website: ["Firebase", "PostgreSQL", "NoSQL", "MongoDB", "None"],
  Mobile_App: ["Firebase", "PostgreSQL", "NoSQL", "MongoDB", "None"]
};

type PromptFormProps = {
  prompt: Prompt;
  setPrompt: (prompt: Prompt) => void;
  setStart: (start: boolean) => void;
};

const PromptForm: React.FC<PromptFormProps> = ({ prompt, setPrompt, setStart }) => {
  const [frontend, setFrontend] = useState("");
  const [backend, setBackend] = useState("");
  const [database, setDatabase] = useState("");
  const [otherFrameworks, setOtherFrameworks] = useState("");
  const [error, setError] = useState("");

  const checkDirectoryExists = async(directory: string): Promise<boolean> => {
    try {
      const response = await fetch(`${process.env.BASE_URL}/api/checkdir`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ directory }),
      });

      if (!response.ok) {
        return false;
      } 
      return true;
    } catch (error) {
      return false;
    }
  };

  const checkGithubRepoExists = async (repoLink: string): Promise<boolean> => {
    try {
      const response = await fetch(`${process.env.BASE_URL}/api/fetchRepo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoLink }),
      });

      if (!response.ok) {
        return false;
      } 

      return true;
    } catch (error) {
      return false;
    }
  };

  const handleNext = async () => {
    const isGithub = prompt.directory.includes("https://github.com");

    let directoryExists = false;
    if (isGithub) {
      directoryExists = await checkGithubRepoExists(prompt.directory);
    } else {
      directoryExists = await checkDirectoryExists(prompt.directory);
    }

    if (!directoryExists) {
      setError("Directory does not exist. Please enter a valid directory.");
      return;
    }

    const techstack = `Frontend - ${frontend}, Backend - ${backend}, Database - ${database}, Other Frameworks/APIs - ${otherFrameworks}`;
    setPrompt({ ...prompt, techstack });
    setStart(true);
  };

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
        <select
          className="p-2"
          value={prompt.type}
          onChange={(e) =>
            setPrompt({ ...prompt, type: e.target.value })
          }
        >
          <option value="" disabled>Select Type of Project</option>
          <option value="Website">Website</option>
          <option value="Mobile_App">Mobile App</option>
        </select>
        {prompt.type && (
          <>
            <select
              className="p-2"
              value={frontend}
              onChange={(e) => setFrontend(e.target.value)}
            >
              <option value="" disabled>Select Frontend</option>
              {frontendOptions[prompt.type].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <select
              className="p-2"
              value={backend}
              onChange={(e) => setBackend(e.target.value)}
            >
              <option value="" disabled>Select Backend</option>
              {backendOptions[prompt.type].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <select
              className="p-2"
              value={database}
              onChange={(e) => setDatabase(e.target.value)}
            >
              <option value="" disabled>Select Database</option>
              {databaseOptions[prompt.type].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <input
              className="p-2"
              type="text"
              placeholder="Other Frameworks or APIs"
              value={otherFrameworks}
              onChange={(e) =>
                setOtherFrameworks(e.target.value)
              }
            />
          </>
        )}
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
          required
          placeholder="Directory of Project | Github URL"
          value={prompt.directory}
          onChange={(e) =>
            setPrompt({ ...prompt, directory: e.target.value })
          }
        />
        <input
          className="p-2"
          type="text"
          placeholder="Features"
          value={prompt.features}
          onChange={(e) =>
            setPrompt({ ...prompt, features: e.target.value })
          }
        />
        <input
          className="p-2"
          type="text"
          required
          placeholder="Cannot Contribute | Ask to Contribute | How to contribute"
          value={prompt.contribute}
          onChange={(e) =>
            setPrompt({ ...prompt, contribute: e.target.value })
          }
        />
        {error && <div className="text-red-500">{error}</div>}
      </div>
      {Object.values(prompt).some((value) => value.trim() !== "") && frontend && backend && database && (
        <button
          onClick={handleNext}
          className="p-3 bg-gray-500 w-1/5 cursor-pointer rounded-md"
        >
          Next
        </button>
      )}
    </>
  );
};

export default PromptForm;

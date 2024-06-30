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

const questions = [
  "Project Title",
  "Type of Project",
  "Frontend",
  "Backend",
  "Database",
  "Other Frameworks or APIs",
  "Purpose of Project",
  "Directory of Project | Github URL",
  "Features",
  "Contribution"
];

const PromptForm: React.FC<PromptFormProps> = ({ prompt, setPrompt, setStart }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [frontend, setFrontend] = useState("");
  const [backend, setBackend] = useState("");
  const [database, setDatabase] = useState("");
  const [otherFrameworks, setOtherFrameworks] = useState("");
  const [error, setError] = useState("");

  const checkDirectoryExists = async (directory: string): Promise<boolean> => {
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
    console.log(prompt)
    const currentPromptKey = Object.keys(prompt)[currentQuestion];
    
    if (
      (currentQuestion < 2 && prompt[currentPromptKey].trim() === "") ||
      (currentQuestion === 2 && frontend.trim() === "") ||
      (currentQuestion === 3 && backend.trim() === "") ||
      (currentQuestion === 4 && database.trim() === "") ||
      (currentQuestion === 6 && prompt.purpose.trim() === "") ||
      (currentQuestion === 7 && prompt.directory.trim() === "")
    ) {
      setError(`${questions[currentQuestion]} is required.`);
      return;
    }

    if (currentQuestion === questions.length - 1) {
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
    } else {
      if (currentQuestion === 5) {
        setPrompt({ ...prompt, techstack: `Frontend - ${frontend}, Backend - ${backend}, Database - ${database}, Other Frameworks/APIs - ${otherFrameworks}` });
      }
      setCurrentQuestion(currentQuestion + 1);
      setError("");
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setError("");
    }
  };
  const renderQuestion = () => {
    switch (currentQuestion) {
      case 0:
        return (
          <input
            className="p-2 bg-white bg-opacity-20 w-full"
            type="text"
            placeholder="Project Title"
            value={prompt.title}
            onChange={(e) => setPrompt({ ...prompt, title: e.target.value })}
          />
        );
      case 1:
        return (
          <select
            className="p-2 bg-white bg-opacity-20 w-full"
            value={prompt.type}
            onChange={(e) => setPrompt({ ...prompt, type: e.target.value })}
          >
            <option className="p-2 bg-gray-700 w-2/3" value="" disabled>Select Type of Project</option>
            <option className="p-2 bg-gray-700 w-2/3" value="Website">Website</option>
            <option className="p-2 bg-gray-700 w-2/3" value="Mobile_App">Mobile App</option>
          </select>
        );
      case 2:
        return (
          <select
            className="p-2 bg-white bg-opacity-20 w-full"
            value={frontend}
            onChange={(e) => setFrontend(e.target.value)}
          >
            <option  value="" disabled>Select Frontend</option>
            {frontendOptions[prompt.type]?.map((option) => (
              <option className="p-2 bg-gray-700 w-2/3" key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 3:
        return (
          <select
            className="p-2 bg-white bg-opacity-20 w-full"
            value={backend}
            onChange={(e) => setBackend(e.target.value)}
          >
            <option value="" disabled>Select Backend</option>
            {backendOptions[prompt.type]?.map((option) => (
              <option className="p-2 bg-gray-700 w-2/3" key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 4:
        return (
          <select
            className="p-2 bg-white bg-opacity-20 w-full"
            value={database}
            onChange={(e) => setDatabase(e.target.value)}
          >
            <option value="" disabled>Select Database</option>
            {databaseOptions[prompt.type]?.map((option) => (
              <option className="p-2 bg-gray-700 w-2/3" key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 5:
        return (
          <input
            className="p-2 bg-white bg-opacity-20 w-full"
            type="text"
            placeholder="Other Frameworks or APIs"
            value={otherFrameworks}
            onChange={(e) => setOtherFrameworks(e.target.value)}
          />
        );
      case 6:
        return (
          <input
            className="p-2 bg-white bg-opacity-20 w-full"
            type="text"
            placeholder="Purpose of Project"
            value={prompt.purpose}
            onChange={(e) => setPrompt({ ...prompt, purpose: e.target.value })}
          />
        );
      case 7:
        return (
          <input
            className="p-2 bg-white bg-opacity-20 w-full"
            type="text"
            required
            placeholder="Directory of Project | Github URL"
            value={prompt.directory}
            onChange={(e) => setPrompt({ ...prompt, directory: e.target.value })}
          />
        );
      case 8:
        return (
          <input
            className="p-2 bg-white bg-opacity-20 w-full"
            type="text"
            placeholder="Features"
            value={prompt.features}
            onChange={(e) => setPrompt({ ...prompt, features: e.target.value })}
          />
        );
      case 9:
        return (
          <input
            className="p-2 bg-white bg-opacity-20 w-full"
            type="text"
            required
            placeholder="Cannot Contribute | Ask to Contribute | How to contribute"
            value={prompt.contribute}
            onChange={(e) => setPrompt({ ...prompt, contribute: e.target.value })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col fade w-full items-center justify-center">
      <div className="flex-col w-full flex gap-y-4 text-white  text-md  shadow-md rounded-md">
        {renderQuestion()}
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex w-full gap-x-12">
          {currentQuestion > 0 && (
                  <button onClick={handleBack} className='p-3 transition-all text-white font-bold shadow-gray-600 shadow-md hover:bg-white hover:text-black border w-full text-center text-md rounded-md'>
              Back
            </button>
          )}
         { !(currentQuestion === questions.length - 1)  ? 
         <button onClick={handleNext} className='p-3 transition-all w-full text-white font-bold shadow-gray-600 shadow-md hover:bg-white hover:text-black border  text-center text-md rounded-md'>
            Next
          </button>: 
        <button onClick={handleNext} className='p-3 transition-all w-full text-white font-bold shadow-gray-600 shadow-md hover:bg-white hover:text-black border  text-center text-md rounded-md'>
            Submit
          </button>
          }
        </div>
      </div>
    </div>
  );
};

export default PromptForm;

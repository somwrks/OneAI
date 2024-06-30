import React from "react";

type ModelSelectorProps = {
  selectedModel: string;
  handleModelChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  generate: boolean;
  regenerate: boolean;
};

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  handleModelChange,
  apiKey,
  setApiKey,
  generate,
  regenerate,
}) => {
  return (
    <>
      <select
        className="p-2 bg-white bg-opacity-20 w-2/3"
        value={selectedModel}
        onChange={handleModelChange}
      >
        <option className="p-2 bg-gray-700 w-2/3" value="gpt-3.5-turbo">gpt-3.5-turbo</option>
        <option className="p-2 bg-gray-700 w-2/3"  value="gemini-1.5-flash">gemini-1.5-flash</option>
        <option className="p-2 bg-gray-700 w-2/3" value="llama3-70b">llama3-70b</option>
        <option className="p-2 bg-gray-700 w-2/3" value="claude-3-5-sonnet-20240620">Claude</option>
      </select>
      <input
        className="p-2 bg-white bg-opacity-20 w-2/3"
        type="text"
        placeholder="Enter API KEY"
        value={apiKey}
        disabled={!generate && regenerate}
        onChange={(e) => setApiKey(e.target.value)}
      />
    </>
  );
};

export default ModelSelector;

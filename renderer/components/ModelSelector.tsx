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
        className="bg-gray-700 w-2/3 p-3"
        value={selectedModel}
        onChange={handleModelChange}
      >
        <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
        <option value="gemini-1.5-flash">gemini-1.5-flash</option>
        <option value="llama3-70b">llama3-70b</option>
        <option value="claude-3-5-sonnet-20240620">Claude</option>
      </select>
      <input
        className="bg-gray-700 w-2/3 p-3"
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

import React from "react";
import { ReadmeData } from "./types";
import AnimatedText from "./AnimatedText";

type TemplateDisplayProps = {
  template: number;
  setTemplate: (template: number) => void;
  templates: any[];
  readme: ReadmeData[];
  handleSendQuestion: () => void;
  handleSave: () => void;
  regenerate: boolean;
  setStart:any
};

const TemplateDisplay: React.FC<TemplateDisplayProps> = ({
  template,
  setTemplate,
  templates,
  readme,
  handleSendQuestion,
  handleSave,
  regenerate,
  setStart
}) => {
  return (
    <>
      <div className="flex flex-row w-full justify-between">
        <div className="flex flex-col w-full">
          <button
            className="p-3 bg-gray-700 w-full cursor-pointer "
            onClick={ () => {
              !regenerate && setStart(false);
            }}
          >
            Go back
          </button>
        </div>
        <div className="flex w-full">
          <select
            className="bg-gray-700 w-full p-3"
            value={template}
            onChange={(e) => setTemplate(Number(e.target.value))}
          >
            {templates.map((e, i) => (
              <option key={i} value={i}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {templates.map((t, index) =>
        index === template ? (
          <div key={index}>
            {t.headings.map((text:any, subIndex:any) => {
              const description =
                readme[index]?.headings.find((e) => e.title === text.title)
                  ?.description || text.description;
              const condition = readme[index]?.headings.find(
                (e) => e.title === text.title
              )?.description
                ? true
                : false;
              return (
                <div key={subIndex} className="flex-col flex gap-y-5">
                  <div className="flex text-2xl">{text.title}</div>
                  <div className="flex text-md border text-gray-300 border-gray-600 p-4">
                    <p style={{ whiteSpace: "pre-wrap" }}>
                      {condition ? <AnimatedText speed={10} text={description} /> : description}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-12 items-end w-full">
                    {subIndex == t.headings.length - 1 && (
                      <>
                        <button
                          className="p-3 bg-gray-500 cursor-pointer w-1/5 rounded-md"
                          onClick={handleSendQuestion}
                        >
                          {regenerate ? "Regenerate" : "Generate"}
                        </button>
                        {regenerate && (
                          <button
                            className="p-3 bg-gray-500 w-1/5 cursor-pointer rounded-md"
                            onClick={handleSave}
                          >
                            Save
                          </button>
                        )}
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
  );
};

export default TemplateDisplay;

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import LlamaAI from "llamaai";

const traverseDirectory = (dir: string, fileList: string[] = []) => {
  const files = fs.readdirSync(dir);
  console.log(files);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (
      stat.isDirectory() &&
      file !== "node_modules" &&
      file !== ".vscode" &&
      file !== "app" &&
      file !== "dist" &&
      file !== ".next"
    ) {
      traverseDirectory(filePath, fileList);
    } else if (stat.isFile()) {
      fileList.push(filePath);
    }
  });

  return fileList;
};

const getPromptWithFiles = (
  prompt: any,
  template: any,
  part: string,
  directory: string
) => {
  const fileList = traverseDirectory(directory);
  let fileListString = "";
  
  fileList.forEach((filePath) => {
    const fileName = path.basename(filePath);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    fileListString += `${fileName} : contains : ${fileContent}\n`;
  });
  
  const relevantTemplatePart = template.headings.find(
    (heading: any) => heading.title === part
  );
  
  return `You are an AI assistant. Your task is to generate descriptions for the README file of a project based on the provided template and project details. Here are the details of the project:\n
${JSON.stringify(prompt, null, 2)}\n
The project contains the following files:\n
${fileListString}\n
Please generate the description for the following part of the README template:\n
Title: ${relevantTemplatePart.title}\n
Description: ${relevantTemplatePart.description}\n
The Readme Template: ${JSON.stringify(template)}
Use the project details and file list to create an accurate and detailed description. Just return the description, not the title`;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { model } = req.query;
  const { prompt, apiKey, part, template } = req.body;
  const projectDir = path.resolve(process.cwd(), prompt.directory);
  if (req.method === "POST") {
    try {
      const fullPrompt = getPromptWithFiles(prompt, template, part, projectDir);
      // console.log(fullPrompt)
      let response;
      let result;

      switch (model) {
        case "gpt-3.5-turbo":
          const openai = new OpenAI({
            apiKey: apiKey,
          });

          response = await openai.chat.completions.create({
            model: model,
            messages: [{ role: "user", content: fullPrompt }],
            max_tokens: 150,
          });
          result = response.choices[0].message?.content || "";
          break;

        case "gemini-1.5-flash":
          const genAI = new GoogleGenerativeAI(apiKey);
          response = await genAI
            .getGenerativeModel({ model: "gemini-1.5-flash" })
            .generateContent(fullPrompt);
          result = await response.response;
          result = result.text();
          break;

        // case "llama3-70b":
        //   const llamaAPI = new LlamaAI({ apiKey: process.env.LLAMA_API_KEY });
        //   response = await llamaAPI.generate({
        //     model: "llama3-70b",
        //     prompt: fullPrompt,
        //     maxTokens: 150,
        //   });
        //   result = response.data.text;
        //   break;

        default:
          res.status(400).json({ error: "Invalid model" });
          return;
      }
      const jsonFilePath = path.join(
        process.cwd(),
        "renderer",
        "public",
        `${prompt.title}.json`
      );

      let templateData = [{ headings: [] }];

      if (fs.existsSync(jsonFilePath)) {
        templateData = JSON.parse(
          fs.readFileSync(jsonFilePath, "utf8") || "[{ headings: [] }]"
        );
      }

      const updatedSectionIndex = templateData[0].headings.findIndex(
        (heading) => heading.title === part
      );

      if (updatedSectionIndex !== -1) {
        templateData[0].headings[updatedSectionIndex].description = result;
      } else {
        templateData[0].headings.push({ title: part, description: result });
      }
      const publicDir = path.join(process.cwd(), "renderer", "public");
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
      }

      fs.writeFileSync(jsonFilePath, JSON.stringify(templateData, null, 2));

      res.status(200).json({ response: JSON.stringify(templateData, null, 2) });
    } catch (error) {
      console.error("Error while handling request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

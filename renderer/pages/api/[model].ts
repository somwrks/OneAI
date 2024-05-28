import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";


const chatHistoryFile = path.join(process.cwd(), "chat_history.txt");

const readChatHistory = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(chatHistoryFile, "utf8", (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          resolve("");
        } else {
          reject(err);
        }
      } else {
        resolve(data);
      }
    });
  });
};

const writeChatHistory = (newChatHistory: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(chatHistoryFile, newChatHistory, "utf8", (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { model } = req.query;
  const { prompt } = req.body;
  
  if (req.method === "POST") {
    try {
      const chatHistory = await readChatHistory();
      
      const fullPrompt = `${chatHistory}\n${prompt}`;
      
      let response;
      let result;
      switch (model) {
        case "gpt-3.5-turbo":
          const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
          });
  
           response = await openai.chat.completions.create({
            model: model,
            messages: [{ role: "user", content: fullPrompt }],
            max_tokens: 150,
          });
           result = response.choices[0].message?.content || "";
          break;
          case "gemini-1.5-flash":
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

            const prompt = fullPrompt;
          
            response = await genAI.getGenerativeModel({ model: "gemini-1.5-flash"}).generateContent(prompt);
            console.log(response)
            result = await response.response;
            result = result.text();
            console.log(result)
          break;
      
        default:
          break;
      }


      const newChatHistory = `${chatHistory}\nMe: ${prompt}\nYou: ${result}`;

      await writeChatHistory(newChatHistory);

      res.status(200).json({ response: result });
    } catch (error) {
      console.error("Error while handling request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

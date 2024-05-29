import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";


export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { file } = req.body;

  const chatHistoryFile = path.join(process.cwd(), `${file}.txt`);
  
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

  if (req.method === "POST") {
    try {
      const chatHistory = await readChatHistory();
      res.status(200).json({ response: chatHistory });
    } catch (error) {
      console.error("Error while handling request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

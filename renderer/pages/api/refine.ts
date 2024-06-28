import { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";


export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { prompt,apiKey } = req.body;
  if (req.method === "POST") {
    let response:any;
    console.log("recieved prompt on /refine " + prompt)
    const fullPrompt=`You are an AI Prompt Refiner, Your Job is to refine the prompts for future ai agents. \n
     Example case-\n
     Requested prompt : {"title":"Leetcode Marathon","type":"Competitive Programming","techstack":"python","purpose":"to add all those questions that i tackle on web to crack faang companies","directory":"/home/som/leetcode"}\n
     Refined prompt : {"title":"Leetcode Marathon","type":"Competitive Programming","techstack":"Python","purpose":"to add all those questions that i tackle on web to crack faang companies","directory":"/home/som/leetcode"}\n
     `
    console.log("final prompt on /refine " + fullPrompt)
    let result:any;
    try{
        const genAI = new GoogleGenerativeAI(apiKey);
          response = await genAI
            .getGenerativeModel({ model: "gemini-1.5-flash" })
            .generateContent(fullPrompt);
          result = await response.response;
          result = result.text();

    } catch (error) {
      console.error("Error while handling request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).json({response: result});

  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

import { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";


export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { prompt,apiKey } = req.body;
  if (req.method === "POST") {
    let response:any;
    console.log("recieved prompt on /refine " + prompt)
    const fullPrompt=`You are an AI Prompt Refiner, Your Job is to refine the prompts for future ai agents. Make sure you keep the variable names same but the values as required for refining. Don't change the title and directory variable values of the json. 
     Example case-
     Requested prompt : {"title":"Leetcode Marathon","type":"Competitive Programming","techstack":"python","purpose":"to add all those questions that i tackle on web to crack faang companies","contribute":"you can contribute","directory":"/home/som/leetcode"}\n
     Refined prompt : {"title":"Leetcode Marathon","type": "Competitive Programming and Algorithm Practice",
  "techstack": "Python 3",
  "purpose": "To systematically tackle and document LeetCode problems commonly asked in FAANG company interviews, focusing on data structures and algorithms","contribute":"Contributions to this project are welcome! If you have any suggestions, improvements, or bug fixes, please feel free to create issues or pull requests","directory":"/home/som/leetcode"}
  
  
  Now refine this prompt according to the rules described above and return the json object text.:
  ${JSON.stringify(prompt, null, 2)}
  `
  
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
    console.log("returned raw result : " + result)
    res.status(200).json({response: result});

  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

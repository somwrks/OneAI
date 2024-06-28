import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import LlamaAI from 'llamaai';
import path from 'path';
import fs from 'fs';
import { getPromptWithFiles } from '../../services/fileSearch'; // Import the functions

const handleAPIRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const { model } = req.query;
  const { prompt, apiKey, part, template } = req.body;
  const projectDir = path.resolve(process.cwd(), prompt.directory);

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const fullPrompt = getPromptWithFiles(prompt, template, part, projectDir);
    console.log(fullPrompt)
    let response, result;

    switch (model) {
      case 'gpt-3.5-turbo':
        const openai = new OpenAI({ apiKey });
        response = await openai.chat.completions.create({
          model: model,
          messages: [{ role: 'user', content: fullPrompt }],
          max_tokens: 150,
        });
        result = response.choices[0].message?.content || '';
        break;

      case 'gemini-1.5-flash':
        const genAI = new GoogleGenerativeAI(apiKey);
        response = await genAI
          .getGenerativeModel({ model: 'gemini-1.5-flash' })
          .generateContent(fullPrompt);
        result = await response.response.text();
        break;

      // case 'llama3-70b':
      //   const llamaAPI = new LlamaAI({ apiKey });
      //   response = await llamaAPI.generate({
      //     model: 'llama3-70b',
      //     prompt: fullPrompt,
      //     maxTokens: 150,
      //   });
      //   result = response.data.text;
      //   break;

      default:
        res.status(400).json({ error: 'Invalid model' });
        return;
    }

    const jsonFilePath = path.join(
      process.cwd(),
      'renderer', 'public', `${prompt.title}.json`
    );

    let templateData = [{ headings: [] }];

    if (fs.existsSync(jsonFilePath)) {
      templateData = JSON.parse(
        fs.readFileSync(jsonFilePath, 'utf8') || '[{ headings: [] }]'
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

    const publicDir = path.join(process.cwd(), 'renderer', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }

    fs.writeFileSync(jsonFilePath, JSON.stringify(templateData, null, 2));

    res.status(200).json({ response: JSON.stringify(templateData, null, 2) });
  } catch (error) {
    console.error('Error while handling request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default handleAPIRequest;

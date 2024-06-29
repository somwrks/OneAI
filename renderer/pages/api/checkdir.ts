import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';


export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {dir} = req.body;
  const jsonFilePath = path.resolve(process.cwd(), dir);
  const result = fs.existsSync(jsonFilePath);
  res.status(200).json({ result: result });
};
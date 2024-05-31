import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { file } = req.body;
  const jsonFilePath = path.join(
    process.cwd(),
    "renderer",
    "public",
    `${file}.json`
  );

  if (fs.existsSync(jsonFilePath)) {
    fs.unlinkSync(jsonFilePath);
  }
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ message: "JSON file deleted successfully!" });
};

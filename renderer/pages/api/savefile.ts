import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";

function createReadmeContent(data: any[], title: string) {
  let content = "";

  const sectionOrder = [
    "# Title",
    "## Overview",
    "## Dependencies",
    "## Usage",
    "## Code Structure",
    "## Folder Structure",
    "## License",
  ];

  console.log("Section Order:", sectionOrder);

  sectionOrder.forEach((sectionTitle) => {
    const section = data[0].headings.find(
      (heading) => heading.title === sectionTitle
    );

    if (section) {
      content += `${sectionTitle}\n\n${section.description}\n\n`;
    }
  });

  content = content.replace("# Title", `# ${title}`);
  console.log("Generated Content:", content);

  return content;
}

function writeReadmeToFile(content: string, dir: string) {
  fs.writeFile(dir + "/readme.md", content, (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
    console.log("Readme file created successfully!");
  });
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { data, dir, title } = req.body;
    const isGithub = dir.includes("https://github.com");

    const readmeContent = createReadmeContent(data, title);

    if (isGithub) {
      // Send the generated content as a response for the user to download
      res.setHeader("Content-Disposition", "attachment; filename=README.md");
      res.setHeader("Content-Type", "text/markdown");
      res.status(200).send(readmeContent);
    } else {
      // If it's not a GitHub URL, create the readme file in the local directory
      writeReadmeToFile(readmeContent, dir);
      res.status(200).json({ message: "Readme file created successfully!" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";

function createReadme(data: any[], dir: string, title: string) {
    let content = "";
  
    const sectionOrder = ["# Title", "## Overview", "## Dependencies", "## Usage", "## Code Structure", "## Folder Structure", "## License"];
  
    console.log("Section Order:", sectionOrder);
  
    sectionOrder.forEach((sectionTitle) => {
        const section = data[0].headings.find((heading) => heading.title === sectionTitle);
  
        if (section) {
          content += `${sectionTitle}\n\n${section.description}\n\n`;
        }
      });
  
  content = content.replace("# Title", `# ${title}`)
    console.log("Generated Content:", content);
  
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
    const { data, dir ,title} = req.body;
    createReadme(data, dir,title);
    res.status(200).json({ message: "Readme file created successfully!" });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

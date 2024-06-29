
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const EXCLUDE_FILES = [
  'node_modules', '.vscode', 'dist', '.next', '.git', 'README.md',
];

const EXCLUDE_EXTENSIONS = [
  '.sample', '.md', '.png', '.mp3', '.mp4', '.webp', '.gif', '.svg', '.ico', '.jpeg', '.jpg',
]; 

const EXCLUDE_PATTERNS = [
  /COMMIT_EDITMSG/, /FETCH_HEAD/, /HEAD/, /^[0-9a-f]{40}$/, // Matches commit hashes
];

export const traverseDirectory = (dir: string, fileList: string[] = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    const shouldExclude =
      EXCLUDE_FILES.includes(file) ||
      EXCLUDE_EXTENSIONS.some((ext) => file.endsWith(ext)) ||
      EXCLUDE_PATTERNS.some((pattern) => pattern.test(file));

    if (stat.isDirectory() && !shouldExclude) {
      traverseDirectory(filePath, fileList);
    } else if (stat.isFile() && !shouldExclude) {
      fileList.push(filePath);
    }
  }
  return fileList;
};

export const getPromptWithFiles = async (
  prompt: any, template: any, part: string, directory: string
) => {
  const isGitHub = directory.includes("https://github.com");

  let fileList: string[], fileListString = '', relevantTemplatePart;

  if (isGitHub) {
    const response = await fetch(`${process.env.BASE_URL}/api/fetchRepo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoLink: directory }),
    });
    const files = await response.json();
    console.log(files)
    for (const file of files) {
      
      if (file.type === "file") {
        const shouldExclude =
          EXCLUDE_FILES.includes(file.name) ||
          EXCLUDE_EXTENSIONS.some((ext) => file.name.endsWith(ext)) ||
          EXCLUDE_PATTERNS.some((pattern) => pattern.test(file.name));

        if (!shouldExclude) {
          const fileContentResponse = await fetch(file.download_url);
          const content = await fileContentResponse.text();
          const fileLines = content.split('\n');
          const snippet = fileLines.length > 5
            ? fileLines.slice(0, 5).join('\n') + '\n...'
            : fileLines.join('\n');
          fileListString += `${file.path}\n${snippet}\n\n`;
        }
      }
    }
  } else {
    
    fileList = traverseDirectory(directory);
    fileList.forEach((filePath) => {
      const fileName = path.basename(filePath);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const fileLines = fileContent.split('\n');
      const snippet = fileLines.length > 5
        ? fileLines.slice(0, 5).join('\n') + '\n...'
        : fileLines.join('\n');
      fileListString += `${fileName}\n${snippet}\n\n`;
    });
  }

  relevantTemplatePart = template.headings.find(
    (heading: any) => heading.title === part
  );

  return `You are an AI assistant. Your task is to generate descriptions for the README file of a project based on the provided template and project details. Here are the details of the project:\n
${JSON.stringify(prompt, null, 2)}\n
This ${prompt.title} project contains the following files only:\n
${fileListString}\n
Please generate the description for the following part of the README template:\n
Title: ${relevantTemplatePart.title}\n
Description: ${relevantTemplatePart.description}\n
The Readme Template: ${JSON.stringify(template)}
Use the project details and file list to create an accurate and detailed description. Just return the description, not the title. Don't mention too many unnecessary files or folders like node_modules or ts configs.`;
};

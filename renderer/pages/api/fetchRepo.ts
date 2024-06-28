import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

const fetchRepo = async (req: NextApiRequest, res: NextApiResponse) => {
  const { repoLink } = req.body;
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed at /api/fetchRepo' });
    return;
  }
  const match = repoLink.match(/github\.com\/(.+?)\/(.+?)(?:\.git|\/)?$/);
  if (!match) {
    res.status(400).json({ error: "Invalid GitHub repository link. at /api/fetchRepo" });
    return;
  }

  const [_, owner, repo] = match;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;

  try {
    const response = await fetch(apiUrl);
    if (response.ok) {
      const files = await response.json();
      res.status(200).json(files);
    } else {
      res.status(response.status).json({ error: "Failed to fetch repository contents.  at /api/fetchRepo" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error at /api/fetchRepo" });
  }
};

export default fetchRepo;

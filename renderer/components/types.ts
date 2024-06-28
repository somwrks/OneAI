export type Prompt = {
    title: string;
    type: string;
    techstack: string;
    purpose: string;
    directory: string;
  };
  
  export type Heading = {
    title: string;
    description: string;
  };
  
  export type ReadmeData = {
    headings: Heading[];
  };
  
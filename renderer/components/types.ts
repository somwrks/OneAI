export type Prompt = {
    title: string;
    type: string;
    techstack: string;
    purpose: string;
    features: string;
    directory: string;
    contribute: string;
    
  };
  
  export type Heading = {
    title: string;
    description: string;
  };
  
  export type ReadmeData = {
    name: string,
    headings: Heading[];
  };
  
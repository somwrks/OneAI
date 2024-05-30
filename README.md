# OneAI

This is a desktop application where user can select from various ai models such as Openai, Llama, Gemini, Claude, Perplexity,  upon entering their apikeys, user can provide directory to their project, user can select from various templates present for readme then ai would do the job to build the readme out of it for the project, user can save the readme file on their computer aswell. The application is built using NextronJS, ElectronJS, TailwindCSS and utilizes APIs from Openai, Gemini, Claude, Llama and Perplexity to generate README files. 


## Overview

This project is a desktop application built using **NextronJS**, **ElectronJS**, and **TailwindCSS**, allowing users to generate professional README files for their projects with the help of various AI models such as OpenAI, Llama, Gemini, Claude, Perplexity, and more. Users can select their preferred AI model, provide their API keys, specify the project directory, and choose from a range of README templates. The AI will then generate a comprehensive README file based on the user's selections. Users can conveniently save the generated README file to their computer. 


## Dependencies

The project requires the following dependencies:

- NextronJS
- ElectronJS
- TailwindCSS
- Openai API
- Gemini API
- Claude API
- Llama API
- Perplexity API 


## Usage

1. Ensure all dependencies are installed. You can install all dependencies by running `npm install` in the project's root directory.
2. Build the application by running `npm run build` in the project's root directory.
3. Launch the application by running `npm run start` in the project's root directory. 

You will be greeted with the OneAI application. 
4. Provide your API keys for various AI models like OpenAI, Llama, Gemini, Claude, Perplexity.
5. Select the desired template for your README file.
6. Provide the directory to your project.
7. OneAI will generate the README file based on your selections and save it to your computer. You can edit and customize the generated README file as needed. 


## Code Structure

The key components of the code include:

- **UI:** The application's user interface is built using `NextronJS`, which leverages the power of `Next.js` for building web applications and integrates it with `ElectronJS` to create a native desktop application. The UI is styled using `TailwindCSS` for a modern and customizable look.
- **AI Model Integration:**  The project seamlessly integrates with various leading AI models:
    - **OpenAI API:** Users can leverage OpenAI's powerful models like GPT-3 and GPT-4 for advanced text generation and understanding.
    - **Gemini API:** Access to Google's Gemini family of models, offering state-of-the-art performance for a range of tasks.
    - **Claude API:** Utilize Anthropic's Claude, known for its safety and reliability in text generation and interaction.
    - **Llama API:** Integrate with Meta's Llama models for large language model capabilities.
    - **Perplexity API:** Connect to Perplexity AI, a powerful search engine and language model for information retrieval.
- **API Key Management:**  Users can securely input their API keys for each model, allowing them to access and utilize the AI models within the application.
- **Project Directory Integration:** The application enables users to provide the directory path to their projects, facilitating the automatic generation of READMEs based on the project's content and structure.
- **Readme Template Selection:** Users can choose from a collection of pre-defined Readme templates, ensuring their Readme files adhere to best practices and conventions.
- **Readme Generation:** The application leverages the selected AI model to automatically generate a high-quality Readme file based on the user's project directory and chosen template.
- **Readme File Saving:** Users can conveniently save the generated Readme file to their computer for easy access and sharing. 


## Folder Structure

- `.git`: Contains version control information for the project.
- `chat_history.txt`: Stores the chat history between the user and the AI models.
- `electron-builder.yml`: Configuration file for Electron Builder, used to package the application for different platforms.
- `main`: Contains the main process code for the Electron application.
    - `background.ts`: Handles background tasks and communication with the renderer process.
    - `helpers`: Contains helper functions for creating windows and managing the application.
        - `create-window.ts`: Creates the main application window.
        - `index.ts`: Main helper functions file.
    - `preload.ts`: Preload script injected into the renderer process to provide additional functionalities.
- `package-lock.json`: Contains information about the project's dependencies and their versions.
- `package.json`: The project's manifest file, defining dependencies, scripts, and other configuration.
- `README.md`: This file, providing information about the project.
- `renderer`: Contains the frontend code built with Next.js, Electron, and TailwindCSS.
    - `.env.local`: Environment variables specific to the development environment.
    - `components`: Contains reusable UI components.
        - `Chat.tsx`: Component for displaying and managing the chat interface.
    - `middleware.ts`: Middleware functions to handle requests and responses.
    - `next-env.d.ts`: Type definitions for Next.js environment variables.
    - `next.config.js`: Configuration file for Next.js, defining build settings and optimizations.
    - `pages`: Contains the application's pages.
        - `api`: Contains API routes for handling file operations and interacting with AI models.
            - `readfile.ts`: Route for reading files from the user's project directory.
            - `savefile.ts`: Route for saving the generated README file.
            - `[model].ts`: Route for interacting with specific AI models based on the provided API keys.
        - `home.tsx`: The main landing page of the application.
        - `_app.tsx`: The application's main component.
    - `postcss.config.js`: Configuration file for PostCSS, defining styling rules and plugins.
    - `preload.d.ts`: Type definitions for the preload script.
    - `public`: Contains static assets for the application.
        - `images`: Contains images for the application.
            - `logo.png`: The application's logo.
        - `template.json`: Contains pre-defined README templates for users to select from.
    - `styles`: Contains global styles for the application.
        - `globals.css`: Global CSS styles.
    - `tailwind.config.js`: Configuration file for TailwindCSS, defining the styling framework.
    - `tsconfig.json`: TypeScript configuration file, defining compiler settings.
- `resources`: Contains icons for the application.
    - `icon.icns`: Icon for macOS.
    - `icon.ico`: Icon for Windows.
- `tsconfig.json`: TypeScript configuration file for the main process. 


## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). Feel free to modify and distribute the code as per the terms of the license. 



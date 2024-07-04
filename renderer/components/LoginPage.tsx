import { SignInButton, useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react';
import AnimatedText from "./AnimatedText";
import { useRouter } from 'next/router';

export default function LoginPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
  
    // Redirect to the /home page if the user is signed in
    React.useEffect(() => {
      if (isLoaded && user) {
        router.push('/home');
      }
    }, [isLoaded, user, router]);
    const content = [
        {title: "React",
            content: `# Project Name\n\n## Overview\nProject Name is a comprehensive full-stack application built with React, Node.js, Express, and MongoDB. This project aims to provide a seamless and robust web application experience, combining the latest in frontend and backend technologies.\n\n## Table of Contents\n1. [Introduction](#introduction)\n2. [Features](#features)\n3. [Tech Stack](#tech-stack)\n4. [Installation](#installation)\n5. [Usage](#usage)\n6. [Configuration](#configuration)\n7. [Scripts](#scripts)\n8. [API Documentation](#api-documentation)\n9. [Contributing](#contributing)\n10. [License](#license)\n11. [Contact](#contact)\n\n## Introduction\nWelcome to Project Name!`
        },
        {title: "React Native",
            content: `# MobileApp: React Native Application\n\n## Overview\n\nMobileApp is a cutting-edge mobile application developed by [Startup Name] using React Native. This cross-platform solution provides a native app experience for both iOS and Android devices, offering seamless performance and a unified codebase.\n\n## Table of Contents\n\n- [Features](#features)\n- [Technologies](#technologies)\n- [Getting Started](#getting-started)\n  - [Prerequisites](#prerequisites)\n  - [Installation](#installation)\n- [Usage](#usage)\n- [API Integration](#api-integration)\n- [Contributing](#contributing)\n- [Testing](#testing)\n- [Deployment](#deployment)\n- [License]`
        },
        {title: "Flask",
            content: `# FlaskAPI: RESTful API Service\n\n## Overview\n\nFlaskAPI is a robust and scalable RESTful API service developed by [Startup Name] using Flask, a lightweight WSGI web application framework in Python. This API serves as the backend for our various client applications, providing efficient data management and business logic implementation.\n\n## Table of Contents\n\n- [Features](#features)\n- [Technologies](#technologies)\n- [Getting Started](#getting-started)\n  - [Prerequisites](#prerequisites)\n  - [Installation](#installation)\n- [Usage](#usage)\n- [API Documentation](#api-documentation)\n- [Database](#database)\n- [Testing](#testing)\n- [Deployment](#deployment)\n- [Contributing](#contributing)\n- [License](#license) `
        },
    ]
    
  return (
        <>
        <div className="flex   bringin  rounded-lg  shadow-md shadow-gray-700 space-y-3 p-3  flex-col absolute top-[20vw] left-[28vw] bg-gradient-to-tr from-gray-800 to-black  ">
 
        <div className="flex text-center text-3xl flex-col">        <AnimatedText speed={60} text={content[0].title} /></div>
          <div className="flex font-mono flex-col text-pink-500">        <AnimatedText speed={10} text={content[0].content} /></div>
      </div>
        <div className="flex  bringin  rounded-lg z-0 shadow-md shadow-gray-700 space-y-3 p-3  flex-col absolute top-[10vw] left-[50vw]  bg-gradient-to-tl from-gray-900 to-black">
        <div className="flex text-center text-3xl flex-col">        <AnimatedText speed={60} text={content[1].title} /></div>
          <div className="flex font-mono flex-col text-blue-500">        <AnimatedText speed={10} text={content[1].content} /></div>     </div>
        <div className="flex  bringin  rounded-lg  shadow-md shadow-gray-700 space-y-3 p-3  flex-col absolute top-[10vw] left-[78vw]  bg-black  bg-gradient-to-t from-gray-900 to-black">
        <div className="flex text-center text-3xl flex-col">        <AnimatedText speed={60} text={content[2].title} /></div>
          <div className="flex font-mono flex-col text-green-500">        <AnimatedText speed={10} text={content[2].content} /></div>    </div>
      
      <div className="flex  z-50 shadow-lg fade backdrop-blur-sm font-poppins flex-col w-full   min-h-screen items-center  justify-center">
        <div className="flex flex-col bg-black bg-opacity-20 rounded-full backdrop-blur-xl w-1/2 h-96 justify-center gap-y-5 p-5">

              <div className="flex z-50  flex-col space-y-1 items-center justify-center">
                  <div>
                      <h1 className='text-8xl font-black'>OneAI</h1>
                  </div>
                  <div>
                      <h2 className='text-3xl'>Generate Readme at Ease</h2>
                  </div>
              </div>
              <div className="flex z-50 flex-col w-full items-center">
                  <div className='p-3 transition-all font-bold shadow-gray-600 shadow-md hover:bg-white hover:text-black border w-1/3 text-center text-md rounded-2xl'>
                      <SignInButton>

                          GET STARTED
                      </SignInButton>

                  </div>
              </div>
        </div>
          </div></>
  )
}

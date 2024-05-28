import React from 'react'
import type { AppProps } from 'next/app'
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

import '../styles/globals.css'
import Link from 'next/link';

function MyApp({ Component, pageProps }: AppProps) {
  
return(
   <ClerkProvider >
      <SignedOut>
        <html>
          <body>
            <div className="flex flex-col w-full min-h-screen items-center justify-center">
            <SignInButton>
              <div className='text-xl cursor-pointer p-3 rounded-2xl bg-white text-blue-600 '>
               
                Sign In
              </div>
              </SignInButton>
            </div>
          </body>
        </html>
      </SignedOut>
      <SignedIn>
      <Component {...pageProps} />
       </SignedIn>
    </ClerkProvider>
)
}

export default MyApp

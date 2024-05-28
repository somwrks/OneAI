import React from 'react'
import type { AppProps } from 'next/app'
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  
return(
   <ClerkProvider >
      <SignedOut>
        <html>
          <body>
            <div className="flex flex-col w-full min-h-screen items-center justify-center">
            <SignInButton>
          
              Sign in
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

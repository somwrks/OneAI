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
<ClerkProvider >
      <SignedOut>
        <html>
          <body>
            <SignInButton />
          </body>
        </html>
      </SignedOut>
      <SignedIn>
      <Component {...pageProps} />
      </SignedIn>
    </ClerkProvider>
}

export default MyApp

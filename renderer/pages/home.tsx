import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import Chat from "../components/Chat"

export default function HomePage() {
  return (
    <React.Fragment>
      <Head>
        <title>OneAI</title>
      </Head>
    <div className="flex font-poppins justify-center  flex-col w-full min-h-screen  p-5">
      
      <Chat/>
    </div>
    </React.Fragment>
  )
}

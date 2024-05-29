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
    <div className="flex font-mono flex-col w-full min-h-screen  p-5">
      <div>
        <h1 className='text-3xl font-bold text-center'>OneAI - Project Readme Generator</h1>
      </div>
      <Chat/>
    </div>
    </React.Fragment>
  )
}

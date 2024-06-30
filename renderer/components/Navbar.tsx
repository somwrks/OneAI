import Link from 'next/link'
import React from 'react'

export default function Navbar() {
  return (
    <div className="flex fixed z-50 fade bg-white text-xl bg-opacity-5 backdrop-blur-md font-poppins font-semibold flex-row w-full px-6 py-4 justify-between items-center">
      <button><Link href={"https://somwrks.com"} target='blank' className=' hover:underline underline-offset-2 '>somwrks</Link></button>
      <button><Link href={"https://github.com/somwrks/OneAI"} target='blank' className='hover:underline underline-offset-2'>Contribute</Link></button>
    </div>
  )
}

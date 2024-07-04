import { SignInButton, SignOutButton, useUser } from '@clerk/clerk-react'
import Link from 'next/link'
import { useRouter } from 'next/router';
import React from 'react'

export default function Navbar() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // Redirect to the /home page if the user is signed in
  React.useEffect(() => {
    if (isLoaded && user) {
      router.push('/home');
    }
  }, [isLoaded, user, router]);
  return (
    <div className="flex fixed z-50 fade bg-white text-xl bg-opacity-5 backdrop-blur-md font-poppins font-semibold flex-row w-full px-6 py-4 justify-between items-center">
      <div><h1  className=' hover:underline underline-offset-2 '>{user?<SignOutButton> Logout</SignOutButton>: <SignInButton/>}</h1></div>
      <button><Link href={"https://somwrks.com"} target='blank' className=' hover:underline underline-offset-2 '>somwrks</Link></button>
      <button><Link href={"https://github.com/somwrks/OneAI"} target='blank' className='hover:underline underline-offset-2'>Contribute</Link></button>
    </div>
  )
}

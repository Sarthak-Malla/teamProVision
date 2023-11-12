'use client'

import Link from 'next/link';

import { useUserContext } from '@/app/context/store';

import { SignOutButton } from '../app/login/page';

// Top navbar
export default function Navbar() {
  const { user, username, leader } = useUserContext();

  return (
    <nav className="border-b-[0.5px] border-b-quaternary shadow-md h-[5rem]
                    flex justify-between items-center
                    px-64">
      <Link href="/">
        <h1 className='font-robotoslab text-4xl hover:border-b-2 hover:border-purple'>
          TeamProVision
        </h1>
      </Link>
      <ul className="flex justify-between items-center text-xl">
        <div className='flex items-center justify-end gap-[3rem]'>
          {username && leader && (
            <>
              <div>
                <Link href={`/${username.replace(' ', '-')}/createProject`}>
                  <h3 className='hover:border-b-2 hover:border-purple'>
                    Create Project
                  </h3>
                </Link>
              </div>
              <div>
                <Link href={`/${username.replace(' ', '-')}/dashboard`}>
                  <h3 className='hover:border-b-2 hover:border-purple'>
                    Dashboard
                  </h3>
                </Link>
              </div>
              <div>
                <SignOutButton />
              </div>
            </>
          )}
          {username && !leader && (
            <>
              <div>
                <Link href={`/${username.replace(' ', '-')}/dashboard`}>
                  <h3 className='p-4
                                    hover:bg-tertiary hover:text-black'>
                    Dashboard
                  </h3>
                </Link>
              </div>
              <div>
                <SignOutButton />
              </div>
            </>
          )}
          {!username && (
            <Link href="/login">
              <button className="hover:border-b-2 hover:border-purple">
                Log in
              </button>
            </Link>
          )}
        </div>

      </ul>
    </nav>
  );
}
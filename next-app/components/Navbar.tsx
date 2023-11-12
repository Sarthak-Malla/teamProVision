'use client'

import Link from 'next/link';

import { useUserContext } from '@/app/context/store';

import { SignOutButton } from '../app/login/page';

// Top navbar
export default function Navbar() {
  const { user, username, leader } = useUserContext();

  return (
    <nav className="bg-blue-500 p-4">
      <ul className="flex justify-evenly items-center">
        <Link href="/">
          <button className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md">teamProVision</button>
        </Link>
        <div className='flex justify-center items-center gap-4'>
          {username && leader && (
            <>
              <div>
                <Link href={`/${username.replace(' ', '-')}/createProject`}>
                  <button className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md">Create Project</button>
                </Link>
              </div>
              <div>
                <Link href={`/${username.replace(' ', '-')}/dashboard`}>
                  <button className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md">Dashboard</button>
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
                  <button className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md">Dashboard</button>
                </Link>
              </div>
              <div>
                <SignOutButton />
              </div>
            </>
          )}
          {!username && (
            <Link href="/login">
              <button className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md">Log in</button>
            </Link>
          )}
        </div>

      </ul>
    </nav>
  );
}
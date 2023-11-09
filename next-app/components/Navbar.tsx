'use client'

import Link from 'next/link';
import { useContext } from 'react';

import { useUserContext } from '@/app/context/store';

import { SignOutButton } from '../app/login/page';

// Top navbar
export default function Navbar() {
  const { user, username, leader } = useUserContext();

  return (
    <nav className="bg-blue-500 p-4">
      <ul className="flex justify-evenly items-center">
        <li>
          <Link href="/">
            <button className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md">teamProVision</button>
          </Link>
        </li>
        <li className='flex justify-center items-center gap-4'>
          {username && leader && (
            <>
              <li>
                <Link href={`/${username}/createProject`}>
                  <button className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md">Create Project</button>
                </Link>
              </li>
              <li>
                <Link href={`/${username}/dashboard`}>
                  <button className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md">Dashboard</button>
                </Link>
              </li>
              <li>
                <SignOutButton />
              </li>
            </>
          )}
          {!username && (
            <li>
              <Link href="/login">
                <button className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md">Log in</button>
              </Link>
            </li>
          )}
        </li>

      </ul>
    </nav>
  );
}
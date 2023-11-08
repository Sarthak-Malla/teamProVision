'use client'

import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';

// Top navbar
export default function Navbar() {
  const { user, username, leader } = useContext(UserContext);

  return (
    <nav className="bg-blue-500 p-4">
      <ul className="flex justify-between items-center">
        <li>
          <Link href="/">
            <button className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md">teamProVision</button>
          </Link>
        </li>

        {username && leader && (
          <li>
            <Link href="/createProject">
              <button className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md">Create Project</button>
            </Link>
          </li>
        )}

        {!username && (
          <li>
            <Link href="/login">
              <button className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md">Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
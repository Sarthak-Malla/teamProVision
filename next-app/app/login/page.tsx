"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { auth, provider } from '../../config/firebaseConfig'
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

import { useUserContext } from '@/app/context/store';

export default function Login() {
  const { user, username, leader } = useUserContext();

  // @ts-ignore
  const slug = username?.replace(' ', '-');

  // route to dashboard if user is logged in
  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.push(`/${slug}/dashboard`);
    }
  }, [user]);

  return (
    <main className="flex justify-center items-center h-[90vh]">
      {user ? 
        <SignOutButton />
      : <SignInButton />
      }
    </main>
  )
}

export function SignOutButton() {
  return (
    <button className="bg-red-500 text-white py-2 px-4 rounded-lg" onClick={() => {
      signOut(auth).then(() => {
        console.log('Signed out');

        window.location.href = '/';
      }).catch((error) => {
        console.log(error);
      });
    }}>
      Sign out
    </button>
  )
}

function SignInButton() {
  const signInWithGoogle = async () => {
    const leader = document.getElementById('leader') as HTMLInputElement;
    const isLeader = leader.checked;

    signInWithPopup(auth, provider)
      .then( async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;

        const email = user.email? user.email : '';
        const name = user.displayName? user.displayName : '';

        const response = await fetch(`api/createUser?query=${isLeader}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, name }),
        });
  
        if (response.status === 200) {
          console.log('User created successfully');
        } else if (response.status === 409) {
          console.log('User already exists');
        } else {
          console.error('Error creating user');
        }
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);

        console.log(errorCode, errorMessage, email, credential);
      });
  }

  return (
    <div className="text-center">
      <form className="mb-4">
        <label htmlFor="leader" className="block">Are you a leader?</label>
        <input type="checkbox" name="leader" id="leader" className="mr-2" />
      </form>

      <button
        onClick={signInWithGoogle}
        className="bg-white text-gray-700 border border-gray-300 rounded-lg p-2 flex items-center space-x-2 hover:bg-gray-100 focus:outline-none"
      >
        <img className="w-6" src="google.png" alt="Google Icon" />
        Sign in with Google
      </button>
    </div>
  )
}
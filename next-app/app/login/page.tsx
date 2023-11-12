"use client";

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { auth, provider } from '../../config/firebaseConfig'
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

import { useUserContext } from '@/app/context/store';
import { sign } from 'crypto';

export default function Login() {
  const { user, username, leader } = useUserContext();
  const [clicked, setClicked] = useState(false);

  // @ts-ignore
  const slug = username?.replace(' ', '-');

  // route to dashboard if user is logged in
  // const router = useRouter();
  // useEffect(() => {
  //   if (user) {
  //     router.push(`/${slug}/dashboard`);
  //   }
  // }, [user]);

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
    <button className="hover:border-b-2 hover:border-b-purple" onClick={() => {
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

export function SignInButton() {

  const signInWithGoogle = async () => {

    signInWithPopup(auth, provider)
      .then( async (result) => {
        const user = result.user;

        const email = user.email? user.email : '';

        const queryObject = {
            email
        };
        
        const response = await fetch(`api/getUser?query=${JSON.stringify(queryObject)}`);
        const data = await response.json();

        if (data.length === 0) {
          signOut(auth).then(() => {
            console.log('Signed out');
          }).catch((error) => {
            console.log(error);
          });
        } else {
          const slug = data[0].name.replace(' ', '-');
          window.location.href = `/${slug}/dashboard`;
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
    <div id="sign-in-div" className="text-center">

      <button
        onClick={signInWithGoogle}
        className="bg-white text-gray-700 border border-gray-300 rounded-lg p-2 flex items-center space-x-2 hover:bg-gray-100 focus:outline-none
                    hover:bg-primary "
      >
        <img className="w-6 mr-4" src="google.png" alt="Google Icon" />
        Sign in with Google
      </button>
    </div>
  )
}
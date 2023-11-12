"use client";

import { auth, provider } from '@/config/firebaseConfig'
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

import { useUserContext } from '@/app/context/store';

export default function Login() {
  const { user, username, leader } = useUserContext();

  if (user) {
    const slug = username.replace(' ', '-');
    window.location.href = `/${slug}/dashboard`;
  }

  return (
    <main className="flex justify-center items-center h-[90vh]">
      {user ? 
        <SignOutButton />
      : <SignInButton />
      }
    </main>
  )
}

function SignOutButton() {
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

function SignInButton() {

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
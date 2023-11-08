"use client";

import { useContext } from 'react';
import { auth, provider } from '../../config/firebaseConfig'
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { UserContext } from '../../lib/context';

import dbConnect from '../../db/dbConnect';
import User, { Users } from '../../db/userSchema';


export default function Home() {
  const { user, username } = useContext(UserContext);

  return (
    <main>
      {user ? 
        !username ? <UserNameForm /> : <SignOutButton />
      : <SignInButton />
      }
    </main>
  )
}

async function addToDatabase(email: string, name: string) {
  await dbConnect();

  const foundUser = await User.findOne({ email: email });

  if (!foundUser) {
    const newUser = new User({
      email: email,
      username: name,
      team_leader: false,
      projects: [],
      tasks: []
    });

    const savedUser = await newUser.save();

    if (savedUser) {
      console.log('User saved');
    } else {
      console.log('User not saved');
    }
  }
}

function SignInButton() {
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;

        const email = user.email? user.email : '';
        const name = user.displayName? user.displayName : '';

        addToDatabase(email, name);

      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);

        console.log(errorCode, errorMessage, email, credential);
      });
  }

  return (
    <button
      onClick={signInWithGoogle}
      className="bg-white text-gray-700 border border-gray-300 rounded-lg p-2 flex items-center space-x-2 hover:bg-gray-100 focus:outline-none"
    >
      <img className="w-6" src="google.png" alt="Google Icon" />
      Sign in with Google
    </button>
  )
}

function SignOutButton() {
  return (
    <button onClick={() => {
      signOut(auth).then(() => {
        console.log('Signed out');
      }).catch((error) => {
        console.log(error);
      });
    }}>
      Sign out
    </button>
  )
}

function UserNameForm() {
  return null;
}


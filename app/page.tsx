"use client";

import { useContext } from 'react';
import { auth, provider } from '../config/firebaseConfig'
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { UserContext } from '../lib/context';

export default function Home() {
  

  return (
    <main>
      Home Page
    </main>
  )
}

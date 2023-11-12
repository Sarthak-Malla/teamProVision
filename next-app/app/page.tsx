"use client";

import { useContext } from 'react';
import { auth, provider } from '../config/firebaseConfig'
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

export default function Home() {
  

  return (
    <main className="text-center p-8 h-[90vh]">
      <h1 className="text-3xl font-bold">Make Projects Simpler!</h1>
    </main>
  )
}

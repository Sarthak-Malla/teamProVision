"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useUserContext } from '@/app/context/store';

import { auth, provider } from '@/config/firebaseConfig'
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

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

function SignInButton({ leader }: { leader: boolean }) {

    const signInWithGoogle = async () => {

        signInWithPopup(auth, provider)
            .then(async (result) => {
                const user = result.user;

                const email = user.email ? user.email : '';

                // this will avoid any errors if the user's display name has a hyphen
                const name = user.displayName ? user.displayName.trim().replace('-', ' ') : '';

                const response = await fetch(`api/createUser?query=${leader}`, {
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

                // redirect to dashboard
                const slug = name.replace(' ', '-');
                window.location.href = `/${slug}/dashboard`;

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


const SignUp = () => {

    let { user, username, leader } = useUserContext();

    const [isLeader, setIsLeader] = useState(false);

    const handleYesClick = () => {
        setIsLeader(true);
    };

    const handleNoClick = () => {
        setIsLeader(false);
    };

    const slug = username?.replace(' ', '-');
    const router = useRouter();
    if (user) {
        router.push(`/${slug}/dashboard`);
    }

    return (
        <div className="flex justify-center items-center h-[calc(100vh-12rem)]">
            <div className='w-[50%] text-center h-64 flex flex-col justify-center shadow-md'>
                <h1 className='text-3xl mb-4'>Are you a Leader?</h1>
                <div>
                    <button
                        className={`px-6 py-3 border ${isLeader ? 'bg-quaternary text-primary' : ''} hover:bg-tertiary hover:text-black mr-4`}
                        onClick={handleYesClick}
                    >
                        Yes
                    </button>

                    <button
                        className={`px-6 py-3 border ${!isLeader ? 'bg-quaternary text-primary' : ''} hover:bg-tertiary hover:text-primary`}
                        onClick={handleNoClick}
                    >
                        No
                    </button>
                </div>
                <main className="flex justify-center items-center h-[calc(100vh-12rem)]">
                    {user ?
                        <SignOutButton />
                        : <SignInButton leader={isLeader} />
                    }
                </main>
            </div>

        </div>
    );
};

export default SignUp;

"use client";

import Link from "next/link";
import { useState } from "react";

const FeatureCard = ({ title, description }: { title: string, description: string }) => (
  <div className="w-64 p-8 text-center border border-quaternary shadow-lg">
    <h3 className="w-full mb-4 font-bold">{title}</h3>
    <p className="w-full">{description}</p>
  </div>
);

const Footer = () => {
  return (
    <footer className="mx-0 mt-12 text-center h-16 bg-quaternary text-primary
                        flex justify-center items-center">
      <p className="text-gray-500">&copy; 2023 TeamProVision. All rights reserved.</p>
    </footer>
  );
}

export default function Home() {
  const [showOverlay, setShowOverlay] = useState(false);

  const features = [
    {
      title: 'Effortless Project Management',
      description: 'Streamline project creation, planning, and execution for your team.',
    },
    {
      title: 'Advanced Privileges for Team Leaders',
      description: 'Shape and modify project pipelines, assign tasks, and monitor progress.',
    },
    {
      title: 'Task Assignment and Progress Tracking',
      description: 'Assign tasks to team members and easily track the overall project progress.',
    },
    {
      title: 'Shared Workspace for Collaborative Efforts',
      description: 'Create a shared workspace for seamless collaboration on projects.',
    },
  ];

  return (
    <>
      <main className="px-64">
        <header className="mx-auto my-8 flex">
          <div id="hero-image-container"
                className="flex" onMouseEnter={() => setShowOverlay(true)} onMouseLeave={() => setShowOverlay(false)}>
            <img className="" src="/hero.jpg" alt="hero-image" />
            {/* <div className={`absolute inset-0 bg-black bg-opacity-50 text-white flex flex-col items-center justify-end opacity-0 transition-opacity ${showOverlay ? 'opacity-100' : ''}`}>
              <a href="https://www.vecteezy.com/" className="mb-2">Photo by: www.vecteezy.com</a>
            </div> */}
          </div>
          <div className="flex flex-shrink flex-col justify-center items-center text-center
                          p-12">
            <h1 className="text-5xl">Welcome to TeamProVision</h1>
            <p className="mb-12 text-quaternary">Streamlining collaborative project efforts for efficient teamwork.</p>
            <Link href="/login">
                <button className="px-12 py-4 bg-purple text-secondary
                                    hover:bg-primary hover:text-quaternary">
                  Log in
                </button>
            </Link>
          </div>
        </header>

        <section className="mt-12">
          <h2 className="text-3xl mb-4">Features</h2>
          <div className="flex flex-wrap justify-around">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </section>

        <section className="my-12">
          <h2 className="text-3xl mb-4">Get Started</h2>
          <div className="flex flex-col justify-center items-center">
            <p className="mb-4">Join TeamProVision today and revolutionize your project management experience.</p>
            <Link href="/signup">
              <button className="px-12 py-4 bg-purple text-secondary
                                      hover:bg-primary hover:text-quaternary">
                Sign up
              </button>
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}

"use client";
import React from "react";
import { UserContext } from "../lib/context";
import Navbar from "./Navbar";

import { useUserData } from '../lib/hooks';

export default function ContextWrapper({
    children
}: {
    children: React.ReactNode
}) {

    const userData = useUserData();

    return (
        // @ts-ignore
        <UserContext.Provider value={userData}>
            <Navbar />
            {children}

        </UserContext.Provider>
    )
}
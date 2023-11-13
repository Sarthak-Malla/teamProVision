"use client";

import { createContext, useContext, useState, useEffect } from "react";

import { auth } from '@/config/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

type DataType = {
    user: any;
    username: string;
    leader: boolean;
}

const UserContext = createContext<DataType>({
    user: null,
    username: "",
    leader: true
});

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    const [leader, setLeader] = useState(false);

    const [userAuth, loading, error] = useAuthState(auth);

    useEffect(() => {
        if (userAuth) {
            const userEmail = userAuth.email;

            fetch(`/api/getUser?email=${userEmail}`)
                .then(res => res.json())
                .then(data => {
                    if (data) {
                        setUser(data);
                        setUsername(data.username);
                        setLeader(data.team_leader);
                    } else {
                        setUser(null);
                        setUsername("");
                        setLeader(false);
                    }
                })
                .catch(err => console.log(err));
        }
    }, [userAuth]);

    return (
        <UserContext.Provider value={{ user, username, leader}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserContext = () => useContext(UserContext);
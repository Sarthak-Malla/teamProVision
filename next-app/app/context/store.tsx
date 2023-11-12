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

            const queryObject = {
                email: userEmail
            };

            fetch(`/api/getUser?query=${JSON.stringify(queryObject)}`)
                .then(res => res.json())
                .then(data => {
                    if (data) {
                        setUser(data[0]);
                        setUsername(data[0].username);
                        setLeader(data[0].team_leader);
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
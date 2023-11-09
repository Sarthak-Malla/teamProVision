import { auth } from '../config/firebaseConfig';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

// Custom hook to read  auth record and user profile doc
export function useUserData() {
    const [user] = useAuthState(auth);
    const [username, setUsername] = useState(null);
    const [leader, setLeader] = useState(null);

    useEffect(() => {
        if (user) {
            const userEmail = user.email;

            const queryObject = {
                email: userEmail
            }

            fetch(`/api/getUser?query=${JSON.stringify(queryObject)}`)
                .then(res => res.json())
                .then(data => {
                    if (data) {
                        setUsername(data[0].username);
                        setLeader(data[0].team_leader);
                    } else {
                        setUsername(null);
                        setLeader(null);
                    }
                })
                .catch(err => console.log(err));
        }
    }, [user]);

    return { user, username: username, leader: leader };
}
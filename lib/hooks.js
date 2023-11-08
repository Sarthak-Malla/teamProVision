// // import '../db/mongoShema';

// import { auth } from '../config/firebaseConfig';
// import { useEffect, useState } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';

// import mongoose from 'mongoose';

// // const User = mongoose.model('User');

// // Custom hook to read  auth record and user profile doc
export function useUserData() {
    // const [user] = useAuthState(auth);
    // const [username, setUsername] = useState(null);
    // const [leader, setLeader] = useState(null);

    // useEffect( async () => {

    //     if (user) {
    //         // grab the username from mongodb
    //         const foundUser = await User.findOne({ email: user.email });

    //         if (foundUser) {
    //             setUsername(foundUser.username);
    //             setLeader(foundUser.team_leader);
    //         } else {
    //             setUsername(null);
    //             setLeader(null);
    //         }
    //     } else {
    //         setUsername(null);
    //         setLeader(null);
    //     }
    // }, [user]);

    return { user: null, username: null, leader: true};
}
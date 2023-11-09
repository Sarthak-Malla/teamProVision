import dbConnect from '../../db/dbConnect';
import User from '../../db/userSchema';

import { randomUUID } from 'crypto';

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    console.log('Sign In request received');
    try {
      await dbConnect(); // Connect to the MongoDB database

      const { email, name } = req.body;
      const { query } = req.query;
      const isLeader = JSON.parse(query);

      const foundUser = await User.findOne({ email });

      if (!foundUser) {
        const newUser = new User({
          userID: randomUUID(),
          email,
          username: name,
          team_leader: isLeader,
          projects: [],
          tasks: [],
        });

        const savedUser = await newUser.save();

        if (savedUser) {
          return res.status(200).json({ message: 'User created successfully' });
        } else {
          return res.status(500).json({ message: 'User not saved' });
        }
      } else {
        return res.status(409).json({ message: 'User already exists' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  } else {
    return res.status(405).end(); // Method Not Allowed
  }
}

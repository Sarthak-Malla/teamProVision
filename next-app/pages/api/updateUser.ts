import dbConnect from '../../db/dbConnect';
import User from '../../db/userSchema';

import { randomUUID } from 'crypto';

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    console.log('Sign In request received');
    try {
      await dbConnect(); // Connect to the MongoDB database

      const { uid, new_user } = req.body;

      const foundUser = await User.findOne({ userID: uid });

      if (foundUser) {
        foundUser.new_user = new_user;
        foundUser.save();

        return res.status(200).json({ message: 'User was made a Leader' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  } else {
    return res.status(405).end(); // Method Not Allowed
  }
}

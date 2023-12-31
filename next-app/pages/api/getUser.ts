import dbConnect from '../../db/dbConnect';
import User from '../../db/userSchema';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    try {
      await dbConnect(); // Connect to the MongoDB database
      console.log("Connected to the database");

      // Get the query parameters from the request
      const { email } = req.query;

      console.log("Query parameters", email)

      // Use the query object to fetch user data
      const users = await User.findOne({ email: email });

      console.log("Found Users", users);

      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  } else {
    return res.status(405).end(); // Method Not Allowed
  }
}

import dbConnect from '../../db/dbConnect';
import User from '../../db/userSchema';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    try {
      await dbConnect(); // Connect to the MongoDB database

      // Get the query parameters from the request
      const { query } = req.query;

      // Parse the query as JSON (assuming it's sent as JSON)
      const queryObject = JSON.parse(query);

      // Use the query object to fetch user data
      const users = await User.find(queryObject);

      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  } else {
    return res.status(405).end(); // Method Not Allowed
  }
}

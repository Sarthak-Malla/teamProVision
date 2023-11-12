import dbConnect from '../../db/dbConnect';
import User from '../../db/userSchema';
import Task from '../../db/taskSchema';

export default async function handler(req: any, res: any) {
    if (req.method === 'GET') {
        try {
            await dbConnect(); // Connect to the MongoDB database

            // Get the query parameters from the request
            const email = req.query.email;

            // Use the query object to fetch user data
            const users = await User.find({ email: email });

            // get all the projects for the user
            const taskIDs = users[0].tasks;
            const tasks = await Task.find({ _id: { $in: taskIDs } });

            // return the projects
            return res.status(200).json(tasks);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    } else {
        return res.status(405).end(); // Method Not Allowed
    }
}

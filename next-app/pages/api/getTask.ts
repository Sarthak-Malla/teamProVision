import dbConnect from '../../db/dbConnect';
import Task from '../../db/taskSchema';

export default async function handler(req: any, res: any) {
    if (req.method === 'GET') {
        try {
            await dbConnect(); // Connect to the MongoDB database

            const { id } = req.query;

            // get all the projects for the user
            const tasks = await Task.find({ _id: { $in: id } });

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

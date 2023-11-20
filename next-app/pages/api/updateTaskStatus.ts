import dbConnect from '../../db/dbConnect';
import Task from '@/db/taskSchema';

export default async function handler(req: any, res: any) {
    if (req.method === 'POST') {
        console.log('Task Status Update request received');
        try {
            await dbConnect(); // Connect to the MongoDB database

            const { taskID, status } = req.body;

            const foundTask = await Task.findOne({ taskID: taskID });

            console.log("TaskID and Status", taskID, status);

            if (foundTask) {
                foundTask.status = status;
                foundTask.save();

                return res.status(200).json({ message: 'Task status updated' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    } else {
        return res.status(405).end(); // Method Not Allowed
    }
}
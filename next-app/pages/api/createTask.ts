import dbConnect from '../../db/dbConnect';
import Project from '../../db/projectSchema';
import Task from '../../db/taskSchema';
import User from '../../db/userSchema';

import { randomUUID } from 'crypto';

export default async function handler(req: any, res: any) {
    if (req.method === 'POST') {
        console.log('Task creation request received');
        try {
            await dbConnect(); // Connect to the MongoDB database

            const { email, taskName, taskDescription, taskStartDate, taskDueDate, taskStatus, taskProject, projectMembers } = req.body;

            const user = await User.findOne({ email });

            const name = taskName;
            const description = taskDescription;
            const startDate = taskStartDate;
            const dueDate = taskDueDate;
            const status = taskStatus;


            // parse the members array and retrieve the userIDs
            const members = projectMembers.split(',').map((member: string) => member.trim());
            const memberIDs = await User.find({ email: { $in: members } });

            // TODO: parse the taskProject which has the projectID of the project
            // we fetch the project data of the project
            const projectID = taskProject;
            const project = await Project.findOne({ projectID: projectID });

            const foundTask = await Task.findOne({ name, user });

            if (!foundTask) {
                const newTask = new Task({
                    taskID: randomUUID(),
                    user,
                    name,
                    description,
                    startedAt: new Date(startDate),
                    deadline: new Date(dueDate),
                    status,
                    project: project,
                    members: [user, ...memberIDs],
                });

                const savedTask = await newTask.save();

                if (savedTask) {
                    // TODO: Find the members and add the task to their tasks array
                    memberIDs.map(async (member) => {
                        const foundUser = await User.findOne({ userID: member.userID });
                        foundUser.tasks.push(savedTask);
                        await foundUser.save();
                    });
                    // TODO: Add the task to the user's tasks array in the database
                    user.tasks.push(savedTask);
                    await user.save();

                    // TODO: Add the task to the project's tasks array in the database
                    project.tasks.push(savedTask);
                    await project.save();
                    
                    return res.status(200).json({ message: 'Project created successfully' });
                } else {
                    return res.status(500).json({ message: 'Project not saved' });
                }
            } else {
                return res.status(409).json({ message: 'Project already exists' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    } else {
        return res.status(405).end(); // Method Not Allowed
    }
}

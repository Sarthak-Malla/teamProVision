import dbConnect from '../../db/dbConnect';
import Project from '../../db/projectSchema';
import User from '../../db/userSchema';

import { randomUUID } from 'crypto';

export default async function handler(req: any, res: any) {
    if (req.method === 'POST') {
        console.log('Project creation request received');
        try {
            await dbConnect(); // Connect to the MongoDB database

            const { email, projectName, projectDescription, projectStartDate, projectDueDate, projectMembers, } = req.body;

            const user = await User.findOne({ email });

            const name = projectName;
            const description = projectDescription;
            const startDate = projectStartDate;
            const dueDate = projectDueDate;

            // parse the members array and retrieve the userIDs
            const members = projectMembers.split(',').map((member: string) => member.trim());
            const memberIDs = await User.find({ email: { $in: members } });

            const foundProject = await Project.findOne({ name });

            if (!foundProject) {
                const newProject = new Project({
                    projectID: randomUUID(),
                    user,
                    name,
                    description,
                    creator: user,
                    startedAt: new Date(startDate),
                    deadline: new Date(dueDate),
                    members: [user, ...memberIDs],
                    tasks: [],
                    leader: user,
                });

                const savedProject = await newProject.save();

                if (savedProject) {
                    // TODO: Find the members and add the project to their projects array
                    memberIDs.map(async (member) => {
                        const foundUser = await User.findOne({ userID: member.userID });
                        foundUser.projects.push(savedProject);
                        await foundUser.save();
                    });

                    // TODO: Add the project to the user's projects array in the database
                    user.projects.push(savedProject);
                    await user.save();
                    
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

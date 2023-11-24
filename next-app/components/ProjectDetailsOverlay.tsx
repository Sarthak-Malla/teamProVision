import { useEffect, useState } from 'react';

import TaskCard from '@/components/TaskCard';

const ProjectDetailsOverlay = ({ project, onClose }: any) => {
    const startDate = new Date(project.startedAt).toLocaleDateString();
    const dueDate = new Date(project.deadline).toLocaleDateString();

    // get the member emails
    const [memberEmails, setMemberEmails] = useState<string[]>([]);

    useEffect(() => {
        const uniqueEmails = new Set<string>();

        project.members.forEach((member: any) => {
            fetch('/api/getMembers?id=' + member)
                .then((res) => res.json())
                .then((data) => {
                    // Add the email to the set to ensure uniqueness
                    uniqueEmails.add(data.email);

                    setMemberEmails(Array.from(uniqueEmails));
                })
                .catch((error) => {
                    console.error('Error fetching member email:', error);
                });
        });

    }, [project.members]);

    const handleClose = () => {
        onClose();
    };

    // get the task details
    const [tasks_, setTasks] = useState<any[]>([]);

    useEffect(() => {
        const uniqueTasks = new Set<string>();

        project.tasks.forEach((task: any) => {
            fetch('/api/getTask?id=' + task)
                .then((res) => res.json())
                .then((data) => {
                    // Add the task to the set to ensure uniqueness
                    uniqueTasks.add(data[0]);

                    setTasks(Array.from(uniqueTasks));
                })
                .catch((error) => {
                    console.error('Error fetching task:', error);
                });
        });
    }, [project.tasks]);

    console.log("tasks", tasks_);


    return (
        <div
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 overflow-hidden"
            onClick={handleClose}
        >
            <div className="bg-black bg-opacity-50 absolute w-full h-full"></div>
            <div
                className="bg-primary p-8 shadow-lg z-10 relative w-[50%] overflow-y-auto max-h-[90%]"
                onClick={(e) => e.stopPropagation()} // Prevent clicking inside from closing the overlay
            >
                <button
                    onClick={handleClose}
                    className="text-white bg-red-500 py-2 px-4 rounded hover:bg-red-600 absolute top-4 right-4"
                >
                    X
                </button>
                <h2 className="text-2xl font-semibold mb-4">{project.name}</h2>
                <p>Started Date: {startDate}</p>
                <p>Deadline: {dueDate}</p>
                <p>{project.description}</p>

                <h3 className="text-xl font-semibold mt-4">Members</h3>
                <ul className="flex flex-wrap gap-2">
                    {memberEmails.map((email, index) => (
                        <li key={index} className="flex items-center bg-tertiary p-2 ">
                            {email}
                        </li>
                    ))}
                </ul>

                <h3 className="text-xl font-semibold mt-4">Tasks</h3>
                <div className="flex flex-wrap gap-4">
                    {tasks_.map((task: any) => (
                        console.log("here", task),
                        <TaskCard key={task._id} task={task} projects={[project]} />
                    ))}

                    {tasks_.length === 0 && <p>No tasks yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsOverlay;
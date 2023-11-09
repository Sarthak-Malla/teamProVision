"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { useUserContext } from '../../context/store';

function CreateProjectForm() {
    const [members, setMembers] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [projectStartDate, setProjectStartDate] = useState('');
    const [projectDueDate, setProjectDueDate] = useState('');

    const pathname = usePathname();

    let { user, username, leader } = useUserContext();

    const currUsername = pathname?.split('/')[1].replace('-', ' ');

    useEffect(() => {
        user = null;
    }, [currUsername]);

    const handleAddMember = (event: any) => {
        if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            const member = event.target.value.trim();
            if (member) {
                // @ts-ignore
                setMembers([...members, member]);
                event.target.value = '';
            }
        }
    };

    const handleFormSubmit = (event: any) => {
        event.preventDefault();

        const projectMembers = members.join(',');

        // You can submit the form data here, e.g., by making an API request using fetch.

        console.log('Project Name:', projectName);
        console.log('Project Description:', projectDescription);
        console.log('Project Start Date:', projectStartDate);
        console.log('Project Due Date:', projectDueDate);
        console.log('Project Members:', projectMembers);
    };

    return (
        <div className='flex justify-center items-center flex-col'>
            <h1 className="text-2xl font-bold text-center mt-10">Create Your Project</h1>

            {!user && (
                <p className="text-center mt-4">
                    Please <a href="/login" className="text-blue-500">log in</a> to view your dashboard.
                </p>
            )}

            {user && (<form onSubmit={handleFormSubmit} className="mt-4" id="projectForm">
                <div className="mb-4">
                    <label className="block">Name:</label>
                    <input
                        type="text"
                        name="projectName"
                        required
                        onChange={(e) => setProjectName(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block">Description:</label>
                    <textarea
                        name="projectDescription"
                        required
                        onChange={(e) => setProjectDescription(e.target.value)}
                    ></textarea>
                </div>

                <div className="mb-4">
                    <label className="block">Started Date:</label>
                    <input
                        type="date"
                        name="projectStartDate"
                        required
                        onChange={(e) => setProjectStartDate(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block">Due Date:</label>
                    <input
                        type="date"
                        name="projectDueDate"
                        onChange={(e) => setProjectDueDate(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block">Members:</label>
                    <div id="memberContainer" className="mb-2">
                        {members.map((member, index) => (
                            <span key={index} className="bg-blue-100 p-1 rounded m-1">
                                {member}
                            </span>
                        ))}
                    </div>
                    <input
                        type="text"
                        name="projectMembers"
                        placeholder="Add members"
                        onKeyDown={handleAddMember}
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Create
                </button>
            </form>)}
        </div>
    );
}

export default CreateProjectForm;

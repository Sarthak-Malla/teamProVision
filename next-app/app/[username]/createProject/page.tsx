"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { useUserContext } from '@/app/context/store';
import { useRouter } from 'next/navigation';

function CreateProjectForm() {
    const [members, setMembers] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [projectStartDate, setProjectStartDate] = useState('');
    const [projectDueDate, setProjectDueDate] = useState('');

    // for error handling
    const [alreadyExists, setAlreadyExists] = useState(false);

    // for redirecting to the dashboard
    const [redirect, setRedirect] = useState(false);

    // get the current pathname
    const pathname = usePathname();

    // get the user from the context
    let { user, username, leader } = useUserContext();

    // get the current username from the pathname
    const currUsername = pathname?.split('/')[1].replace('-', ' ');

    // if the currUsername changes we need to update the user, that is we do not provide access to the page
    useEffect(() => {
        user = null;
    }, [currUsername]);

    // redirect to the dashboard
    // @ts-ignore
    const slug = username?.replace(' ', '-');

    // route to dashboard if user is logged in
    const router = useRouter();
    useEffect(() => {
        if (user) {
            router.push(`/${slug}/dashboard`);
        }
    }, [redirect]);

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

    const handleRemoveMember = (event: any) => {
        // will take the text content of the parent node of the delete button
        const member = event.target.parentNode.textContent;

        // filter the members array to remove the member that was clicked
        const newMembers = members.filter((m) => m !== member);
        setMembers(newMembers);
    }

    const handleFormSubmit = async (event: any) => {
        event.preventDefault();

        const projectMembers = members.join(',');

        const query = {
            email: user.email,
            projectName,
            projectDescription,
            projectStartDate,
            projectDueDate,
            projectMembers,
        }

        // You can submit the form data here, e.g., by making an API request using fetch.
        const response = await fetch("/api/createProject", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(query),
        });

        if (response.status === 200) {
            // setAlreadyExists(false);
            console.log('Project created successfully');
        } else if (response.status === 409) {
            // setAlreadyExists(true);
            console.log('Project already exists');
        } else {
            console.error('Error creating project');
        }

        console.log('Project Name:', projectName);
        console.log('Project Description:', projectDescription);
        console.log('Project Start Date:', projectStartDate);
        console.log('Project Due Date:', projectDueDate);
        console.log('Project Members:', projectMembers);

        setRedirect(true);
    };

    // check if the url is valid, else redirect to 404
    if (user && (pathname?.split('/')[1] !== user?.username) && (currUsername !== user?.username)) {
        return (
            <div>
                <h1 className="text-3xl font-bold text-center mt-10">403 Forbidden</h1>
                <p className="text-center mt-4">
                    You can not view this page.
                </p>
            </div>
        );
    }

    return (
        <div className='flex flex-col justify-start items-center min-h-screen'>
            <h1 className="m-8 text-4xl">Create Your Project</h1>

            {!user && (
                <p className="">
                    Please <a href="/login" className="">log in</a> to view your dashboard.
                </p>
            )}

            {alreadyExists && (
                <h3 className="">
                    Project already exists.
                </h3>
            )}

            {user && (
                <div className='p-4 w-[40%] bg-primary border mx-auto'>
                    <form onSubmit={handleFormSubmit} className="" id="projectForm">
                        <div className="p-2">
                            <label className="block">Name:</label>
                            <input
                                type="text"
                                name="projectName"
                                className='w-full shadow-sm border rounded p-1'
                                required
                                onChange={(e) => setProjectName(e.target.value)}
                            />
                        </div>

                        <div className="p-2">
                            <label className="block">Description:</label>
                            <textarea
                                name="projectDescription"
                                required
                                className='w-full shadow-sm border rounded p-1'
                                onChange={(e) => setProjectDescription(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="p-2">
                            <label className="block">Started Date:</label>
                            <input
                                type="date"
                                name="projectStartDate"
                                className='w-full shadow-sm border rounded p-1'
                                required
                                onChange={(e) => setProjectStartDate(e.target.value)}
                            />
                        </div>

                        <div className="p-2">
                            <label className="block">Due Date:</label>
                            <input
                                type="date"
                                name="projectDueDate"
                                className='w-full shadow-sm border rounded p-1'
                                onChange={(e) => setProjectDueDate(e.target.value)}
                            />
                        </div>

                        <div className="p-2">
                            <label className="block">Member Emails:</label>
                            <div id="memberContainer" className="mb-2 flex flex-wrap">
                                {members.map((member, index) => (
                                    <span key={index} className="bg-secondary text-black p-1 rounded m-1 ">
                                        {member}
                                        <img onClick={handleRemoveMember} src="/cross.png" alt="delete" className=' w-3 inline ml-2' />
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                name="projectMembers"
                                placeholder="Add members"
                                className='w-full shadow-sm border rounded p-1'
                                onKeyDown={handleAddMember}
                            />
                        </div>

                        <div className='flex justify-center items-center p-2'>
                            <button
                                type="submit"
                                className="bg-purple text-primary px-8 py-2 hover:bg-tertiary hover:text-white "
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default CreateProjectForm;

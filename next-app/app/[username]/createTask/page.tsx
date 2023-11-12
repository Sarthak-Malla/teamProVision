"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { useUserContext } from '@/app/context/store';
import { useRouter } from 'next/navigation';

function TaskForm() {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskStartDate, setTaskStartDate] = useState('');
    const [taskDueDate, setTaskDueDate] = useState('');
    const [taskStatus, setTaskStatus] = useState('Not Started');
    const [members, setMembers] = useState([]);
    const [taskProject, setTaskProject] = useState('');

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

    const [projects, setProjects] = useState([] as any);
    let [count, setCount] = useState(0);
    if (user && !count) {
        // only fetch projects once
        setCount(1);
    
        fetch(`/api/getProjects?email=${user?.email}`)
          .then((res) => res.json())
          .then((data) => {
            setProjects(data);
          });
      }



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
            taskName,
            taskDescription,
            taskStartDate,
            taskDueDate,
            taskStatus,
            taskProject,
            projectMembers,
        }

        // You can submit the form data here, e.g., by making an API request using fetch.
        const response = await fetch("/api/createTask", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(query),
        });

        if (response.status === 200) {
            // setAlreadyExists(false);
            console.log('Task created successfully');
        } else if (response.status === 409) {
            // setAlreadyExists(true);
            console.log('Task already exists');
        } else {
            console.error('Error creating task');
        }

        console.log(query);

        setRedirect(true);
    };

    return (
        <div className='flex flex-col justify-start items-center min-h-screen'>
            <h1 className="m-8 text-4xl">Create Your Task</h1>
    
            {!user && (
                <p className="">
                    Please <a href="/login" className="">log in</a> to view your dashboard.
                </p>
            )}
    
            {user && (
                <div className='p-4 w-[40%] bg-primary border mx-auto'>
                    <form onSubmit={handleFormSubmit} className="" id="taskForm">
                        <div className="p-2">
                            <label className="block">Name:</label>
                            <input
                                type="text"
                                name="taskName"
                                className='w-full shadow-sm border rounded p-1'
                                required
                                onChange={(e) => setTaskName(e.target.value)}
                            />
                        </div>
    
                        <div className="p-2">
                            <label className="block">Description:</label>
                            <textarea
                                name="taskDescription"
                                className='w-full shadow-sm border rounded p-1'
                                onChange={(e) => setTaskDescription(e.target.value)}
                            ></textarea>
                        </div>
    
                        <div className="p-2">
                            <label className="block">Started Date:</label>
                            <input
                                type="date"
                                name="taskStartDate"
                                className='w-full shadow-sm border rounded p-1'
                                required
                                onChange={(e) => setTaskStartDate(e.target.value)}
                            />
                        </div>
    
                        <div className="p-2">
                            <label className="block">Due Date:</label>
                            <input
                                type="date"
                                name="taskDueDate"
                                className='w-full shadow-sm border rounded p-1'
                                onChange={(e) => setTaskDueDate(e.target.value)}
                            />
                        </div>
    
                        <div className="p-2">
                            <label className="block">Status:</label>
                            <select
                                name="taskStatus"
                                className='w-full shadow-sm border rounded p-1'
                                onChange={(e) => setTaskStatus(e.target.value)}
                            >
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
    
                        <div className="p-2">
                            <label className="block">Members:</label>
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
                                name="taskMembers"
                                placeholder="Add members"
                                className='w-full shadow-sm border rounded p-1'
                                onKeyDown={handleAddMember}
                            />
                        </div>
    
                        <div className="p-2">
                            <label className="block">Project (Optional):</label>
                            <select
                                name="taskProject"
                                className='w-full shadow-sm border rounded p-1'
                                onChange={(e) => setTaskProject(e.target.value)}
                            >
                                <option value="">None</option>
                                {/* Add options dynamically based on projects */}
                                {projects.map((project: any) => (
                                    <option key={project.projectID} value={project.projectID}>{project.name}</option>
                                ))}
                            </select>
                        </div>
    
                        <div className='flex justify-center items-center p-2'>
                            <button
                                type="submit"
                                className="bg-purple text-primary px-8 py-2 hover:bg-tertiary hover:text-white "
                            >
                                Create Task
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
    
}

// Export the Next.js component
export default TaskForm;

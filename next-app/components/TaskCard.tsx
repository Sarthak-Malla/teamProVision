"use client";

import { useEffect, useState, useRef } from "react";

const TaskCard = ({ task, projects }: any) => {
    const name = task.name;
    const startDate = new Date(task.startedAt).toLocaleDateString();
    const description = task.description.length > 150 ? task.description.slice(0, 150) + '...' : task.description;
    const status = task.status;

    // store the current status in state
    const [statusState, setStatusState] = useState(status);
    const count = useRef(0);

    const handleStatusChange = (e: any) => {
        setStatusState(e.target.value);
    }
    // handle status change
    useEffect(() => {

        const select = document.getElementsByTagName('select');
        for (let i = 0; i < select.length; i++) {
            if (select[i]) {
                if (select[i].value === 'Not Started') {
                    select[i].style.backgroundColor = '#FFB8B8';
                } else if (select[i].value === 'In Progress') {
                    select[i].style.backgroundColor = '#FFF9C2';
                } else if (select[i].value === 'Completed') {
                    select[i].style.backgroundColor = '#C2FFC9';
                }
            }
        }

        if (count.current < 1) {
            count.current++;
            return;
        }

        const updateStatus = async () => {
            const res = await fetch('/api/updateTaskStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    taskID: task.taskID,
                    status: statusState
                }),
            });
            
            const data = await res.json();
            console.log(data);
        }
        
        updateStatus();

    }, [statusState]);


    const [projectName, setProjectName] = useState('');
    // get the project name
    useEffect(() => {
        const getProjectName = () => {
            const project = projects.find((project: any) => project._id === task.project);

            if (project) {
                setProjectName(project.name);
            }
        }
        getProjectName();
    }, [projects]);

    return (
        <div className='w-full border border-quaternary shadow-lg
                      p-8 gap-4
                      flex justify-between items-center flex-wrap
                      hover:bg-purple hover:text-primary '>
            <div className=''>
                <h2 className="text-2xl font-semibold 
                          ">{name}</h2>
                <p className='text-sm text-tertiary mb-2'>Start Date: {startDate}</p>
                <h4 className="text-md">{projectName}</h4>
            </div>
            <p className='flex-grow flex justify-center items-start'>{description}</p>

            <div className='flex '>
                <select name="taskStatus" 
                        id="task-status"
                        value={statusState}
                        onChange={handleStatusChange}
                        className="p-2 px-8s border rounded-full text-black hover:border-2 hover:border-primary">
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
        </div>
    );
}

export default TaskCard;
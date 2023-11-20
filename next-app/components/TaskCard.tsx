"use client";

import { useEffect, useState, useRef } from "react";

const TaskCard = ({ task }: any) => {
    const name = task.name;
    const startDate = new Date(task.startedAt).toLocaleDateString();
    const description = task.description.length > 150 ? task.description.slice(0, 150) + '...' : task.description;
    const status = task.status;

    const [statusState, setStatusState] = useState(status);
    const count = useRef(0);

    const handleStatusChange = (e: any) => {
        setStatusState(e.target.value);
    }

    useEffect(() => {

        if (count.current < 2) {
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

    return (
        <div className='w-[20rem] h-[20rem] border border-quaternary shadow-lg
                      p-8
                      flex flex-col justify-between
                      hover:bg-purple hover:text-primary '>
            <div className=''>
                <h2 className="text-2xl font-semibold 
                          ">{name}</h2>
                <p className='text-sm text-tertiary mb-2'>Start Date: {startDate}</p>
            </div>
            <p className='flex-grow flex justify-center items-start'>{description}</p>

            <div className='flex justify-between'>
                <span className='text-sm '>Status:</span>
                <select name="taskStatus" 
                        id="task-status"
                        value={statusState}
                        onChange={handleStatusChange}>
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
        </div>
    );
}

export default TaskCard;
"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { useUserContext } from '../../context/store';

// set-up a mock user
const mockUser = {
  username: 'sampleuser',
  team_leader: false,
  projects: [],
  tasks: [],
};

const Dashboard = () => {
  const pathname = usePathname();

  let { user, username, leader } = useUserContext();

  const currUsername = pathname?.split('/')[1].replace('-', ' ');

  useEffect(() => {
    user = null;
  }, [currUsername]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mt-10">Dashboard</h1>

      {/* if the user is not authorized, ask them to log in */}
      {!user && (
        <p className="text-center mt-4">
          Please <a href="/login" className="text-blue-500">log in</a> to view your dashboard.
        </p>
      )}

      {/* if user is authorized, we display their dashboard */}
      {user && username && (
        <>
          <p className="text-center mt-4">
            Welcome back, {username}!
          </p>

          {leader ? (
            <>
              <div className="mt-4 p-4 border border-gray-300">
                <h2 className="text-xl font-semibold">Create Project</h2>
                <a href={`/${username}/createProject`} className="text-blue-500">Create</a>
              </div>
              <div className="mt-4 p-4 border border-gray-300">
                <h2 className="text-xl font-semibold">Existing Projects</h2>
                <ul className="list-disc list-inside">
                  {user.projects.map((project: any, index: any) => (
                    <li key={index}>{project.name}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="mt-4 p-4 border border-gray-300">
                <h2 className="text-xl font-semibold">Projects</h2>
                <ul className="list-disc list-inside">
                  {user.projects.map((project: any, index: any) => (
                    <li key={index}>{project.name}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 p-4 border border-gray-300">
                <h2 className="text-xl font-semibold">Tasks</h2>
                <a href={`/${username}/createTask`} className="text-blue-500">Add Task(s)</a>
                <ul className="list-disc list-inside">
                  {user.tasks.map((task: any, index: any) => (
                    <li key={index}>{task.name}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </>
      )}
    </div>

  );
};

export default Dashboard;

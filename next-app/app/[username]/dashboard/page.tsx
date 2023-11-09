"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { useContext } from 'react';
import { useUserData } from '../../../lib/hooks';

// set-up a mock user
const mockUser = {
  username: 'sampleuser',
  team_leader: false,
  projects: [],
  tasks: [],
};

const Dashboard = () => {
  const pathname = usePathname();

  const [currUser, setUser] = useState(mockUser);

  let { user, username, leader } = useUserData();

  if (currUser.username !== username){
    // @ts-ignore
    setUser(user);
  }

  // Get the username from the query parameters
  // the query has the format:
  const currUsername = pathname?.split('/')[1].replace('-', ' ');

  useEffect(() => {
    // get the data for the user with the username
    if (currUsername === username) {
      // @ts-ignore
        const userEmail = currUser.email;
        const queryObject = {
          email: userEmail
        }
        fetch(`/api/getUser?query=${JSON.stringify(queryObject)}`)
            .then(res => res.json())
            .then(data => {
              console.log(data);
                user = data;
            })
            .catch(err => {
                console.log(err);
            });
    }
    }, [username]);

  if (!currUser) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1 className="page-heading">Dashboard</h1>

      {currUser && (
        <>
          <p>Welcome back, {currUser.username}!</p>

          {currUser.team_leader ? (
            <>
                <div className="leader-dashboard-landing">
                <h2 className="create-project">Create Project</h2>
                <a href={`/${currUser.username}/createProject`}>Create</a>
                </div>
                <div className="leader-dashboard-projects">
                <h2 className="projects">Existing Projects</h2>
                <ul className="project-list">
                    {currUser.projects.map((project, index) => (
                    <li key={index} className="project-item">
                        {/* {project.name} */}
                    </li>
                    ))}
                </ul>
                </div>
            </>
          ) : (
            <>
              <div className="member-dashboard-landing">
                <h2 className="projects">Projects</h2>
                <ul className="project-list">
                  {currUser.projects.map((project, index) => (
                    <li key={index} className="project-item">
                      {/* {project.name} */}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="member-dashboard-tasks">
                <h2 className="tasks">Tasks</h2>
                <a href={`/${currUser.username}/createTask`}>Add Task(s)</a>
                <ul className="task-list">
                  {currUser.tasks.map((task, index) => (
                    <li key={index} className="task-item">
                      {/* {task.name} */}
                    </li>
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

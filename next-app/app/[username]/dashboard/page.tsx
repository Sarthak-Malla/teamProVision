"use client";
import Link from 'next/link';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { useUserContext } from '@/app/context/store';
import TaskCard from '@/components/TaskCard';

const ProjectCard = ({ project }: any) => {
  const name = project.name;
  const description = project.description.slice(0, 150) + '...';
  const startDate = new Date(project.startedAt).toLocaleDateString();

  return (
    <div className='w-[20rem] min-h-[20rem] border border-quaternary shadow-lg
                    p-8
                    flex flex-col
                    hover:bg-purple hover:text-primary '>
      <h2 className="text-2xl font-semibold flex-grow
                      ">{name}</h2>
      <p className='text-sm text-tertiary mb-2'>Start Date: {startDate}</p>
      <p className='flex-grow flex justify-center items-start'>{description}</p>
    </div>
  );
};

const CreateCard = ({username}: {username: string}) => {
  return (
    <Link href={`/${username.replace(' ', '-')}/createProject`} className='inline-block w-[20rem]'>
      <div className='w-[20rem] min-h-[20rem] border border-quaternary shadow-lg
                        flex flex-col items-center '>
        <div className='flex-grow flex justify-center items-center
                      bg-primary'>
          <img src='/plus.png' className=" w-[20%]" />
        </div>
        <p className='flex-grow flex justify-center items-center px-12 text-xl'>Create a new project for your team.</p>
      </div>
    </Link>
  );
}

const CreateTaskCard = ({username}: {username: string}) => {
  return (
    <Link href={`/${username.replace(' ', '-')}/createTask`} className='inline-block w-[20rem]'>
      <div className='w-[20rem] min-h-[20rem] border border-quaternary shadow-lg
                        flex flex-col items-center '>
        <div className='flex-grow flex justify-center items-center
                      bg-primary'>
          <img src='/plus.png' className=" w-[20%]" />
        </div>
        <p className='flex-grow flex justify-center items-center px-4 text-xl'>Add a new task.</p>
      </div>
    </Link>
  );
}

const Dashboard = () => {
  const pathname = usePathname();

  let { user, username, leader } = useUserContext();

  const [projects, setProjects] = useState([] as any);
  let [count, setCount] = useState(0);

  const [tasks, setTasks] = useState([] as any);

  const currUsername = pathname?.split('/')[1].replace('-', ' ');

  useEffect(() => {
    user = null;
  }, [currUsername]);

  if (user && !count) {
    // only fetch projects once
    setCount(1);

    fetch(`/api/getProjects?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
      });

    fetch(`/api/getTasks?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
      });
  }

  // check if the url is valid, else redirect to 404
  if (user && currUsername !== user?.username) {
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
    <div>
      <h1 className="text-3xl font-bold text-center mt-10">Dashboard</h1>

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
              <div className="my-12 px-64 flex gap-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-8">Create Project</h2>
                  <CreateCard username={username} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-8">Create Task</h2>
                  <CreateTaskCard username={username} />
                </div>
              </div>
              <div className="my-12 px-64">
                <h2 className="text-2xl font-semibold mb-8">Existing Projects</h2>
                <div className='flex flex-wrap gap-[2rem]'>
                  {projects && projects.map((project: any, index: any) => (
                    <ProjectCard project={project} key={index} />
                  ))}
                </div>
              </div>
              <div className="my-12 px-64">
                <h2 className="text-2xl font-semibold mb-8">Existing Tasks</h2>
                <div className='flex flex-wrap gap-[2rem]'>
                  {tasks && tasks.map((task: any, index: any) => (
                    <TaskCard task={task} projects={projects} key={index} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="my-12 px-64">
                <h2 className="text-2xl font-semibold mb-6">Projects</h2>
                <div className='flex flex-wrap gap-[2rem]'>
                  {projects && projects.map((project: any, index: any) => (
                    <ProjectCard project={project} key={index} />
                  ))}
                </div>
              </div>
              <div className="my-12 px-64">
                <h2 className="text-2xl font-semibold mb-6">Tasks</h2>
                <div className='flex flex-wrap gap-[2rem]'>
                  <CreateTaskCard username={username} />
                  {tasks && tasks.map((task: any, index: any) => (
                    <TaskCard task={task} projects={projects} key={index} />
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>

  );
};

export default Dashboard;

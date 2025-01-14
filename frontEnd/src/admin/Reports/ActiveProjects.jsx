import React, { useEffect, useState } from "react";
import GanttChart from "react-gantt-chart";

const ActiveProjects = () => {
  const [projects, setProjects] = useState([]);

  // Mock data for ongoing projects
  useEffect(() => {
    // Replace this with actual data from an API or backend
    const projectData = [
      {
        start: new Date("2025-01-01"),
        end: new Date("2025-02-01"),
        name: "Project 1",
        id: "1",
        progress: 40, // percentage of completion
      },
      {
        start: new Date("2025-01-10"),
        end: new Date("2025-03-01"),
        name: "Project 2",
        id: "2",
        progress: 70,
      },
      {
        start: new Date("2025-01-20"),
        end: new Date("2025-04-01"),
        name: "Project 3",
        id: "3",
        progress: 10,
      },
    ];

    setProjects(projectData);
  }, []);

  return (
    <div>
      <h1>Ongoing Projects</h1>
      {projects.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <GanttChart
          data={projects}
          options={{
            columnWidth: 50,
            barHeight: 30,
            scale: "day",
          }}
        />
      )}
    </div>
  );
};

export default ActiveProjects;

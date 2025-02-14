import React, { useState, useEffect, useRef } from "react";
import { Timeline } from "vis-timeline/standalone";
import axios from "axios";

const ActiveProjects = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const timelineContainerRef = useRef(null);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/project"
        );
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          console.error("Failed to fetch projects.");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      if (projects.length === 0) return;

      const projectIds = projects.map((project) => project.id);
      console.log("ProjectId:", projectIds);
      try {
        const response = await axios.get(
          "http://localhost:8081/tasks",
          {
            params: { projectIds },
          }
        );
        console.log("Task fetchs:", response.data.tasks);
        setTasks(response.data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [projects]);

  const calculateProgress = (projectId) => {
    const projectTasks = tasks.filter((task) => task.project_id === projectId);
    const totalTasks = projectTasks.length;
    if (totalTasks === 0) return "0";

    const completedTasks = projectTasks.filter(
      (task) => task.status === "Completed"
    ).length;
    return Math.round((completedTasks / totalTasks) * 100);
  };

  const getTaskCountForProject = (projectId) => {
    return tasks.filter((task) => task.project_id === projectId).length;
  };

  useEffect(() => {
    if (
      timelineContainerRef.current &&
      projects.length > 0 &&
      tasks.length > 0
    ) {
      const items = projects.map((project) => {
        return {
          id: project.id,
          content: `${project.projectName} (${calculateProgress(
            project.id
          )} %)`,
          start: project.startDate,
          end: project.endDate,
          type: "range",
        };
      });

      const milestones = projects.map((project) => ({
        id: `milestone-${project.id}`,
        content: `${calculateProgress(project.id)}%`,
        start: project.endDate, // milestone at the end date of the project
        type: "point",
        className: `milestone progress-${calculateProgress(project.id)}`,
      }));

      const allItems = [...items, ...milestones];

      // Debugging log to confirm the timeline items
      console.log("Timeline items:", allItems);

      // Initialize the timeline
      new Timeline(timelineContainerRef.current, allItems, {
        editable: false,
        stack: true,
        margin: { item: 20 },
        zoomable: true,
        showCurrentTime: true,
      });
    }
  }, [projects, tasks]); // Add tasks as a dependency here

  return (
    <div>
      <h2>Projects Timeline</h2>
      {projects.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div ref={timelineContainerRef} style={{ height: "600px" }} />
      )}
    </div>
  );
};

export default ActiveProjects;

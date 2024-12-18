import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import "./task.css";
import TaskForm from "./Taskform";

const ProjectTask = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("posts");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [tasks, setTasks] = useState([]); // State for storing tasks

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleCreateTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setShowTaskForm(false); // Close the form after creating a task
  };

  const handleCancelForm = () => {
    setShowTaskForm(false); // Close the form without creating a task
  };

  return (
    <div className="project-task-container">
      <div className="home-button-container">
        <button className="home-button" onClick={() => navigate("/")}>
          <FontAwesomeIcon icon={faHome} size="lg" />
        </button>
      </div>

      <div className="project-task-tabs">
        <button
          className={activeTab === "posts" ? "active" : ""}
          onClick={() => handleTabClick("posts")}
        >
          Posts
        </button>
        <button
          className={activeTab === "files" ? "active" : ""}
          onClick={() => handleTabClick("files")}
        >
          Files
        </button>
      </div>

      <div className="project-task-content">
        {activeTab === "posts" && (
          <div className="posts-tab-content">
            <div className="project-posts">
              {tasks.length === 0 ? (
                <div className="no-task-container">
                  <h2>No Task Created</h2>
                  <button onClick={() => setShowTaskForm(true)}>Create</button>
                </div>
              ) : (
                <ul className="task-list">
                  {tasks.map((task, index) => (
                    <li key={index} className="task-item">
                      <h3>{task.taskName}</h3>
                      <p>Fee: {task.taskFee}</p>
                      <p>Due: {task.dueDate}</p>
                      <p>Employee: {task.employee || "Unassigned"}</p>
                      {task.additionalFeeName && (
                        <p>
                          Additional Fee ({task.additionalFeeName}):{" "}
                          {task.additionalFee}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {showTaskForm && (
                <TaskForm
                  onCreate={handleCreateTask}
                  onCancel={handleCancelForm}
                />
              )}
            </div>
          </div>
        )}

        {activeTab === "files" && (
          <div className="files-tab-content">
            <div className="files-posts">
              <h2>Manage project files</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTask;

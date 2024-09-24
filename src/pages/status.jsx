import React, { useState, useEffect } from 'react';
import '../styles/Display.css';
import DoneIcon from '../assets/Done.svg';
import AddIcon from '../assets/add.svg';
import ThreeDotIcon from '../assets/3_dot_menu.svg';
import CancelledIcon from '../assets/Cancelled.svg';
import InProgressIcon from '../assets/in-progress.svg';
import ToDoIcon from '../assets/To-do.svg';

// API URL
const API_URL = 'https://api.quicksell.co/v1/internal/frontend-assignment';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [grouping, setGrouping] = useState(localStorage.getItem('grouping') || 'status');
  const [sorting, setSorting] = useState(localStorage.getItem('sorting') || 'priority');
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setTasks(data.tickets);
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('grouping', grouping);
    localStorage.setItem('sorting', sorting);
  }, [grouping, sorting]);

  // Sorting function
  const sortTasks = (tasks) => {
    return tasks.sort((a, b) => {
      if (sorting === 'priority') {
        return b.priority - a.priority;
      } else if (sorting === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  // Grouping function
  const groupTasks = () => {
    const groupedTasks = {};
    if (grouping === 'status') {
      tasks.forEach(task => {
        if (!groupedTasks[task.status]) groupedTasks[task.status] = [];
        groupedTasks[task.status].push(task);
      });
    } else if (grouping === 'user') {
      tasks.forEach(task => {
        const user = users.find(u => u.id === task.userId);
        const userName = user ? user.name : 'Unknown User';
        if (!groupedTasks[userName]) groupedTasks[userName] = [];
        groupedTasks[userName].push(task);
      });
    } else if (grouping === 'priority') {
      tasks.forEach(task => {
        const priorityLabel = getPriorityLabel(task.priority);
        if (!groupedTasks[priorityLabel]) groupedTasks[priorityLabel] = [];
        groupedTasks[priorityLabel].push(task);
      });
    }
    return groupedTasks;
  };

  // Helper function to get priority label
  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 4: return 'Urgent';
      case 3: return 'High';
      case 2: return 'Medium';
      case 1: return 'Low';
      case 0: return 'No Priority';
      default: return 'No Priority';
    }
  };

  // Helper function to get icon based on task status
  const getTaskIcon = (status) => {
    switch(status) {
      case 'Done': return DoneIcon;
      case 'In Progress': return InProgressIcon;
      case 'Cancelled': return CancelledIcon;
      case 'To Do': return ToDoIcon;
      default: return ThreeDotIcon; // Default icon if no match
    }
  };

  const renderTasks = (tasks) => {
    return sortTasks(tasks).map(task => (
      <div key={task.id} className="task-card">
        <img src={getTaskIcon(task.status)} alt={task.status} />
        <h3>{task.id}</h3>
        <h4>{task.title}</h4>
        <p>{task.description}</p>
        <span>{getPriorityLabel(task.priority)}</span>
      </div>
    ));
  };

  const groupedTasks = groupTasks();

  // Helper function to get column icon based on group name
  const getColumnIcon = (group) => {
    switch(group) {
      case 'To Do': return ToDoIcon;
      case 'In Progress': return InProgressIcon;
      case 'Done': return DoneIcon;
      default: return ThreeDotIcon; // Default icon if no match
    }
  };

  return (
    <div className="kanban-board">
      <button onClick={() => setShowControls(!showControls)}>
        {showControls ? 'Hide Options' : 'Display Options'}
      </button>
      <div className={`controls ${showControls ? 'show' : ''}`}>
        <label>
          Grouping:
          <select value={grouping} onChange={(e) => setGrouping(e.target.value)}>
            <option value="status">Status</option>
            <option value="user">User</option>
            <option value="priority">Priority</option>
          </select>
        </label>
        <label>
          Ordering:
          <select value={sorting} onChange={(e) => setSorting(e.target.value)}>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </label>
      </div>
      {Object.keys(groupedTasks).map((group) => (
        <div key={group} className="task-group">
          <h2>
            <img src={getColumnIcon(group)} alt={group} /> {group}
          </h2>
          {groupedTasks[group].map((task) => (
            <div key={task.id} className="task-card">
              <img src={getTaskIcon(task.status)} alt={task.status} />
              <h3>{task.id}</h3>
              <h4>{task.title}</h4>
              <p>{task.description}</p>
              <span>{getPriorityLabel(task.priority)}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default App;

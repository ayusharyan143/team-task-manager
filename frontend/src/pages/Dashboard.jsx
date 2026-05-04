import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  LayoutDashboard,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  X,
  LogOut,
  FolderPlus,
  Users,
  Trash2,
  Edit,
} from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  // Data States
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    overdue: 0,
  });
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  // Modal States 
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Form States
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    project: "",
    assignedTo: "",
  });
  const [projectName, setProjectName] = useState("");

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };

      const API_BASE = import.meta.env.VITE_API_URL;

      const [statsRes, tasksRes, projectsRes] = await Promise.all([
        axios.get(`${API_BASE}/api/tasks`, config),
        axios.get(`${API_BASE}/api/tasks/stats`, config),
        axios.get(`${API_BASE}/api/projects`, config),
      ]);

      // Access the nested .stats object from the backend
      setStats(statsRes.data.stats || statsRes.data);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);

      if (user.role === "Admin") {
        const usersRes = await axios.get(
          `${API_BASE}/api/users`,
          config,
        );
        setTeamMembers(usersRes.data);
      }
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  // Calculation Tasks Per User
  const tasksPerUser = tasks.reduce((acc, task) => {
    const userName = task.assignedTo?.name || "Unassigned";
    acc[userName] = (acc[userName] || 0) + 1;
    return acc;
  }, {});

  // --- HANDLERS ---

  const closeModals = () => {
    setShowTaskModal(false);
    setShowProjectModal(false);
    setEditingTask(null);
    setTaskData({
      title: "",
      description: "",
      priority: "Medium",
      dueDate: "",
      project: "",
      assignedTo: "",
    });
  };

  // Handler for clicking the Edit button
  const handleEditClick = (task) => {
    setEditingTask(task); // Remember which task we are editing

    // Pre-fill the form with the task's current data
    setTaskData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      // Format the date correctly for an HTML <input type="date">
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      // Ensure we extract the ID if 'project' or 'assignedTo' are populated objects
      project: task.project?._id || task.project,
      assignedTo: task.assignedTo?._id || "",
    });

    setShowTaskModal(true); // Open the modal
  };

  // Handles both Create and Update
  const handleTaskAction = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const payload = { ...taskData };
      if (!payload.assignedTo) delete payload.assignedTo;

      if (editingTask) {
        // UPDATE logic: If editingTask exists, send a PUT request
        await axios.put(
          `${API_BASE}/api/tasks/${editingTask._id}`,
          payload,
          config,
        );
      } else {
        // CREATE logic: If editingTask is null, send a POST request
        await axios.post(`${API_BASE}/api/tasks`, payload, config);
      }

      closeModals(); // Close the modal and reset state
      fetchData(); // Refresh the dashboard data
    } catch (err) {
      alert("Action failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(
        `${API_BASE}/api/projects`,
        { name: projectName },
        config,
      );
      setShowProjectModal(false);
      setProjectName("");
      fetchData();
    } catch (err) {
      alert(
        "Failed to create project: " +
          (err.response?.data?.message || err.message),
      );
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskData.project) return alert("Please select a Project first!");

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const payload = { ...taskData };
      if (!payload.assignedTo) delete payload.assignedTo;

      await axios.post(`${API_BASE}/api/tasks`, payload, config);
      setShowTaskModal(false);
      setTaskData({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
        project: "",
        assignedTo: "",
      });
      fetchData();
    } catch (err) {
      alert("Backend Error: " + (err.response?.data?.message || err.message));
    }
  };

  // Handler: Delete Task (Admin Only)
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${API_BASE}/api/tasks/${taskId}`, config);
      fetchData();
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.patch(
        `${API_BASE}/api/tasks/${taskId}/status`,
        { status: newStatus },
        config,
      );
      fetchData();
    } catch (err) {
      alert("Status update failed");
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this project? Tasks under this project will still exist but won't have a project assigned.",
      )
    )
      return;

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(
        `${API_BASE}/api/projects/${projectId}`,
        config,
      );
      fetchData(); // Refresh the list so the deleted project disappears
    } catch (err) {
      alert(
        "Failed to delete project: " +
          (err.response?.data?.message || err.message),
      );
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans">
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-blue-500 p-2 rounded-lg">
            <LayoutDashboard size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">T T Manager</span>
        </div>
        <nav className="flex-1">
          <div className="flex items-center gap-3 p-3 bg-blue-600/20 text-blue-400 rounded-xl mb-2 cursor-pointer">
            <LayoutDashboard size={18} /> <span>Dashboard</span>
          </div>
        </nav>
        <button
          onClick={logout}
          className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition mt-auto"
        >
          <LogOut size={18} /> <span>Logout</span>
        </button>
      </aside>

      <main className="flex-1 flex flex-col p-4 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              Project Overview
            </h1>
            <p className="text-slate-500 font-medium">
              Logged in as:{" "}
              <span className="text-blue-600 uppercase text-sm font-bold">
                {user?.name} ({user?.role})
              </span>
            </p>
          </div>

          {user?.role === "Admin" && (
            <div className="flex gap-3">
              <button
                onClick={() => setShowProjectModal(true)}
                className="bg-slate-800 text-white px-5 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-700 transition-all flex items-center gap-2"
              >
                <FolderPlus size={18} /> New Project
              </button>
              <button
                onClick={() => {
                  if (projects.length === 0)
                    return alert("You must create a Project first!");
                  setShowTaskModal(true);
                }}
                className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <Plus size={18} /> New Task
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total"
            value={stats?.total || 0}
            icon={<LayoutDashboard size={20} />}
            color="blue"
          />
          <StatCard
            title="Pending"
            value={(stats?.todo || 0) + (stats?.inProgress || 0)}
            icon={<Clock size={20} />}
            color="yellow"
          />
          <StatCard
            title="Done"
            value={stats?.done || 0}
            icon={<CheckCircle size={20} />}
            color="green"
          />
          <StatCard
            title="Overdue"
            value={stats?.overdue || 0}
            icon={<AlertCircle size={20} />}
            color="red"
          />
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-3 text-slate-700 font-bold">
            <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
              <Users size={20} />
            </div>
            Tasks Per User:
          </div>
          <div className="flex flex-wrap gap-3">
            {Object.keys(tasksPerUser).length > 0 ? (
              Object.entries(tasksPerUser).map(([name, count]) => (
                <div
                  key={name}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 shadow-sm"
                >
                  {name}:{" "}
                  <span className="text-blue-600 font-black">{count}</span>
                </div>
              ))
            ) : (
              <span className="text-slate-400 text-sm italic">
                No active tasks
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <h2 className="text-xl font-bold text-slate-800">Your Tasks</h2>
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
              {tasks.length} Active
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-xs uppercase tracking-widest font-bold">
                <tr>
                  <th className="p-4">Task</th>
                  <th className="p-4">Assigned To</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4 text-center">Status & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <tr key={task._id} className="hover:bg-slate-50 transition">
                      <td className="p-4">
                        <div className="font-semibold text-slate-700">
                          {task.title}
                        </div>
                        <div className="text-xs text-slate-400 truncate max-w-[200px] mt-1">
                          {task.description || "No description provided."}
                        </div>
                      </td>
                      <td className="p-4 font-medium text-slate-600 text-sm">
                        {task.assignedTo?.name || "Unassigned"}
                      </td>
                      <td className="p-4 text-slate-500 text-sm">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            task.priority === "High"
                              ? "bg-red-100 text-red-600"
                              : task.priority === "Medium"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="p-4 flex items-center justify-center gap-3">
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleUpdateStatus(task._id, e.target.value)
                          }
                          className={`text-xs font-bold uppercase rounded-md p-1 border outline-none cursor-pointer ${
                            task.status === "Done"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : task.status === "In Progress"
                                ? "bg-blue-100 text-blue-700 border-blue-200"
                                : "bg-yellow-100 text-yellow-700 border-yellow-200"
                          }`}
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                        </select>

                        {user.role === "Admin" && (
                          <div className="flex gap-2 ml-2">
                            <button
                              onClick={() => handleEditClick(task)}
                              className="text-slate-400 hover:text-blue-500 transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-20 text-center text-slate-400 italic"
                    >
                      {user?.role === "Admin"
                        ? "No tasks found. Create a project, then create a task!"
                        : "No tasks assigned to you yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showProjectModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl relative">
              <X
                className="absolute top-6 right-6 cursor-pointer text-slate-300 hover:text-red-500"
                onClick={closeModals}
              />

              <h2 className="text-2xl font-black text-slate-900 mb-6">
                Manage Projects
              </h2>

              <form onSubmit={handleCreateProject} className="space-y-4 mb-8">
                <input
                  type="text"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  required
                  placeholder="New Project Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
                <button className="w-full bg-slate-800 text-white p-4 rounded-2xl font-black shadow-lg">
                  CREATE PROJECT
                </button>
              </form>

              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Existing Projects
                </h3>
                <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {projects.length > 0 ? (
                    projects.map((p) => (
                      <li
                        key={p._id}
                        className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200"
                      >
                        <span className="font-semibold text-slate-700 truncate">
                          {p.name}
                        </span>
                        <button
                          onClick={() => handleDeleteProject(p._id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Delete Project"
                        >
                          <Trash2 size={16} />
                        </button>
                      </li>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 italic">
                      No projects exist yet.
                    </p>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {showTaskModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md relative">
              <X
                className="absolute top-6 right-6 cursor-pointer text-slate-300 hover:text-red-500"
                onClick={closeModals}
              />

              <h2 className="text-2xl font-black mb-6">
                {editingTask ? "Edit Task" : "New Task"}
              </h2>

              <form onSubmit={handleTaskAction} className="space-y-4">
                <input
                  type="text"
                  placeholder="Task Title"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  required
                  value={taskData.title}
                  onChange={(e) =>
                    setTaskData({ ...taskData, title: e.target.value })
                  }
                />

                <textarea
                  placeholder="Description"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  value={taskData.description}
                  onChange={(e) =>
                    setTaskData({ ...taskData, description: e.target.value })
                  }
                ></textarea>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-600"
                    required
                    value={taskData.dueDate}
                    onChange={(e) =>
                      setTaskData({ ...taskData, dueDate: e.target.value })
                    }
                  />

                  <select
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-600"
                    value={taskData.priority}
                    onChange={(e) =>
                      setTaskData({ ...taskData, priority: e.target.value })
                    }
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <select
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-600"
                    required
                    value={taskData.project}
                    onChange={(e) =>
                      setTaskData({ ...taskData, project: e.target.value })
                    }
                  >
                    <option value="">Select Project</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  <select
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-600"
                    value={taskData.assignedTo}
                    onChange={(e) =>
                      setTaskData({ ...taskData, assignedTo: e.target.value })
                    }
                  >
                    <option value="">Unassigned</option>
                    {teamMembers.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold mt-2 hover:bg-blue-700 transition">
                  {editingTask ? "SAVE CHANGES" : "CREATE TASK"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    yellow: "bg-yellow-50 text-yellow-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
      <div
        className={`${colors[color]} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm`}
      >
        {icon}
      </div>
      <div className="text-slate-400 text-xs font-black uppercase tracking-widest">
        {title}
      </div>
      <div className="text-4xl font-black text-slate-800 mt-1">{value}</div>
    </div>
  );
};

export default Dashboard;

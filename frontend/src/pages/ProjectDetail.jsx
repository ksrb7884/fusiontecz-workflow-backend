import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProjectById,
  getTasks,
  createTask,
  updateTaskStatus,
  getTaskActivityLogs,
} from "../services/api";

import Button from "../components/common/Button";
import Tabs from "../components/project/Tabs";
import KanbanBoard from "../components/task/KanbanBoard";
import InviteMemberModal from "../components/project/InviteMemberModal";
import CreateTaskModal from "../components/task/CreateTaskModal";
import ActivityTimeline from "../components/activity/ActivityTimeline";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("Tasks");

  const [showInvite, setShowInvite] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const [tasks, setTasks] = useState(null);

  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);

  // ---------------- FETCH PROJECT ----------------
  const fetchProject = async () => {
    try {
      const res = await getProjectById(projectId);
      setProject(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FETCH TASKS ----------------
  const fetchTasks = async () => {
    try {
      const res = await getTasks(projectId);
      const kanban = res.data.data.kanban;

      setTasks(kanban);

      // pick first available task for activity
      const firstTask =
        kanban.BACKLOG[0] ||
        kanban.IN_PROGRESS[0] ||
        kanban.REVIEW[0] ||
        kanban.DONE[0];

      if (firstTask) {
        setSelectedTaskId(firstTask._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- FETCH ACTIVITY ----------------
  const fetchActivityLogs = async () => {
    if (!selectedTaskId) return;

    try {
      setActivityLoading(true);
      const res = await getTaskActivityLogs(selectedTaskId);
      setActivityLogs(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setActivityLoading(false);
    }
  };

  // ---------------- CREATE TASK ----------------
  const handleCreateTask = async (data) => {
    await createTask(data);
    fetchTasks();
  };

  // ---------------- STATUS CHANGE ----------------
  const handleStatusChange = async (taskId, status) => {
    await updateTaskStatus(taskId, status);
    fetchTasks();
  };

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    fetchProject();
  }, [projectId]);

  useEffect(() => {
    if (activeTab === "Tasks") {
      fetchTasks();
    }
  }, [activeTab, projectId]);

  useEffect(() => {
    if (activeTab === "Activity" && selectedTaskId) {
      fetchActivityLogs();
    }
  }, [activeTab, selectedTaskId]);

  // ---------------- UI STATES ----------------
  if (loading) {
    return <div className="p-6 text-slate-500">Loading...</div>;
  }

  if (!project) {
    return <div className="p-6">Project not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div>
          <button
            onClick={() => navigate("/projects")}
            className="text-sm text-blue-600 mb-1"
          >
            ← Back to Projects
          </button>
          <h1 className="text-xl font-semibold">{project.name}</h1>
        </div>

        <Button size="sm" onClick={() => setShowInvite(true)}>
          Invite Member
        </Button>
      </header>

      {/* Members */}
      <div className="px-6 py-3 bg-white border-b">
        <p className="text-sm text-slate-600">Members:</p>
        <div className="flex gap-2 mt-1 flex-wrap">
          <span className="text-sm bg-slate-100 px-2 py-1 rounded">
            {project.owner.name} (Owner)
          </span>
          {project.members.map((m) => (
            <span
              key={m._id}
              className="text-sm bg-slate-100 px-2 py-1 rounded"
            >
              {m.name}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-4">
        <Tabs
          tabs={["Tasks", "Activity"]}
          active={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* TASKS TAB */}
        {activeTab === "Tasks" && (
          <>
            <div className="mb-4 flex justify-end">
              <Button onClick={() => setShowTaskModal(true)}>
                + Create Task
              </Button>
            </div>

            {tasks ? (
              <KanbanBoard tasks={tasks} onStatusChange={handleStatusChange} />
            ) : (
              <p className="text-slate-500">Loading tasks...</p>
            )}
          </>
        )}

        {/* ACTIVITY TAB */}
        {activeTab === "Activity" && (
          <>
            {activityLoading ? (
              <p className="text-slate-500">Loading activity...</p>
            ) : (
              <ActivityTimeline logs={activityLogs} />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showInvite && (
        <InviteMemberModal
          projectId={projectId}
          onClose={() => setShowInvite(false)}
          onSuccess={fetchProject}
        />
      )}

      {showTaskModal && (
        <CreateTaskModal
          projectId={projectId}
          onClose={() => setShowTaskModal(false)}
          onCreate={handleCreateTask}
        />
      )}
    </div>
  );
};

export default ProjectDetail;

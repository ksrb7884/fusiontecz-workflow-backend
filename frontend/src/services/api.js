import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = (data) => api.post("/auth/login", data);
export const signupUser = (data) => api.post("/auth/signup", data);
export const getMyProjects = () => api.get("/projects");
export const createProject = (data) => api.post("/projects", data);
export const getProjectById = (projectId) => api.get(`/projects/${projectId}`);
export const getTasks = (projectId) => api.get(`/tasks?projectId=${projectId}`);
export const createTask = (data) => api.post("/tasks", data);
export const updateTaskStatus = (taskId, status) =>
  api.patch(`/tasks/${taskId}/status`, { status });
export const getTaskActivityLogs = (taskId) =>
  api.get(`/tasks/${taskId}/activity-logs`);

export default api;

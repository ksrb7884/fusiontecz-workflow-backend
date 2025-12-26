import { useEffect, useState } from "react";
import { getMyProjects, createProject } from "../services/api";
import ProjectCard from "../components/project/ProjectCard";
import CreateProjectModal from "../components/project/CreateProjectModal";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await getMyProjects();
      setProjects(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (data) => {
    await createProject(data);
    fetchProjects();
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Projects</h1>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setShowModal(true)}>
            + New Project
          </Button>
          <Button size="sm" variant="secondary" onClick={logout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="p-6">
        {loading ? (
          <p className="text-slate-500">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="text-center text-slate-500 mt-20">
            <p className="text-lg">No projects yet</p>
            <p className="text-sm mt-1">
              Create your first project to get started
            </p>
            <div className="mt-4">
              <Button onClick={() => setShowModal(true)}>Create Project</Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onClick={() => navigate(`/projects/${project._id}`)}
              />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateProject}
        />
      )}
    </div>
  );
};

export default Projects;

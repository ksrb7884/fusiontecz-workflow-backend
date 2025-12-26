const ProjectCard = ({ project, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-lg border p-4 hover:shadow transition"
    >
      <h3 className="font-semibold text-slate-800">{project.name}</h3>
      <p className="text-sm text-slate-500 mt-1">
        {project.description || "No description"}
      </p>
    </div>
  );
};

export default ProjectCard;

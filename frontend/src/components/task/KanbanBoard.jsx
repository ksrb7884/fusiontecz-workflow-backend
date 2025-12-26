import TaskCard from "./TaskCard";

const columns = [
  { key: "BACKLOG", label: "Backlog" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "REVIEW", label: "Review" },
  { key: "DONE", label: "Done" },
];

const KanbanBoard = ({ tasks, onStatusChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {columns.map((col) => (
        <div key={col.key} className="bg-slate-100 rounded-lg p-3">
          <h3 className="text-sm font-semibold mb-3">{col.label}</h3>

          <div className="space-y-3">
            {tasks[col.key].length === 0 ? (
              <p className="text-xs text-slate-400">No tasks</p>
            ) : (
              tasks[col.key].map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onStatusChange={onStatusChange}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;

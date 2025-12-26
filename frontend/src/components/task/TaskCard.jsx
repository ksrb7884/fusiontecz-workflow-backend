import Button from "../common/Button";

const TaskCard = ({ task, onStatusChange }) => {
  return (
    <div className="bg-white rounded-lg border p-3 space-y-2">
      <h4 className="font-medium text-slate-800 text-sm">{task.title}</h4>

      {task.description && (
        <p className="text-xs text-slate-500">{task.description}</p>
      )}

      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400">{task.priority}</span>

        {/* Status actions */}
        {task.status === "BACKLOG" && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onStatusChange(task._id, "IN_PROGRESS")}
          >
            Start
          </Button>
        )}

        {task.status === "IN_PROGRESS" && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onStatusChange(task._id, "REVIEW")}
          >
            Review
          </Button>
        )}

        {task.status === "REVIEW" && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onStatusChange(task._id, "DONE")}
          >
            Done
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

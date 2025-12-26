const ActivityTimeline = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return <p className="text-slate-500 text-sm">No activity yet</p>;
  }

  return (
    <div className="border-l-2 border-slate-200 pl-4 space-y-6">
      {logs.map((log) => {
        const oldStatus = log.previousValue?.status;
        const newStatus = log.newValue?.status;

        const actionText =
          log.action === "STATUS_CHANGE" ? "changed task status" : log.action;

        return (
          <div key={log._id} className="relative">
            {/* timeline dot */}
            <span className="absolute -left-[9px] top-2 h-3 w-3 bg-blue-600 rounded-full" />

            <div className="bg-white rounded-md border p-3">
              <p className="text-sm text-slate-700">
                <span className="font-medium">
                  {log.performedBy?.name || "User"}
                </span>{" "}
                {actionText}
              </p>

              {oldStatus && newStatus && (
                <p className="text-xs text-slate-500 mt-1">
                  {oldStatus} → {newStatus}
                </p>
              )}

              <p className="text-xs text-slate-400 mt-2">
                {new Date(log.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityTimeline;

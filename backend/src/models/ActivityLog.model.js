const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: ["CREATE", "STATUS_CHANGE"],
      required: true,
    },
    previousValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

activityLogSchema.index({ taskId: 1, createdAt: -1 });

module.exports = mongoose.model("ActivityLog", activityLogSchema);

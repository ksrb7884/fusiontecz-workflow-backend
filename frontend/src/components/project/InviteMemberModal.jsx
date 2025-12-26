import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import api from "../../services/api";

const InviteMemberModal = ({ projectId, onClose, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      await api.post(`/projects/${projectId}/invite`, { email });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Invite failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Invite Member</h2>

        <form onSubmit={handleInvite} className="space-y-4">
          <Input
            label="Email"
            placeholder="member@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button loading={loading} type="submit">
              Invite
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteMemberModal;

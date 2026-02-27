import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";


function AdminDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

const [users, setUsers] = useState([]);
const [barters, setBarters] = useState([]);
const [loading, setLoading] = useState(false);

  if (!user || user.role !== "Admin") {
    return <div className="p-6 text-red-600">Access Denied</div>;
  }

  const token = user.token;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBarters = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/barters",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBarters(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleBan = async (id) => {
  try {
    await axios.put(
      `http://localhost:5000/api/admin/ban/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchUsers();
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    fetchUsers();
    fetchBarters();
  }, []);

  return (
    <div className="p-6 space-y-10">
      <h2 className="text-3xl font-bold mb-4">Admin Dashboard</h2>

      {/* ================= USERS ================= */}
      <div>
        <h3 className="text-xl font-semibold mb-3">All Users</h3>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Credits</th>
                  <th className="p-2 border">Trust</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="p-2 border">{u.name}</td>
                    <td className="p-2 border">{u.email}</td>
                    <td className="p-2 border">{u.credits}</td>
                    <td className="p-2 border">{u.trustScore}</td>
                    <td className="p-2 border">
                      {u.isBanned ? (
                        <span className="text-red-600">
                          Banned
                        </span>
                      ) : (
                        <span className="text-green-600">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="p-2 border">
                      <button
                        onClick={() => toggleBan(u._id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        {u.isBanned ? "Unban" : "Ban"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= BARTERS ================= */}
      <div>
        <h3 className="text-xl font-semibold mb-3">All Barters</h3>

        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Sender</th>
                <th className="p-2 border">Receiver</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Created</th>
              </tr>
            </thead>
            <tbody>
              {barters.map((b) => (
                <tr key={b._id}>
                  <td className="p-2 border">
                    {b.senderId?.name}
                  </td>
                  <td className="p-2 border">
                    {b.receiverId?.name}
                  </td>
                  <td className="p-2 border">
                    {b.status}
                  </td>
                  <td className="p-2 border">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
import { useSelector } from "react-redux";

function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);

  if (user.role !== "Admin") {
    return <div className="p-6">Access Denied</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <p>Manage users, barters, disputes here.</p>
    </div>
  );
}

export default AdminDashboard;
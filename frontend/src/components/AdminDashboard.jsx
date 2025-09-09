import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import LogoutButton from "./LogoutButton";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);
  const [userSubmissions, setUserSubmissions] = useState({});
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const { getToken } = useAuth();

  const fetchUsers = async () => {
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/v1/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  const deleteUser = async (id) => {
    try {
      const token = await getToken();
      await fetch(`http://localhost:5000/api/v1/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const changeRole = async (id, role) => {
    try {
      const token = await getToken();
      await fetch(`http://localhost:5000/api/v1/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });
      fetchUsers();
    } catch (error) {
      console.error("Error changing role:", error);
    }
  };

  const handleViewSubmissions = async (userId) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
      return;
    }
    setLoadingSubmissions(true);
    setExpandedUser(userId);
    try {
      const token = await getToken();
      const res = await fetch(
        `http://localhost:5000/api/v1/admin/submissions/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setUserSubmissions((prev) => ({ ...prev, [userId]: data }));
      setLoadingSubmissions(false);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      {/* Navigation buttons */}
      <div className="flex gap-4 mb-6">
        {/* <button
          onClick={() => navigate("/admin/add-test")}
          className="px-4 py-2 bg-black text-white rounded"
        >
          ➕ Add Test
        </button> */}
        {/* <button
          onClick={() => navigate("/admin/test-list")}
          className="px-4 py-2 bg-yellow-600 text-white rounded"
        >
          📑 Manage Tests
        </button>
        <LogoutButton /> */}
      </div>

      {/* User Management Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <React.Fragment key={u._id}>
              <tr className="border">
                <td className="p-2 border">{u.name}</td>
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u._id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-2 border flex gap-2">
                  <button
                    onClick={() => deleteUser(u._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleViewSubmissions(u._id)}
                    className="px-2 py-1 bg-blue-600 text-white rounded"
                  >
                    {expandedUser === u._id
                      ? "Hide Submissions"
                      : "View Submissions"}
                  </button>
                </td>
              </tr>
              {expandedUser === u._id && (
                <tr>
                  <td colSpan={4} className="p-2 border bg-gray-50">
                    {loadingSubmissions ? (
                      <div>Loading submissions...</div>
                    ) : userSubmissions[u._id] && userSubmissions[u._id].length > 0 ? (
                      <table className="w-full text-sm mt-2">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="p-1 border">Test Name</th>
                            <th className="p-1 border">Score</th>
                            <th className="p-1 border">%</th>
                            <th className="p-1 border">Date</th>
                            <th className="p-1 border">Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userSubmissions[u._id].map((s) => (
                            <tr key={s._id}>
                              <td className="p-1 border">{s.testName}</td>
                              <td className="p-1 border">
                                {s.score}/{s.totalQuestions}
                              </td>
                              <td className="p-1 border">{s.percentage}%</td>
                              <td className="p-1 border">
                                {new Date(s.submittedAt).toLocaleString()}
                              </td>
                              <td className="p-1 border">
                                {Math.floor(s.timeTaken / 60)}m {s.timeTaken % 60}s
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-gray-500">No submissions found.</div>
                    )}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;

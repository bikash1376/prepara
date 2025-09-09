import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import AdminDashboard from "./AdminDashboard";

const AdminTestList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const fetchTests = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/v1/admin/tests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setTests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching tests:", error);
      setMessage("Error fetching tests");
      setTests([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/v1/test/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setMessage("Test deleted!");
        fetchTests();
      } else {
        setMessage("Error deleting test");
      }
    } catch (error) {
      console.error("Error deleting test:", error);
      setMessage("Error deleting test");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      {/* <Link to='/admin/dashboard' className="mb-4 inline-block px-4 py-2 bg-black text-white rounded">Admin Dashboard</Link> */}
      <h2 className="text-2xl font-bold mb-4">Admin: Test List</h2>
      {message && <div className="mb-4 text-red-600">{message}</div>}
      {loading && <div className="mb-4 text-gray-600">Loading...</div>}
      <ul>
        {tests.map(test => (
          <li key={test._id} className="mb-3 flex justify-between items-center">
            <span className="font-medium">{test.testname}</span>
            <div className="space-x-2">
              <button
                className="px-3 py-1 bg-yellow-500 text-white rounded"
                onClick={() => navigate(`/admin/edit-test/${test._id}`)}
              >
                Edit
              </button>
              <button
                className="px-3 py-1 bg-red-600 text-white rounded"
                onClick={() => handleDelete(test._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminTestList;
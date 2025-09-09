import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const StudentDashboard = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🎓 Student Dashboard</h2>

      <div className="flex flex-col w-fit gap-4">
        <Link
          to="/test-list"
          className="px-4 py-2 bg-black text-white rounded"
        >
          📚 View Available Tests
        </Link>

        {/* <Link
          to="/test-viewer/123" // example test id, in real use map available tests
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          ▶️ Take a Test
        </Link> */}

        {/* <Link
          to="/profile"
          className="px-4 py-2 bg-yellow-600 text-white rounded"
        >
          👤 My Profile
        </Link> */}

        <div>
          {/* <LogoutButton /> */}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

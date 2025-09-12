import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Users, Activity, FileText, Trash2, ChevronDown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);
  const [userSubmissions, setUserSubmissions] = useState({});
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

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
      setExpandedUser(null); // Collapse if already open
      return;
    }

    setExpandedUser(userId); // Expand the new one
    // Fetch submissions only if they haven't been fetched before
    if (!userSubmissions[userId]) {
      setLoadingSubmissions(true);
      try {
        const token = await getToken();
        const res = await fetch(`http://localhost:5000/api/v1/admin/submissions/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUserSubmissions((prev) => ({ ...prev, [userId]: data }));
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoadingSubmissions(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Admin Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Hardcoded value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Taken</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">Total test submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* User Management Table */}
      {/* <h2 className="text-2xl font-bold tracking-tight mb-4">User Management</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <Collapsible asChild key={user._id} open={expandedUser === user._id}>
                <>
                  <TableRow>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select value={user.role} onValueChange={(value) => changeRole(user._id, value)}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                       <CollapsibleTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => handleViewSubmissions(user._id)}>
                          Submissions
                          <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${expandedUser === user._id ? "rotate-180" : ""}`} />
                        </Button>
                      </CollapsibleTrigger>
                      <Button variant="destructive" size="icon" onClick={() => deleteUser(user._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <CollapsibleContent asChild>
                    <TableRow>
                      <TableCell colSpan={4} className="p-0">
                        <div className="p-4 bg-muted">
                           {loadingSubmissions && expandedUser === user._id ? (
                            <div className="flex items-center justify-center p-4">
                              <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                          ) : userSubmissions[user._id]?.length > 0 ? (
                            <SubmissionsTable submissions={userSubmissions[user._id]} />
                          ) : (
                            <div className="text-center text-sm text-muted-foreground p-4">
                              No submissions found for this user.
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  </CollapsibleContent>
                </>
              </Collapsible>
            ))}
          </TableBody>
        </Table>
      </div> */}
    </div>
  );
};

// A small sub-component for clarity
const SubmissionsTable = ({ submissions }) => (
  <>
    <h4 className="text-md font-semibold mb-2 px-2">Test Submissions</h4>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Test Name</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Percentage</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time Taken</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((s) => (
          <TableRow key={s._id}>
            <TableCell>{s.testName}</TableCell>
            <TableCell>{s.score}/{s.totalQuestions}</TableCell>
            <TableCell>{s.percentage}%</TableCell>
            <TableCell>{new Date(s.submittedAt).toLocaleDateString()}</TableCell>
            <TableCell>{Math.floor(s.timeTaken / 60)}m {s.timeTaken % 60}s</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </>
);


export default AdminDashboard;
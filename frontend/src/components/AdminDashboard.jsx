
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Users, Activity, FileText, Trash2, ChevronDown, Loader2, PlusCircle, ClipboardList, Bug } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

// Compact relative time for the activity feed
const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);
  const [userSubmissions, setUserSubmissions] = useState({});
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("stats request failed");
      setStats(await res.json());
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats({ totalStudents: "—", activeToday: "—", testsTaken: "—", recentActivity: [] });
    }
  };

  const fetchUsers = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/users`, {
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
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/users/${id}`, {
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
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/users/${id}`, {
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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/submissions/${userId}`, {
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
            <div className="text-2xl font-bold">{stats ? stats.totalStudents : "—"}</div>
            <p className="text-xs text-muted-foreground">Registered student accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats ? stats.activeToday : "—"}</div>
            <p className="text-xs text-muted-foreground">Students active in the last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Taken</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats ? stats.testsTaken : "—"}</div>
            <p className="text-xs text-muted-foreground">Total test submissions</p>
          </CardContent>
        </Card>
      </div>



      {/* Quick Actions */}
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Link to="/admin/test-list">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Create Test</CardTitle>
              <PlusCircle className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Add a new test to the library
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/student-management">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Manage Students</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                View and manage student accounts
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/submissions">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Review Submissions</CardTitle>
              <ClipboardList className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Check recent student results
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/dashboard/?eruda=true" target="_blank">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Debug Dashboard</CardTitle>
              <Bug className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Open debug tools in new tab
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="mb-8">
        {/* Recent Activity (live from submissions) */}
        <Card className="select-none">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest test submissions across the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!stats ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : stats.recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center p-8">
                No submissions yet. Activity will show up here once students start taking tests.
              </p>
            ) : (
              <div className="space-y-6">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{initials(activity.name)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Completed "{activity.testName}" with {activity.percentage}% ({activity.score}/{activity.totalQuestions})
                      </p>
                    </div>
                    <div className="ml-auto font-medium text-sm text-muted-foreground whitespace-nowrap pl-4">
                      {timeAgo(activity.submittedAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Management Table */}
      {/* User Management Table */}
      <h2 className="text-2xl font-bold tracking-tight mb-4">User Management</h2>
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
              <React.Fragment key={user._id}>
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
                    <Button variant="outline" size="sm" onClick={() => handleViewSubmissions(user._id)}>
                      Submissions
                      <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${expandedUser === user._id ? "rotate-180" : ""}`} />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => deleteUser(user._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedUser === user._id && (
                  <TableRow>
                    <TableCell colSpan={4} className="p-0">
                      <div className="p-4 bg-muted">
                        {loadingSubmissions ? (
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
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
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
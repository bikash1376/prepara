
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Users, Activity, FileText, Trash2, ChevronDown, Loader2, PlusCircle, ClipboardList, Bug, Settings, Server, Database } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-8">
        {/* Recent Activity Mock */}
        <Card className="col-span-1 md:col-span-4 select-none">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions performed across the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-sm text-muted-foreground">
                    Completed "Math Level 1" with 85% score
                  </p>
                </div>
                <div className="ml-auto font-medium text-sm text-muted-foreground">2m ago</div>
              </div>
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/02.png" alt="Avatar" />
                  <AvatarFallback>AS</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Alice Smith</p>
                  <p className="text-sm text-muted-foreground">
                    Registered as a new student
                  </p>
                </div>
                <div className="ml-auto font-medium text-sm text-muted-foreground">1h ago</div>
              </div>
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/03.png" alt="Avatar" />
                  <AvatarFallback>RK</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Rahul Kumar</p>
                  <p className="text-sm text-muted-foreground">
                    Started "Physics Mock Test 3"
                  </p>
                </div>
                <div className="ml-auto font-medium text-sm text-muted-foreground">3h ago</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Overview Mock */}
        <Card className="col-span-1 md:col-span-3 select-none">
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>
              Current status of system components.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                       <Server className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">API Server</p>
                      <p className="text-xs text-muted-foreground">Operational</p>
                    </div>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>
                 <div className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                       <Database className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Database</p>
                      <p className="text-xs text-muted-foreground">Connected</p>
                    </div>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>
                 <div className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                       <Settings className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Version</p>
                      <p className="text-xs text-muted-foreground">v1.2.0-beta</p>
                    </div>
                  </div>
                  <Badge variant="outline">Latest</Badge>
                </div>
             </div>
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
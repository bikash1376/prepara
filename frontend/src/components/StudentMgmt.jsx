import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { MoreHorizontal, PlusCircle, File, ChevronDown, Trash2, Settings2, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const StudentMgmt = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState(null);
  const [userSubmissions, setUserSubmissions] = useState({});
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const { getToken } = useAuth();
  const [columnVisibility, setColumnVisibility] = useState({
    name: true,
    email: true,
    role: true,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/v1/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {

      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    setUsers(users.filter(u => u._id !== id)); // Optimistic UI update
    try {
      const token = await getToken();
      await fetch(`http://localhost:5000/api/v1/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {

      fetchUsers(); // Re-fetch to sync state on error
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

    }
  };

  const handleViewSubmissions = async (userId) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
      return;
    }
    setExpandedUser(userId);
    if (!userSubmissions[userId]) {
      setLoadingSubmissions(true);
      try {
        const token = await getToken();
        const res = await fetch(`http://localhost:5000/api/v1/submissions/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUserSubmissions((prev) => ({ ...prev, [userId]: data }));
      } catch (error) {

      } finally {
        setLoadingSubmissions(false);
      }
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
          <p className="text-muted-foreground">View, manage, and edit student details.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Column Visibility Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <Settings2 className="mr-2 h-4 w-4" /> Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.keys(columnVisibility).map((key) => (
                <DropdownMenuCheckboxItem
                  key={key}
                  className="capitalize"
                  checked={columnVisibility[key]}
                  onCheckedChange={(value) =>
                    setColumnVisibility((prev) => ({ ...prev, [key]: value }))
                  }
                >
                  {key}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Add more actions here if needed */}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Details</TableHead>
              {columnVisibility.name && <TableHead>Name</TableHead>}
              {columnVisibility.email && <TableHead>Email</TableHead>}
              {columnVisibility.role && <TableHead>Role</TableHead>}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : users.length > 0 ? (
              users.map((user) => (
                <Collapsible asChild key={user._id} open={expandedUser === user._id}>
                  <>
                    <TableRow>
                      <TableCell>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => handleViewSubmissions(user._id)}>
                            <ChevronDown className={`h-4 w-4 transition-transform ${expandedUser === user._id ? "rotate-180" : ""}`} />
                          </Button>
                        </CollapsibleTrigger>
                      </TableCell>
                      {columnVisibility.name && <TableCell className="font-medium">{user.name}</TableCell>}
                      {columnVisibility.email && <TableCell>{user.email}</TableCell>}
                      {columnVisibility.role && (
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                      )}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => changeRole(user._id, user.role === 'admin' ? 'student' : 'admin')}>
                              Make {user.role === 'admin' ? 'Student' : 'Admin'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => deleteUser(user._id)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <CollapsibleContent asChild>
                      <TableRow>
                        <TableCell colSpan={5} className="p-0">
                           <div className="p-4 bg-muted">
                            {loadingSubmissions && expandedUser === user._id ? (
                               <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Sub-component for displaying submissions cleanly
const SubmissionsTable = ({ submissions }) => (
  <div className="px-4">
    <h4 className="text-md font-semibold mb-2">Test Submissions</h4>
    <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test Name</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Percentage</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((s) => (
              <TableRow key={s._id}>
                <TableCell>{s.testName}</TableCell>
                <TableCell>{s.score}/{s.totalQuestions}</TableCell>
                <TableCell>{s.percentage}%</TableCell>
                <TableCell>{new Date(s.submittedAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  </div>
);


export default StudentMgmt;
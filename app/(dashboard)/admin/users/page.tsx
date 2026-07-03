"use client";

import { TopBar } from "@/components/TopBar";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  avatarUrl?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "SWIMMER",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create user");
      }

      setFormData({ name: "", email: "", password: "", role: "SWIMMER" });
      setShowAddForm(false);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating user");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete user");
      }

      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting user");
    }
  };

  return (
    <>
      <TopBar title="User Management" />

      <div className="flex-1 overflow-auto">
        <div className="px-8 py-6 space-y-6 max-w-7xl mx-auto">
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "User Management" },
            ]}
          />

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">
                Manage system users and administrators
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 text-sm font-medium"
            >
              ➕ Add User
            </button>
          </div>

          {showAddForm && (
            <div className="card p-6 bg-blue-50 border border-blue-200">
              <h3 className="text-lg font-semibold mb-4">Add New User</h3>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="COACH">Coach</option>
                      <option value="ACCOUNTANT">Accountant</option>
                      <option value="SWIMMER">Swimmer</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Create User
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="card overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-600">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-gray-600">No users found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              user.role === "ADMIN"
                                ? "bg-red-100 text-red-800"
                                : user.role === "COACH"
                                ? "bg-blue-100 text-blue-800"
                                : user.role === "ACCOUNTANT"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    gmail: "",
    password: "",
    address: "",
    role: "customer",
  });

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/getAllUsers`,
        { withCredentials: true }
      );
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add User
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/addUser`,
        form,
        { withCredentials: true }
      );
      toast.success("User added successfully");
      setForm({ name: "", gmail: "", password: "", address: "", role: "customer" });
      fetchUsers();
    } catch (error) {
      toast.error("Failed to add user");
    }
  };

  // Delete User
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/deleteUser/${id}`,
        { withCredentials: true }
      );
      toast.success("User deleted");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="min-h-150 bg-gray-100 p-6">
      <Toaster position="top-right" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add User Form */}
        <div className="bg-white max-h-110 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add User</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full border p-2 rounded-lg"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border p-2 rounded-lg"
              value={form.gmail}
              onChange={(e) => setForm({ ...form, gmail: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border p-2 rounded-lg"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Address"
              className="w-full border p-2 rounded-lg"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
            <select
              className="w-full border p-2 rounded-lg"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium cursor-pointer"
            >
              Add User
            </button>
          </form>
        </div>

        {/* User List */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Users</h2>
            <input
              type="text"
              placeholder="Search user..."
              className="border p-2 rounded-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Email</th>
                  <th className="p-3 border">Address</th>
                  <th className="p-3 border">Role</th>
                  <th className="p-3 border text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((u) =>
                    u.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="p-3 border">{u.name}</td>
                      <td className="p-3 border">{u.gmail}</td>
                      <td className="p-3 border">{u.address}</td>
                      <td className="p-3 border">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            u.role === "admin"
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 border text-center">
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;

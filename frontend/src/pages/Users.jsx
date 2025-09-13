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
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/getAllUsers`,
        { withCredentials: true }
      );
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row gap-6">
        {/* Add User Form */}
        <div className="bg-white h-105 p-6 rounded-xl shadow-md w-full md:w-1/3">
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

        {/* Users List */}
        <div className="md:w-2/3 bg-white p-6 rounded-xl shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <h2 className="text-xl font-semibold">Users</h2>
            <input
              type="text"
              placeholder="Search user..."
              className="border p-2 rounded-lg w-full md:w-1/2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-60">
              <p className="text-lg font-semibold">Loading...</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-auto max-h-[70vh]">
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
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((u) => (
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
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-6 text-gray-500">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <div key={u._id} className="bg-gray-50 rounded-xl shadow p-4 border">
                      <p><strong>Name:</strong> {u.name}</p>
                      <p><strong>Email:</strong> {u.gmail}</p>
                      <p><strong>Address:</strong> {u.address}</p>
                      <p><strong>Role:</strong> {u.role}</p>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No users found</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;

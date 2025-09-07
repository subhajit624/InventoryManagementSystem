import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({ name: "", gmail: "", phone: "", address: "" });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/supplier/getAllSuppliers`,
        { withCredentials: true }
      );
      setSuppliers(data.suppliers);
    } catch (error) {
      toast.error("Failed to fetch suppliers");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/api/supplier/updateSupplier/${editId}`,
          form,
          { withCredentials: true }
        );
        toast.success("Supplier updated successfully");
        setEditId(null);
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/supplier/addSupplier`,
          form,
          { withCredentials: true }
        );
        toast.success("Supplier added successfully");
      }
      setForm({ name: "", gmail: "", phone: "", address: "" });
      fetchSuppliers();
    } catch (error) {
      toast.error("Error saving supplier");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/supplier/deleteSupplier/${id}`,
        { withCredentials: true }
      );
      toast.success("Supplier deleted successfully");
      fetchSuppliers();
    } catch (error) {
      toast.error("Failed to delete supplier");
    }
  };

  const handleEdit = (supplier) => {
    setForm(supplier);
    setEditId(supplier._id);
  };

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.gmail.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-150 rounded-2xl">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side: Add/Edit Supplier Form */}
        <div className="md:w-1/3 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editId ? "Edit Supplier" : "Add Supplier"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={form.gmail}
              onChange={(e) => setForm({ ...form, gmail: e.target.value })}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="number"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition cursor-pointer"
            >
              {editId ? "Update Supplier" : "Add Supplier"}
            </button>
          </form>
        </div>

        {/* Right side: Supplier Table */}
        <div className="md:w-2/3">
          <div className="mb-4 flex justify-end">
            <input
              type="text"
              placeholder="Search suppliers..."
              className="w-full md:w-1/2 p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-4 text-left">S.No</th>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">Address</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((s, idx) => (
                    <tr
                      key={s._id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-4">{idx + 1}</td>
                      <td className="p-4">{s.name}</td>
                      <td className="p-4">{s.gmail}</td>
                      <td className="p-4">{s.phone}</td>
                      <td className="p-4">{s.address}</td>
                      <td className="p-4 flex gap-2">
                        <button
                          onClick={() => handleEdit(s)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 cursor-pointer transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 cursor-pointer transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      No suppliers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suppliers;

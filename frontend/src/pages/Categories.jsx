import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editCategory, setEditCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/category/getAllCategories`,
        { withCredentials: true }
      );
      setCategories(res.data.categories || []);
      setFilteredCategories(res.data.categories || []);
    } catch (err) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setFilteredCategories(
      categories.filter((cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, categories]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/category/addCategory`,
        { name, description },
        { withCredentials: true }
      );
      toast.success("Category added successfully!");
      setName("");
      setDescription("");
      fetchCategories();
    } catch (err) {
      toast.error("Failed to add category");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/category/updateCategory/${editCategory._id}`,
        { name, description },
        { withCredentials: true }
      );
      toast.success("Category updated!");
      setEditCategory(null);
      setName("");
      setDescription("");
      fetchCategories();
    } catch (err) {
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/category/deleteCategory/${id}`,
        { withCredentials: true }
      );
      toast.success("Category deleted!");
      fetchCategories();
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Toaster position="top-right" reverseOrder={false} />

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">

          {/* Add/Edit Form */}
          <div className="md:w-1/3 h-60 bg-white shadow rounded-lg p-4 border">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              {editCategory ? "Edit Category" : "Add New Category"}
            </h2>

            <form
              onSubmit={editCategory ? handleUpdate : handleAdd}
              className="space-y-3 flex flex-col"
            >
              <input
                type="text"
                placeholder="Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded cursor-pointer"
                >
                  {editCategory ? "Update" : "Add"}
                </button>

                {editCategory && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditCategory(null);
                      setName("");
                      setDescription("");
                    }}
                    className="flex-1 bg-gray-400 text-white py-2 rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Categories List */}
          <div className="md:w-2/3 bg-white shadow rounded-lg p-4 border flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              All Categories
            </h2>

            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />

            {/* Desktop Table */}
            <div className="hidden md:block overflow-auto max-h-[60vh]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 border-b">Name</th>
                    <th className="p-3 border-b">Description</th>
                    <th className="p-3 border-b">Created At</th>
                    <th className="p-3 border-b">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((cat) => (
                      <tr key={cat._id} className="hover:bg-gray-50">
                        <td className="p-3 border-b">{cat.name}</td>
                        <td className="p-3 border-b">{cat.description}</td>
                        <td className="p-3 border-b">
                          {new Date(cat.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 border-b space-x-2">
                          <button
                            onClick={() => {
                              setEditCategory(cat);
                              setName(cat.name);
                              setDescription(cat.description);
                            }}
                            className="bg-yellow-500 text-white px-3 py-1 rounded cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(cat._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="p-4 text-center text-gray-500"
                      >
                        No categories found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Cards Mobile */}
            <div className="md:hidden space-y-4 overflow-auto max-h-[60vh]">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <div
                    key={cat._id}
                    className="border rounded p-4 bg-gray-50"
                  >
                    <p>
                      <strong>Name:</strong> {cat.name}
                    </p>
                    <p>
                      <strong>Description:</strong> {cat.description}
                    </p>
                    <p>
                      <strong>Created At:</strong>{" "}
                      {new Date(cat.createdAt).toLocaleDateString()}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => {
                          setEditCategory(cat);
                          setName(cat.name);
                          setDescription(cat.description);
                        }}
                        className="bg-yellow-500 text-white px-3 py-1 rounded cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No categories found</p>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Products_Admin = () => {
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    stock: "",
    price: "",
    categoryId: "",
    supplierId: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, supRes, prodRes] = await Promise.all([
        axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/category/getAllCategories`,
          { withCredentials: true }
        ),
        axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/supplier/getAllSuppliers`,
          { withCredentials: true }
        ),
        axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/getAllProducts`,
          { withCredentials: true }
        ),
      ]);

      setCategories(catRes.data.categories || []);
      setSuppliers(supRes.data.suppliers || []);
      setProducts(prodRes.data.products || []);
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/updateProduct/${editId}`,
          form,
          { withCredentials: true }
        );
        toast.success("Product updated!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/addProduct`,
          form,
          { withCredentials: true }
        );
        toast.success("Product added!");
      }

      setForm({
        name: "",
        stock: "",
        price: "",
        categoryId: "",
        supplierId: "",
      });
      setEditId(null);
      fetchData();
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/deleteProduct/${id}`,
        { withCredentials: true }
      );
      toast.success("Product deleted!");
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const handleEdit = (p) => {
    setEditId(p._id);
    setForm({
      name: p.name,
      stock: p.stock,
      price: p.price,
      categoryId: p.categoryId?._id || "",
      supplierId: p.supplierId?._id || "",
    });
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {loading ? (
          <div className="flex justify-center items-center h-60">
            <p className="text-lg font-semibold">Loading...</p>
          </div>
        ) : (
          
          <div className="flex flex-col md:flex-row gap-6">

            {/* Form Section */}
            <div className="md:w-1/3 bg-white shadow rounded-lg p-4">
              <h2 className="text-xl font-bold mb-4">
                {editId ? "Edit Product" : "Add Product"}
              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-4 flex flex-col"
              >
                <input
                  type="text"
                  placeholder="Product Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full border rounded p-2"
                  required
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: e.target.value })
                  }
                  className="w-full border rounded p-2"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                  className="w-full border rounded p-2"
                  required
                />

                <select
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
                  className="w-full border rounded p-2"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.length > 0 ? (
                    categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No categories available</option>
                  )}
                </select>

                <select
                  value={form.supplierId}
                  onChange={(e) =>
                    setForm({ ...form, supplierId: e.target.value })
                  }
                  className="w-full border rounded p-2"
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers.length > 0 ? (
                    suppliers.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No suppliers available</option>
                  )}
                </select>

                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 rounded cursor-pointer"
                >
                  {editId ? "Update" : "Add"}
                </button>
              </form>
            </div>

            {/* Products Section */}
            <div className="md:w-2/3 bg-white shadow rounded-lg p-4 flex flex-col">
              <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
                <h2 className="text-xl font-bold">Products</h2>
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded p-2 w-full sm:w-auto"
                />
              </div>

              {/* Table (Desktop) */}
              <div className="hidden md:block overflow-auto max-h-[60vh]">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">Stock</th>
                      <th className="p-2 border">Price</th>
                      <th className="p-2 border">Category</th>
                      <th className="p-2 border">Supplier</th>
                      <th className="p-2 border">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products
                      .filter((p) =>
                        p.name.toLowerCase().includes(search.toLowerCase())
                      )
                      .map((p) => (
                        <tr
                          key={p._id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-2">{p.name}</td>
                          <td className="p-2">{p.stock}</td>
                          <td className="p-2">₹{p.price}</td>
                          <td className="p-2">{p.category?.name}</td>
                          <td className="p-2">{p.supplier?.name}</td>
                          <td className="p-2 flex gap-2">
                            <button
                              onClick={() => handleEdit(p)}
                              className="bg-yellow-500 text-white px-3 py-1 rounded cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(p._id)}
                              className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Cards (Mobile) */}
              <div className="md:hidden space-y-4 overflow-auto max-h-[60vh]">
                {products
                  .filter((p) =>
                    p.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((p) => (
                    <div
                      key={p._id}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <p><strong>Name:</strong> {p.name}</p>
                      <p><strong>Stock:</strong> {p.stock}</p>
                      <p><strong>Price:</strong> ₹{p.price}</p>
                      <p><strong>Category:</strong> {p.category?.name}</p>
                      <p><strong>Supplier:</strong> {p.supplier?.name}</p>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Products_Admin;

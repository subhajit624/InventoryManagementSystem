import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Orders_Admin = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/order/getAllOrders`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/order/deleteOrder/${id}`,
        { withCredentials: true }
      );
      toast.success("Order deleted");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to delete order");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/order/changeOrderStatus`,
        { orderId: id, status },
        { withCredentials: true }
      );
      toast.success("Status updated");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const userName = order.user?.name?.toLowerCase() || "";
    const productNames = order.products
      ?.map((p) => p.product?.name?.toLowerCase() || "")
      .join(" ");
    return (
      userName.includes(search.toLowerCase()) ||
      productNames.includes(search.toLowerCase()) ||
      order.status.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-2xl">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by customer, product, or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 p-2 border rounded shadow-sm focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-auto max-h-[70vh]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border-b">S.No</th>
                  <th className="p-3 border-b">Customer</th>
                  <th className="p-3 border-b">Address</th>
                  <th className="p-3 border-b">Products</th>
                  <th className="p-3 border-b">Quantity</th>
                  <th className="p-3 border-b">Total Price</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b">Date</th>
                  <th className="p-3 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => {
                    const totalPrice = order.products.reduce((sum, p) => {
                      return sum + (p.product?.price || 0) * p.quantity;
                    }, 0);

                    return (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="p-3 border-b font-medium">{index + 1}</td>
                        <td className="p-3 border-b">{order.user?.name}</td>
                        <td className="p-3 border-b">{order.user?.address}</td>
                        <td className="p-3 border-b">
                          {order.products.map((p, i) => (
                            <div key={i} className="text-sm">
                              {p.product ? (
                                <span className="font-semibold">{p.product.name}</span>
                              ) : (
                                <span className="text-red-500">Deleted Product</span>
                              )}
                            </div>
                          ))}
                        </td>
                        <td className="p-3 border-b">
                          {order.products.map((p, i) => (
                            <div key={i} className="text-sm">
                              {p.quantity}
                            </div>
                          ))}
                        </td>
                        <td className="p-3 border-b font-semibold">₹{totalPrice}</td>
                        <td className="p-3 border-b">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            className="p-1 border rounded cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-3 border-b text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleString()}
                        </td>
                        <td className="p-3 border-b text-center">
                          <button
                            onClick={() => handleDelete(order._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer shadow hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9" className="p-4 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => {
                const totalPrice = order.products.reduce((sum, p) => {
                  return sum + (p.product?.price || 0) * p.quantity;
                }, 0);

                return (
                  <div key={order._id} className="bg-white rounded-xl shadow p-4 border">
                    <p>
                      <strong>Order #:</strong> {index + 1}
                    </p>
                    <p>
                      <strong>Customer:</strong> {order.user?.name}
                    </p>
                    <p>
                      <strong>Address:</strong> {order.user?.address}
                    </p>
                    <p>
                      <strong>Products:</strong>{" "}
                      {order.products.map((p, i) => (
                        <span key={i} className="text-sm block">
                          {p.product
                            ? p.product.name
                            : "Deleted Product"} × {p.quantity}
                        </span>
                      ))}
                    </p>
                    <p>
                      <strong>Total Price:</strong> ₹{totalPrice}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="p-1 border rounded cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Date:</strong>{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer shadow hover:bg-red-600 mt-2"
                    >
                      Delete
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500">No orders found</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Orders_Admin;

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, {Toaster} from "react-hot-toast";

const Orders_Admin = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/order/getAllOrders`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Delete order
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/order/deleteOrder/${id}`, {
        withCredentials: true,
      });
      toast.success("Order deleted");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to delete order");
    }
  };

  // Change status
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

  // Search filter
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
    <div className="p-6 bg-gray-50 min-h-150 rounded-2xl">
      <Toaster position="top-right" reverseOrder={false} />
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by customer, product, or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
        />
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
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
                // calculate total price
                const totalPrice = order.products.reduce((sum, p) => {
                  return sum + (p.product?.price || 0) * p.quantity;
                }, 0);

                return (
                  <tr key={order._id} className="hover:bg-gray-50">
                    {/* Numbering */}
                    <td className="p-3 border-b font-medium">{index + 1}</td>

                    {/* Customer */}
                    <td className="p-3 border-b">{order.user?.name}</td>

                    {/* Address */}
                    <td className="p-3 border-b">{order.user?.address}</td>

                    {/* Products */}
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

                    {/* Quantity */}
                    <td className="p-3 border-b">
                      {order.products.map((p, i) => (
                        <div key={i} className="text-sm">
                          {p.quantity}
                        </div>
                      ))}
                    </td>

                    {/* Total */}
                    <td className="p-3 border-b font-semibold">₹{totalPrice}</td>

                    {/* Status with icons */}
                    <td className="p-3 border-b">
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="p-1 border rounded-lg bg-gray-50"
                        >
                          <option value="pending">Pending</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="p-3 border-b text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td className="p-3 border-b text-center">
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="px-3 py-1 bg-red-500 cursor-pointer text-white rounded-lg shadow hover:bg-red-600"
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
    </div>
  );
};

export default Orders_Admin;

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Orders_Cus = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/order/getUserOrders`,
          { withCredentials: true }
        );
        if (res.data.success) setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleDelete = async (orderId) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/order/deleteOrder/${orderId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Order deleted");
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
      } else {
        toast.error("Failed to delete order");
      }
    } catch (err) {
      console.error("Error deleting order:", err);
      toast.error("Error deleting order");
    }
  };

  const formatINR = (n) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
      Number(n || 0)
    );

  const statusBadge = (status) => {
    const map = {
      pending: "bg-yellow-100 text-yellow-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return map[status] || "bg-gray-100 text-gray-700";
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[70vh] text-gray-600">
        Loading your orders…
      </div>
    );

  if (!orders.length)
    return (
      <div className="flex items-center justify-center h-[70vh] text-gray-500">
        No orders yet. 🛍️
      </div>
    );

  return (
    <div className="bg-gray-100 rounded-2xl min-h-150 px-4 py-6">

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => {
          const total = (order.products || []).reduce(
            (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0),
            0
          );

          return (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-5"
            >
              {/* Header: ID + status + placed on */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="font-mono text-sm break-all">{order._id}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Placed on:{" "}
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              {/* Body: product list */}
              <div className="mt-4">
                <div className="grid grid-cols-12 text-[11px] uppercase tracking-wide text-gray-500">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-2 text-right">Unit</div>
                  <div className="col-span-2 text-right">Line</div>
                </div>

                <div className="mt-2 divide-y">
                  {(order.products || []).map((item) => {
                    const name = item.product?.name || "Product";
                    const qty = item.quantity || 0;
                    const unit = item.product?.price || 0;
                    const line = unit * qty;

                    return (
                      <div
                        key={item._id}
                        className="grid grid-cols-12 py-2 text-sm items-center"
                      >
                        <div className="col-span-6 font-medium text-gray-800">
                          {name}
                        </div>
                        <div className="col-span-2 text-center text-gray-700">
                          {qty}
                        </div>
                        <div className="col-span-2 text-right text-gray-700">
                          {formatINR(unit)}
                        </div>
                        <div className="col-span-2 text-right font-semibold text-gray-900">
                          {formatINR(line)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer: total + delete */}
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm">
                  <span className="text-gray-500">Total:&nbsp;</span>
                  <span className="text-lg font-bold">{formatINR(total)}</span>
                </p>
                <button
                  onClick={() => handleDelete(order._id)}
                  className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-600 active:scale-[0.98] transition"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders_Cus;

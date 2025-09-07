import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UserInfo } from "@/context/AuthContext";

const Products_Cus = () => {
  const { authUser } = useContext(UserInfo);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/getAllProducts`,
          { withCredentials: true }
        );

        if (res.data.success) {
          setProducts(res.data.products);
          const qtyObj = {};
          res.data.products.forEach((p) => {
            qtyObj[p._id] = 1;
          });
          setQuantities(qtyObj);
        } else {
          toast.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error during fetching products:", error);
        toast.error("Unauthorized or not logged in");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleOrder = async (e, product) => {
    e.preventDefault();
    const quantity = quantities[product._id] || 1;
    const totalAmount = product.price * quantity;

    try {
      // Create order in backend
      const { data: orderData } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/create-order`,
        { amount: totalAmount },
        { withCredentials: true }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Razorpay Test Key ID
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.id,
        name: "Inventory Management System",
        description: "Purchase Product",
        handler: async function (response) {
          await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/payment/verify-payment`,
            response,
            { withCredentials: true }
          );

          toast.success("Payment Successful ✅");

          const orderRes = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/order/placeOrder`,
            { productId: product._id, quantity },
            { withCredentials: true }
          );

          if (orderRes.data.success) {
            const order = orderRes.data.order;
            setProducts((prev) =>
              prev.map((p) =>
                p._id === product._id ? { ...p, stock: p.stock - quantity } : p
              )
            );

            setOrderDetails({
              id: order._id,
              productName: product.name,
              quantity: order.products[0].quantity,
              status: order.status,
              createdAt: order.createdAt,
            });
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error during ordering/payment:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const categories = [...new Set(products.map((p) => p.category?.name))];

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      !selectedCategory || p.category?.name === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-150 rounded-2xl bg-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-center rounded-2xl gap-4 p-4 bg-gray-100 shadow">
        <div className="flex items-center gap-2">
          <label className="font-medium">Select Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded-lg px-3 py-1"
          >
            <option value="">All</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <input
            type="text"
            placeholder="Search Products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-1 w-60"
          />
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <p className="text-center">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center">No products available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p._id}
                className="bg-gray-50 shadow rounded-xl p-4 flex flex-col justify-between hover:shadow-lg transition"
              >
                <div>
                  <h2 className="text-lg font-bold capitalize">{p.name}</h2>
                  <p className="text-gray-600 text-sm">
                    Category: {p.category?.name}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Supplier: {p.supplier?.name}
                  </p>
                  <p className="text-gray-700 mt-2">Stock: {p.stock}</p>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm">Qty:</label>
                    <input
                      type="number"
                      min="1"
                      max={p.stock}
                      value={quantities[p._id] || 1}
                      className="w-16 border rounded px-2 py-1 text-sm"
                      onChange={(e) =>
                        setQuantities({
                          ...quantities,
                          [p._id]: parseInt(e.target.value) || 1,
                        })
                      }
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-green-600">
                      ₹{(p.price * (quantities[p._id] || 1)).toFixed(2)}
                    </span>
                    <button
                      onClick={(e) => handleOrder(e, p)}
                      className="bg-blue-600 text-white cursor-pointer px-3 py-1 rounded-lg hover:bg-blue-700"
                    >
                      Pay & Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {orderDetails && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-3">Order Confirmation</h2>
            <p>
              <span className="font-semibold">Order ID:</span> {orderDetails.id}
            </p>
            <p>
              <span className="font-semibold">Product:</span>{" "}
              {orderDetails.productName}
            </p>
            <p>
              <span className="font-semibold">Quantity:</span>{" "}
              {orderDetails.quantity}
            </p>
            <p>
              <span className="font-semibold">Status:</span> {orderDetails.status}
            </p>
            <p>
              <span className="font-semibold">Placed On:</span>{" "}
              {new Date(orderDetails.createdAt).toLocaleString()}
            </p>

            <button
              onClick={() => setOrderDetails(null)}
              className="mt-4 w-full bg-blue-600 text-white py-2 cursor-pointer rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products_Cus;

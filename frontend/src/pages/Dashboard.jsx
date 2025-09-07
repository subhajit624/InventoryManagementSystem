import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ShoppingBag,
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/getAllProducts`,
          { withCredentials: true }
        );
        const orderRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/order/getAllOrders`,
          { withCredentials: true }
        );
        setProducts(prodRes.data.products || []);
        setOrders(orderRes.data.orders || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  // === Calculations ===
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  // ✅ Local date (fix for showing today's order correctly)
  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD local
  const ordersToday = orders.filter((o) => {
    const orderDate = new Date(o.createdAt).toLocaleDateString("en-CA");
    return orderDate === today;
  });

  const revenue = orders.reduce((sum, order) => {
    return (
      sum +
      order.products.reduce(
        (s, item) => s + item.product.price * item.quantity,
        0
      )
    );
  }, 0);

  const outOfStockProducts = products.filter((p) => p.stock === 0);

  // Sales count per product
  const productSales = {};
  orders.forEach((order) => {
    order.products.forEach((item) => {
      productSales[item.product.name] =
        (productSales[item.product.name] || 0) + item.quantity;
    });
  });

  const topSaleProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, qty]) => ({ name, qty }));

  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 5);

  // Orders per day (line chart)
  const ordersByDate = {};
  orders.forEach((order) => {
    const date = new Date(order.createdAt).toLocaleDateString("en-CA"); // ✅ Local date
    ordersByDate[date] = (ordersByDate[date] || 0) + 1;
  });

  const orderTrend = Object.entries(ordersByDate).map(([date, count]) => ({
    date,
    count,
  }));

  // === Card Component ===
  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`rounded-2xl p-6 shadow-md text-white ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm opacity-80">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Icon size={36} className="opacity-80" />
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          color="bg-gradient-to-r from-purple-500 to-purple-700"
        />
        <StatCard
          title="Total Stock"
          value={totalStock}
          icon={ShoppingBag}
          color="bg-gradient-to-r from-blue-500 to-blue-700"
        />
        <StatCard
          title="Orders Today"
          value={ordersToday.length}
          icon={ShoppingCart}
          color="bg-gradient-to-r from-green-500 to-green-700"
        />
        <StatCard
          title="Revenue"
          value={`₹${revenue}`}
          icon={DollarSign}
          color="bg-gradient-to-r from-orange-500 to-orange-700"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Top Sale Products Bar Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="text-green-500" /> Top Sale Products
          </h2>
          {topSaleProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topSaleProducts}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="qty" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No sales data yet</p>
          )}
        </div>

        {/* Orders Per Day Line Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">📈 Orders Per Day</h2>
          {orderTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={orderTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No orders yet</p>
          )}
        </div>
      </div>

      {/* Out of Stock */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="text-red-500" /> Out of Stock Products
        </h2>
        {outOfStockProducts.length > 0 ? (
          <ul className="list-disc ml-6">
            {outOfStockProducts.map((p) => (
              <li key={p._id}>{p.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">✅ All products in stock</p>
        )}
      </div>

      {/* Low Stock */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ShoppingBag className="text-yellow-500" /> Low Stock Products
        </h2>
        {lowStockProducts.length > 0 ? (
          <ul className="list-disc ml-6">
            {lowStockProducts.map((p) => (
              <li key={p._id}>
                {p.name} — <span className="font-bold">{p.stock}</span> left
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">✅ All products well stocked</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

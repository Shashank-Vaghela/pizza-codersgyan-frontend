import { useGetDashboardDataQuery } from "../../services/dashboard.service";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.data);
  const { data: dashboardData, isLoading } = useGetDashboardDataQuery();

  const stats = dashboardData?.data?.stats || { totalOrders: 0, totalRevenue: 0 };
  const recentOrders = dashboardData?.data?.recentOrders || [];
  const salesChartData = dashboardData?.data?.salesData || [];

  const getStatusColor = (status) => {
    const colors = {
      Received: "bg-blue-100 text-blue-700",
      Confirmed: "bg-yellow-100 text-yellow-700",
      Prepared: "bg-orange-100 text-orange-700",
      "Out for delivery": "bg-purple-100 text-purple-700",
      Delivered: "bg-green-100 text-green-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Welcome, {user?.firstName || "Admin"} 👋
      </h1>

      <div className="grid grid-cols-[1fr_1fr] gap-6 mb-6">
        {/* Left Column - Stats and Sales */}
        <div className="space-y-4">
          {/* Total Orders and Total Sold - Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            {/* Total Orders Card */}
            <div className="bg-white rounded-lg shadow-sm p-3">
              <p className="text-xs text-gray-600 mb-1">Total orders</p>
              <p className="text-xl font-bold text-gray-900">
                {stats.totalOrders}
              </p>
            </div>

            {/* Total Sold Card */}
            <div className="bg-white rounded-lg shadow-sm p-3">
              <p className="text-xs text-gray-600 mb-1">Total sold</p>
              <p className="text-xl font-bold text-gray-900">
                ₹{" "}
                {stats.totalRevenue?.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                }) || "0.00"}
              </p>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="text-sm font-semibold text-gray-900">
                Sales (Last 7 Days)
              </h3>
            </div>
            <div className="h-48">
              {salesChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 12 }}
                      stroke="#9ca3af"
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      stroke="#9ca3af"
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        fontSize: "12px",
                      }}
                      formatter={(value) => [`₹${value}`, "Sales"]}
                      labelFormatter={(label) => `Day: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ fill: "#ef4444", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No sales data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Recent Orders Card */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="text-sm font-semibold text-gray-900">
              Recent orders
            </h3>
          </div>
          <div className="space-y-2 flex-1 overflow-auto">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="grid grid-cols-[2fr_1fr_1fr] gap-3 items-center text-sm cursor-pointer hover:bg-gray-50 p-2 rounded"
                  onClick={() => navigate(`/admin/orders/${order._id}`)}
                >
                  <div>
                    <p className="font-medium text-gray-900 text-xs">
                      {order.items
                        ?.slice(0, 2)
                        .map((item) => item.name)
                        .join(", ")}
                      {order.items?.length > 2 && "..."}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.customer?.firstName} {order.customer?.lastName}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900 text-xs">
                      ₹{order.pricing?.total}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs px-2 py-1 rounded inline-block ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 text-sm py-4">
                No recent orders
              </p>
            )}
          </div>
          <button
            onClick={() => navigate("/admin/orders")}
            className="text-red-500 hover:text-red-600 text-xs font-medium mt-3"
          >
            See all orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllOrdersQuery } from "../../../services/order.service";
import { format } from "date-fns";
import CustomPagination from "../../../components/common/CustomPagination";

const AdminOrders = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentModeFilter, setPaymentModeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: ordersData, isLoading } = useGetAllOrdersQuery({
    status: statusFilter,
    paymentMode: paymentModeFilter,
  });

  const allOrders = ordersData?.data || [];
  
  // Pagination logic
  const totalItems = allOrders.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const orders = allOrders.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

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
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <span className="hover:text-gray-900 cursor-pointer">Dashboard</span>
          <span>&gt;</span>
          <span className="text-gray-900 font-medium">Orders</span>
        </div>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="hover:text-gray-900 cursor-pointer" onClick={() => navigate("/admin")}>
            Dashboard
          </span>
          <span>&gt;</span>
          <span className="text-gray-900 font-medium">Orders</span>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Status</option>
            <option value="Received">Received</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Prepared">Prepared</option>
            <option value="Out for delivery">Out for delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
          
          <select
            value={paymentModeFilter}
            onChange={(e) => setPaymentModeFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Payment</option>
            <option value="card">Card</option>
            <option value="cash">Cash</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Address
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Comment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Payment Mode
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  CreatedAt
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-900">
                      {order._id}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-900">
                      {order.customer?.firstName} {order.customer?.lastName}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-900 max-w-xs truncate">
                      {order.deliveryAddress}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-900 max-w-xs truncate">
                      {order.comment || "None"}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-900 capitalize">
                      {order.paymentMode}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded inline-block ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-900 font-semibold">
                      ₹{order.pricing?.total}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-900">
                      {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                        className="text-xs text-red-500 hover:text-red-600"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 py-12 text-center">
                    <p className="text-gray-500">No orders found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <CustomPagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          itemLabel="orders"
        />
      </div>
    </div>
  );
};

export default AdminOrders;

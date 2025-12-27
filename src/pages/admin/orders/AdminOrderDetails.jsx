import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useGetOrderByIdQuery, useUpdateOrderStatusMutation } from "../../../services/order.service";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import heroPizza from "../../../assets/img/hero-pizza.png";

const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { data: orderData, isLoading, isError } = useGetOrderByIdQuery(orderId);
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const order = orderData?.data;
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  const statusOptions = [
    "Received",
    "Confirmed",
    "Prepared",
    "Out for delivery",
    "Delivered",
  ];

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

  const handleStatusChange = async (newStatus) => {
    try {
      await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
      setStatus(newStatus);
      toast.success("Order status updated successfully!");
    } catch (error) {
      toast.error(error.data?.message || "Failed to update order status");
    }
  };

  const getCustomizationText = (item) => {
    if (!item.customization) return "";
    const customization = item.customization;
    return Object.values(customization).join(", ");
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <span className="hover:text-gray-900 cursor-pointer" onClick={() => navigate("/admin")}>Dashboard</span>
          <span>&gt;</span>
          <span className="hover:text-gray-900 cursor-pointer" onClick={() => navigate("/admin/orders")}>Orders</span>
          <span>&gt;</span>
          <span className="text-gray-900 font-medium">Order Details</span>
        </div>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <span className="hover:text-gray-900 cursor-pointer" onClick={() => navigate("/admin")}>Dashboard</span>
          <span>&gt;</span>
          <span className="hover:text-gray-900 cursor-pointer" onClick={() => navigate("/admin/orders")}>Orders</span>
          <span>&gt;</span>
          <span className="text-gray-900 font-medium">Order Details</span>
        </div>
        <div className="text-center py-12">
          <p className="text-red-500">Order not found</p>
          <button
            onClick={() => navigate("/admin/orders")}
            className="mt-4 text-red-500 hover:text-red-600"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="hover:text-gray-900 cursor-pointer" onClick={() => navigate("/admin")}>Dashboard</span>
          <span>&gt;</span>
          <span className="hover:text-gray-900 cursor-pointer" onClick={() => navigate("/admin/orders")}>Orders</span>
          <span>&gt;</span>
          <span className="text-gray-900 font-medium">
            Order #{order._id}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Change Order Status</span>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating}
            className="text-xs px-3 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-[2fr_1fr] gap-6">
        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Order Details
            </h2>
            <span className={`text-xs px-3 py-1 rounded ${getStatusColor(status)}`}>
              {status}
            </span>
          </div>

          <div className="space-y-6">
            {order.items?.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <img
                  src={item.image || heroPizza}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded-lg bg-gray-100"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {getCustomizationText(item)}
                      </p>
                    </div>
                    <span className="text-sm text-gray-600 whitespace-nowrap">
                      ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">₹{order.pricing?.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxes</span>
                <span className="text-gray-900">₹{order.pricing?.taxes}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Charges</span>
                <span className="text-gray-900">₹{order.pricing?.deliveryCharges}</span>
              </div>
              {order.pricing?.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600">-₹{order.pricing?.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold border-t border-gray-200 pt-2">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">₹{order.pricing?.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Customer Details
          </h2>

          <div className="space-y-3">
            <div className="text-sm">
              <span className="text-gray-500">Name: </span>
              <span className="text-gray-900">
                {order.customer?.firstName} {order.customer?.lastName}
              </span>
            </div>

            <div className="text-sm">
              <span className="text-gray-500">Email: </span>
              <span className="text-gray-900">
                {order.customer?.email}
              </span>
            </div>

            <div className="text-sm">
              <span className="text-gray-500">Address: </span>
              <span className="text-gray-900">
                {order.deliveryAddress}
              </span>
            </div>

            <div className="text-sm">
              <span className="text-gray-500">Payment Method: </span>
              <span className="text-gray-900 uppercase">
                {order.paymentMode}
              </span>
            </div>

            <div className="text-sm">
              <span className="text-gray-500">Payment Status: </span>
              <span className={`font-medium ${
                order.paymentStatus === "PAID" 
                  ? "text-green-600" 
                  : order.paymentStatus === "PENDING"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}>
                {order.paymentStatus}
              </span>
            </div>

            <div className="text-sm">
              <span className="text-gray-500">Order Amount: </span>
              <span className="text-gray-900 font-semibold">
                ₹{order.pricing?.total}
              </span>
            </div>

            <div className="text-sm">
              <span className="text-gray-500">Order Time: </span>
              <span className="text-gray-900">
                {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
              </span>
            </div>

            {order.comment && (
              <div className="text-sm">
                <span className="text-gray-500">Comment: </span>
                <span className="text-gray-900">
                  {order.comment}
                </span>
              </div>
            )}

            {order.promoCode && (
              <div className="text-sm">
                <span className="text-gray-500">Promo Code: </span>
                <span className="text-green-600 font-medium">
                  {order.promoCode}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;

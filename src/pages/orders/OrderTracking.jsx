import { useParams } from "react-router-dom";
import { useGetOrderByIdQuery, useCancelOrderMutation } from "../../services/order.service";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import CancelOrderDialog from "../../components/common/CancelOrderDialog";

const OrderTracking = () => {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  // Fetch order initially
  const { data: initialData, isLoading, error, refetch } = useGetOrderByIdQuery(orderId, {
    refetchOnMountOrArgChange: true,
  });

  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  // Set initial order data
  useEffect(() => {
    if (initialData?.data) {
      setOrderData(initialData.data);
    }
  }, [initialData]);

  // Socket.IO real-time updates
  useEffect(() => {
    const socket = io("http://localhost:5001");

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      // Join the order room
      socket.emit("join-order", orderId);
    });

    // Listen for order updates
    socket.on("order-updated", (updatedOrder) => {
      console.log("Order updated via socket:", updatedOrder);
      setOrderData(updatedOrder);
      toast.success("Order status updated!");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    // Cleanup on unmount
    return () => {
      socket.emit("leave-order", orderId);
      socket.disconnect();
    };
  }, [orderId]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "Failed to load order details");
    }
  }, [error]);

  const handleCancelOrder = async () => {
    if (!orderData) return;

    if (orderData.status === "Delivered") {
      toast.error("Cannot cancel a delivered order");
      return;
    }
    if (orderData.status === "Out for delivery") {
      toast.error("Cannot cancel order that is out for delivery");
      return;
    }

    setShowCancelDialog(true);
  };

  const confirmCancelOrder = async () => {
    try {
      const result = await cancelOrder(orderId).unwrap();
      toast.success(result.message || "Order cancelled successfully");
      setShowCancelDialog(false);
      refetch(); // Refresh order data
    } catch (err) {
      toast.error(err?.data?.message || "Failed to cancel order");
      setShowCancelDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen py-8 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  const order = orderData;

  if (!order) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen py-8">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-600">Order not found</p>
          </div>
        </div>
      </div>
    );
  }

  const orderSteps = [
    { id: 1, name: "Received", status: "Received", completed: order.status === "Cancelled" ? false : true },
    { id: 2, name: "Confirmed", status: "Confirmed", completed: order.status === "Cancelled" ? false : ["Confirmed", "Prepared", "Out for delivery", "Delivered"].includes(order.status) },
    { id: 3, name: "Prepared", status: "Prepared", completed: order.status === "Cancelled" ? false : ["Prepared", "Out for delivery", "Delivered"].includes(order.status) },
    { id: 4, name: "Out for delivery", status: "Out for delivery", completed: order.status === "Cancelled" ? false : ["Out for delivery", "Delivered"].includes(order.status) },
    { id: 5, name: "Delivered", status: "Delivered", completed: order.status === "Cancelled" ? false : order.status === "Delivered" },
  ];

  // Calculate progress percentage
  const currentStepIndex = order.status === "Cancelled" ? -1 : orderSteps.findIndex(step => step.status === order.status);
  const progressPercentage = currentStepIndex >= 0 ? (currentStepIndex / (orderSteps.length - 1)) * 100 : 0;

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8">
      {/* Cancel Order Confirmation Dialog */}
      <CancelOrderDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={confirmCancelOrder}
        isLoading={isCancelling}
      />

      <div className="max-w-[1200px] mx-auto px-6 space-y-6">
        {/* Cancelled Order Alert */}
        {order.status === "Cancelled" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <p className="text-red-800 font-medium">This order has been cancelled</p>
            </div>
          </div>
        )}

        {/* Order Status Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Order</h1>
            <p className="text-sm text-gray-600">Track the order status</p>
          </div>

          {/* Order Status Timeline */}
          <div className="flex items-center justify-between relative px-4">
            {/* Progress Line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200 mx-16">
              <div
                className="h-full bg-orange-500 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            {orderSteps.map((step, index) => (
              <div
                key={step.id}
                className="flex flex-col items-center flex-1 relative z-10"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 border-3 ${
                    step.completed
                      ? "bg-orange-500 border-orange-500 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {step.completed ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {step.id === 3 && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      )}
                      {step.id === 4 && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                        />
                      )}
                      {step.id === 5 && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      )}
                    </svg>
                  )}
                </div>
                <span
                  className={`text-xs font-medium ${
                    step.completed ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details Cards */}
        <div className="grid grid-cols-[35%_65%] gap-6">
          {/* Delivery Address Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-[#FAF7F2]">
              Delivery Address
            </h2>
            <div>
              <p className="font-semibold text-gray-900 mb-1">
                {order.customer.firstName} {order.customer.lastName}
              </p>
              <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
            </div>
          </div>

          {/* Your Order Information Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-[#FAF7F2]">
              Your order information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-sm text-gray-900">
                  <span className="text-gray-600">Order reference:</span>{" "}
                  <span className="font-medium">{order._id}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <p className="text-sm text-gray-900">
                  <span className="text-gray-600">Payment status:</span>{" "}
                  <span className={`font-medium ${
                    order.paymentStatus === "PAID" ? "text-green-600" : 
                    order.paymentStatus === "FAILED" ? "text-red-600" :
                    order.paymentStatus === "REFUNDED" ? "text-blue-600" : 
                    "text-yellow-600"
                  }`}>
                    {order.paymentStatus}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p className="text-sm text-gray-900">
                  <span className="text-gray-600">Payment method:</span>{" "}
                  <span className="font-medium uppercase">{order.paymentMode}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm text-gray-900">
                  <span className="text-gray-600">Total amount:</span>{" "}
                  <span className="font-medium">₹{order.pricing.total.toFixed(2)}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm text-gray-900">
                  <span className="text-gray-600">Order time:</span>{" "}
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </p>
              </div>
            </div>

            {/* Cancel Order Button */}
            {order.status !== "Delivered" && order.status !== "Out for delivery" && order.status !== "Cancelled" && (
              <button 
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="mt-6 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold px-6 py-2 rounded-md transition-colors text-sm"
              >
                {isCancelling ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-[#FAF7F2]">
            Order Items
          </h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    {Object.entries(item.customization).map(([key, value]) => (
                      <span key={key} className="mr-2">
                        {key}: {value}
                      </span>
                    ))}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ₹{item.price} × {item.quantity}
                  </p>
                  <p className="text-sm text-gray-600">
                    = ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{order.pricing.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Taxes</span>
              <span className="font-medium">₹{order.pricing.taxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Charges</span>
              <span className="font-medium">₹{order.pricing.deliveryCharges.toFixed(2)}</span>
            </div>
            {order.pricing.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span className="font-medium">-₹{order.pricing.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>₹{order.pricing.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;

import { useParams } from "react-router-dom";

const OrderTracking = () => {
  const { orderId } = useParams();

  const orderSteps = [
    { id: 1, name: "Received", icon: "📦", completed: true },
    { id: 2, name: "Confirmed", icon: "✓", completed: true },
    { id: 3, name: "Prepared", icon: "🍕", completed: false },
    { id: 4, name: "Out for delivery", icon: "🚚", completed: false },
    { id: 5, name: "Delivered", icon: "✓", completed: false },
  ];

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8">
      <div className="max-w-[1200px] mx-auto px-6 space-y-6">
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
                style={{ width: "25%" }}
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
              <p className="font-semibold text-gray-900 mb-1">Rakesh K</p>
              <p className="text-sm text-gray-600">55, high street, Mumbai</p>
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
                  <span className="font-medium">{orderId}</span>
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
                  <span className="font-medium">PAID</span>
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
                  <span className="font-medium">CARD</span>
                </p>
              </div>
            </div>

            {/* Cancel Order Button */}
            <button className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-md transition-colors text-sm">
              Cancel Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;

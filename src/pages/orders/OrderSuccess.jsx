import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVerifyPaymentMutation } from "../../services/payment.service";
import { toast } from "react-hot-toast";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifyPayment, { isLoading }] = useVerifyPaymentMutation();
  const [orderReference, setOrderReference] = useState("");
  const [paymentVerified, setPaymentVerified] = useState(false);

  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    const verifyStripePayment = async () => {
      if (sessionId && orderId) {
        try {
          const result = await verifyPayment({ sessionId, orderId }).unwrap();
          setOrderReference(result.data.order._id);
          setPaymentVerified(true);
          toast.success("Payment verified successfully!");
        } catch (error) {
          toast.error("Payment verification failed");
          navigate("/checkout");
        }
      } else if (orderId) {
        // Cash payment - no verification needed
        setOrderReference(orderId);
        setPaymentVerified(true);
      }
    };

    verifyStripePayment();
  }, [sessionId, orderId, verifyPayment, navigate]);

  if (isLoading || !paymentVerified) {
    return (
      <div className="bg-[#FAF7F2] h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] h-screen flex items-center justify-center overflow-hidden px-6">
      <div className="max-w-2xl w-full text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order placed successfully.
        </h1>
        <p className="text-gray-600 mb-8">Thank you for your order.</p>

        {/* Order Information Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-orange-500"
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
              <span className="font-semibold text-gray-900">
                Your order information
              </span>
            </div>
            <span className="text-sm text-green-600 font-medium">
              Confirmed
            </span>
          </div>

          <div className="space-y-3 text-left">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-gray-400 mt-0.5"
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
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="text-gray-600">Order reference:</span>{" "}
                  <button
                    onClick={() => navigate(`/order/${orderReference}`)}
                    className="font-medium text-orange-500 hover:text-orange-600 underline"
                  >
                    {orderReference}
                  </button>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-gray-400 mt-0.5"
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
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="text-gray-600">Payment status:</span>{" "}
                  <span className="font-medium">Paid</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => navigate(`/order/${orderReference}`)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-md transition-colors inline-flex items-center gap-2"
          >
            View Order Details
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-3 rounded-md transition-colors border border-gray-300 inline-flex items-center gap-2"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

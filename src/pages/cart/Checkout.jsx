import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetCartQuery } from "../../services/cart.service";
import { useCreateOrderMutation } from "../../services/order.service";
import { useValidatePromoMutation } from "../../services/promo.service";
import { useCreateCheckoutSessionMutation } from "../../services/payment.service";
import { useGetProfileQuery, useUpdateProfileMutation } from "../../services/user.service";
import { toast } from "react-hot-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.data);

  const { data: cartData, isLoading: cartLoading } = useGetCartQuery();
  const { data: profileData } = useGetProfileQuery();
  const [createOrder, { isLoading: orderLoading }] = useCreateOrderMutation();
  const [validatePromo, { isLoading: promoLoading }] =
    useValidatePromoMutation();
  const [createCheckoutSession, { isLoading: checkoutLoading }] =
    useCreateCheckoutSessionMutation();
  const [updateProfile] = useUpdateProfileMutation();

  const userAddresses = profileData?.data?.addresses || [];
  const defaultAddress = userAddresses.find(addr => addr.isDefault);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    address: defaultAddress?.address || "",
    paymentMode: "card",
    comment: "",
  });

  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddress?._id || null);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [setAsDefault, setSetAsDefault] = useState(false);

  const cartItems = cartData?.data?.items || [];

  // Update address when profile loads
  useEffect(() => {
    if (userAddresses.length > 0 && !formData.address) {
      const defaultAddr = userAddresses.find(addr => addr.isDefault) || userAddresses[0];
      setFormData(prev => ({ ...prev, address: defaultAddr.address }));
      setSelectedAddressId(defaultAddr._id);
    }
  }, [userAddresses, formData.address]);

  // Calculate order summary
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const taxes = Math.round(subtotal * 0.18); // 18% tax
  const deliveryCharges = 100;
  const total = subtotal + taxes + deliveryCharges - discount;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddressSelect = (addressId, addressText) => {
    setSelectedAddressId(addressId);
    setFormData({ ...formData, address: addressText });
  };

  const handleSaveNewAddress = async () => {
    if (!newAddress.trim()) {
      toast.error("Please enter an address");
      return;
    }

    try {
      const updatedAddresses = [
        ...userAddresses.map(addr => ({ ...addr, isDefault: false })),
        { address: newAddress, isDefault: setAsDefault }
      ];

      await updateProfile({ addresses: updatedAddresses }).unwrap();
      setFormData({ ...formData, address: newAddress });
      setIsAddressDialogOpen(false);
      setNewAddress("");
      setSetAsDefault(false);
      toast.success("Address added successfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save address");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      const result = await validatePromo({
        code: couponCode,
        orderAmount: subtotal,
      }).unwrap();
      setDiscount(result.data.discount);
      toast.success("Coupon applied successfully!");
    } catch (error) {
      toast.error(error.data?.message || "Invalid coupon code");
      setDiscount(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if cart is empty
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
      return;
    }

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.address
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const orderData = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        },
        deliveryAddress: formData.address,
        paymentMode: formData.paymentMode,
        comment: formData.comment,
        promoCode: couponCode,
      };

      // Create order first
      const result = await createOrder(orderData).unwrap();
      const orderId = result.data._id;

      // If payment mode is card, redirect to Stripe
      if (formData.paymentMode === "card") {
        const checkoutResult = await createCheckoutSession(orderId).unwrap();
        // Redirect to Stripe checkout
        window.location.href = checkoutResult.data.url;
      } else {
        // For cash payment, directly go to success page
        toast.success("Order placed successfully!");
        navigate("/order-success", { state: { orderId } });
      }
    } catch (error) {
      toast.error(error.data?.message || "Failed to place order");
    }
  };

  if (cartLoading) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen py-8">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8">
          {/* Left Side - Customer Details */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Customer details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Address */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Address *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAddressDialogOpen(true)}
                    className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                  >
                    + Add New Address
                  </button>
                </div>
                
                {userAddresses.length > 0 ? (
                  <div className="space-y-3">
                    {userAddresses.map((addr) => (
                      <div
                        key={addr._id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedAddressId === addr._id
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                        onClick={() => handleAddressSelect(addr._id, addr.address)}
                      >
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="selectedAddress"
                            checked={selectedAddressId === addr._id}
                            onChange={() => handleAddressSelect(addr._id, addr.address)}
                            className="mt-0.5 w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                          />
                          <div className="flex-1">
                            <span className="text-sm text-gray-700">{addr.address}</span>
                            {addr.isDefault && (
                              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <p className="text-gray-500 text-sm mb-2">No saved addresses</p>
                    <button
                      type="button"
                      onClick={() => setIsAddressDialogOpen(true)}
                      className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                    >
                      Add your first address
                    </button>
                  </div>
                )}
              </div>

              {/* Payment Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Mode *
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, paymentMode: "card" })
                    }
                    className={`flex items-center gap-2 px-6 py-2 border rounded-md transition-colors ${
                      formData.paymentMode === "card"
                        ? "border-orange-500 bg-orange-50 text-orange-600"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
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
                    Card
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, paymentMode: "cash" })
                    }
                    className={`flex items-center gap-2 px-6 py-2 border rounded-md transition-colors ${
                      formData.paymentMode === "cash"
                        ? "border-orange-500 bg-orange-50 text-orange-600"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
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
                    Cash
                  </button>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>
            </form>
          </div>

          {/* Right Side - Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ₹{subtotal}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes (18%)</span>
                  <span className="font-semibold text-gray-900">₹{taxes}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery charges</span>
                  <span className="font-semibold text-gray-900">
                    ₹{deliveryCharges}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-semibold text-green-600">
                      -₹{discount}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Order total</span>
                  <span className="font-bold text-gray-900 text-lg">
                    ₹{total}
                  </span>
                </div>
              </div>

              {/* Coupon Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    placeholder="Coupon code"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={promoLoading}
                    className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {promoLoading ? "..." : "Apply"}
                  </button>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handleSubmit}
                disabled={
                  orderLoading || checkoutLoading || cartItems.length === 0
                }
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {orderLoading || checkoutLoading
                  ? "Processing..."
                  : formData.paymentMode === "card"
                  ? "Proceed to Payment"
                  : "Place order"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Address Dialog */}
      {isAddressDialogOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setIsAddressDialogOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Add Address</h3>
                <p className="text-sm text-gray-600">
                  Enter your delivery address
                </p>
              </div>
              <button
                onClick={() => setIsAddressDialogOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-orange-500 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                placeholder="Enter your address..."
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={setAsDefault}
                  onChange={(e) => setSetAsDefault(e.target.checked)}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Set as default address</span>
              </label>
            </div>

            <button
              onClick={handleSaveNewAddress}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-md transition-colors"
            >
              Save address
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;

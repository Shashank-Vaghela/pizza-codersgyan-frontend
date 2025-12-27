import { useNavigate } from "react-router-dom";
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveFromCartMutation } from "../../services/cart.service";
import { toast } from "react-hot-toast";
import mineralWater from "../../assets/img/mineral-water.png";
import periPeriPizza from "../../assets/img/Peri-Peri.png";

const CartPage = () => {
  const navigate = useNavigate();
  const { data: cartData, isLoading, isError } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const cartItems = cartData?.data?.items || [];

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await updateCartItem({ itemId, quantity: newQuantity }).unwrap();
    } catch (error) {
      toast.error(error.data?.message || "Failed to update quantity");
    }
  };

  const removeItem = async (itemId) => {
    try {
      await removeFromCart(itemId).unwrap();
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error(error.data?.message || "Failed to remove item");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getCustomizationText = (item) => {
    if (!item.customization) return "";
    const customization = item.customization;
    return Object.values(customization).join(", ");
  };

  if (isLoading) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen py-8">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Loading cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen py-8">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center py-12">
            <p className="text-red-500">Failed to load cart. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen py-8">
        <div className="max-w-[1200px] mx-auto px-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping cart</h1>
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Add some delicious items to get started!</p>
            <button
              onClick={() => navigate("/")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium"
            >
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Shopping cart</h1>
        </div>

        {/* Cart Items and Total */}
        <div className="bg-white rounded-lg shadow-sm">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-6 p-6 border-b border-gray-200"
            >
              {/* Product Image */}
              <div className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg p-2">
                <img
                  src={item.image || (item.category === "pizza" ? periPeriPizza : mineralWater)}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1 text-sm">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-500">{getCustomizationText(item)}</p>
              </div>

              {/* Quantity Controls */}
              <div
                className="flex items-center bg-gray-100 rounded-full px-2 py-1.5"
                style={{ display: "flex", alignItems: "center" }}
              >
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="text-gray-600 hover:text-gray-900 transition-colors w-6 h-6"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: "1",
                  }}
                >
                  −
                </button>
                <span
                  className="text-gray-900 font-medium w-8 text-sm"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: "1",
                  }}
                >
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="text-gray-600 hover:text-gray-900 transition-colors w-6 h-6"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: "1",
                  }}
                >
                  +
                </button>
              </div>

              {/* Price */}
              <div className="w-16 text-right font-bold text-gray-900 text-sm">
                ₹{item.price * item.quantity}
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeItem(item._id)}
                className="text-gray-400 hover:text-gray-600 text-lg ml-2"
              >
                ×
              </button>
            </div>
          ))}

          {/* Total and Checkout */}
          <div className="p-6 flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900">
              ₹{calculateTotal()}
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-md transition-colors flex items-center gap-2 text-sm"
            >
              Checkout
              <span className="text-lg">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

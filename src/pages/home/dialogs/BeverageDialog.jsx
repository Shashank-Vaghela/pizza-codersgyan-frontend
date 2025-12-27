import { useState, useEffect } from "react";
import { useAddToCartMutation } from "../../../services/cart.service";
import { toast } from "react-hot-toast";
import cartIcon from "../../../assets/img/cart-icon.svg";

const BeverageDialog = ({ isOpen, onClose, beverage }) => {
  const [selectedSize, setSelectedSize] = useState("ml330");
  const [selectedTemp, setSelectedTemp] = useState("cold");
  const [addToCart, { isLoading }] = useAddToCartMutation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Reset to defaults when dialog opens
      setSelectedSize("ml330");
      setSelectedTemp("cold");
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const calculateTotal = () => {
    if (!beverage?.pricing) return 0;
    
    const pricing = beverage.pricing;
    let total = 0;
    
    // Add size price
    if (pricing[selectedSize]) {
      total += pricing[selectedSize];
    }
    
    // Add chilling price
    if (pricing[selectedTemp]) {
      total += pricing[selectedTemp];
    }
    
    return total;
  };

  const handleAddToCart = async () => {
    try {
      await addToCart({
        productId: beverage._id,
        customization: {
          size: selectedSize,
          chilling: selectedTemp,
        },
        quantity: 1,
      }).unwrap();
      
      toast.success("Beverage added to cart!");
      onClose();
    } catch (error) {
      toast.error(error.data?.message || "Failed to add to cart");
    }
  };

  if (!isOpen || !beverage) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white rounded-lg max-w-2xl w-full overflow-hidden shadow-2xl">
        <div className="grid grid-cols-[35%_65%]">
          {/* Left Side - White background with image */}
          <div className="bg-white p-8 flex items-center justify-center">
            <img
              src={beverage.image}
              alt={beverage.name}
              className="w-full h-auto object-contain max-h-80"
            />
          </div>

          {/* Right Side - Beige/Cream background with details */}
          <div className="bg-[#FAF7F2] p-8 relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>

            {/* Product Name */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {beverage.name}
            </h2>

            {/* Product Description */}
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              {beverage.description}
            </p>

            {/* Choose the Size */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Choose the Size
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedSize("ml100")}
                  className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                    selectedSize === "ml100"
                      ? "border-orange-500 text-orange-500"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  100ml
                </button>
                <button
                  onClick={() => setSelectedSize("ml330")}
                  className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                    selectedSize === "ml330"
                      ? "border-orange-500 text-orange-500"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  330ml
                </button>
                <button
                  onClick={() => setSelectedSize("ml500")}
                  className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                    selectedSize === "ml500"
                      ? "border-orange-500 text-orange-500"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  500ml
                </button>
              </div>
            </div>

            {/* Choose the Chilling */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Choose the Chilling
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedTemp("warm")}
                  className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors capitalize ${
                    selectedTemp === "warm"
                      ? "border-orange-500 text-orange-500"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  Warm
                </button>
                <button
                  onClick={() => setSelectedTemp("cold")}
                  className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors capitalize ${
                    selectedTemp === "cold"
                      ? "border-orange-500 text-orange-500"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  Cold
                </button>
              </div>
            </div>

            {/* Price and Add to Cart */}
            <div className="flex items-center justify-between mt-8">
              <span className="text-2xl font-bold text-gray-900">
                ₹{calculateTotal()}
              </span>
              <button 
                onClick={handleAddToCart}
                disabled={isLoading}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-md transition-colors text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <img
                  src={cartIcon}
                  alt="Cart"
                  className="w-4 h-4 brightness-0 invert"
                />
                {isLoading ? "Adding..." : "Add to cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeverageDialog;

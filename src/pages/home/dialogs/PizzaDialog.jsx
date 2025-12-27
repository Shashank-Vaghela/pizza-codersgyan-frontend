import { useState, useEffect } from "react";
import { useAddToCartMutation } from "../../../services/cart.service";
import { toast } from "react-hot-toast";
import cartIcon from "../../../assets/img/cart-icon.svg";

const PizzaDialog = ({ isOpen, onClose, pizza }) => {
  const [selectedSize, setSelectedSize] = useState("small");
  const [selectedCrust, setSelectedCrust] = useState("thin");
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [addToCart, { isLoading }] = useAddToCartMutation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Reset to defaults when dialog opens
      setSelectedSize("small");
      setSelectedCrust("thin");
      setSelectedToppings([]);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleTopping = (topping) => {
    setSelectedToppings((prev) => {
      const exists = prev.find((t) => t.name === topping.name);
      if (exists) {
        return prev.filter((t) => t.name !== topping.name);
      } else {
        return [...prev, topping];
      }
    });
  };

  const isToppingSelected = (toppingName) => {
    return selectedToppings.some((t) => t.name === toppingName);
  };

  const calculateTotal = () => {
    if (!pizza?.pricing) return 0;

    const pricing = pizza.pricing;
    let total = 0;

    // Add size price
    if (pricing[selectedSize]) {
      total += pricing[selectedSize];
    }

    // Add crust price
    if (pricing[selectedCrust]) {
      total += pricing[selectedCrust];
    }

    // Add toppings price
    selectedToppings.forEach((topping) => {
      total += topping.price;
    });

    return total;
  };

  const handleAddToCart = async () => {
    try {
      const customization = {
        size: selectedSize,
        crust: selectedCrust,
      };

      // Add toppings to customization if any selected
      if (selectedToppings.length > 0) {
        customization.toppings = selectedToppings.map((t) => t.name).join(", ");
      }

      await addToCart({
        productId: pizza._id,
        customization,
        quantity: 1,
      }).unwrap();

      toast.success("Pizza added to cart!");
      onClose();
    } catch (error) {
      toast.error(error.data?.message || "Failed to add to cart");
    }
  };

  if (!isOpen || !pizza) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white rounded-lg max-w-3xl w-full overflow-hidden shadow-2xl">
        <div className="grid grid-cols-[35%_65%]">
          {/* Left Side - White background with image */}
          <div className="bg-white p-8 flex items-center justify-center">
            <img
              src={pizza.image}
              alt={pizza.name}
              className="w-full h-auto object-contain max-h-80"
            />
          </div>

          {/* Right Side - Beige/Cream background with details */}
          <div className="bg-[#FAF7F2] p-8 relative max-h-[600px] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>

            {/* Product Name */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {pizza.name}
            </h2>

            {/* Product Description */}
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              {pizza.description}
            </p>

            {/* Choose the Size */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Choose the Size
              </h3>
              <div className="flex gap-3">
                {["small", "medium", "large"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-2 border rounded-md text-sm font-medium transition-colors capitalize ${
                      selectedSize === size
                        ? "border-orange-500 text-orange-500"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Choose the Crust */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Choose the Crust
              </h3>
              <div className="flex gap-3">
                {["thin", "thick"].map((crust) => (
                  <button
                    key={crust}
                    onClick={() => setSelectedCrust(crust)}
                    className={`px-6 py-2 border rounded-md text-sm font-medium transition-colors capitalize ${
                      selectedCrust === crust
                        ? "border-orange-500 text-orange-500"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {crust}
                  </button>
                ))}
              </div>
            </div>

            {/* Extra Toppings */}
            {pizza.toppings && pizza.toppings.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Extra toppings
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {pizza.toppings.map((topping, index) => (
                    <button
                      key={index}
                      onClick={() => toggleTopping(topping)}
                      className={`flex flex-col items-center p-3 border rounded-lg transition-all ${
                        isToppingSelected(topping.name)
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {topping.image && (
                        <img
                          src={topping.image}
                          alt={topping.name}
                          className="w-12 h-12 object-cover rounded mb-2"
                        />
                      )}
                      <span className="text-xs font-medium text-gray-900">
                        {topping.name}
                      </span>
                      <span className="text-xs text-gray-600">
                        ₹{topping.price}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

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

export default PizzaDialog;

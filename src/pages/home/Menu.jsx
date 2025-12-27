import { useState } from "react";
import { useGetPublishedProductsQuery } from "../../services/product.service";
import periPeriPizza from "../../assets/img/Peri-Peri.png";
import mineralWater from "../../assets/img/mineral-water.png";
import BeverageDialog from "./dialogs/BeverageDialog";
import PizzaDialog from "./dialogs/PizzaDialog";

const Menu = () => {
  const [activeTab, setActiveTab] = useState("pizza");
  const [selectedBeverage, setSelectedBeverage] = useState(null);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [isBeverageDialogOpen, setIsBeverageDialogOpen] = useState(false);
  const [isPizzaDialogOpen, setIsPizzaDialogOpen] = useState(false);

  // Fetch products from API
  const { data: productsData, isLoading, isError } = useGetPublishedProductsQuery();

  // Filter products by category
  const pizzas = productsData?.data?.filter((product) => product.category === "pizza") || [];
  const beverages = productsData?.data?.filter((product) => product.category === "beverages") || [];

  // Helper function to get base price from pricing
  const getBasePrice = (product) => {
    if (!product.pricing) return 0;
    const pricing = product.pricing;
    
    if (product.category === "pizza") {
      return pricing.small || pricing.medium || pricing.large || 0;
    } else {
      return pricing.ml100 || pricing.ml330 || pricing.ml500 || 0;
    }
  };

  if (isLoading) {
    return (
      <section className="bg-[#FAF7F2] py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Loading menu...</p>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="bg-[#FAF7F2] py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center py-12">
            <p className="text-red-500">Failed to load menu. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#FAF7F2] py-16">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-12">
          <button
            onClick={() => setActiveTab("pizza")}
            className={`px-5 py-2 text-sm font-medium rounded-md transition-all border ${
              activeTab === "pizza"
                ? "bg-[#F5F0E8] text-gray-900 border-[#E8DFD0]"
                : "bg-transparent text-gray-600 hover:bg-[#F5F0E8] border-[#E8DFD0]"
            }`}
          >
            Pizza
          </button>
          <button
            onClick={() => setActiveTab("beverages")}
            className={`px-5 py-2 text-sm font-medium rounded-md transition-all border ${
              activeTab === "beverages"
                ? "bg-[#F5F0E8] text-gray-900 border-[#E8DFD0]"
                : "bg-transparent text-gray-600 hover:bg-[#F5F0E8] border-[#E8DFD0]"
            }`}
          >
            Beverages
          </button>
        </div>

        {/* Pizza Content */}
        {activeTab === "pizza" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pizzas.map((pizza) => (
              <div
                key={pizza.id}
                className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                {/* Pizza Image */}
                <div className="aspect-square mb-4 flex items-center justify-center">
                  <img
                    src={pizza.image || periPeriPizza}
                    alt={pizza.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Pizza Name */}
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {pizza.name}
                </h3>

                {/* Description - 3-4 lines */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                  {pizza.description}
                </p>

                {/* Price and Choose Button */}
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-gray-900 font-semibold">
                    From ₹{getBasePrice(pizza)}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedPizza(pizza);
                      setIsPizzaDialogOpen(true);
                    }}
                    className="bg-[#FFD7B5] text-gray-900 font-medium px-5 py-2 rounded-full text-sm cursor-pointer"
                  >
                    Choose
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Beverages Content */}
        {activeTab === "beverages" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {beverages.map((beverage) => (
              <div
                key={beverage.id}
                className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                {/* Beverage Image */}
                <div className="aspect-square mb-4 flex items-center justify-center">
                  <img
                    src={beverage.image || mineralWater}
                    alt={beverage.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Beverage Name */}
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {beverage.name}
                </h3>

                {/* Description - 3-4 lines */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                  {beverage.description}
                </p>

                {/* Price and Choose Button */}
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-gray-900 font-semibold">
                    From ₹{getBasePrice(beverage)}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedBeverage(beverage);
                      setIsBeverageDialogOpen(true);
                    }}
                    className="bg-[#FFD7B5] text-gray-900 font-medium px-5 py-2 rounded-full text-sm cursor-pointer"
                  >
                    Choose
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pizza Dialog */}
      <PizzaDialog
        isOpen={isPizzaDialogOpen}
        onClose={() => setIsPizzaDialogOpen(false)}
        pizza={selectedPizza}
      />

      {/* Beverage Dialog */}
      <BeverageDialog
        isOpen={isBeverageDialogOpen}
        onClose={() => setIsBeverageDialogOpen(false)}
        beverage={selectedBeverage}
      />
    </section>
  );
};

export default Menu;

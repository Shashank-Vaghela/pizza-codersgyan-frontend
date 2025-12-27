import { useState } from "react";
import { useUploadImageMutation } from "../../../../services/upload.service";
import { toast } from "react-hot-toast";

const ProductFormDrawer = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  imagePreview,
  setImagePreview,
  selectedProduct,
  isSubmitting,
}) => {
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const [toppingForm, setToppingForm] = useState({ name: "", price: "", image: "" });
  const [editingToppingIndex, setEditingToppingIndex] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      setImagePreview(base64String);

      try {
        const result = await uploadImage(base64String).unwrap();
        setFormData({ ...formData, image: result.data.url });
        toast.success("Image uploaded successfully!");
      } catch (error) {
        toast.error(error.data?.message || "Failed to upload image");
        setImagePreview("");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleToppingImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      try {
        const result = await uploadImage(base64String).unwrap();
        setToppingForm({ ...toppingForm, image: result.data.url });
        toast.success("Topping image uploaded!");
      } catch (error) {
        toast.error(error.data?.message || "Failed to upload image");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddTopping = () => {
    if (!toppingForm.name || !toppingForm.price) {
      toast.error("Please fill topping name and price");
      return;
    }

    const newTopping = {
      name: toppingForm.name,
      price: Number(toppingForm.price),
      image: toppingForm.image || "",
    };

    if (editingToppingIndex !== null) {
      const updatedToppings = [...formData.toppings];
      updatedToppings[editingToppingIndex] = newTopping;
      setFormData({ ...formData, toppings: updatedToppings });
      setEditingToppingIndex(null);
    } else {
      setFormData({ ...formData, toppings: [...formData.toppings, newTopping] });
    }

    setToppingForm({ name: "", price: "", image: "" });
  };

  const handleEditTopping = (index) => {
    const topping = formData.toppings[index];
    setToppingForm(topping);
    setEditingToppingIndex(index);
  };

  const handleDeleteTopping = (index) => {
    const updatedToppings = formData.toppings.filter((_, i) => i !== index);
    setFormData({ ...formData, toppings: updatedToppings });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-gray-50 shadow-xl z-50 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedProduct ? "Edit Product" : "Add Product"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Submit"}
            </button>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Product info
          </h3>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  * Product name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
                {!formData.name && (
                  <p className="text-xs text-red-500 mt-1">
                    Product name is required
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  * Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select category</option>
                  <option value="pizza">Pizza</option>
                  <option value="beverages">Beverages</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                * Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                rows={4}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Product Image Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Product image
          </h3>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="space-y-4">
              {/* Image Preview */}
              {imagePreview && (
                <div className="flex justify-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}

              {/* Upload Button */}
              <div>
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-gray-600">
                          Uploading...
                        </span>
                      </>
                    ) : (
                      <>
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
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">
                          Upload Image
                        </span>
                      </>
                    )}
                  </div>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Max size: 5MB. Supported formats: JPG, PNG, GIF
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Price Section - Dynamic based on category */}
        {formData.category && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Product price
            </h3>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              {formData.category === "pizza" ? (
                <>
                  {/* Size (base) */}
                  <div className="mb-6">
                    <label className="block text-xs text-gray-600 mb-3">
                      Size (base) *
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-700 mb-1">
                          Small
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={formData.pricing.small}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pricing: {
                                  ...formData.pricing,
                                  small: e.target.value,
                                },
                              })
                            }
                            placeholder="400"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="absolute right-3 top-2 text-sm text-gray-400">
                            ₹
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-700 mb-1">
                          Medium
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={formData.pricing.medium}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pricing: {
                                  ...formData.pricing,
                                  medium: e.target.value,
                                },
                              })
                            }
                            placeholder="500"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="absolute right-3 top-2 text-sm text-gray-400">
                            ₹
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-700 mb-1">
                          Large
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={formData.pricing.large}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pricing: {
                                  ...formData.pricing,
                                  large: e.target.value,
                                },
                              })
                            }
                            placeholder="600"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="absolute right-3 top-2 text-sm text-gray-400">
                            ₹
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Crust (additional) */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-3">
                      Crust (additional)
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-700 mb-1">
                          Thin
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={formData.pricing.thin}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pricing: {
                                  ...formData.pricing,
                                  thin: e.target.value,
                                },
                              })
                            }
                            placeholder="0"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="absolute right-3 top-2 text-sm text-gray-400">
                            ₹
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-700 mb-1">
                          Thick
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={formData.pricing.thick}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pricing: {
                                  ...formData.pricing,
                                  thick: e.target.value,
                                },
                              })
                            }
                            placeholder="50"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="absolute right-3 top-2 text-sm text-gray-400">
                            ₹
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Size (base) for beverages */}
                  <div className="mb-6">
                    <label className="block text-xs text-gray-600 mb-3">
                      Size (base) *
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-700 mb-1">
                          100ml
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={formData.pricing.ml100}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pricing: {
                                  ...formData.pricing,
                                  ml100: e.target.value,
                                },
                              })
                            }
                            placeholder="20"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="absolute right-3 top-2 text-sm text-gray-400">
                            ₹
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-700 mb-1">
                          330ml
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={formData.pricing.ml330}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pricing: {
                                  ...formData.pricing,
                                  ml330: e.target.value,
                                },
                              })
                            }
                            placeholder="40"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="absolute right-3 top-2 text-sm text-gray-400">
                            ₹
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-700 mb-1">
                          500ml
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={formData.pricing.ml500}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pricing: {
                                  ...formData.pricing,
                                  ml500: e.target.value,
                                },
                              })
                            }
                            placeholder="60"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="absolute right-3 top-2 text-sm text-gray-400">
                            ₹
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Chilling (additional) */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-3">
                      Chilling (additional)
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-700 mb-1">
                          Warm
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={formData.pricing.warm}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pricing: {
                                  ...formData.pricing,
                                  warm: e.target.value,
                                },
                              })
                            }
                            placeholder="0"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="absolute right-3 top-2 text-sm text-gray-400">
                            ₹
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-700 mb-1">
                          Cold
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={formData.pricing.cold}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pricing: {
                                  ...formData.pricing,
                                  cold: e.target.value,
                                },
                              })
                            }
                            placeholder="10"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="absolute right-3 top-2 text-sm text-gray-400">
                            ₹
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Toppings Section - Only for Pizza */}
        {formData.category === "pizza" && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Extra toppings
            </h3>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              {/* Add Topping Form */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="Topping name (e.g., Chicken)"
                    value={toppingForm.name}
                    onChange={(e) => setToppingForm({ ...toppingForm, name: e.target.value })}
                    className="px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Price (e.g., 90)"
                    value={toppingForm.price}
                    onChange={(e) => setToppingForm({ ...toppingForm, price: e.target.value })}
                    className="px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleToppingImageUpload}
                      className="hidden"
                    />
                    <div className="px-3 py-2 text-sm border border-gray-300 rounded cursor-pointer hover:bg-gray-100 text-center">
                      {toppingForm.image ? "✓ Image" : "Upload Image"}
                    </div>
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleAddTopping}
                  className="w-full px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                  {editingToppingIndex !== null ? "Update Topping" : "+ Add Topping"}
                </button>
              </div>

              {/* Toppings List */}
              {formData.toppings.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {formData.toppings.map((topping, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3 text-center">
                      {topping.image && (
                        <img src={topping.image} alt={topping.name} className="w-16 h-16 object-cover rounded mx-auto mb-2" />
                      )}
                      <p className="text-sm font-medium text-gray-900">{topping.name}</p>
                      <p className="text-xs text-gray-600">₹{topping.price}</p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleEditTopping(index)}
                          className="flex-1 text-xs text-blue-500 hover:text-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTopping(index)}
                          className="flex-1 text-xs text-red-500 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Attributes Section - Dynamic based on category */}
        {formData.category && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Attributes
            </h3>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              {/* Is Hit Toggle */}
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <span className="text-sm text-gray-700">Is Hit</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.isHit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isHit: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-red-500 transition-colors"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </div>
                </label>
              </div>

              {/* Spiciness or Alcohol */}
              {formData.category === "pizza" ? (
                <div>
                  <label className="block text-xs text-gray-600 mb-2">
                    * Spiciness
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          spiciness: "non-spicy",
                        })
                      }
                      className={`px-4 py-2 text-sm rounded border ${
                        formData.spiciness === "non-spicy"
                          ? "border-red-500 text-red-500 bg-red-50"
                          : "border-gray-300 text-gray-700"
                      }`}
                    >
                      Non-Spicy
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, spiciness: "spicy" })
                      }
                      className={`px-4 py-2 text-sm rounded border ${
                        formData.spiciness === "spicy"
                          ? "border-red-500 text-red-500 bg-red-50"
                          : "border-gray-300 text-gray-700"
                      }`}
                    >
                      Spicy
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs text-gray-600 mb-2">
                    * Alcohol
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          alcohol: "non-alcoholic",
                        })
                      }
                      className={`px-4 py-2 text-sm rounded border ${
                        formData.alcohol === "non-alcoholic"
                          ? "border-red-500 text-red-500 bg-red-50"
                          : "border-gray-300 text-gray-700"
                      }`}
                    >
                      Non-Alcoholic
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, alcohol: "alcoholic" })
                      }
                      className={`px-4 py-2 text-sm rounded border ${
                        formData.alcohol === "alcoholic"
                          ? "border-red-500 text-red-500 bg-red-50"
                          : "border-gray-300 text-gray-700"
                      }`}
                    >
                      Alcoholic
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Other Properties Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Other properties
          </h3>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      published: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-500 transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              </div>
              <span className="text-sm text-gray-700">Published</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFormDrawer;

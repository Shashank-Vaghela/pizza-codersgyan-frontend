import { useState } from "react";
import {
  useGetAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../../../services/product.service";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import heroPizza from "../../../assets/img/hero-pizza.png";
import ProductDeleteDialog from "./dialogs/ProductDeleteDialog";
import ProductFormDrawer from "./dialogs/ProductFormDrawer";
import CustomPagination from "../../../components/common/CustomPagination";

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showOnlyPublished, setShowOnlyPublished] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    image: "",
    published: false,
    isHit: false,
    spiciness: "non-spicy",
    alcohol: "non-alcoholic",
    pricing: {
      small: "",
      medium: "",
      large: "",
      thin: "",
      thick: "",
      ml100: "",
      ml330: "",
      ml500: "",
      warm: "",
      cold: "",
    },
    toppings: [],
  });

  const { data: productsData, isLoading } = useGetAllProductsQuery({
    category: selectedCategory,
    published: showOnlyPublished ? true : undefined,
    search: searchTerm,
  });

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const allProducts = productsData?.data || [];

  // Pagination logic
  const totalItems = allProducts.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const products = allProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    const pricing = product.pricing || {};
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      image: product.image || "",
      published: product.published,
      isHit: product.attributes?.isHit || false,
      spiciness: product.attributes?.spiciness || "non-spicy",
      alcohol: product.attributes?.alcohol || "non-alcoholic",
      pricing: {
        small: pricing.small || "",
        medium: pricing.medium || "",
        large: pricing.large || "",
        thin: pricing.thin || "",
        thick: pricing.thick || "",
        ml100: pricing.ml100 || "",
        ml330: pricing.ml330 || "",
        ml500: pricing.ml500 || "",
        warm: pricing.warm || "",
        cold: pricing.cold || "",
      },
      toppings: product.toppings || [],
    });
    setImagePreview(product.image || "");
    setIsDrawerOpen(true);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setFormData({
      name: "",
      category: "",
      description: "",
      image: "",
      published: false,
      isHit: false,
      spiciness: "non-spicy",
      alcohol: "non-alcoholic",
      pricing: {
        small: "",
        medium: "",
        large: "",
        thin: "",
        thick: "",
        ml100: "",
        ml330: "",
        ml500: "",
        warm: "",
        cold: "",
      },
      toppings: [],
    });
    setImagePreview("");
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProduct(null);
    setImagePreview("");
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.category || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Build pricing object based on category
    const pricing = {};
    if (formData.category === "pizza") {
      if (
        !formData.pricing.small ||
        !formData.pricing.medium ||
        !formData.pricing.large
      ) {
        toast.error("Please fill in all pizza size prices");
        return;
      }
      pricing.small = Number(formData.pricing.small);
      pricing.medium = Number(formData.pricing.medium);
      pricing.large = Number(formData.pricing.large);
      pricing.thin = Number(formData.pricing.thin) || 0;
      pricing.thick = Number(formData.pricing.thick) || 0;
    } else if (formData.category === "beverages") {
      if (
        !formData.pricing.ml100 ||
        !formData.pricing.ml330 ||
        !formData.pricing.ml500
      ) {
        toast.error("Please fill in all beverage size prices");
        return;
      }
      pricing.ml100 = Number(formData.pricing.ml100);
      pricing.ml330 = Number(formData.pricing.ml330);
      pricing.ml500 = Number(formData.pricing.ml500);
      pricing.warm = Number(formData.pricing.warm) || 0;
      pricing.cold = Number(formData.pricing.cold) || 0;
    }

    const productData = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      image: formData.image || "https://via.placeholder.com/150",
      pricing,
      toppings: formData.category === "pizza" ? formData.toppings : [],
      attributes: {
        isHit: formData.isHit,
        spiciness:
          formData.category === "pizza" ? formData.spiciness : undefined,
        alcohol:
          formData.category === "beverages" ? formData.alcohol : undefined,
      },
      published: formData.published,
    };

    try {
      if (selectedProduct) {
        await updateProduct({
          id: selectedProduct._id,
          ...productData,
        }).unwrap();
        toast.success("Product updated successfully!");
      } else {
        await createProduct(productData).unwrap();
        toast.success("Product created successfully!");
      }
      closeDrawer();
    } catch (error) {
      toast.error(error.data?.message || "Failed to save product");
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete._id).unwrap();
      toast.success("Product deleted successfully!");
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete product");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <span className="hover:text-gray-900 cursor-pointer">Dashboard</span>
        <span>&gt;</span>
        <span className="text-gray-900 font-medium">Products</span>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="absolute right-3 top-2.5 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              <option value="pizza">Pizza</option>
              <option value="beverages">Beverages</option>
            </select>

            {/* Show only published toggle switch */}
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showOnlyPublished}
                  onChange={(e) => setShowOnlyPublished(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-blue-500 transition-colors"></div>
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
              </div>
              <span className="text-sm text-gray-600">Show only published</span>
            </label>
          </div>

          {/* Add Product Button */}
          <button
            onClick={handleAddProduct}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                      Product Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                      CreatedAt
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image || heroPizza}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded bg-gray-100"
                          />
                          <span className="text-xs text-gray-900">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 capitalize">
                        {product.category}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 max-w-xs truncate">
                        {product.description}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-1 rounded inline-block ${
                            product.published
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {product.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-900">
                        {format(
                          new Date(product.createdAt),
                          "dd/MM/yyyy HH:mm"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-xs text-red-500 hover:text-red-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product)}
                            className="text-xs text-gray-500 hover:text-gray-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <CustomPagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemLabel="items"
            />
          </>
        ) : (
          <div className="text-center py-12">
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-6">
              Start by adding your first product
            </p>
            <button
              onClick={handleAddProduct}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-medium"
            >
              + Add Product
            </button>
          </div>
        )}
      </div>

      {/* Product Form Drawer */}
      <ProductFormDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        selectedProduct={selectedProduct}
        isSubmitting={isCreating || isUpdating}
      />

      {/* Delete Confirmation Dialog */}
      <ProductDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        productName={productToDelete?.name || ""}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default AdminProducts;

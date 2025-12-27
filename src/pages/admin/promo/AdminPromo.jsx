import { useState } from "react";
import {
  useGetAllPromosQuery,
  useCreatePromoMutation,
  useUpdatePromoMutation,
  useDeletePromoMutation,
} from "../../../services/promo.service";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import PromoFormDrawer from "./dialogs/PromoFormDrawer";
import PromoDeleteDialog from "./dialogs/PromoDeleteDialog";
import CustomPagination from "../../../components/common/CustomPagination";

const AdminPromo = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    maxDiscount: "",
    validFrom: "",
    validTo: "",
    usageLimit: "",
    active: true,
  });

  const { data: promosData, isLoading } = useGetAllPromosQuery({});
  const [createPromo, { isLoading: isCreating }] = useCreatePromoMutation();
  const [updatePromo, { isLoading: isUpdating }] = useUpdatePromoMutation();
  const [deletePromo, { isLoading: isDeleting }] = useDeletePromoMutation();

  const allPromos = promosData?.data || [];
  
  // Pagination logic
  const totalItems = allPromos.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const promos = allPromos.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleEdit = (promo) => {
    setSelectedPromo(promo);
    setFormData({
      code: promo.code,
      description: promo.description,
      discountType: promo.discountType,
      discountValue: promo.discountValue.toString(),
      minOrderAmount: promo.minOrderAmount?.toString() || "",
      maxDiscount: promo.maxDiscount?.toString() || "",
      validFrom: promo.validFrom ? format(new Date(promo.validFrom), "yyyy-MM-dd") : "",
      validTo: promo.validTo ? format(new Date(promo.validTo), "yyyy-MM-dd") : "",
      usageLimit: promo.usageLimit?.toString() || "",
      active: promo.active,
    });
    setIsDrawerOpen(true);
  };

  const handleAddPromo = () => {
    setSelectedPromo(null);
    setFormData({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      minOrderAmount: "",
      maxDiscount: "",
      validFrom: "",
      validTo: "",
      usageLimit: "",
      active: true,
    });
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedPromo(null);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.code || !formData.description || !formData.discountValue) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.validFrom || !formData.validTo) {
      toast.error("Please select validity period");
      return;
    }

    const promoData = {
      code: formData.code.toUpperCase(),
      description: formData.description,
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : undefined,
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
      validFrom: new Date(formData.validFrom),
      validTo: new Date(formData.validTo),
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
      active: formData.active,
    };

    try {
      if (selectedPromo) {
        await updatePromo({ id: selectedPromo._id, ...promoData }).unwrap();
        toast.success("Promo updated successfully!");
      } else {
        await createPromo(promoData).unwrap();
        toast.success("Promo created successfully!");
      }
      closeDrawer();
    } catch (error) {
      toast.error(error.data?.message || "Failed to save promo");
    }
  };

  const handleDeleteClick = (promo) => {
    setPromoToDelete(promo);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!promoToDelete) return;

    try {
      await deletePromo(promoToDelete._id).unwrap();
      toast.success("Promo deleted successfully!");
      setDeleteDialogOpen(false);
      setPromoToDelete(null);
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete promo");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPromoToDelete(null);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="hover:text-gray-900 cursor-pointer">Dashboard</span>
          <span>&gt;</span>
          <span className="text-gray-900 font-medium">Promo</span>
        </div>
        <button
          onClick={handleAddPromo}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium"
        >
          + Add Promo
        </button>
      </div>

      {/* Promos Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            <p className="mt-4 text-gray-600">Loading promos...</p>
          </div>
        ) : promos.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                      Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                      Discount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                      Min Order
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                      Valid Period
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                      Usage
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {promos.map((promo) => (
                    <tr key={promo._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold text-gray-900">
                          {promo.code}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 max-w-xs truncate">
                        {promo.description}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-900">
                          <div className="capitalize">{promo.discountType}</div>
                          <div className="text-gray-500">
                            {promo.discountType === "percentage" ? `${promo.discountValue}%` : `₹${promo.discountValue}`}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-900">
                        {promo.minOrderAmount ? `₹${promo.minOrderAmount}` : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-900">
                          <div>{format(new Date(promo.validFrom), "dd/MM/yyyy")}</div>
                          <div className="text-gray-500">to {format(new Date(promo.validTo), "dd/MM/yyyy")}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-900">
                        {promo.usedCount || 0}/{promo.usageLimit || "∞"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-1 rounded inline-block ${
                            promo.active
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {promo.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(promo)}
                            className="text-xs text-red-500 hover:text-red-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(promo)}
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
              itemLabel="promos"
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
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No promos found
            </h3>
            <p className="text-gray-500 mb-6">
              Start by adding your first promo code
            </p>
            <button
              onClick={handleAddPromo}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-medium"
            >
              + Add Promo
            </button>
          </div>
        )}
      </div>

      {/* Promo Form Drawer */}
      <PromoFormDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        selectedPromo={selectedPromo}
        isSubmitting={isCreating || isUpdating}
      />

      {/* Delete Confirmation Dialog */}
      <PromoDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        promoCode={promoToDelete?.code || ""}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default AdminPromo;

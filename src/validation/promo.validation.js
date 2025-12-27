/**
 * Client-side promo form validation schemas (Admin)
 */

export const validatePromoForm = (data) => {
  const errors = {};

  // Promo code
  if (!data.code || data.code.trim() === "") {
    errors.code = "Promo code is required";
  } else if (data.code.length < 3) {
    errors.code = "Promo code must be at least 3 characters";
  } else if (data.code.length > 20) {
    errors.code = "Promo code must not exceed 20 characters";
  } else if (!/^[A-Z0-9]+$/.test(data.code)) {
    errors.code = "Promo code must contain only uppercase letters and numbers";
  }

  // Description
  if (!data.description || data.description.trim() === "") {
    errors.description = "Description is required";
  } else if (data.description.length < 10) {
    errors.description = "Description must be at least 10 characters";
  } else if (data.description.length > 500) {
    errors.description = "Description must not exceed 500 characters";
  }

  // Discount type
  if (!data.discountType) {
    errors.discountType = "Discount type is required";
  } else if (!["percentage", "fixed", "free-shipping"].includes(data.discountType)) {
    errors.discountType = "Invalid discount type";
  }

  // Discount value
  if (data.discountType === "percentage" || data.discountType === "fixed") {
    if (data.discountValue === undefined || data.discountValue === null || data.discountValue === "") {
      errors.discountValue = "Discount value is required";
    } else if (typeof data.discountValue !== "number" || data.discountValue <= 0) {
      errors.discountValue = "Discount value must be a positive number";
    } else if (data.discountType === "percentage" && data.discountValue > 100) {
      errors.discountValue = "Percentage discount cannot exceed 100%";
    } else if (data.discountType === "fixed" && data.discountValue > 10000) {
      errors.discountValue = "Fixed discount value is too high";
    }
  }

  // Min order amount
  if (data.minOrderAmount !== undefined && data.minOrderAmount !== null && data.minOrderAmount !== "") {
    if (typeof data.minOrderAmount !== "number" || data.minOrderAmount < 0) {
      errors.minOrderAmount = "Minimum order amount must be a positive number";
    }
  }

  // Max discount
  if (data.maxDiscount !== undefined && data.maxDiscount !== null && data.maxDiscount !== "") {
    if (typeof data.maxDiscount !== "number" || data.maxDiscount < 0) {
      errors.maxDiscount = "Maximum discount must be a positive number";
    }
  }

  // Date range
  const dateErrors = validateDateRange(data.validFrom, data.validTo);
  if (!dateErrors.isValid) {
    Object.assign(errors, dateErrors.errors);
  }

  // Usage limit
  if (data.usageLimit !== undefined && data.usageLimit !== null && data.usageLimit !== "") {
    if (typeof data.usageLimit !== "number" || data.usageLimit < 1) {
      errors.usageLimit = "Usage limit must be at least 1";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validatePromoCode = (code) => {
  const errors = {};

  if (!code || code.trim() === "") {
    errors.code = "Promo code is required";
  } else if (!/^[A-Z0-9]+$/.test(code)) {
    errors.code = "Promo code must contain only uppercase letters and numbers";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateDateRange = (validFrom, validTo) => {
  const errors = {};

  if (!validFrom) {
    errors.validFrom = "Start date is required";
  }

  if (!validTo) {
    errors.validTo = "End date is required";
  }

  if (validFrom && validTo) {
    const fromDate = new Date(validFrom);
    const toDate = new Date(validTo);

    if (isNaN(fromDate.getTime())) {
      errors.validFrom = "Invalid start date";
    }

    if (isNaN(toDate.getTime())) {
      errors.validTo = "Invalid end date";
    }

    if (fromDate.getTime() >= toDate.getTime()) {
      errors.validTo = "End date must be after start date";
    }

    // Check if start date is in the past (optional warning)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (fromDate < today) {
      // This is just a warning, not blocking validation
      errors.validFromWarning = "Start date is in the past";
    }
  }

  return {
    isValid: Object.keys(errors).filter(key => !key.includes('Warning')).length === 0,
    errors,
  };
};

export const validateDiscountValue = (discountType, discountValue) => {
  const errors = {};

  if (discountType === "percentage") {
    if (discountValue <= 0 || discountValue > 100) {
      errors.discountValue = "Percentage must be between 1 and 100";
    }
  } else if (discountType === "fixed") {
    if (discountValue <= 0) {
      errors.discountValue = "Discount amount must be greater than 0";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

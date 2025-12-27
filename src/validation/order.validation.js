/**
 * Client-side order/checkout validation schemas
 */

export const validateCheckoutForm = (data) => {
  const errors = {};

  // Validate customer info
  if (!data.customer) {
    errors.customer = "Customer information is required";
    return { isValid: false, errors };
  }

  const customerErrors = validateCustomerInfo(data.customer);
  if (!customerErrors.isValid) {
    errors.customer = customerErrors.errors;
  }

  // Validate delivery address
  const addressErrors = validateDeliveryAddress(data.deliveryAddress);
  if (!addressErrors.isValid) {
    errors.deliveryAddress = addressErrors.errors.deliveryAddress;
  }

  // Validate payment mode
  if (!data.paymentMode) {
    errors.paymentMode = "Payment method is required";
  } else if (!["card", "cash"].includes(data.paymentMode)) {
    errors.paymentMode = "Invalid payment method";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateCustomerInfo = (customer) => {
  const errors = {};

  if (!customer) {
    errors.customer = "Customer information is required";
    return { isValid: false, errors };
  }

  // First name
  if (!customer.firstName || customer.firstName.trim() === "") {
    errors.firstName = "First name is required";
  } else if (customer.firstName.length < 2) {
    errors.firstName = "First name must be at least 2 characters";
  } else if (customer.firstName.length > 50) {
    errors.firstName = "First name must not exceed 50 characters";
  }

  // Last name
  if (!customer.lastName || customer.lastName.trim() === "") {
    errors.lastName = "Last name is required";
  } else if (customer.lastName.length < 2) {
    errors.lastName = "Last name must be at least 2 characters";
  } else if (customer.lastName.length > 50) {
    errors.lastName = "Last name must not exceed 50 characters";
  }

  // Email
  if (!customer.email || customer.email.trim() === "") {
    errors.email = "Email is required";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      errors.email = "Please enter a valid email address";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateDeliveryAddress = (address) => {
  const errors = {};

  if (!address || address.trim() === "") {
    errors.deliveryAddress = "Delivery address is required";
  } else if (address.length < 10) {
    errors.deliveryAddress = "Address must be at least 10 characters";
  } else if (address.length > 500) {
    errors.deliveryAddress = "Address must not exceed 500 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validatePromoCode = (code) => {
  const errors = {};

  if (!code || code.trim() === "") {
    errors.promoCode = "Promo code is required";
  } else if (code.length < 3) {
    errors.promoCode = "Promo code must be at least 3 characters";
  } else if (code.length > 20) {
    errors.promoCode = "Promo code must not exceed 20 characters";
  } else if (!/^[A-Z0-9]+$/.test(code)) {
    errors.promoCode = "Promo code must contain only uppercase letters and numbers";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateOrderComment = (comment) => {
  const errors = {};

  if (comment && comment.length > 500) {
    errors.comment = "Comment must not exceed 500 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Client-side cart validation schemas
 */

export const validateCartItem = (data) => {
  const errors = {};

  // Validate product ID
  if (!data.productId || data.productId.trim() === "") {
    errors.productId = "Product is required";
  }

  // Validate customization
  if (!data.customization || typeof data.customization !== "object") {
    errors.customization = "Product customization is required";
  } else {
    // Validate customization has required fields
    if (data.customization.totalPrice === undefined || data.customization.totalPrice < 0) {
      errors.customization = "Invalid product price";
    }
  }

  // Validate quantity
  if (data.quantity !== undefined) {
    if (typeof data.quantity !== "number" || data.quantity < 1) {
      errors.quantity = "Quantity must be at least 1";
    }
    if (data.quantity > 50) {
      errors.quantity = "Quantity cannot exceed 50";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateQuantityUpdate = (quantity) => {
  const errors = {};

  if (quantity === undefined || quantity === null) {
    errors.quantity = "Quantity is required";
  } else if (typeof quantity !== "number") {
    errors.quantity = "Quantity must be a number";
  } else if (quantity < 1) {
    errors.quantity = "Quantity must be at least 1";
  } else if (quantity > 50) {
    errors.quantity = "Quantity cannot exceed 50";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateCustomization = (customization, category) => {
  const errors = {};

  if (!customization || typeof customization !== "object") {
    errors.customization = "Customization is required";
    return { isValid: false, errors };
  }

  // For pizzas
  if (category === "pizza") {
    if (!customization.size) {
      errors.size = "Pizza size is required";
    }
    if (!customization.crust) {
      errors.crust = "Pizza crust is required";
    }
  }

  // For beverages
  if (category === "beverages") {
    if (!customization.size) {
      errors.size = "Beverage size is required";
    }
  }

  // Validate total price
  if (customization.totalPrice === undefined || customization.totalPrice <= 0) {
    errors.totalPrice = "Invalid price";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Client-side product form validation schemas (Admin)
 */

export const validateProductForm = (data) => {
  const errors = {};

  // Product name
  if (!data.name || data.name.trim() === "") {
    errors.name = "Product name is required";
  } else if (data.name.length < 3) {
    errors.name = "Product name must be at least 3 characters";
  } else if (data.name.length > 100) {
    errors.name = "Product name must not exceed 100 characters";
  }

  // Description
  if (!data.description || data.description.trim() === "") {
    errors.description = "Description is required";
  } else if (data.description.length < 10) {
    errors.description = "Description must be at least 10 characters";
  } else if (data.description.length > 1000) {
    errors.description = "Description must not exceed 1000 characters";
  }

  // Category
  if (!data.category) {
    errors.category = "Category is required";
  } else if (!["pizza", "beverages"].includes(data.category)) {
    errors.category = "Invalid category";
  }

  // Pricing
  const pricingErrors = validatePricing(data.pricing, data.category);
  if (!pricingErrors.isValid) {
    errors.pricing = pricingErrors.errors;
  }

  // Toppings (optional for pizza)
  if (data.category === "pizza" && data.toppings) {
    const toppingsErrors = validateToppings(data.toppings);
    if (!toppingsErrors.isValid) {
      errors.toppings = toppingsErrors.errors;
    }
  }

  // Attributes
  if (data.attributes) {
    const attributesErrors = validateAttributes(data.attributes, data.category);
    if (!attributesErrors.isValid) {
      errors.attributes = attributesErrors.errors;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validatePricing = (pricing, category) => {
  const errors = {};

  if (!pricing || typeof pricing !== "object") {
    errors.pricing = "Pricing is required";
    return { isValid: false, errors };
  }

  // For pizzas - validate different sizes
  if (category === "pizza") {
    const sizes = ["small", "medium", "large"];
    sizes.forEach((size) => {
      if (pricing[size] !== undefined) {
        if (typeof pricing[size] !== "number" || pricing[size] < 0) {
          errors[size] = `${size.charAt(0).toUpperCase() + size.slice(1)} price must be a positive number`;
        } else if (pricing[size] > 10000) {
          errors[size] = `${size.charAt(0).toUpperCase() + size.slice(1)} price is too high`;
        }
      }
    });

    // At least one size should have a price
    const hasPrice = sizes.some((size) => pricing[size] > 0);
    if (!hasPrice) {
      errors.general = "At least one size must have a price";
    }
  }

  // For beverages - validate different sizes
  if (category === "beverages") {
    const sizes = ["250ml", "500ml", "1L"];
    sizes.forEach((size) => {
      if (pricing[size] !== undefined) {
        if (typeof pricing[size] !== "number" || pricing[size] < 0) {
          errors[size] = `${size} price must be a positive number`;
        } else if (pricing[size] > 1000) {
          errors[size] = `${size} price is too high`;
        }
      }
    });

    // At least one size should have a price
    const hasPrice = sizes.some((size) => pricing[size] > 0);
    if (!hasPrice) {
      errors.general = "At least one size must have a price";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateToppings = (toppings) => {
  const errors = {};

  if (!Array.isArray(toppings)) {
    errors.general = "Toppings must be an array";
    return { isValid: false, errors };
  }

  toppings.forEach((topping, index) => {
    if (!topping.name || topping.name.trim() === "") {
      errors[`topping_${index}_name`] = `Topping ${index + 1} name is required`;
    }
    if (topping.price === undefined || topping.price < 0) {
      errors[`topping_${index}_price`] = `Topping ${index + 1} price must be a positive number`;
    }
    if (topping.price > 500) {
      errors[`topping_${index}_price`] = `Topping ${index + 1} price is too high`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateAttributes = (attributes, category) => {
  const errors = {};

  if (typeof attributes !== "object") {
    errors.general = "Attributes must be an object";
    return { isValid: false, errors };
  }

  // For pizza
  if (category === "pizza") {
    if (attributes.spiciness && !["non-spicy", "spicy"].includes(attributes.spiciness)) {
      errors.spiciness = "Invalid spiciness value";
    }
  }

  // For beverages
  if (category === "beverages") {
    if (attributes.alcohol && !["non-alcoholic", "alcoholic"].includes(attributes.alcohol)) {
      errors.alcohol = "Invalid alcohol value";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateImageUrl = (url) => {
  const errors = {};

  if (url && url.trim() !== "") {
    try {
      new URL(url);
    } catch (e) {
      errors.image = "Invalid image URL";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

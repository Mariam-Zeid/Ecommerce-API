export const roles = {
  USER: "user",
  ADMIN: "admin",
  SELLER: "seller",
};
Object.freeze(roles);

export const statuses = {
  PENDING: "pending",
  VERIFIED: "verified",
  BLOCKED: "blocked",
};
Object.freeze(statuses);

export const discountTypes = {
  NONE: "none",
  FIXED: "fixed",
  PERCENTAGE: "percentage",
};
Object.freeze(discountTypes);

export const orderStatuses = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
};
Object.freeze(orderStatuses);

export const paymentMethods = {
  CASH: "cash",
  CARD: "card",
};
Object.freeze(paymentMethods);

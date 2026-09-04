// Formats a number as Indian Rupees using the en-IN locale grouping (e.g. ₹1,24,999)
export const formatPrice = (amount = 0) => {
  return `₹${Number(amount).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
};

// Returns the discount percentage between an MRP and the selling price
export const discountPercent = (mrp, price) => {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
};

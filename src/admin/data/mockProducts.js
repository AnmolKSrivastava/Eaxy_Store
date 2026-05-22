import { allProducts } from '../../data/productsData';

// Enhance products with admin-specific data (stock quantities)
export const mockProducts = allProducts.map((product, index) => ({
  ...product,
  stockQuantity: product.inStock 
    ? (index % 3 === 0 ? 8 : index % 5 === 0 ? 45 : 25) // Low, High, Medium stock
    : 0, // Out of stock
  sku: `SKU-${product.category.toUpperCase().slice(0, 3)}-${String(product.id).padStart(4, '0')}`,
  lastRestocked: product.inStock 
    ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    : null,
}));

// Category labels for display
export const categoryLabels = {
  'laptops': 'Laptops & Computers',
  'smartphones': 'Smartphones',
  'accessories': 'Accessories',
  'refurbished-laptops': 'Refurbished',
};

// Stock status helpers
export const getStockStatus = (quantity) => {
  if (quantity === 0) return { status: 'out-of-stock', label: 'Out of Stock', color: '#ef4444' };
  if (quantity < 10) return { status: 'low-stock', label: 'Low Stock', color: '#f59e0b' };
  if (quantity < 30) return { status: 'medium-stock', label: 'In Stock', color: '#3b82f6' };
  return { status: 'high-stock', label: 'In Stock', color: '#10b981' };
};

export const stockStatusColors = {
  'out-of-stock': { bg: '#ef4444', text: 'Out of Stock' },
  'low-stock': { bg: '#f59e0b', text: 'Low Stock' },
  'medium-stock': { bg: '#3b82f6', text: 'In Stock' },
  'high-stock': { bg: '#10b981', text: 'In Stock' },
};

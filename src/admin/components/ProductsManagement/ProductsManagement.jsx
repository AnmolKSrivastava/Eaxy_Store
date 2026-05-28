import React, { useState, useEffect } from 'react';
import { Package, Plus } from 'lucide-react';
import {
  fetchAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  fetchAllCategories,
} from '../../../firebase/productsService';
import { logActivity } from '../../../firebase/activityLogger';
import { useAdmin } from '../../../contexts/AdminContext';
import ProductFilters from './ProductFilters';
import ProductsTable from './ProductsTable';
import ProductFormModal from './ProductFormModal';
import '../ProductsManagement.css';

function ProductsManagement() {
  const { adminSession } = useAdmin();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [productsData, categoriesData] = await Promise.all([
        fetchAllProducts(),
        fetchAllCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (formData, editing) => {
    if (!formData.name || !formData.category || !formData.price) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const productData = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price),
        image: formData.image,
        badge: formData.badge,
        rating: Number(formData.rating),
        inStock: formData.inStock,
        specs: formData.specs.filter((spec) => spec.trim() !== ''),
        description: formData.description,
      };

      if (editing) {
        await updateProduct(editing.id, productData);
        await logActivity(
          'product_updated',
          { productId: editing.id, productName: formData.name },
          adminSession?.email
        );
        setSuccess('Product updated successfully!');
      } else {
        const newId = await addProduct(productData);
        await logActivity(
          'product_added',
          { productId: newId, productName: formData.name },
          adminSession?.email
        );
        setSuccess('Product added successfully!');
      }

      await loadData();
      setTimeout(() => {
        handleCloseModal();
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError('Failed to save product: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) return;

    try {
      setSubmitting(true);
      setError('');
      await deleteProduct(productId);
      await logActivity(
        'product_deleted',
        { productId, productName },
        adminSession?.email
      );
      setSuccess('Product deleted successfully!');
      await loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete product: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStock = async (productId, currentStock) => {
    try {
      await updateProductStock(productId, !currentStock);
      await logActivity(
        'product_stock_updated',
        { productId, inStock: !currentStock },
        adminSession?.email
      );
      await loadData();
    } catch (err) {
      setError('Failed to update stock status: ' + err.message);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="products-management">
      <div className="pm-header">
        <div className="pm-title-section">
          <Package size={28} />
          <div>
            <h2>Products Management</h2>
            <p className="pm-subtitle">{products.length} total products</p>
          </div>
        </div>
        <button className="pm-add-btn" onClick={() => handleOpenModal()}>
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {error && <div className="pm-error">{error}</div>}
      {success && <div className="pm-success">{success}</div>}

      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterCategory={filterCategory}
        onFilterChange={setFilterCategory}
        categories={categories}
      />

      <ProductsTable
        products={filteredProducts}
        loading={loading && !showModal}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        onToggleStock={handleToggleStock}
      />

      <ProductFormModal
        show={showModal}
        editingProduct={editingProduct}
        categories={categories}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        loading={submitting}
        error={error}
        success={success}
      />
    </div>
  );
}

export default ProductsManagement;

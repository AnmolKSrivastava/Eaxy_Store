import React, { useState, useEffect } from 'react';
import { mockProducts, getStockStatus } from '../../data/mockProducts';
import ProductHeader from './ProductHeader';
import ProductFilters from './ProductFilters';
import ProductTable from './ProductTable';
import ProductDetailModal from './ProductDetailModal';
import ProductFormModal from './ProductFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import BulkActionsModal from './BulkActionsModal';
import StockAlertBanner from './StockAlertBanner';
import './ProductManagement.css';

function ProductManagement() {
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkActionType, setBulkActionType] = useState(null);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [showStockAlert, setShowStockAlert] = useState(true);

  // Filter products
  useEffect(() => {
    let filtered = products;

    // Search by name or SKU
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Filter by stock status
    if (stockFilter !== 'all') {
      filtered = filtered.filter(product => {
        const status = getStockStatus(product.stockQuantity).status;
        return status === stockFilter;
      });
    }

    setFilteredProducts(filtered);
  }, [searchTerm, categoryFilter, stockFilter, products]);

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowFormModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowFormModal(true);
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      // Update existing product
      setProducts(prevProducts =>
        prevProducts.map(p => p.id === productData.id ? productData : p)
      );
    } else {
      // Add new product
      setProducts(prevProducts => [productData, ...prevProducts]);
    }
    setShowFormModal(false);
    setEditingProduct(null);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedProduct(null);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!deletingProduct) return;
    
    setIsDeleting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setProducts(prevProducts =>
        prevProducts.filter(p => p.id !== deletingProduct.id)
      );
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeletingProduct(null);
    }, 500);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return; // Prevent closing during deletion
    setShowDeleteModal(false);
    setDeletingProduct(null);
  };

  const handleSelectProduct = (productId) => {
    setSelectedProductIds(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map(p => p.id));
    }
  };

  const handleBulkAction = (type) => {
    if (selectedProductIds.length === 0) return;
    setBulkActionType(type);
    setShowBulkModal(true);
  };

  const confirmBulkAction = (quantity) => {
    setIsBulkProcessing(true);
    
    setTimeout(() => {
      if (bulkActionType === 'updateStock') {
        setProducts(prevProducts =>
          prevProducts.map(p =>
            selectedProductIds.includes(p.id)
              ? { ...p, stockQuantity: quantity, inStock: quantity > 0 }
              : p
          )
        );
      } else if (bulkActionType === 'delete') {
        setProducts(prevProducts =>
          prevProducts.filter(p => !selectedProductIds.includes(p.id))
        );
      }
      
      setIsBulkProcessing(false);
      setShowBulkModal(false);
      setBulkActionType(null);
      setSelectedProductIds([]);
    }, 500);
  };

  const closeBulkModal = () => {
    if (isBulkProcessing) return;
    setShowBulkModal(false);
    setBulkActionType(null);
  };

  const handleViewStockAlerts = () => {
    setStockFilter('low-stock');
    setShowStockAlert(false);
  };

  const handleDismissAlert = () => {
    setShowStockAlert(false);
  };

  const lowStockCount = products.filter(p => p.stockQuantity < 10).length;

  return (
    <div className="product-management">
      <ProductHeader 
        totalProducts={products.length}
        lowStockCount={lowStockCount}
        onAddProduct={handleAddProduct}
        selectedCount={selectedProductIds.length}
        onBulkUpdateStock={() => handleBulkAction('updateStock')}
        onBulkDelete={() => handleBulkAction('delete')}
        onDeselectAll={() => setSelectedProductIds([])}
      />

      {showStockAlert && (
        <StockAlertBanner
          lowStockCount={lowStockCount}
          onViewAlerts={handleViewStockAlerts}
          onDismiss={handleDismissAlert}
        />
      )}

      <ProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        stockFilter={stockFilter}
        setStockFilter={setStockFilter}
      />

      <ProductTable
        products={filteredProducts}
        onViewProduct={handleViewProduct}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        selectedProductIds={selectedProductIds}
        onSelectProduct={handleSelectProduct}
        onSelectAll={handleSelectAll}
      />

      {showDetailModal && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={closeDetailModal}
        />
      )}

      {showFormModal && (
        <ProductFormModal
          product={editingProduct}
          onClose={closeFormModal}
          onSave={handleSaveProduct}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          product={deletingProduct}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          isDeleting={isDeleting}
        />
      )}

      {showBulkModal && (
        <BulkActionsModal
          type={bulkActionType}
          selectedCount={selectedProductIds.length}
          onClose={closeBulkModal}
          onConfirm={confirmBulkAction}
          isProcessing={isBulkProcessing}
        />
      )}
    </div>
  );
}

export default ProductManagement;
import React, { useState, useEffect } from 'react';
import { Tag, Plus } from 'lucide-react';
import {
  fetchAllDeals,
  addDeal,
  updateDeal,
  deleteDeal,
  toggleDealStatus,
  fetchAllProducts,
} from '../../../firebase/productsService';
import { logActivity } from '../../../firebase/activityLogger';
import { useAdmin } from '../../../contexts/AdminContext';
import DealCard from './DealCard';
import DealFormModal from './DealFormModal';
import '../DealsManagement.css';

function DealsManagement() {
  const { adminSession } = useAdmin();
  const [deals, setDeals] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [dealsData, productsData] = await Promise.all([
        fetchAllDeals(),
        fetchAllProducts(),
      ]);
      setDeals(dealsData);
      setProducts(productsData);
    } catch (err) {
      setError('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (deal = null) => {
    setEditingDeal(deal);
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDeal(null);
  };

  const handleSubmit = async (formData, editing) => {
    if (!formData.productId || !formData.badge) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const product = products.find(p => p.id === formData.productId);
      if (!product) {
        setError('Product not found');
        return;
      }

      const dealData = {
        productId: formData.productId,
        productName: product.name,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        image: product.image,
        badge: formData.badge,
        priority: Number(formData.priority),
        isActive: formData.isActive,
        discountPercent: formData.discountPercent ? Number(formData.discountPercent) : null,
      };

      if (editing) {
        await updateDeal(editing.id, dealData);
        await logActivity(
          'deal_updated',
          { dealId: editing.id, productName: product.name },
          adminSession?.email
        );
        setSuccess('Deal updated successfully!');
      } else {
        const newId = await addDeal(dealData);
        await logActivity(
          'deal_added',
          { dealId: newId, productName: product.name },
          adminSession?.email
        );
        setSuccess('Deal added successfully!');
      }

      await loadData();
      setTimeout(() => {
        handleCloseModal();
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError('Failed to save deal: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (dealId, productName) => {
    if (!window.confirm(`Are you sure you want to delete the deal for "${productName}"?`)) return;

    try {
      setLoading(true);
      setError('');
      await deleteDeal(dealId);
      await logActivity(
        'deal_deleted',
        { dealId, productName },
        adminSession?.email
      );
      setSuccess('Deal deleted successfully!');
      await loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete deal: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (dealId, currentStatus) => {
    try {
      await toggleDealStatus(dealId, !currentStatus);
      await logActivity(
        'deal_status_toggled',
        { dealId, isActive: !currentStatus },
        adminSession?.email
      );
      await loadData();
    } catch (err) {
      setError('Failed to toggle deal status: ' + err.message);
    }
  };

  return (
    <div className="deals-management">
      <div className="dm-header">
        <div className="dm-title-section">
          <Tag size={28} />
          <div>
            <h2>Deals Management</h2>
            <p className="dm-subtitle">
              {deals.length} total deals | {deals.filter(d => d.isActive).length} active
            </p>
          </div>
        </div>
        <button className="dm-add-btn" onClick={() => handleOpenModal()}>
          <Plus size={20} />
          Add Deal
        </button>
      </div>

      {error && <div className="dm-error">{error}</div>}
      {success && <div className="dm-success">{success}</div>}

      {loading && !showModal ? (
        <div className="dm-loading">Loading deals...</div>
      ) : (
        <div className="dm-grid">
          {deals.length === 0 ? (
            <div className="dm-empty">No deals found. Add your first deal!</div>
          ) : (
            deals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))
          )}
        </div>
      )}

      <DealFormModal
        show={showModal}
        editingDeal={editingDeal}
        products={products}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        success={success}
      />
    </div>
  );
}

export default DealsManagement;

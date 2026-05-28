import React, { useState, useEffect } from 'react';
import { FolderOpen, Plus } from 'lucide-react';
import {
  fetchAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from '../../../firebase/productsService';
import { logActivity } from '../../../firebase/activityLogger';
import { useAdmin } from '../../../contexts/AdminContext';
import CategoryCard from './CategoryCard';
import CategoryFormModal from './CategoryFormModal';
import '../CategoriesManagement.css';

function CategoriesManagement() {
  const { adminSession } = useAdmin();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchAllCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    setEditingCategory(category);
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (formData, editing) => {
    if (!formData.title || !formData.slug) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const categoryData = {
        title: formData.title,
        slug: formData.slug,
        icon: formData.icon,
        count: formData.count,
        image: formData.image,
        order: Number(formData.order),
      };

      if (editing) {
        await updateCategory(editing.id, categoryData);
        await logActivity(
          'category_updated',
          { categoryId: editing.id, categoryTitle: formData.title },
          adminSession?.email
        );
        setSuccess('Category updated successfully!');
      } else {
        const newId = await addCategory(categoryData);
        await logActivity(
          'category_added',
          { categoryId: newId, categoryTitle: formData.title },
          adminSession?.email
        );
        setSuccess('Category added successfully!');
      }

      await loadCategories();
      setTimeout(() => {
        handleCloseModal();
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError('Failed to save category: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (categoryId, categoryTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${categoryTitle}"?`)) return;

    try {
      setSubmitting(true);
      setError('');
      await deleteCategory(categoryId);
      await logActivity(
        'category_deleted',
        { categoryId, categoryTitle },
        adminSession?.email
      );
      setSuccess('Category deleted successfully!');
      await loadCategories();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete category: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="categories-management">
      <div className="cm-header">
        <div className="cm-title-section">
          <FolderOpen size={28} />
          <div>
            <h2>Categories Management</h2>
            <p className="cm-subtitle">{categories.length} total categories</p>
          </div>
        </div>
        <button className="cm-add-btn" onClick={() => handleOpenModal()}>
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {error && <div className="cm-error">{error}</div>}
      {success && <div className="cm-success">{success}</div>}

      {loading && !showModal ? (
        <div className="cm-loading">Loading categories...</div>
      ) : (
        <div className="cm-grid">
          {categories.length === 0 ? (
            <div className="cm-empty">No categories found. Add your first category!</div>
          ) : (
            categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      )}

      <CategoryFormModal
        show={showModal}
        editingCategory={editingCategory}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        loading={submitting}
        error={error}
        success={success}
      />
    </div>
  );
}

export default CategoriesManagement;

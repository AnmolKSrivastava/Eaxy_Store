import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import {
  fetchAllRepairServices,
  addRepairService,
  updateRepairService,
  deleteRepairService,
  fetchAllServiceCategories
} from '../../../firebase/repairServicesService';
import { logActivity } from '../../../firebase/activityLogger';
import { useAdmin } from '../../../contexts/AdminContext';
import RepairServiceCard from './RepairServiceCard';
import RepairServiceFormModal from './RepairServiceFormModal';
import ServiceFilters from './ServiceFilters';
import './RepairServicesManagement.css';

function RepairServicesManagement() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  
  const { adminSession, hasPermission } = useAdmin();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [servicesData, categoriesData] = await Promise.all([
        fetchAllRepairServices(),
        fetchAllServiceCategories()
      ]);
      setServices(servicesData);
      setCategories(categoriesData);
      setError('');
    } catch (err) {
      setError('Failed to load repair services');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    if (!hasPermission('products')) {
      setError('You do not have permission to manage services');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const serviceData = {
        category: formData.category,
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        duration: formData.duration,
        warranty: formData.warranty,
        rating: Number(formData.rating) || 4.5,
        features: formData.features || []
      };

      if (editingService) {
        await updateRepairService(editingService.id, serviceData);
        await logActivity(
          'service_updated',
          { serviceId: editingService.id, serviceName: serviceData.title },
          adminSession?.email
        );
        setSuccess('Service updated successfully!');
      } else {
        const newId = await addRepairService(serviceData);
        await logActivity(
          'service_added',
          { serviceId: newId, serviceName: serviceData.title },
          adminSession?.email
        );
        setSuccess('Service added successfully!');
      }

      await loadData();
      setShowModal(false);
      setEditingService(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save service');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setShowModal(true);
  };

  const handleDelete = async (service) => {
    if (!hasPermission('products')) {
      setError('You do not have permission to delete services');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${service.title}"?`)) {
      return;
    }

    try {
      await deleteRepairService(service.id);
      await logActivity(
        'service_deleted',
        { serviceId: service.id, serviceName: service.title },
        adminSession?.email
      );
      await loadData();
      setSuccess('Service deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete service');
      console.error(err);
    }
  };

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="repair-services-management">
      <header className="management-header">
        <div>
          <h2>Repair Services Management</h2>
          <p>Manage your repair services catalog</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingService(null);
            setShowModal(true);
          }}
          disabled={!hasPermission('products')}
        >
          <Plus size={20} />
          Add Service
        </button>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <ServiceFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterCategory={filterCategory}
        onFilterChange={setFilterCategory}
        categories={categories}
      />

      {loading ? (
        <div className="loading-state">Loading services...</div>
      ) : (
        <div className="services-grid">
          {filteredServices.length === 0 ? (
            <div className="empty-state">
              No services found. {hasPermission('products') && 'Add your first service to get started.'}
            </div>
          ) : (
            filteredServices.map(service => (
              <RepairServiceCard
                key={service.id}
                service={service}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canEdit={hasPermission('products')}
              />
            ))
          )}
        </div>
      )}

      {showModal && (
        <RepairServiceFormModal
          show={showModal}
          editingService={editingService}
          categories={categories}
          onClose={() => {
            setShowModal(false);
            setEditingService(null);
            setError('');
          }}
          onSubmit={handleSubmit}
          loading={submitting}
          error={error}
          success={success}
        />
      )}
    </div>
  );
}

export default RepairServicesManagement;

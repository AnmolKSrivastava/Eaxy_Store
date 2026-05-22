// Mock order data for admin dashboard
export const mockOrders = [
  {
    id: 'ORD-2026-001',
    customer: {
      name: 'Rajesh Kumar',
      email: 'rajesh.k@email.com',
      phone: '+91 98765 43210',
      address: 'Flat 302, Sunshine Apartments, Kothrud, Pune - 411038'
    },
    items: [
      { id: 1, name: 'MacBook Air M2', quantity: 1, price: 84999, image: 'macbook.jpg' }
    ],
    total: 84999,
    status: 'processing',
    paymentStatus: 'paid',
    deliveryArea: 'Kothrud & Warje',
    orderDate: new Date('2026-05-22T09:30:00'),
    deliveryDeadline: new Date('2026-05-22T13:30:00'),
    estimatedDelivery: new Date('2026-05-22T12:45:00'),
    notes: 'Customer requested gift wrapping'
  },
  {
    id: 'ORD-2026-002',
    customer: {
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 98123 45678',
      address: 'B-204, Tech Park Residency, Hinjewadi, Pune - 411057'
    },
    items: [
      { id: 2, name: 'iPhone 15 Pro', quantity: 1, price: 124999, image: 'iphone.jpg' },
      { id: 22, name: 'AirPods Pro', quantity: 1, price: 24900, image: 'airpods.jpg' }
    ],
    total: 149899,
    status: 'delivered',
    paymentStatus: 'paid',
    deliveryArea: 'Wakad & Hinjewadi',
    orderDate: new Date('2026-05-21T14:20:00'),
    deliveryDeadline: new Date('2026-05-21T18:20:00'),
    estimatedDelivery: new Date('2026-05-21T17:45:00'),
    deliveredAt: new Date('2026-05-21T17:30:00')
  },
  {
    id: 'ORD-2026-003',
    customer: {
      name: 'Amit Patel',
      email: 'amit.patel@email.com',
      phone: '+91 97654 32109',
      address: '15/A, Green Valley Society, Aundh, Pune - 411007'
    },
    items: [
      { id: 3, name: 'Dell XPS 15', quantity: 1, price: 124999, image: 'dell.jpg' }
    ],
    total: 124999,
    status: 'pending',
    paymentStatus: 'paid',
    deliveryArea: 'Aundh & Baner',
    orderDate: new Date('2026-05-22T11:15:00'),
    deliveryDeadline: new Date('2026-05-22T15:15:00'),
    estimatedDelivery: new Date('2026-05-22T14:30:00')
  },
  {
    id: 'ORD-2026-004',
    customer: {
      name: 'Sneha Desai',
      email: 'sneha.d@email.com',
      phone: '+91 99887 76554',
      address: 'Plot 45, Vijay Nagar, Pimpri-Chinchwad, Pune - 411018'
    },
    items: [
      { id: 16, name: 'Sony WH-1000XM5', quantity: 2, price: 26999, image: 'headphones.jpg' }
    ],
    total: 53998,
    status: 'out-for-delivery',
    paymentStatus: 'paid',
    deliveryArea: 'Pimpri-Chinchwad',
    orderDate: new Date('2026-05-22T08:45:00'),
    deliveryDeadline: new Date('2026-05-22T12:45:00'),
    estimatedDelivery: new Date('2026-05-22T11:30:00')
  },
  {
    id: 'ORD-2026-005',
    customer: {
      name: 'Vikram Singh',
      email: 'vikram.singh@email.com',
      phone: '+91 98000 12345',
      address: 'C-12, Royal Heights, Shivajinagar, Pune - 411005'
    },
    items: [
      { id: 5, name: 'HP Pavilion Gaming', quantity: 1, price: 74999, image: 'hp.jpg' }
    ],
    total: 74999,
    status: 'processing',
    paymentStatus: 'paid',
    deliveryArea: 'Shivajinagar & Camp',
    orderDate: new Date('2026-05-22T10:00:00'),
    deliveryDeadline: new Date('2026-05-22T14:00:00'),
    estimatedDelivery: new Date('2026-05-22T13:15:00')
  },
  {
    id: 'ORD-2026-006',
    customer: {
      name: 'Meera Joshi',
      email: 'meera.joshi@email.com',
      phone: '+91 97123 45678',
      address: 'Flat 801, Cyber Towers, Magarpatta, Pune - 411013'
    },
    items: [
      { id: 8, name: 'Samsung Galaxy S24', quantity: 1, price: 79999, image: 'samsung.jpg' },
      { id: 19, name: 'Samsung Buds Pro', quantity: 1, price: 14999, image: 'buds.jpg' }
    ],
    total: 94998,
    status: 'delivered',
    paymentStatus: 'paid',
    deliveryArea: 'Hadapsar & Magarpatta',
    orderDate: new Date('2026-05-20T15:30:00'),
    deliveryDeadline: new Date('2026-05-20T19:30:00'),
    estimatedDelivery: new Date('2026-05-20T18:45:00'),
    deliveredAt: new Date('2026-05-20T18:20:00')
  },
  {
    id: 'ORD-2026-007',
    customer: {
      name: 'Arjun Mehta',
      email: 'arjun.m@email.com',
      phone: '+91 96543 21098',
      address: 'Villa 23, Palm Springs, Baner, Pune - 411045'
    },
    items: [
      { id: 4, name: 'Lenovo ThinkPad X1', quantity: 1, price: 119999, image: 'lenovo.jpg' }
    ],
    total: 119999,
    status: 'pending',
    paymentStatus: 'pending',
    deliveryArea: 'Aundh & Baner',
    orderDate: new Date('2026-05-22T11:45:00'),
    deliveryDeadline: new Date('2026-05-22T15:45:00'),
    estimatedDelivery: new Date('2026-05-22T15:00:00'),
    notes: 'Payment pending - COD order'
  },
  {
    id: 'ORD-2026-008',
    customer: {
      name: 'Kavita Reddy',
      email: 'kavita.reddy@email.com',
      phone: '+91 99123 45670',
      address: 'Apartment 5B, Tech Hub, Hinjewadi Phase 2, Pune - 411057'
    },
    items: [
      { id: 12, name: 'Apple Watch Series 9', quantity: 1, price: 44900, image: 'watch.jpg' }
    ],
    total: 44900,
    status: 'out-for-delivery',
    paymentStatus: 'paid',
    deliveryArea: 'Wakad & Hinjewadi',
    orderDate: new Date('2026-05-22T09:00:00'),
    deliveryDeadline: new Date('2026-05-22T13:00:00'),
    estimatedDelivery: new Date('2026-05-22T12:15:00')
  }
];

export const statusColors = {
  pending: { bg: '#f59e0b', text: 'Pending' },
  processing: { bg: '#3b82f6', text: 'Processing' },
  'out-for-delivery': { bg: '#8b5cf6', text: 'Out for Delivery' },
  delivered: { bg: '#10b981', text: 'Delivered' },
  cancelled: { bg: '#ef4444', text: 'Cancelled' }
};

export const paymentStatusColors = {
  paid: { bg: '#10b981', text: 'Paid' },
  pending: { bg: '#f59e0b', text: 'Pending' },
  failed: { bg: '#ef4444', text: 'Failed' }
};

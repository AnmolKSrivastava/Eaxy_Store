// Mock repair service request data
export const mockRepairRequests = [
  {
    id: 'REP-2026-001',
    customer: {
      name: 'Suresh Patil',
      email: 'suresh.patil@email.com',
      phone: '+91 98765 43211',
      address: 'Shop 12, MG Road, Shivajinagar, Pune - 411005'
    },
    device: 'MacBook Pro 2021',
    issue: 'Screen Replacement',
    description: 'Cracked screen after accidental drop. Display still working but glass damaged.',
    category: 'laptop',
    priority: 'high',
    status: 'diagnosed',
    technician: 'Rahul Deshmukh',
    estimatedCost: 12999,
    actualCost: null,
    warranty: '6 months',
    requestDate: new Date('2026-05-22T10:00:00'),
    estimatedCompletion: new Date('2026-05-22T14:00:00'),
    notes: 'Original Apple display in stock',
    serviceHistory: [
      { date: new Date('2026-05-22T10:00:00'), action: 'Request received', by: 'System' },
      { date: new Date('2026-05-22T10:30:00'), action: 'Assigned to Rahul Deshmukh', by: 'Admin' },
      { date: new Date('2026-05-22T11:00:00'), action: 'Diagnosis completed - Screen replacement needed', by: 'Rahul Deshmukh' }
    ]
  },
  {
    id: 'REP-2026-002',
    customer: {
      name: 'Anita Kulkarni',
      email: 'anita.k@email.com',
      phone: '+91 97654 32100',
      address: 'Flat 15B, Seasons Mall Road, Magarpatta, Pune - 411013'
    },
    device: 'iPhone 14 Pro',
    issue: 'Battery Replacement',
    description: 'Battery health at 76%. Phone shuts down at 20% charge.',
    category: 'mobile',
    priority: 'medium',
    status: 'repairing',
    technician: 'Priya Joshi',
    estimatedCost: 4999,
    actualCost: null,
    warranty: '1 year',
    requestDate: new Date('2026-05-22T09:15:00'),
    estimatedCompletion: new Date('2026-05-22T11:15:00'),
    notes: 'Original Apple battery',
    serviceHistory: [
      { date: new Date('2026-05-22T09:15:00'), action: 'Request received', by: 'System' },
      { date: new Date('2026-05-22T09:30:00'), action: 'Assigned to Priya Joshi', by: 'Admin' },
      { date: new Date('2026-05-22T09:45:00'), action: 'Diagnosis completed - Battery replacement confirmed', by: 'Priya Joshi' },
      { date: new Date('2026-05-22T10:00:00'), action: 'Repair started', by: 'Priya Joshi' }
    ]
  },
  {
    id: 'REP-2026-003',
    customer: {
      name: 'Vikram Bhosale',
      email: 'vikram.b@email.com',
      phone: '+91 99887 65432',
      address: 'C-304, IT Park Towers, Hinjewadi Phase 1, Pune - 411057'
    },
    device: 'Dell Inspiron 15',
    issue: 'Water Damage',
    description: 'Coffee spilled on keyboard. Laptop not turning on.',
    category: 'laptop',
    priority: 'high',
    status: 'received',
    technician: null,
    estimatedCost: 8999,
    actualCost: null,
    warranty: '3 months',
    requestDate: new Date('2026-05-22T11:30:00'),
    estimatedCompletion: new Date('2026-05-22T15:30:00'),
    notes: 'Needs immediate attention - possible motherboard damage'
  },
  {
    id: 'REP-2026-004',
    customer: {
      name: 'Neha Rathod',
      email: 'neha.rathod@email.com',
      phone: '+91 98123 45690',
      address: 'Bungalow 7, Palm Greens, Aundh, Pune - 411007'
    },
    device: 'Samsung Galaxy S23',
    issue: 'Screen Fix',
    description: 'Touchscreen not responding in top-left corner.',
    category: 'mobile',
    priority: 'medium',
    status: 'completed',
    technician: 'Amit Pawar',
    estimatedCost: 3999,
    actualCost: 3999,
    warranty: '6 months',
    requestDate: new Date('2026-05-21T14:00:00'),
    estimatedCompletion: new Date('2026-05-21T17:00:00'),
    completedAt: new Date('2026-05-21T16:30:00'),
    notes: 'Display replaced with original Samsung screen',
    serviceHistory: [
      { date: new Date('2026-05-21T14:00:00'), action: 'Request received', by: 'System' },
      { date: new Date('2026-05-21T14:15:00'), action: 'Assigned to Amit Pawar', by: 'Admin' },
      { date: new Date('2026-05-21T14:45:00'), action: 'Diagnosis completed - Display assembly replacement needed', by: 'Amit Pawar' },
      { date: new Date('2026-05-21T15:00:00'), action: 'Repair started', by: 'Amit Pawar' },
      { date: new Date('2026-05-21T16:30:00'), action: 'Repair completed - Device tested', by: 'Amit Pawar' }
    ]
  },
  {
    id: 'REP-2026-005',
    customer: {
      name: 'Aditya Sawant',
      email: 'aditya.sawant@email.com',
      phone: '+91 97000 11223',
      address: 'Office 203, Cerebrum IT Park, Kalyani Nagar, Pune - 411014'
    },
    device: 'HP Desktop PC',
    issue: 'Performance Boost',
    description: 'PC running slow. Need RAM and SSD upgrade.',
    category: 'computer',
    priority: 'low',
    status: 'diagnosed',
    technician: 'Kiran Shah',
    estimatedCost: 15999,
    actualCost: null,
    warranty: '1 year',
    requestDate: new Date('2026-05-22T08:30:00'),
    estimatedCompletion: new Date('2026-05-22T12:30:00'),
    notes: 'Upgrade to 16GB RAM and 512GB SSD recommended',
    serviceHistory: [
      { date: new Date('2026-05-22T08:30:00'), action: 'Request received', by: 'System' },
      { date: new Date('2026-05-22T08:45:00'), action: 'Assigned to Kiran Shah', by: 'Admin' },
      { date: new Date('2026-05-22T09:30:00'), action: 'Diagnosis completed - 16GB RAM + 512GB SSD upgrade', by: 'Kiran Shah' }
    ]
  },
  {
    id: 'REP-2026-006',
    customer: {
      name: 'Pooja Deshmukh',
      email: 'pooja.d@email.com',
      phone: '+91 98765 00111',
      address: 'Row House 45, Green Valley, Pimpri, Pune - 411018'
    },
    device: 'iPhone 13',
    issue: 'Software Update',
    description: 'Phone stuck in boot loop after iOS update.',
    category: 'mobile',
    priority: 'high',
    status: 'repairing',
    technician: 'Priya Joshi',
    estimatedCost: 999,
    actualCost: null,
    warranty: '1 month',
    requestDate: new Date('2026-05-22T10:45:00'),
    estimatedCompletion: new Date('2026-05-22T12:00:00'),
    notes: 'Software restore required',
    serviceHistory: [
      { date: new Date('2026-05-22T10:45:00'), action: 'Request received', by: 'System' },
      { date: new Date('2026-05-22T10:50:00'), action: 'Assigned to Priya Joshi', by: 'Admin' },
      { date: new Date('2026-05-22T11:00:00'), action: 'Diagnosis completed - iOS restore needed', by: 'Priya Joshi' },
      { date: new Date('2026-05-22T11:15:00'), action: 'Software restore in progress', by: 'Priya Joshi' }
    ]
  }
];

export const repairStatusColors = {
  pending: { bg: '#f59e0b', text: 'Pending' },
  confirmed: { bg: '#3b82f6', text: 'Confirmed' },
  'in-progress': { bg: '#8b5cf6', text: 'In Progress' },
  completed: { bg: '#10b981', text: 'Completed' },
  cancelled: { bg: '#ef4444', text: 'Cancelled' },
  // Legacy statuses
  received: { bg: '#f59e0b', text: 'Received' },
  diagnosed: { bg: '#3b82f6', text: 'Diagnosed' },
  repairing: { bg: '#8b5cf6', text: 'Repairing' }
};

export const priorityColors = {
  low: { bg: '#6b7280', text: 'Low' },
  medium: { bg: '#f59e0b', text: 'Medium' },
  high: { bg: '#ef4444', text: 'High' },
  default: { bg: '#6b7280', text: 'Normal' }
};

export const availableTechnicians = [];

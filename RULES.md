# Code Generation Rules & Best Practices

## 🎯 Core Principles

1. **Keep components small, focused, and single-purpose**
2. **Maintain clear folder structure and file organization**
3. **Split large components into smaller, composable pieces**
4. **Follow consistent naming conventions**
5. **Prioritize readability and maintainability over cleverness**

---

## 📏 Component Size Guidelines

### Maximum Component Sizes
- ❌ **File should NEVER exceed 400 lines** (including imports, styles)
- ⚠️ **Alert at 250 lines** - Consider refactoring
- ✅ **Ideal: 100-200 lines per component**
- ✅ **Utility components: 50-100 lines**

### When to Split a Component

Split when ANY of these conditions are met:

1. **Line Count**: File exceeds 250 lines
2. **Complexity**: Component has more than 5 useState hooks
3. **Responsibilities**: Component handles multiple unrelated concerns
4. **JSX Length**: Return statement exceeds 150 lines
5. **Logic Density**: More than 10 functions defined in component
6. **Nested Depth**: JSX nesting exceeds 5 levels deep
7. **Conditional Rendering**: More than 3 major conditional branches

---

## 📁 Folder & File Structure

### Feature-Based Organization

```
src/
├── admin/                          # Admin feature module
│   ├── AdminDashboardPage.jsx     # Main page component
│   ├── AdminDashboard.css         # Shared styles
│   ├── README.md                  # Feature documentation
│   │
│   ├── components/                # Feature components
│   │   ├── AdminTopBar/
│   │   │   ├── AdminTopBar.jsx
│   │   │   ├── AdminTopBar.css
│   │   │   └── index.js
│   │   │
│   │   ├── AdminSidebar/
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── AdminSidebar.css
│   │   │   ├── MenuItem.jsx       # Sub-component
│   │   │   └── index.js
│   │   │
│   │   ├── OrderManagement/
│   │   │   ├── OrderManagement.jsx         # Parent component
│   │   │   ├── OrderManagement.css
│   │   │   ├── ProductOrdersTab.jsx        # Tab component
│   │   │   ├── RepairRequestsTab.jsx       # Tab component
│   │   │   ├── OrderFilters.jsx            # Filters component
│   │   │   ├── OrderTable.jsx              # Table component
│   │   │   ├── OrderDetailModal.jsx        # Modal component
│   │   │   ├── RepairDetailModal.jsx       # Modal component
│   │   │   ├── TechnicianAssignModal.jsx   # Modal component
│   │   │   └── index.js
│   │   │
│   │   └── index.js               # Barrel export
│   │
│   ├── data/                      # Mock data & constants
│   │   ├── mockOrders.js
│   │   ├── mockRepairRequests.js
│   │   └── index.js
│   │
│   └── hooks/                     # Custom hooks (if needed)
│       ├── useOrderFilters.js
│       └── useCountdown.js
│
├── components/                    # Shared/global components
│   ├── shared/
│   ├── layout/
│   └── home/
│
└── ...
```

### Component File Structure (Individual Component)

```
ComponentName/
├── ComponentName.jsx      # Main component logic
├── ComponentName.css      # Component styles
├── SubComponent1.jsx      # Child component 1 (if needed)
├── SubComponent2.jsx      # Child component 2 (if needed)
├── hooks.js              # Custom hooks specific to this component
├── utils.js              # Utility functions for this component
├── constants.js          # Constants used by this component
└── index.js              # Barrel export
```

---

## 🔨 Component Decomposition Pattern

### ❌ BAD: Monolithic Component (500+ lines)

```jsx
function OrderManagement() {
  // 20 useState declarations
  // 15 useEffect hooks
  // 30 utility functions
  // 5 modal handlers
  // 300 lines of JSX with complex nesting
  
  return (
    <div>
      {/* Filter section - 50 lines */}
      {/* Table section - 150 lines */}
      {/* Modal 1 - 50 lines */}
      {/* Modal 2 - 50 lines */}
      {/* Modal 3 - 50 lines */}
    </div>
  );
}
```

### ✅ GOOD: Decomposed Components

#### Parent Component (100-150 lines)
```jsx
// OrderManagement.jsx - Parent orchestrator
function OrderManagement({ activeTab, setActiveTab }) {
  // Only core state management (5-8 useState)
  // Only essential hooks (2-3 useEffect)
  // Only coordination logic
  
  return (
    <div className="order-management">
      <OrderHeader />
      <OrderTabs 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
      <OrderFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      
      {activeTab === 'products' && (
        <ProductOrdersTab orders={filteredOrders} />
      )}
      
      {activeTab === 'repairs' && (
        <RepairRequestsTab repairs={filteredRepairs} />
      )}
      
      {/* Modals */}
      {showOrderModal && (
        <OrderDetailModal 
          order={selectedOrder}
          onClose={() => setShowOrderModal(false)}
        />
      )}
    </div>
  );
}
```

#### Child Components (50-100 lines each)
```jsx
// OrderFilters.jsx - Focused on filtering UI
function OrderFilters({ filters, onFilterChange, activeTab }) {
  return (
    <div className="order-filters">
      <SearchBox value={filters.search} onChange={...} />
      <StatusFilter value={filters.status} onChange={...} />
      {activeTab === 'products' && <AreaFilter ... />}
      {activeTab === 'repairs' && <PriorityFilter ... />}
    </div>
  );
}

// ProductOrdersTab.jsx - Product orders display
function ProductOrdersTab({ orders }) {
  return (
    <OrderTable 
      orders={orders}
      columns={productColumns}
      renderActions={renderProductActions}
    />
  );
}

// OrderTable.jsx - Reusable table component
function OrderTable({ orders, columns, renderActions }) {
  return (
    <div className="orders-table-container">
      <table className="orders-table">
        {/* Table logic */}
      </table>
    </div>
  );
}
```

---

## 🎨 Component Composition Strategy

### 1. **Container/Presentational Pattern**

```jsx
// OrderManagementContainer.jsx - Logic & State
function OrderManagementContainer() {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({});
  
  // All business logic here
  
  return (
    <OrderManagementView 
      orders={orders}
      filters={filters}
      onFilterChange={handleFilterChange}
      onOrderUpdate={handleOrderUpdate}
    />
  );
}

// OrderManagementView.jsx - Pure UI
function OrderManagementView({ orders, filters, onFilterChange, onOrderUpdate }) {
  return (
    <div>
      {/* Pure presentation, no logic */}
    </div>
  );
}
```

### 2. **Compound Components Pattern**

```jsx
// For related components that work together
function OrderModal({ children, onClose }) {
  return <div className="modal">{children}</div>;
}

OrderModal.Header = function({ children }) {
  return <div className="modal-header">{children}</div>;
};

OrderModal.Body = function({ children }) {
  return <div className="modal-body">{children}</div>;
};

OrderModal.Footer = function({ children }) {
  return <div className="modal-footer">{children}</div>;
};

// Usage
<OrderModal onClose={...}>
  <OrderModal.Header>Order Details</OrderModal.Header>
  <OrderModal.Body>{content}</OrderModal.Body>
  <OrderModal.Footer>{actions}</OrderModal.Footer>
</OrderModal>
```

### 3. **Hook Extraction Pattern**

```jsx
// Extract complex logic into custom hooks
function useOrderFilters(orders, initialFilters) {
  const [filters, setFilters] = useState(initialFilters);
  const [filtered, setFiltered] = useState(orders);
  
  useEffect(() => {
    // Filter logic
  }, [orders, filters]);
  
  return { filtered, filters, setFilters };
}

// Use in component
function OrderManagement() {
  const { filtered, filters, setFilters } = useOrderFilters(orders, {});
  
  return <OrderTable orders={filtered} />;
}
```

---

## 📋 Naming Conventions

### Component Names
- **PascalCase** for components: `OrderManagement`, `AdminSidebar`
- **Descriptive**: Name should explain what it does
- **Nouns**: Components are things - `OrderList` not `ListOrders`

### File Names
- **PascalCase** for components: `OrderManagement.jsx`
- **camelCase** for utilities: `orderUtils.js`, `formatDate.js`
- **kebab-case** for CSS: `order-management.css`
- **UPPERCASE** for constants: `API_ENDPOINTS.js`

### Folder Names
- **PascalCase** for component folders: `OrderManagement/`
- **camelCase** for utility folders: `utils/`, `hooks/`, `data/`

### Function Names
- **camelCase**: `handleSubmit`, `calculateTotal`
- **Prefix with "handle"** for event handlers: `handleClick`, `handleChange`
- **Prefix with "render"** for render functions: `renderActions`, `renderRow`
- **Prefix with "use"** for hooks: `useOrderFilters`, `useCountdown`

---

## 🧩 Code Organization Within Files

### Import Order
```jsx
// 1. External dependencies
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock } from 'lucide-react';

// 2. Internal absolute imports (if using)
import { Button } from '@/components/ui';

// 3. Relative imports - Components
import OrderTable from './OrderTable';
import OrderFilters from './OrderFilters';

// 4. Relative imports - Data/Utils
import { mockOrders } from '../data/mockOrders';
import { formatDate, calculateTotal } from './utils';

// 5. Styles (last)
import './OrderManagement.css';
```

### Component Structure Order
```jsx
function ComponentName() {
  // 1. Hooks (useState, useEffect, custom hooks)
  const [state, setState] = useState();
  useEffect(() => {}, []);
  
  // 2. Derived state / Memoization
  const derivedValue = useMemo(() => {}, []);
  
  // 3. Event handlers
  const handleClick = () => {};
  const handleSubmit = () => {};
  
  // 4. Render helpers
  const renderItem = (item) => {};
  
  // 5. Early returns (conditional rendering)
  if (loading) return <Spinner />;
  if (error) return <Error />;
  
  // 6. Main render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}

// 7. PropTypes / TypeScript types (if using)
ComponentName.propTypes = {};

// 8. Default export
export default ComponentName;
```

---

## 🚨 Anti-Patterns to Avoid

### ❌ DON'T: God Components
```jsx
// 800 line component that does everything
function Dashboard() {
  // User management
  // Order management
  // Analytics
  // Settings
  // Notifications
  // Profile
  // Everything else
}
```

### ❌ DON'T: Prop Drilling Hell
```jsx
<GrandParent>
  <Parent data={data} handler={handler}>
    <Child data={data} handler={handler}>
      <GrandChild data={data} handler={handler}>
        <GreatGrandChild data={data} handler={handler} />
      </GrandChild>
    </Child>
  </Parent>
</GrandParent>
```

**✅ DO: Use Context or Composition**

### ❌ DON'T: Inline Everything
```jsx
<button onClick={() => {
  // 50 lines of logic here
}}>
  Click
</button>
```

**✅ DO: Extract to named function**

### ❌ DON'T: Duplicate Code
```jsx
// Same logic in 5 different components
function ComponentA() {
  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );
}
```

**✅ DO: Extract to utility or hook**

---

## ✅ Refactoring Checklist

When creating or modifying components, ask:

- [ ] Is this component under 250 lines?
- [ ] Does it have a single, clear responsibility?
- [ ] Can I explain what it does in one sentence?
- [ ] Are there repeating patterns that can be extracted?
- [ ] Is the JSX readable without excessive nesting?
- [ ] Can someone else understand this in 5 minutes?
- [ ] Are props clearly named and purposeful?
- [ ] Is state management appropriate (local vs global)?
- [ ] Are side effects properly managed in useEffect?
- [ ] Is the component testable in isolation?

---

## 🎯 Quick Decision Tree

**"Should I split this component?"**

```
Is file > 250 lines? ──YES──> Split immediately
    │
    NO
    ↓
Has > 5 useState? ──YES──> Consider splitting by concern
    │
    NO
    ↓
JSX > 150 lines? ──YES──> Extract sections to components
    │
    NO
    ↓
> 3 modals/dialogs? ──YES──> Extract to separate modal components
    │
    NO
    ↓
Handles multiple tabs? ──YES──> Extract each tab to component
    │
    NO
    ↓
Keep as is, but monitor
```

---

## 📚 Real Example: OrderManagement Refactor

### Before (550 lines - BAD)
```
OrderManagement.jsx (550 lines)
├── All state (15 useState)
├── All filters logic
├── Product orders table
├── Repair requests table
├── 3 different modals
└── All event handlers
```

### After (Proper Structure - GOOD)
```
OrderManagement/
├── OrderManagement.jsx (150 lines)        # Parent orchestrator
├── OrderManagement.css
├── OrderHeader.jsx (30 lines)             # Header section
├── OrderTabs.jsx (40 lines)               # Tab switcher
├── OrderFilters.jsx (80 lines)            # All filter UI
├── ProductOrdersTab.jsx (120 lines)       # Products tab
├── RepairRequestsTab.jsx (120 lines)      # Repairs tab
├── OrderDetailModal.jsx (100 lines)       # Order modal
├── RepairDetailModal.jsx (100 lines)      # Repair modal
├── TechnicianAssignModal.jsx (80 lines)   # Assign modal
├── hooks/
│   ├── useOrderFilters.js (50 lines)      # Filter logic
│   └── useCountdown.js (40 lines)         # Countdown logic
└── index.js
```

**Benefits:**
- ✅ Each file < 150 lines
- ✅ Clear separation of concerns
- ✅ Reusable components
- ✅ Easy to test individually
- ✅ Easy to maintain and modify
- ✅ Clear file organization

---

## 🎓 Summary: Golden Rules

1. **One component = One file** (except tiny sub-components)
2. **One responsibility per component**
3. **250 lines is the red line** - split before reaching it
4. **Extract early, extract often**
5. **Composition over complexity**
6. **Name things clearly**
7. **Organize by feature, not by type**
8. **Keep parent components thin** - delegate to children
9. **Custom hooks for complex logic**
10. **Document when you split** - explain the structure

---

## 🔄 When to Apply These Rules

### Always Apply:
- Creating new features
- Adding new pages
- Building complex UI sections
- When component exceeds 200 lines

### Consider Applying:
- Refactoring existing code
- When debugging becomes difficult
- When adding new features to existing components
- When team members report confusion

### Don't Over-Apply:
- Simple utility components (< 50 lines)
- One-time use components
- Prototype/POC code (but refactor before merging)
- When it makes code harder to understand

---

**Remember: These rules exist to make code maintainable, not to make it perfect. Use judgment, but lean towards splitting when in doubt.**

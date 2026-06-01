# Admin Role-Based Access Control (RBAC) System

## Overview
The admin dashboard now implements a hierarchical role-based access control system with 4 distinct roles, each with specific permissions and restrictions.

---

## 🎭 Role Definitions

### 1. Super Admin 👑
**Role ID:** `super_admin`

**Capabilities:**
- **Full system access** to all features and sections
- **Can add/edit/delete** all other roles including other super admins
- **Cannot be deleted** (system protection)
- **Maximum 4 users** with this role (hard limit)

**Access:**
- ✅ Dashboard & Analytics
- ✅ Product Orders & Repair Requests
- ✅ Products (Inventory, Categories, Deals)
- ✅ Services (Repair Services, Service Categories)
- ✅ Customers
- ✅ Coverage & Logistics
- ✅ Content Management
- ✅ Activity Logs
- ✅ Settings (Password Change, **Admin Management**)

---

### 2. Admin 🔧
**Role ID:** `admin`

**Capabilities:**
- **Full access** to all operational features
- **Cannot add/delete** admins or super admins
- **Cannot access** Admin Management section
- Can change own password

**Access:**
- ✅ Dashboard & Analytics
- ✅ Product Orders & Repair Requests
- ✅ Products (Inventory, Categories, Deals)
- ✅ Services (Repair Services, Service Categories)
- ✅ Customers
- ✅ Coverage & Logistics
- ✅ Content Management
- ✅ Activity Logs
- ✅ Settings (Password Change only)
- ❌ Admin Management

---

### 3. Order Manager 📦
**Role ID:** `order_manager`

**Capabilities:**
- **Limited to product order management**
- Read-only access to products and customers
- Cannot access repair services or admin settings

**Access:**
- ✅ Dashboard (limited view)
- ✅ Product Orders (full access)
- ✅ Products (read-only for reference)
- ✅ Customers (read-only)
- ✅ Settings (Password Change only)
- ❌ Repair Requests
- ❌ Services
- ❌ Admin Management
- ❌ Activity Logs

---

### 4. Technician 🛠️
**Role ID:** `technician`

**Capabilities:**
- **Limited to repair request management**
- Read-only access to services and customers
- Cannot access product orders or admin settings

**Access:**
- ✅ Dashboard (limited view)
- ✅ Repair Requests (full access)
- ✅ Services (read-only for reference)
- ✅ Customers (read-only)
- ✅ Settings (Password Change only)
- ❌ Product Orders
- ❌ Products
- ❌ Admin Management
- ❌ Activity Logs

---

## 🔐 Permission Matrix

| Feature | Super Admin | Admin | Order Manager | Technician |
|---------|-------------|-------|---------------|------------|
| Dashboard | ✅ Full | ✅ Full | ✅ Limited | ✅ Limited |
| Product Orders | ✅ | ✅ | ✅ | ❌ |
| Repair Requests | ✅ | ✅ | ❌ | ✅ |
| Products | ✅ | ✅ | ✅ (Read) | ❌ |
| Services | ✅ | ✅ | ❌ | ✅ (Read) |
| Customers | ✅ | ✅ | ✅ (Read) | ✅ (Read) |
| Coverage & Logistics | ✅ | ✅ | ❌ | ❌ |
| Content Management | ✅ | ✅ | ❌ | ❌ |
| Activity Logs | ✅ | ✅ | ❌ | ❌ |
| Admin Management | ✅ | ❌ | ❌ | ❌ |
| Password Change | ✅ | ✅ | ✅ | ✅ |

---

## 🚀 Setup Instructions

### Step 1: Create Your First Super Admin

Go to Firebase Console → Firestore Database → `admin` collection → Add Document:

```json
{
  "email": "youremail@example.com",
  "role": "super_admin",
  "addedBy": "system",
  "addedAt": "2026-05-29T10:00:00Z",
  "active": true
}
```

**Document ID:** Use the email as the document ID (e.g., `youremail@example.com`)

### Step 2: Add Remaining Super Admins (Max 3 More)

You can add up to 3 more super admins through:
1. Firebase Console (manually)
2. Admin Management section (after logging in as super admin)

### Step 3: Add Other Roles

Once logged in as a super admin, navigate to:
**Admin Dashboard → Settings → Admin Management**

- Select role type (Admin, Order Manager, or Technician)
- Enter email address
- Click "Send Invite"
- User receives password setup email

---

## 🔒 Security Rules

Update your **Firestore Security Rules** to enforce role-based access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             exists(/databases/$(database)/documents/admin/$(request.auth.email));
    }
    
    // Helper function to get admin role
    function getAdminRole() {
      return get(/databases/$(database)/documents/admin/$(request.auth.email)).data.role;
    }
    
    // Helper function to check specific permission
    function hasRole(role) {
      return isAdmin() && getAdminRole() == role;
    }
    
    // Admin collection - only super admins can manage
    match /admin/{email} {
      allow read: if isAdmin();
      allow create, update: if hasRole('super_admin');
      allow delete: if hasRole('super_admin') && 
                       get(/databases/$(database)/documents/admin/$(email)).data.role != 'super_admin';
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if isAdmin();
      allow write: if hasRole('super_admin') || hasRole('admin');
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if isAdmin();
      allow write: if hasRole('super_admin') || hasRole('admin') || hasRole('order_manager');
    }
    
    // Repair requests collection
    match /repair_requests/{requestId} {
      allow read: if isAdmin();
      allow write: if hasRole('super_admin') || hasRole('admin') || hasRole('technician');
    }
    
    // Activity logs - super admin and admin only
    match /activity_logs/{logId} {
      allow read: if hasRole('super_admin') || hasRole('admin');
      allow create: if isAdmin();
    }
    
    // Users collection - read access for all admins
    match /users/{userId} {
      allow read: if isAdmin();
      allow write: if hasRole('super_admin') || hasRole('admin');
    }
  }
}
```

---

## 🎯 Role Management Rules

### Super Admin Restrictions:
1. **Maximum 4 super admins** - System enforces this limit
2. **Cannot be deleted** - Delete button disabled for super admin accounts
3. **Cannot change their own role** - Role dropdown shows "Protected"
4. **Only super admins can manage** other super admins

### Role Change Restrictions:
- Super admins **cannot** have their role changed
- Regular admins **cannot** add or remove other admins
- Users **cannot** change their own role (except password)

### Delete Protection:
- Super admins are **permanently protected** from deletion
- Users **cannot delete themselves**
- Only super admins can delete other non-super-admin users

---

## 💡 Best Practices

### 1. Super Admin Distribution
- Assign to **founders/core team** only
- Keep **exactly 4** for redundancy
- Use for **critical operations** only

### 2. Admin Distribution
- Assign to **department heads** or **senior managers**
- Full operational access without admin management
- Best for **day-to-day** management

### 3. Order Manager Distribution
- Assign to **fulfillment team** or **inventory staff**
- Limited to **product orders** only
- Perfect for **order processing** specialists

### 4. Technician Distribution
- Assign to **repair technicians** or **service staff**
- Limited to **repair requests** only
- Ideal for **technical support** teams

---

## 🔄 Migration from Old System

If you have existing admins with old roles:

1. **Old `superadmin`** → **New `super_admin`**
2. **Old `admin`** → **New `admin`**
3. **Old `viewer`** → Decide between `order_manager` or `technician` based on responsibility

Update manually in Firestore:
```
1. Go to Firestore → admin collection
2. Open each admin document
3. Change "role" field from old value to new value
4. Save
```

---

## 📊 Role Usage Example

### E-commerce Store Team Structure:

- **Super Admins (2):**
  - CEO: complete oversight
  - CTO: technical management

- **Admins (3):**
  - Operations Manager
  - Marketing Manager
  - Customer Service Manager

- **Order Managers (4):**
  - Warehouse Manager
  - Shipping Coordinator
  - Inventory Clerk
  - Order Processing Team Lead

- **Technicians (6):**
  - Senior Repair Technician (x2)
  - Junior Repair Technician (x3)
  - Parts Specialist

**Total: 15 admin users** across 4 role types

---

## 🐛 Troubleshooting

### Issue: Cannot add 5th super admin
**Solution:** This is by design. Remove one existing super admin first (if they left the company) or promote to regular admin.

### Issue: Cannot delete a super admin
**Solution:** Super admins are protected from deletion. Change their role to "admin" first (requires another super admin).

### Issue: Technician can see product orders
**Solution:** Check their role in Firestore. Should be `technician`, not `admin` or `order_manager`.

### Issue: Order manager cannot access orders
**Solution:** Verify permissions in adminService.js - they need `product_orders` permission.

---

## 📝 Summary

The role system provides:
✅ **Hierarchical access control**
✅ **Principle of least privilege**
✅ **Super admin protection**
✅ **Flexible team management**
✅ **Audit trail** via activity logs

Perfect for scaling your admin team while maintaining security! 🚀

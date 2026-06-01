# Cart, Wishlist & Order Management System - Requirements & Implementation Plan

## 📊 Current State Analysis

### ✅ What Already Exists

#### Frontend Components
- **CartPage.jsx** - UI for cart display (mock data)
- **WishlistPage.jsx** - UI for wishlist display (mock data)
- **OrderManagement.jsx** - Admin order dashboard with filters, status updates, technician assignment

#### Firebase Services
- **productsService.js** - Product CRUD operations
- **userService.js** - User profile management
- **authService.js** - Firebase authentication
- **adminService.js** - Admin role management

#### Authentication System
- **AuthContext** - Google OAuth, Email/Password, Phone OTP
- **AdminContext** - Role-based access control (super_admin, admin, order_manager, technician)
- User profile creation on first login

#### Data Models (Mock)
- Product orders with status tracking (pending → processing → out-for-delivery → delivered)
- Repair service requests with technician assignment
- 4-hour delivery countdown timer
- Order filtering by status, area, date

### ❌ What's Missing

#### User-Facing Features
- **No persistent cart** - Cart data is local state only, lost on refresh
- **No persistent wishlist** - Wishlist data is local state only
- **No checkout flow** - Can't actually place orders
- **No order history** - Users can't view past orders
- **No order tracking** - No way to track order status from user side
- **No payment integration** - No payment gateway
- **No delivery address management** - No address selection/editing
- **No real-time cart sync** - Cart not synced across devices

#### Firebase Backend
- **No cart collection** - No Firebase storage for carts
- **No wishlist collection** - No Firebase storage for wishlists
- **No orders collection** - No real order data in Firestore
- **No order service** - No Firebase CRUD operations for orders
- **No cart/wishlist services** - No Firebase integration

#### Admin Features
- **Orders are mock data** - Admin dashboard uses hardcoded orders
- **No inventory sync** - Product stock not updated when orders placed
- **No order creation from admin** - Can't manually create orders
- **No invoice generation** - Missing from requirements
- **No order analytics** - No revenue tracking, trends

---

## 👤 USER PERSPECTIVE REQUIREMENTS

### 1. 🛒 Shopping Cart Features

#### Core Functionality
- **Add to Cart**
  - Add products from product pages
  - Select quantity (default: 1)
  - Check stock availability before adding
  - Show success notification with cart preview
  
- **View Cart**
  - Display all cart items with:
    - Product image, name, specs
    - Unit price and quantity
    - Subtotal per item
    - Stock status indicator
  - Show order summary:
    - Subtotal
    - Shipping (FREE over ₹50,000)
    - Tax (GST 18%)
    - Total amount
  
- **Update Cart**
  - Increase/decrease quantity
  - Remove individual items
  - Clear entire cart
  - Move items to wishlist
  - Save for later
  
- **Cart Validation**
  - Check stock availability before checkout
  - Remove out-of-stock items automatically
  - Update prices if changed
  - Apply maximum order quantity limits
  
- **Cart Persistence**
  - Save cart to Firebase (logged-in users)
  - Sync cart across devices
  - Merge cart on login (local + Firebase)
  - Keep cart for 30 days
  - Guest cart in localStorage

#### Advanced Features
- **Quick Actions**
  - Add to cart from product cards (without page reload)
  - Buy now (add + checkout immediately)
  - Continue shopping link
  
- **Cart Sidebar/Drawer**
  - Mini cart in navbar (item count badge)
  - Slide-out cart preview on hover/click
  - Quick checkout from mini cart
  
- **Recommendations**
  - "Frequently bought together"
  - "You may also like" in cart
  - Cross-sell accessories

### 2. ❤️ Wishlist Features

#### Core Functionality
- **Add to Wishlist**
  - Heart icon on product cards
  - Save for later from cart
  - Add from product detail page
  - Show visual feedback (heart filled)
  
- **View Wishlist**
  - Grid layout with product cards
  - Product image, name, price, badge
  - Stock status indicator
  - Move to cart button
  - Remove from wishlist button
  
- **Wishlist Actions**
  - Move to cart (single or multiple)
  - Remove items
  - Share wishlist (future)
  - Price drop alerts (future)
  
- **Wishlist Persistence**
  - Save to Firebase (logged-in users)
  - Sync across devices
  - Guest wishlist in localStorage
  - No expiry (permanent until removed)

#### Advanced Features
- **Price Tracking**
  - Notify when price drops
  - Show price history
  - "Deal alert" badge
  
- **Stock Alerts**
  - Email when out-of-stock item returns
  - "Back in stock" notification

### 3. 🛍️ Checkout Flow

#### Step 1: Cart Review
- Display cart items
- Apply coupon code (future)
- Select delivery area (from 6 Pune zones)
- Verify stock availability
- Show estimated delivery time

#### Step 2: Delivery Information
- **Saved Addresses**
  - List of saved delivery addresses
  - Select address or add new
  - Set default address
  - Edit/delete addresses
  
- **New Address Form**
  - Full name
  - Phone number
  - Address line 1 & 2
  - Landmark
  - Pincode
  - City (Pune - fixed)
  - Delivery area (dropdown: 6 zones)
  - Address type (Home/Office)
  - Save address option

#### Step 3: Payment Method
- **Payment Options**
  - Credit/Debit Card
  - UPI (GPay, PhonePe, Paytm)
  - Net Banking
  - Cash on Delivery (COD)
  - Wallet (Paytm, PhonePe)
  
- **Payment Integration**
  - Razorpay / Stripe integration
  - Secure payment gateway
  - Save card for future (optional)
  - Apply wallet balance

#### Step 4: Order Confirmation
- Order ID generation
- Order summary display
- Estimated delivery time (4 hours)
- Payment confirmation
- Send confirmation email/SMS
- Clear cart after successful order
- Redirect to order tracking page

#### Validation & Error Handling
- Stock validation before payment
- Address validation (pincode, area)
- Payment failure handling
- Retry payment option
- Order creation rollback on failure

### 4. 📦 Order Management (User Side)

#### Order History
- **Order List**
  - Show all orders (most recent first)
  - Display per order:
    - Order ID, date, time
    - Status badge (pending/processing/delivered)
    - Total amount
    - Delivery address (short)
    - "View Details" button
  
- **Filters**
  - All orders
  - Active orders (pending/processing)
  - Completed orders
  - Cancelled orders
  - Date range filter
  - Search by order ID/product name

#### Order Details Page
- **Order Information**
  - Order ID, date, time
  - Status with timeline
  - Payment status
  - Payment method
  
- **Items Ordered**
  - Product images
  - Product names
  - Quantity × Unit price
  - Subtotal per item
  
- **Delivery Information**
  - Full delivery address
  - Phone number
  - Landmark
  - Delivery area
  
- **Pricing Breakdown**
  - Subtotal
  - Shipping charges
  - Tax (GST)
  - Total amount paid
  
- **Actions**
  - Track order (if in transit)
  - Cancel order (if pending)
  - Download invoice
  - Rate product (if delivered)
  - Request repair/support
  - Reorder items

#### Order Tracking
- **Live Status Updates**
  - Order placed ✓
  - Payment confirmed ✓
  - Order confirmed ✓
  - Preparing for dispatch
  - Out for delivery (with delivery person)
  - Delivered
  
- **4-Hour Countdown Timer**
  - Time remaining for delivery
  - Progress bar
  - Color coding:
    - Green: 2+ hours remaining
    - Yellow: 1-2 hours
    - Red: <1 hour
    - Grey: Overdue
  
- **Delivery Person Details** (when out for delivery)
  - Name
  - Phone number
  - Vehicle number
  - Photo (future)
  - Live location on map (future)

#### Order Cancellation
- **Cancel Reasons**
  - Changed my mind
  - Found better price elsewhere
  - Ordered by mistake
  - Too long delivery time
  - Other (text input)
  
- **Cancellation Policy**
  - Free cancellation within 30 mins
  - Can only cancel if not dispatched
  - Refund processed in 5-7 days
  - Show refund timeline

### 5. 🔧 Repair Service Orders

#### Service Request Flow
- **Browse Services**
  - Service category (Laptop/Mobile/Computer)
  - Service type (screen, battery, etc.)
  - View service details, price, warranty
  
- **Request Service**
  - Select device details
    - Brand, model, year
    - Issue description (text area)
    - Upload photos (optional)
  - Select priority (Normal/Urgent)
  - Select delivery area
  - Choose pickup or drop-off
  
- **Service Booking**
  - Select pickup date & time slot
  - Pickup address (same as delivery address)
  - Contact information
  - Special instructions
  
- **Service Tracking**
  - Request received
  - Pickup scheduled
  - Device received
  - Diagnosis completed
  - Repair in progress
  - Quality check
  - Ready for delivery
  - Delivered
  
- **Service History**
  - View all past service requests
  - Re-book same service
  - Download service invoice
  - Warranty status

---

## 👨‍💼 ADMIN PERSPECTIVE REQUIREMENTS

### 1. 📊 Order Management Dashboard

#### Product Orders Section

##### Order List View
- **Display Columns**
  - Order ID (clickable)
  - Order Date & Time
  - Customer Name (with email/phone on hover)
  - Items (count badge + preview on hover)
  - Delivery Area
  - Payment Status (Paid/Pending/Failed)
  - Order Status (Pending/Processing/Out for Delivery/Delivered)
  - Total Amount
  - 4-Hour Countdown Timer
  - Actions (View/Update/Cancel)

##### Filters & Search
- **Status Filter**
  - All orders
  - Pending (just placed)
  - Processing (being prepared)
  - Out for delivery
  - Delivered
  - Cancelled
  - Overdue (>4 hours)
  
- **Date Filter**
  - Today
  - Yesterday
  - Last 7 days
  - Last 30 days
  - Custom date range
  
- **Area Filter**
  - All areas
  - Pimpri-Chinchwad
  - Kothrud & Warje
  - Hadapsar & Magarpatta
  - Shivajinagar & Camp
  - Aundh & Baner
  - Wakad & Hinjewadi
  
- **Payment Filter**
  - All
  - Paid
  - Pending
  - Failed/Refunded
  
- **Search**
  - By order ID
  - By customer name/email/phone
  - By product name

##### Bulk Actions
- **Select Multiple Orders**
  - Bulk status update
  - Bulk export to CSV/PDF
  - Bulk assign delivery person
  - Bulk print invoices
  
- **Quick Actions Toolbar**
  - Refresh list
  - Export current view
  - Print selected
  - Mark as processing (bulk)
  - Mark as dispatched (bulk)

#### Order Details Modal/Page

##### Order Information Tab
- **Order Summary**
  - Order ID, date, time
  - Current status with timeline
  - Payment status & method
  - Order source (web/app)
  - Created by (admin name if manual order)
  
- **Customer Details**
  - Full name
  - Email address
  - Phone number
  - Customer ID (link to customer profile)
  - Total orders by this customer
  - Lifetime value
  
- **Delivery Information**
  - Complete address
  - Delivery area
  - Landmark
  - Pincode
  - GPS coordinates (future)
  - Preferred delivery time
  
- **Items Ordered**
  - Product image thumbnail
  - Product name (link to product page)
  - SKU/Product ID
  - Quantity
  - Unit price
  - Discount applied
  - Subtotal
  - Stock status indicator
  
- **Pricing Breakdown**
  - Items subtotal
  - Shipping charges
  - Tax (GST 18%)
  - Discount/Coupon
  - Total amount
  - Amount paid
  - Amount refunded (if any)

##### Order Timeline Tab
- **Status History**
  - Order placed - timestamp - system
  - Payment confirmed - timestamp - system
  - Order confirmed - timestamp - Admin Name
  - Assigned to delivery - timestamp - Admin Name
  - Out for delivery - timestamp - Delivery Person
  - Delivered - timestamp - Delivery Person
  - (or) Cancelled - timestamp - Admin Name/Customer
  
- **Activity Log**
  - Order modifications
  - Status changes
  - Payment updates
  - Admin actions
  - Customer actions
  - System notifications sent

##### Actions & Updates
- **Status Update Buttons**
  - Confirm Order
  - Mark as Processing
  - Assign Delivery Person
  - Mark Out for Delivery
  - Mark as Delivered
  - Cancel Order
  
- **Order Modifications**
  - Add item to order
  - Remove item from order
  - Change quantity
  - Update address
  - Update phone number
  - Apply discount
  - Adjust price (with reason)
  
- **Communication**
  - Send notification to customer
  - Send SMS
  - Send email
  - Call customer (click-to-call)
  - Internal notes (not visible to customer)
  
- **Documents**
  - Generate invoice (PDF)
  - Print packing slip
  - Print delivery label
  - Download order details (JSON/CSV)
  
- **Refund & Returns**
  - Initiate refund
  - Process partial refund
  - Track refund status
  - Record return reason

#### 4-Hour Delivery Monitoring

##### Critical Alerts Dashboard
- **Approaching Deadline Orders**
  - Orders with <1 hour remaining
  - Orders with <30 mins remaining
  - Overdue orders (>4 hours)
  - Visual alerts (red banner)
  - Sound notifications (optional)
  - Desktop notifications
  
- **Alert Actions**
  - Prioritize order
  - Fast-track dispatch
  - Assign priority delivery person
  - Contact customer
  - Mark as exception (with reason)
  
- **Daily Compliance Tracking**
  - Total orders today
  - Delivered within 4 hours (%)
  - Average delivery time
  - Overdue order count
  - Exceptions granted

### 2. 🔧 Repair Service Management

#### Service Request Queue

##### Request List View
- **Display Columns**
  - Request ID
  - Date & Time
  - Customer Name & Phone
  - Device (Brand, Model)
  - Issue Type
  - Priority (Normal/Urgent)
  - Status (Received/Diagnosed/Repairing/Completed)
  - Assigned Technician
  - Estimated Cost
  - Estimated Completion Time
  - Actions

##### Filters
- Status filter (all/received/diagnosed/repairing/completed)
- Priority filter (all/normal/urgent)
- Technician filter (all/unassigned/specific technician)
- Date range
- Device type (Laptop/Mobile/Computer)
- Search by request ID, customer, device

#### Service Request Details

##### Request Information
- Request ID, date, time
- Current status with progress bar
- Priority level
- Service category & type
- Estimated cost (range)
- Actual cost (after diagnosis)
- Warranty applicable (yes/no)
- Warranty period

##### Device Details
- Device type (Laptop/Mobile/Computer)
- Brand & Model
- Purchase date / Age
- Issue description (from customer)
- Photos uploaded by customer
- Diagnosis notes (from technician)
- Parts required
- Parts availability

##### Customer Information
- Name, email, phone
- Pickup address
- Preferred contact method
- Previous service history
- Customer notes

##### Technician Assignment
- Assign available technician
- View technician workload
- Technician skills/expertise
- Estimated time by technician
- Technician notes
- Task priority queue

##### Service Timeline
- Request received
- Pickup scheduled/completed
- Device received at service center
- Diagnosis completed
- Customer approval for cost
- Repair started
- Repair completed
- Quality check done
- Ready for delivery
- Device delivered

#### Actions
- Update status
- Assign/reassign technician
- Update estimated cost
- Update actual cost
- Add diagnosis notes
- Request parts
- Send status update to customer
- Schedule pickup/delivery
- Mark completed
- Generate service invoice

### 3. 📦 Inventory Management Integration

#### Stock Tracking
- **Real-time Stock Updates**
  - Reduce stock when order placed
  - Reserve stock on order (prevent overselling)
  - Release stock if order cancelled
  - Stock alerts (low stock threshold)
  - Out of stock notifications
  
- **Stock History**
  - Stock movement log
  - Orders consuming stock
  - Manual adjustments
  - Restocking events

#### Automatic Actions
- **When Stock Low**
  - Email alert to admin
  - Show badge in admin dashboard
  - Disable "Add to Cart" on frontend
  - Show "Only X left" message
  
- **When Out of Stock**
  - Mark product as out of stock
  - Remove from featured/deals
  - Show "Notify when available"
  - Collect customer emails for restock alert

### 4. 👥 Customer Data & Analytics

#### Customer Management
- **Customer Profile**
  - Basic info (from users collection)
  - Total orders count
  - Total amount spent
  - Lifetime value
  - Average order value
  - Last order date
  - Wishlist items count
  - Cart items count
  
- **Order History**
  - All orders by customer
  - Product preferences
  - Favorite categories
  - Repeat purchase pattern
  
- **Service History**
  - All repair requests
  - Devices serviced
  - Warranty status
  - Service feedback
  
- **Communication Log**
  - Emails sent
  - SMS sent
  - Support tickets
  - Notes by admin

#### Customer Segments
- New customers (1st order)
- Repeat customers
- High-value customers (>₹50,000 spent)
- At-risk customers (no order in 90 days)
- VIP customers (manual tag)

#### Analytics Dashboard
- **Sales Metrics**
  - Total revenue (today/week/month)
  - Order count
  - Average order value
  - Revenue by category
  - Revenue by area
  - Top selling products
  - Revenue trends chart
  
- **Order Metrics**
  - Orders placed
  - Orders completed
  - Orders cancelled
  - Cancellation rate
  - 4-hour compliance rate
  - Average delivery time
  - Overdue orders
  
- **Customer Metrics**
  - New customers
  - Returning customers
  - Customer retention rate
  - Customer lifetime value
  - Churn rate
  
- **Product Metrics**
  - Best sellers
  - Slow movers
  - Out of stock products
  - Low margin products
  - Product return rate

### 5. 📄 Reports & Exports

#### Standard Reports
- **Daily Sales Report**
  - Orders summary
  - Revenue breakdown
  - Payment methods
  - Delivery areas
  - Export to PDF/Excel
  
- **Weekly Summary**
  - Week-over-week comparison
  - Best performing days
  - Peak hours
  - Product performance
  
- **Monthly Report**
  - Monthly trends
  - Goal achievement
  - Customer growth
  - Inventory turnover
  
- **Custom Date Range Reports**
  - Flexible date selection
  - Multiple report types
  - Compare periods
  - Export in multiple formats

#### Export Options
- Orders export (CSV/Excel/JSON)
- Customer export
- Product sales export
- Service requests export
- Payment transactions export
- Delivery performance export

---

## 🗄️ FIREBASE DATABASE STRUCTURE

### Collections & Document Structure

#### 1. `carts` Collection
```javascript
carts/{userId} {
  userId: string,
  items: [
    {
      productId: string,
      name: string,
      image: string,
      price: number,
      quantity: number,
      addedAt: timestamp,
      inStock: boolean
    }
  ],
  updatedAt: timestamp,
  createdAt: timestamp
}
```

#### 2. `wishlists` Collection
```javascript
wishlists/{userId} {
  userId: string,
  items: [
    {
      productId: string,
      addedAt: timestamp
    }
  ],
  updatedAt: timestamp
}
```

#### 3. `orders` Collection
```javascript
orders/{orderId} {
  orderId: string, // Auto-generated
  userId: string,
  status: string, // pending/processing/out-for-delivery/delivered/cancelled
  
  // Order Items
  items: [
    {
      productId: string,
      name: string,
      image: string,
      price: number,
      quantity: number,
      subtotal: number
    }
  ],
  
  // Customer Info
  customer: {
    name: string,
    email: string,
    phone: string,
    userId: string
  },
  
  // Delivery Info
  deliveryAddress: {
    addressLine1: string,
    addressLine2: string,
    landmark: string,
    pincode: string,
    city: string,
    area: string, // One of 6 Pune zones
    addressType: string, // Home/Office
    phone: string
  },
  
  // Pricing
  subtotal: number,
  shippingCharges: number,
  tax: number, // GST 18%
  discount: number, // If coupon applied
  totalAmount: number,
  
  // Payment
  paymentStatus: string, // pending/paid/failed/refunded
  paymentMethod: string, // card/upi/netbanking/cod
  paymentId: string, // From payment gateway
  paidAt: timestamp,
  
  // Timestamps
  orderDate: timestamp,
  orderDeadline: timestamp, // orderDate + 4 hours
  confirmedAt: timestamp,
  dispatchedAt: timestamp,
  deliveredAt: timestamp,
  cancelledAt: timestamp,
  
  // Delivery Tracking
  deliveryPerson: {
    name: string,
    phone: string,
    vehicleNumber: string
  },
  
  // Status History
  statusHistory: [
    {
      status: string,
      timestamp: timestamp,
      updatedBy: string, // admin email or 'customer' or 'system'
      notes: string
    }
  ],
  
  // Metadata
  source: string, // web/app/admin
  createdBy: string, // admin email if manual order
  notes: string, // Internal admin notes
  cancellationReason: string,
  
  // Compliance
  deliveredWithin4Hours: boolean,
  actualDeliveryTime: number, // minutes
  exceptionGranted: boolean,
  exceptionReason: string
}
```

#### 4. `repair_requests` Collection
```javascript
repair_requests/{requestId} {
  requestId: string,
  userId: string,
  status: string, // received/diagnosed/repairing/completed/cancelled
  
  // Customer Info
  customer: {
    name: string,
    email: string,
    phone: string,
    userId: string
  },
  
  // Device Info
  device: {
    type: string, // laptop/mobile/computer
    brand: string,
    model: string,
    purchaseDate: string,
    issue: string,
    description: string,
    photos: [string] // URLs
  },
  
  // Service Info
  serviceCategory: string,
  serviceType: string,
  priority: string, // normal/urgent
  estimatedCost: number,
  actualCost: number,
  warranty: string, // "6 months", "1 year"
  partsRequired: [string],
  
  // Assignment
  technician: {
    id: string,
    name: string,
    phone: string,
    assignedAt: timestamp
  },
  
  // Address
  pickupAddress: {
    addressLine1: string,
    addressLine2: string,
    landmark: string,
    area: string,
    pincode: string,
    phone: string
  },
  
  // Timestamps
  requestDate: timestamp,
  pickupScheduled: timestamp,
  deviceReceived: timestamp,
  diagnosisCompleted: timestamp,
  repairStarted: timestamp,
  repairCompleted: timestamp,
  qualityChecked: timestamp,
  deliveredAt: timestamp,
  estimatedCompletion: timestamp,
  
  // Service History
  serviceHistory: [
    {
      action: string,
      timestamp: timestamp,
      by: string, // technician name or admin
      notes: string
    }
  ],
  
  // Notes
  diagnosisNotes: string,
  technicianNotes: string,
  adminNotes: string,
  customerNotes: string,
  
  // Payment
  paymentStatus: string,
  paymentMethod: string,
  paymentId: string,
  paidAt: timestamp,
  
  // Invoice
  invoiceUrl: string,
  invoiceNumber: string
}
```

#### 5. `user_addresses` Collection
```javascript
user_addresses/{addressId} {
  addressId: string,
  userId: string,
  
  fullName: string,
  phone: string,
  addressLine1: string,
  addressLine2: string,
  landmark: string,
  pincode: string,
  city: string,
  area: string, // One of 6 Pune zones
  addressType: string, // Home/Office/Other
  
  isDefault: boolean,
  
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 6. Update `users` Collection
```javascript
users/{userId} {
  // Existing fields...
  
  // Add cart & order related fields
  cartItemsCount: number,
  wishlistItemsCount: number,
  totalOrders: number,
  totalSpent: number,
  lifetimeValue: number,
  lastOrderDate: timestamp,
  averageOrderValue: number,
  
  // Preferences
  defaultAddressId: string,
  preferredPaymentMethod: string,
  
  // Metadata
  customerSegment: string, // new/repeat/high-value/vip
  tags: [string]
}
```

---

## 🔐 FIRESTORE SECURITY RULES

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isSignedIn() && 
             exists(/databases/$(database)/documents/admin/$(request.auth.email));
    }
    
    // Carts - users can only access their own cart
    match /carts/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    // Wishlists - users can only access their own wishlist
    match /wishlists/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    // User Addresses - users can only access their own addresses
    match /user_addresses/{addressId} {
      allow read, write: if isOwner(resource.data.userId);
    }
    
    // Orders - users can read their own, admins can read/write all
    match /orders/{orderId} {
      allow read: if isOwner(resource.data.userId) || isAdmin();
      allow create: if isSignedIn(); // Users can create orders
      allow update, delete: if isAdmin(); // Only admins can modify
    }
    
    // Repair Requests - same as orders
    match /repair_requests/{requestId} {
      allow read: if isOwner(resource.data.userId) || isAdmin();
      allow create: if isSignedIn();
      allow update, delete: if isAdmin();
    }
    
    // Products - public read, admin write
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Users - users can read/update their own profile, admins can read all
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow update: if isOwner(userId);
      allow create: if isSignedIn();
    }
  }
}
```

---

## 🛠️ IMPLEMENTATION ROADMAP

### Phase 1: Backend Foundation (Week 1)

#### Day 1-2: Firebase Services
- [ ] Create `cartService.js` with CRUD operations
- [ ] Create `wishlistService.js` with CRUD operations
- [ ] Create `orderService.js` with CRUD operations
- [ ] Create `addressService.js` for user addresses
- [ ] Update Firestore security rules

#### Day 3-4: Context & State Management
- [ ] Create `CartContext.jsx` for global cart state
- [ ] Create `WishlistContext.jsx` for global wishlist state
- [ ] Integrate with AuthContext (sync on login)
- [ ] Add localStorage fallback for guests

#### Day 5-7: Testing & Integration
- [ ] Test cart sync across devices
- [ ] Test wishlist persistence
- [ ] Test Firebase CRUD operations
- [ ] Handle edge cases (network errors, race conditions)

### Phase 2: User-Facing Features (Week 2-3)

#### Days 8-10: Cart Functionality
- [ ] Connect CartPage to Firebase
- [ ] Implement add/update/remove operations
- [ ] Add cart validation (stock check)
- [ ] Add mini cart in navbar
- [ ] Add "Add to Cart" on product pages
- [ ] Implement cart merge on login

#### Days 11-13: Wishlist Functionality
- [ ] Connect WishlistPage to Firebase
- [ ] Add heart icons on product cards
- [ ] Implement add/remove operations
- [ ] Add "Move to Cart" functionality
- [ ] Show wishlist count in navbar

#### Days 14-18: Checkout Flow
- [ ] Create CheckoutPage.jsx
- [ ] Step 1: Cart review
- [ ] Step 2: Delivery address (form + saved addresses)
- [ ] Step 3: Payment method selection
- [ ] Step 4: Order confirmation
- [ ] Integrate Razorpay payment gateway
- [ ] Handle payment success/failure

#### Days 19-21: Order Tracking
- [ ] Create OrdersPage.jsx (user order history)
- [ ] Create OrderDetailPage.jsx
- [ ] Implement order timeline
- [ ] Add 4-hour countdown timer
- [ ] Add order status badges
- [ ] Implement order cancellation

### Phase 3: Admin Features (Week 4-5)

#### Days 22-25: Order Management
- [ ] Replace mock data with real Firebase data
- [ ] Implement real-time order updates
- [ ] Add order status update functionality
- [ ] Add delivery person assignment
- [ ] Implement order filtering & search
- [ ] Add bulk actions

#### Days 26-28: Inventory Sync
- [ ] Update stock on order placement
- [ ] Reserve stock for pending orders
- [ ] Release stock on cancellation
- [ ] Add low stock alerts
- [ ] Implement out-of-stock handling

#### Days 29-32: Analytics & Reports
- [ ] Build analytics dashboard
- [ ] Add revenue tracking
- [ ] Add 4-hour compliance tracking
- [ ] Implement report generation
- [ ] Add export functionality

#### Days 33-35: Repair Service Orders
- [ ] Convert repair requests to real Firebase data
- [ ] Implement service request creation flow
- [ ] Add technician assignment logic
- [ ] Add service tracking timeline
- [ ] Generate service invoices

### Phase 4: Polish & Optimization (Week 6)

#### Days 36-38: UI/UX Improvements
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add success notifications
- [ ] Optimize mobile responsiveness
- [ ] Add animations

#### Days 39-40: Testing
- [ ] End-to-end testing
- [ ] Performance testing
- [ ] Security testing
- [ ] Cross-browser testing
- [ ] Mobile testing

#### Days 41-42: Documentation & Deployment
- [ ] Update documentation
- [ ] Create admin user guide
- [ ] Create customer user guide
- [ ] Deploy to production
- [ ] Monitor and fix issues

---

## 📝 KEY IMPLEMENTATION NOTES

### Performance Considerations
1. **Pagination**: Load orders in batches (20-50 per page)
2. **Real-time Listeners**: Use for cart/wishlist, not for all orders
3. **Caching**: Cache product data to reduce reads
4. **Lazy Loading**: Load order details only when viewing
5. **Image Optimization**: Use thumbnails for cart/order items

### Security Best Practices
1. **Validate on server**: Never trust client-side validation
2. **Stock verification**: Check stock before order creation
3. **Payment verification**: Verify payment with gateway webhook
4. **Rate limiting**: Prevent abuse (add to cart spam)
5. **Admin actions**: Log all admin modifications

### User Experience
1. **Instant feedback**: Show loading states immediately
2. **Error recovery**: Allow retry on failures
3. **Offline support**: Queue actions when offline (future)
4. **Clear messaging**: Explain why actions failed
5. **Mobile-first**: Optimize for mobile users

### Admin Experience
1. **Keyboard shortcuts**: Quick actions for power users
2. **Bulk operations**: Select multiple orders
3. **Quick filters**: One-click status filters
4. **Notifications**: Real-time alerts for critical events
5. **Export options**: Multiple format support

---

## 🎯 SUCCESS METRICS

### User Metrics
- Cart abandonment rate < 30%
- Checkout completion rate > 70%
- Average time to checkout < 3 minutes
- Order placement success rate > 95%
- User satisfaction score > 4.5/5

### Business Metrics
- 4-hour delivery compliance > 95%
- Order processing time < 15 minutes
- Average order value > ₹25,000
- Repeat customer rate > 40%
- Monthly revenue growth > 15%

### Technical Metrics
- Page load time < 2 seconds
- API response time < 500ms
- Firebase read/write efficiency > 90%
- Error rate < 1%
- Uptime > 99.9%

---

## 🚀 QUICK START CHECKLIST

Before starting implementation:
- [x] ✅ Read ADMIN_DASHBOARD.md
- [x] ✅ Read RULES.md
- [x] ✅ Understand current authentication system
- [x] ✅ Review existing Firebase services
- [ ] Set up Razorpay account (payment gateway)
- [ ] Create test Firebase collections
- [ ] Set up Firestore security rules
- [ ] Create test user accounts
- [ ] Plan component decomposition (keep < 250 lines)
- [ ] Prepare mock data for testing

---

## 📞 NEXT STEPS

1. **Review this document** - Read thoroughly and ask questions
2. **Prioritize features** - Decide which features to implement first
3. **Create tasks** - Break down into GitHub issues/tasks
4. **Start Phase 1** - Begin with Firebase services
5. **Iterate quickly** - Ship MVP, then enhance

**Let's build an amazing e-commerce experience! 🎉**

# Admin Dashboard Requirements - Eaxy Store

## Dashboard Overview (Home)

### Key Metrics Cards
- **Total revenue** (today/week/month)
- **Active orders count**
- **Pending repair requests**
- **Low stock alerts**
- **Customer satisfaction score**

### Real-time Charts
- Sales trends (products vs services)
- Order status breakdown (pending/processing/delivered)
- Revenue by category

---

## Order Management

### Product Orders
- **Order list with filters**
  - Status
  - Date
  - Amount
  - Delivery area
- **Order details**
  - Customer information
  - Items ordered
  - Payment status
- **4-hour delivery tracker**
- **Update order status**
  - Confirmed → Processing → Out for Delivery → Delivered
- **Generate invoices**

### Repair Service Requests
- **Request queue** with priority flags
- **Assign technicians** to service requests
- **Track repair status**
  - Received → Diagnosed → Repairing → Completed
- **Service history** per customer
- **Warranty tracking**

---

## Product Management

### Inventory
- Add/edit/delete products
- Stock levels with alerts
- Bulk import/export
- **Category management**
  - Laptops & Computers
  - Smartphones
  - Accessories
  - Refurbished
- Product specifications editor

### Pricing & Deals
- **Hot deals management**
  - Current deals: MacBook Air M2, iPhone 15 Pro, Sony WH-1000XM5
- Discount scheduler
- Price history tracking

---

## Services Management

- **Repair service catalog**
  - Laptop repairs (screen, battery, keyboard, performance, data recovery)
  - Mobile repairs (screen, battery, water damage, software)
  - Computer repairs (hardware upgrade, virus removal, OS installation, network setup)
- **Service pricing and duration**
- **Warranty terms configuration**
- **Technician availability calendar**
- **Parts inventory** for repairs

---

## Customer Management

- **Customer database** with purchase history
- **Wishlist and cart analytics**
- **Customer reviews and ratings management**
- **Contact form submissions**
- **Testimonials approval/moderation**

---

## Coverage & Logistics

### Delivery Areas (Pune)
- Pimpri-Chinchwad
- Kothrud & Warje
- Hadapsar & Magarpatta
- Shivajinagar & Camp
- Aundh & Baner
- Wakad & Hinjewadi

### Logistics Features
- **Delivery slot availability**
- **Courier/technician assignment**
- **Route optimization**
- **4-hour guarantee compliance tracking**

---

## Content Management

- **Homepage sections editor**
  - Hero Section
  - How It Works
  - Product Categories
  - Repair Services
  - Why Choose Us
  - Hot Deals
  - Coverage Areas
  - Testimonials
  - CTA Banner
- **Update promotional banners**
- **Manage product categories display**
- **Coverage area updates**
- **Testimonials moderation**

---

## Reports & Analytics

- **Sales reports**
  - By product
  - By category
  - By time period
- **Service performance metrics**
- **Inventory turnover**
- **Customer acquisition and retention**
- **Area-wise performance**
  - Performance breakdown by each Pune coverage area
- **Warranty claim statistics**
- **4-hour delivery compliance rate**

---

## Settings

### System Configuration
- **User roles & permissions**
- **Payment gateway configuration**
- **Notification settings**
  - Email notifications
  - SMS notifications
- **Warranty policy templates**
- **Chatbot configuration**
- **Theme customization**
- **Tax and shipping rules**

---

## Priority Features for 4-Hour Delivery Business

### Critical Features
1. **Live order tracking dashboard** with time countdown
2. **Alert system** for orders approaching 4-hour limit
3. **Technician dispatch management** for repair services
4. **Stock availability real-time sync** (inStock flags)
5. **Area-based order routing** for 6 coverage zones

### Why Choose Us Highlights (To Monitor)
- ⏱️ **4-Hour Guarantee** - Delivery or repair within 4 hours, or it's free
- 🛡️ **100% Warranty** - All products and repairs backed by warranty
- ⚡ **Expert Technicians** - Certified professionals with 10+ years experience
- ⭐ **Premium Quality** - Only authentic products and certified parts

---

## Dashboard Layout Recommendations

### Sidebar Navigation
1. Dashboard (Overview)
2. Orders
   - Product Orders
   - Repair Requests
3. Products
   - Inventory
   - Categories
   - Deals & Pricing
4. Services
   - Repair Catalog
   - Technicians
5. Customers
6. Coverage & Logistics
7. Content Management
8. Reports & Analytics
9. Settings

### Top Bar
- Quick search (orders, products, customers)
- Notification bell (urgent alerts, low stock, approaching 4-hour limit)
- Admin profile & logout

---

## Key Performance Indicators (KPIs)

### Daily Tracking
- Orders placed today
- Orders delivered within 4 hours (compliance %)
- Repair services completed
- Revenue (products + services)
- Customer satisfaction score

### Weekly/Monthly Tracking
- Total revenue growth
- Best-selling products
- Most requested repair services
- Customer retention rate
- Area-wise performance trends
- Inventory turnover rate

---

## Data Models to Consider

### Orders
- Order ID
- Customer details
- Items/Services
- Total amount
- Payment status
- Order timestamp
- Delivery/completion deadline (order time + 4 hours)
- Current status
- Assigned delivery person/technician
- Coverage area

### Products
- Product ID
- Name, category, brand
- Price, original price, discount
- Stock quantity
- Specifications
- Images
- Rating
- In stock status

### Services
- Service ID
- Category (laptop/mobile/computer)
- Title, description
- Price, duration
- Warranty period
- Features
- Rating

### Customers
- Customer ID
- Name, email, phone
- Address, coverage area
- Order history
- Wishlist
- Cart
- Total spent
- Lifetime value

---

## Implementation Notes

- Consider using **Firebase Realtime Database** for live order tracking
- Implement **role-based access control** (Admin, Manager, Technician, Support)
- Set up **automated alerts** for critical events (4-hour limit approaching, low stock)
- Use **geolocation** for area-based routing
- Implement **audit logs** for all admin actions
- Consider **mobile app** for technicians in the field

# Repair Services Firebase Migration Guide

This guide will help you migrate the existing repair services placeholder data to Firebase.

## Overview

The repair services system has been converted to use Firebase with full CRUD operations in the admin dashboard. The placeholder data from `src/data/servicesData.js` needs to be migrated to Firebase.

## What Was Created

### 1. Firebase Service (`src/firebase/repairServicesService.js`)
- `fetchAllRepairServices()` - Get all services
- `fetchRepairServiceById(id)` - Get single service
- `fetchRepairServicesByCategory(category)` - Filter by category
- `addRepairService(data)` - Create new service
- `updateRepairService(id, data)` - Update service
- `deleteRepairService(id)` - Delete service
- `fetchAllServiceCategories()` - Get categories
- `addServiceCategory(data)` - Create category
- `updateServiceCategory(id, data)` - Update category
- `deleteServiceCategory(id)` - Delete category

### 2. Admin Components
- **RepairServicesManagement** (`src/admin/components/RepairServicesManagement/`)
  - Main management component with search, filters, CRUD
  - RepairServiceCard - Individual service display
  - RepairServiceFormModal - Add/edit form with features array
  - ServiceFilters - Search and category filter

- **ServiceCategoriesManagement** (`src/admin/components/ServiceCategoriesManagement/`)
  - Manage service categories (laptop, mobile, computer)
  - Auto-generate category IDs from names
  - Set display order and icons

### 3. Public Page Updates
- **RepairServicesPage.jsx** - Now fetches from Firebase instead of static data
- Includes loading and error states
- Dynamic category counts

## Firestore Collections

### Collection: `repair_services`
Document structure:
```javascript
{
  category: "laptop",           // Required: laptop, mobile, computer
  title: "Screen Replacement",  // Required
  description: "Professional laptop screen replacement with genuine parts", // Required
  price: 2999,                  // Required: Number in INR
  duration: "2-3 hours",        // Required: String (e.g., "30 mins", "1-2 hours", "2-5 days")
  warranty: "6 months",         // Required: String (e.g., "6 months", "1 year", "No warranty")
  rating: 4.8,                  // Optional: Number 1-5, default 4.5
  features: [                   // Optional: Array of strings
    "Genuine Display",
    "Color Calibration",
    "Dead Pixel Check",
    "Free Cleaning"
  ],
  createdAt: Timestamp,         // Auto-generated
  updatedAt: Timestamp          // Auto-generated
}
```

### Collection: `service_categories`
Document structure:
```javascript
{
  id: "laptop",                 // Required: Unique identifier (lowercase, no spaces)
  name: "Laptop Repair",        // Required: Display name
  icon: "laptop",               // Optional: Lucide icon name, default "wrench"
  order: 0,                     // Optional: Display order, default 0
  createdAt: Timestamp,         // Auto-generated
  updatedAt: Timestamp          // Auto-generated
}
```

## Migration Steps

### Step 1: Add Service Categories First

Go to Admin Dashboard → Services → Service Categories

Add these 3 categories:

1. **Laptop Repair**
   - ID: `laptop`
   - Name: Laptop Repair
   - Icon: laptop
   - Order: 0

2. **Mobile Repair**
   - ID: `mobile`
   - Name: Mobile Repair
   - Icon: smartphone
   - Order: 1

3. **Computer Repair**
   - ID: `computer`
   - Name: Computer Repair
   - Icon: monitor
   - Order: 2

### Step 2: Add Repair Services

Go to Admin Dashboard → Services → Repair Services

Use the existing placeholder data from `src/data/servicesData.js`. Here are all 18 services:

#### Laptop Services (6 services)

1. **Screen Replacement**
   - Category: laptop
   - Title: Screen Replacement
   - Description: Professional laptop screen replacement with genuine parts
   - Price: 2999
   - Duration: 2-3 hours
   - Warranty: 6 months
   - Rating: 4.8
   - Features: Genuine Display, Color Calibration, Dead Pixel Check, Free Cleaning

2. **Battery Replacement**
   - Category: laptop
   - Title: Battery Replacement
   - Description: Original battery replacement for all laptop brands
   - Price: 3499
   - Duration: 1-2 hours
   - Warranty: 1 year
   - Rating: 4.9
   - Features: Original Battery, Health Check, Calibration, Backup Support

3. **Keyboard Repair**
   - Category: laptop
   - Title: Keyboard Repair
   - Description: Fix stuck keys, water damage, and complete keyboard replacement
   - Price: 1999
   - Duration: 2-4 hours
   - Warranty: 6 months
   - Rating: 4.7
   - Features: Key Replacement, Cleaning, Backlight Fix, Touchpad Check

4. **Performance Upgrade**
   - Category: laptop
   - Title: Performance Upgrade
   - Description: RAM and SSD upgrades for faster performance
   - Price: 1499
   - Duration: 1-2 hours
   - Warranty: 1 year
   - Rating: 4.9
   - Features: RAM Upgrade, SSD Installation, OS Migration, Speed Test

5. **Data Recovery**
   - Category: laptop
   - Title: Data Recovery
   - Description: Recover lost data from damaged hard drives
   - Price: 4999
   - Duration: 1-3 days
   - Warranty: No warranty
   - Rating: 4.6
   - Features: File Recovery, Secure Process, Data Backup, Privacy Assured

6. **Motherboard Repair**
   - Category: laptop
   - Title: Motherboard Repair
   - Description: Chipset and motherboard component level repair
   - Price: 5999
   - Duration: 2-5 days
   - Warranty: 3 months
   - Rating: 4.5
   - Features: Diagnosis, Component Replace, Testing, Liquid Damage

#### Mobile Services (6 services)

7. **Screen Replacement**
   - Category: mobile
   - Title: Screen Replacement
   - Description: Original OLED/LCD screen replacement for all models
   - Price: 2499
   - Duration: 1 hour
   - Warranty: 6 months
   - Rating: 4.9
   - Features: Original Display, Touch Test, Scratch Resistant, Free Tempered Glass

8. **Battery Replacement**
   - Category: mobile
   - Title: Battery Replacement
   - Description: Genuine battery replacement with capacity guarantee
   - Price: 1499
   - Duration: 30 mins
   - Warranty: 1 year
   - Rating: 4.8
   - Features: Original Battery, Fast Charging, Health Check, 100% Capacity

9. **Water Damage Repair**
   - Category: mobile
   - Title: Water Damage Repair
   - Description: Complete water damage inspection and repair
   - Price: 2999
   - Duration: 2-4 hours
   - Warranty: 3 months
   - Rating: 4.6
   - Features: Deep Cleaning, Component Check, Corrosion Remove, Full Testing

10. **Camera Repair**
    - Category: mobile
    - Title: Camera Repair
    - Description: Front and rear camera repair and replacement
    - Price: 1999
    - Duration: 1-2 hours
    - Warranty: 6 months
    - Rating: 4.7
    - Features: Camera Replace, Focus Check, Lens Cleaning, Software Update

11. **Charging Port Fix**
    - Category: mobile
    - Title: Charging Port Fix
    - Description: Charging port cleaning and replacement
    - Price: 899
    - Duration: 1 hour
    - Warranty: 6 months
    - Rating: 4.8
    - Features: Port Cleaning, Component Replace, Fast Charge Test, Cable Check

12. **Software Update**
    - Category: mobile
    - Title: Software Update
    - Description: OS update, bug fixes, and optimization
    - Price: 499
    - Duration: 30 mins
    - Warranty: 1 month
    - Rating: 4.9
    - Features: Latest OS, Bug Fixes, App Cleanup, Performance Boost

#### Computer Services (6 services)

13. **Hardware Upgrade**
    - Category: computer
    - Title: Hardware Upgrade
    - Description: Upgrade RAM, GPU, CPU, and storage for better performance
    - Price: 1999
    - Duration: 2-3 hours
    - Warranty: 1 year
    - Rating: 4.8
    - Features: Component Install, Compatibility Check, Cable Management, Benchmark Test

14. **Virus Removal**
    - Category: computer
    - Title: Virus Removal
    - Description: Complete virus and malware removal with protection
    - Price: 999
    - Duration: 1-2 hours
    - Warranty: 3 months
    - Rating: 4.9
    - Features: Deep Scan, Malware Remove, Antivirus Install, Data Backup

15. **OS Installation**
    - Category: computer
    - Title: OS Installation
    - Description: Fresh Windows/Linux installation with drivers
    - Price: 799
    - Duration: 1-2 hours
    - Warranty: 1 month
    - Rating: 4.8
    - Features: OS Install, Driver Setup, Software Install, Activation

16. **Network Setup**
    - Category: computer
    - Title: Network Setup
    - Description: WiFi, LAN, and network troubleshooting
    - Price: 699
    - Duration: 1 hour
    - Warranty: 1 month
    - Rating: 4.7
    - Features: WiFi Config, Speed Test, Router Setup, Security Setup

17. **PC Building**
    - Category: computer
    - Title: PC Building
    - Description: Custom PC building with optimal component selection
    - Price: 2499
    - Duration: 3-4 hours
    - Warranty: 1 year
    - Rating: 4.9
    - Features: Component Select, Assembly, Cable Manage, Full Testing

18. **Data Migration**
    - Category: computer
    - Title: Data Migration
    - Description: Safe data transfer to new system or storage
    - Price: 1499
    - Duration: 2-3 hours
    - Warranty: No warranty
    - Rating: 4.8
    - Features: File Transfer, App Migration, Settings Copy, Verification

## Firebase Security Rules

Add these rules to Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read for repair services
    match /repair_services/{serviceId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Public read for service categories
    match /service_categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Admin Dashboard Access

The repair services management is available at:
- **Main Services**: Admin Dashboard → Services → Repair Services
- **Categories**: Admin Dashboard → Services → Service Categories

## Features

✅ **Admin Dashboard**
- Add, edit, delete repair services
- Add, edit, delete service categories
- Search services by title or description
- Filter by category
- Automatic activity logging

✅ **Public Page**
- Fetches real-time data from Firebase
- Search functionality
- Filter by category and price range
- Sort by price, rating, duration
- Loading and error states
- Dynamic category counts
- Responsive design

## Next Steps

1. Access the admin dashboard at `/admin`
2. Navigate to Services → Service Categories
3. Add the 3 service categories (laptop, mobile, computer)
4. Navigate to Services → Repair Services
5. Add all 18 services one by one using the form
6. Visit `/repair-services` to see the public page
7. Verify all services display correctly

## Notes

- All services must have a category selected
- Categories must be created before adding services
- Features are optional but recommended
- Prices are in INR (Indian Rupees)
- The old `src/data/servicesData.js` file can be kept for reference or deleted

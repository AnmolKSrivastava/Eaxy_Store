# Admin Module

All admin-related files are organized in this folder.

## Structure

```
admin/
├── AdminDashboardPage.jsx    # Main admin dashboard page
├── AdminDashboard.css         # Admin styles
└── components/                # Admin-specific components
    ├── AdminTopBar.jsx        # Top navigation bar
    ├── AdminSidebar.jsx       # Sidebar navigation menu
    └── index.js               # Components export
```

## Access

Admin dashboard is accessible via:
- Hidden footer button (period after "All rights reserved")
- Direct URL: `/admin`

## Future Components

As the admin panel grows, add new components here:
- Dashboard widgets (metrics, charts)
- Order management tables
- Product inventory forms
- Service management
- Customer management
- Reports and analytics
- Settings panels

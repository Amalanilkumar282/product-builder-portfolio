# Admin Panel Quick Reference

## 🚀 Quick Start

1. **Start Backend:**
   ```bash
   cd apps/api
   npm run start:dev
   ```

2. **Start Frontend:**
   ```bash
   cd apps/web
   npm run dev -- -p 3001
   ```

3. **Login:**
   - URL: `http://localhost:3001/admin/login`
   - Default credentials: (check your database)

## 📝 Common Tasks

### Adding a New Entity

1. **Backend (if not exists):**
   - Create Prisma model
   - Generate migration
   - Create service, controller, DTOs

2. **Frontend:**
   - Add API interface in `admin-api.ts`
   - Create page in `app/(admin)/[entity]/page.tsx`
   - Add route to sidebar in `AdminSidebar.tsx`

### Uploading Images

```typescript
// In your component
import ImageUpload from '@/components/ui/ImageUpload';

<ImageUpload
  entityType="profile" // or "project"
  entityId={entityId}
  currentImageUrl={currentImageUrl}
  onUploadSuccess={(url) => handleImageUpdate(url)}
/>
```

### Using the API Service

```typescript
import { projectsApi } from '@/lib/admin-api';

// Get all
const projects = await projectsApi.getAll();

// Get by ID
const project = await projectsApi.getById(id);

// Create
const newProject = await projectsApi.create({
  title: 'My Project',
  description: 'Description',
  // ...
});

// Update
const updated = await projectsApi.update(id, {
  title: 'Updated Title',
});

// Delete
await projectsApi.delete(id);
```

### Error Handling

```typescript
try {
  const data = await projectsApi.getAll();
  setData(data);
} catch (error) {
  if (error instanceof AdminApiError) {
    setMessage({ type: 'error', text: error.message });
  }
}
```

## 🎨 UI Components

### AdminCard

```typescript
<AdminCard 
  title="Card Title"
  description="Optional description"
  action={<button>Action</button>}
>
  Content
</AdminCard>
```

### AdminTable

```typescript
<AdminTable
  data={items}
  columns={[
    { key: 'name', header: 'Name' },
    { 
      key: 'status', 
      header: 'Status',
      render: (item) => <Badge>{item.status}</Badge>
    },
  ]}
  onEdit={handleEdit}
  onDelete={handleDelete}
  emptyMessage="No items found"
/>
```

## 🔐 Authentication

### Check Auth Status

```typescript
import { useAuth } from '@/hooks/use-auth';

function MyComponent() {
  const { isAuthenticated, accessToken, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <p>Please login</p>;
  }
  
  // Your component
}
```

### Manual Logout

```typescript
const { logout } = useAuth();
logout(); // Clears tokens and redirects to login
```

## 🐛 Debugging

### Check Tokens

```javascript
// In browser console
sessionStorage.getItem('access_token')
sessionStorage.getItem('refresh_token')
```

### Clear Auth

```javascript
// In browser console
sessionStorage.clear()
// Then refresh page
```

### API Errors

Check network tab in DevTools:
1. Verify request URL is correct
2. Check Authorization header is present
3. View response error message

## 📊 Code Patterns

### Standard CRUD Page

```typescript
'use client';

import { useEffect, useState } from 'react';
import AdminCard from '@/components/admin/AdminCard';
import AdminTable from '@/components/admin/AdminTable';
import { entityApi, Entity } from '@/lib/admin-api';

export default function EntityPage() {
  const [items, setItems] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchItems();
  }, []);
  
  const fetchItems = async () => {
    try {
      const data = await entityApi.getAll();
      setItems(data);
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (item: Entity) => {
    if (!confirm('Delete?')) return;
    await entityApi.delete(item.id);
    setItems(items.filter(i => i.id !== item.id));
  };
  
  // Render UI
}
```

## 🔧 Environment Setup

### Development

```env
# apps/api/.env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRES_IN=900
JWT_REFRESH_EXPIRES_IN=604800
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Production

Update API URL in `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## 📱 Responsive Breakpoints

- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

Use Tailwind prefixes:
- `md:` for tablet+
- `lg:` for desktop
- `xl:` for large desktop

## 🎯 Tips & Tricks

1. **Auto-save forms:** Add debounced onChange handlers
2. **Keyboard shortcuts:** Use `useEffect` with event listeners
3. **Optimistic updates:** Update UI before API call completes
4. **Pagination:** Add page/limit params to API calls
5. **Search:** Add search state and filter items client-side or server-side

## 📚 Additional Resources

- API Service: `apps/web/src/lib/admin-api.ts`
- Auth Hook: `apps/web/src/hooks/use-auth.ts`
- Components: `apps/web/src/components/admin/`
- Full Docs: `ADMIN_IMPLEMENTATION.md`

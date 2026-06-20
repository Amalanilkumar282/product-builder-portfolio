Frontend: Next.js (App Router)
Backend: NestJS
Database: PostgreSQL
ORM: Prisma
Repo type: Monorepo
Hosting FE: Vercel
Hosting BE: Railway
Media: Cloudinary
Auth: JWT
Admin Panel: Custom (inside frontend)

## Admin Panel Implementation (2026-06-19)

✅ **Completed Enterprise-Level Admin Interface**

### Architecture
- **Authentication:** JWT with auto-refresh (15-min access, 7-day refresh)
- **Storage:** sessionStorage for tokens (security best practice)
- **API Layer:** Centralized admin-api.ts with type-safe interfaces
- **Route Protection:** Middleware + layout-based auth guard
- **UI Components:** Reusable AdminSidebar, AdminHeader, AdminCard, AdminTable

### Features Implemented
- 📊 Dashboard with stats overview
- 👤 Profile management with avatar upload
- 📁 Full CRUD for: Projects, Skills, Experience, Education, Services, Blog, Testimonials, Tech Stack, Awards
- 🖼️ Enhanced image upload with progress & validation
- 🔐 Secure authentication flow with auto-refresh
- 🎨 Glassmorphism UI matching public site design
- ✅ Production-ready error handling & loading states

### File Structure
```
apps/web/
├── app/(admin)/          # Protected admin routes
├── src/
│   ├── components/admin/ # Reusable admin components
│   ├── lib/
│   │   ├── auth.ts      # Auth context
│   │   └── admin-api.ts # API service layer
│   └── hooks/
│       └── use-auth.ts  # Auth hook
```

### Documentation
- Full Implementation: `ADMIN_IMPLEMENTATION.md`
- Quick Reference: `ADMIN_QUICK_REFERENCE.md`

### Next Steps
1. Add Cloudinary credentials to `apps/api/.env`
2. Test all CRUD operations
3. Deploy and configure production environment variables

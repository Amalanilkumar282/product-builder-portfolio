# Admin Panel Setup & Testing Checklist

## 🔧 Setup Tasks

### Backend Configuration

- [ ] **Add Cloudinary Credentials**
  - Open `apps/api/.env`
  - Replace placeholder values:
    ```env
    CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
    CLOUDINARY_API_KEY=your_actual_api_key
    CLOUDINARY_API_SECRET=your_actual_api_secret
    ```
  - Get credentials from: https://cloudinary.com/console

- [ ] **Verify Database Connection**
  - Check `DATABASE_URL` in `apps/api/.env`
  - Test connection: `npm run start:dev` in apps/api

- [ ] **Verify JWT Configuration**
  - Check `JWT_SECRET` is set (not default)
  - Verify expiry times are appropriate for your use case

### Frontend Configuration

- [ ] **Verify API URL**
  - Check `apps/web/.env.local`
  - Ensure `NEXT_PUBLIC_API_URL=http://localhost:3000` for dev
  - Update for production deployment

## 🧪 Testing Checklist

### 1. Authentication Flow

- [ ] **Login**
  - Navigate to `http://localhost:3001/admin/login`
  - Enter valid credentials
  - Verify redirect to `/admin/dashboard`
  - Check sessionStorage has `access_token` and `refresh_token`

- [ ] **Auto-refresh**
  - Stay logged in for 12+ minutes
  - Verify token auto-refreshes (check Network tab)
  - Ensure no logout occurs

- [ ] **Logout**
  - Click logout button
  - Verify redirect to `/admin/login`
  - Check sessionStorage is cleared

- [ ] **Protected Routes**
  - Clear sessionStorage
  - Try accessing `/admin/dashboard` directly
  - Verify redirect to login

### 2. Dashboard

- [ ] Load successfully
- [ ] Display correct stats (projects, skills, etc.)
- [ ] Quick action buttons work
- [ ] No console errors

### 3. Profile Management

- [ ] **View Profile**
  - Navigate to Profile page
  - All fields load correctly

- [ ] **Edit Profile**
  - Update first name, last name
  - Update bio, title, location
  - Update email, phone
  - Update social links
  - Click Save
  - Verify success message
  - Refresh page - changes persist

- [ ] **Avatar Upload**
  - Click Choose Image
  - Select image (< 5MB)
  - Preview shows correctly
  - Click Upload
  - Verify progress bar
  - Check success message
  - Image appears in profile

### 4. Projects

- [ ] **List Projects**
  - Navigate to Projects page
  - Projects display in table
  - Pagination works (if implemented)

- [ ] **Create Project** (if new page exists)
  - Click "New Project"
  - Fill all required fields
  - Upload cover image
  - Save
  - Verify appears in list

- [ ] **Edit Project** (if edit page exists)
  - Click Edit on a project
  - Modify fields
  - Save
  - Verify changes

- [ ] **Delete Project**
  - Click Delete
  - Confirm dialog appears
  - Confirm deletion
  - Verify removed from list

### 5. Skills

- [ ] Click "New Skill"
- [ ] Fill form (name, category, proficiency)
- [ ] Create successfully
- [ ] Edit existing skill
- [ ] Delete skill with confirmation

### 6. Experience

- [ ] Create new experience entry
- [ ] Test "Currently working here" checkbox
- [ ] Verify date validation
- [ ] Edit existing entry
- [ ] Delete with confirmation

### 7. Education

- [ ] Create education entry
- [ ] Test all fields
- [ ] Edit and save
- [ ] Delete successfully

### 8. Services

- [ ] Create service
- [ ] Test icon field
- [ ] Edit and save
- [ ] Delete successfully

### 9. Blog

- [ ] Navigate to Blog page
- [ ] List displays (if posts exist)
- [ ] Create new post (if form exists)
- [ ] Edit existing post
- [ ] Delete post

### 10. Testimonials

- [ ] Create testimonial
- [ ] Test rating selector
- [ ] Test avatar URL field
- [ ] Edit and save
- [ ] Delete successfully

### 11. Tech Stack

- [ ] Create tech entry
- [ ] Test icon URL field
- [ ] Edit and save
- [ ] Delete successfully

### 12. Awards

- [ ] Create award
- [ ] Test date picker
- [ ] Edit and save
- [ ] Delete successfully

## 🐛 Error Testing

- [ ] **Upload Invalid File**
  - Try uploading non-image file
  - Verify error message

- [ ] **Upload Large File**
  - Try uploading > 5MB file
  - Verify size validation error

- [ ] **Submit Empty Form**
  - Try saving empty required fields
  - Verify validation errors

- [ ] **Network Error**
  - Stop backend server
  - Try any operation
  - Verify error message displays

- [ ] **Invalid Token**
  - Manually corrupt token in sessionStorage
  - Try any operation
  - Verify redirect to login

## 📱 Responsive Testing

- [ ] **Mobile (< 768px)**
  - Sidebar collapses or adapts
  - Forms are usable
  - Tables scroll horizontally
  - Buttons are tappable

- [ ] **Tablet (768px - 1024px)**
  - Layout adjusts appropriately
  - All features accessible

- [ ] **Desktop (> 1024px)**
  - Full layout displays
  - Sidebar visible
  - Tables show all columns

## 🚀 Production Readiness

- [ ] **Environment Variables**
  - Production API URL configured
  - Cloudinary credentials for production
  - JWT secrets are strong and unique

- [ ] **Security**
  - No sensitive data in console.logs
  - CORS properly configured on backend
  - HTTPS enabled for production

- [ ] **Performance**
  - No unnecessary re-renders
  - Images optimized
  - API calls efficient

- [ ] **Error Handling**
  - All API calls have try-catch
  - User-friendly error messages
  - Loading states everywhere

## 📝 Notes

### Issues Found

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

### Improvements Needed

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

## ✅ Sign Off

- [ ] All critical features tested
- [ ] All critical bugs fixed
- [ ] Documentation reviewed
- [ ] Ready for production deployment

**Tested By:** _______________  
**Date:** _______________  
**Status:** ☐ Pass ☐ Fail ☐ Needs Work

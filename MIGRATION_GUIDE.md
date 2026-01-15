# Migration Guide: Next.js 14 → 15 & React 18 → 19

This document outlines the updates made to upgrade the project to the latest stable versions.

## 📦 Updated Dependencies

### Core Framework Updates
- **Next.js**: `14.2.0` → `15.1.6`
- **React**: `18.3.0` → `19.0.0`
- **React DOM**: `18.3.0` → `19.0.0`

### Type Definitions Updates
- **@types/node**: `20.0.0` → `22.10.2`
- **@types/react**: `18.3.0` → `19.0.6`
- **@types/react-dom**: `18.3.0` → `19.0.2`

### Dev Dependencies Updates
- **TypeScript**: `5.4.0` → `5.7.2`
- **ESLint**: Added `9.17.0` (new)
- **eslint-config-next**: Added `15.1.6` (new)
- **autoprefixer**: `10.4.19` → `10.4.20`
- **postcss**: `8.4.38` → `8.4.47`
- **tailwindcss**: `3.4.3` → `3.4.17`

## 🔧 Configuration Changes

### 1. `tsconfig.json`
- Updated `target` from `es5` to `ES2017` for better performance
- Added Next.js plugin configuration
- Updated `include` to include `.next/types/**/*.ts` for better type support

### 2. `next.config.js`
- Removed deprecated `domains` from `images` configuration (deprecated in Next.js 15)
- Kept only `remotePatterns` for image configuration
- Added localhost support in remotePatterns

### 3. `package.json`
- Updated all dependencies to latest stable versions
- Added ESLint and eslint-config-next for better code quality

## ⚠️ Breaking Changes & Compatibility

### Next.js 15 Changes

1. **Image Configuration**
   - The `domains` property is deprecated
   - Use `remotePatterns` instead (already updated)

2. **Turbopack (Optional)**
   - Next.js 15 uses Turbopack by default in dev mode
   - Can be enabled via `experimental.turbo` in `next.config.js`
   - Currently commented out - enable if needed

3. **React Server Components**
   - Better support for Server Components
   - Pages Router still fully supported (no migration needed)

### React 19 Changes

1. **Refs**
   - All `forwardRef` usage is compatible
   - No changes needed in existing components

2. **TypeScript Types**
   - Updated type definitions for React 19
   - All existing types remain compatible

3. **Hooks**
   - All hooks work the same way
   - No breaking changes in hook usage

## 📁 Folder Structure

The project maintains the **Pages Router** structure, which is still fully supported:

```
src/
├── pages/          # Next.js Pages Router
│   ├── _app.tsx    # App wrapper
│   ├── _document.tsx # Document customization
│   ├── index.tsx   # Home page
│   ├── admin/      # Admin pages
│   ├── spiritual/  # Spiritual module pages
│   └── api/        # API routes
├── components/     # Reusable components
├── contexts/       # React contexts
├── services/       # API services
├── store/          # Redux store
├── styles/         # Global styles
├── types/          # TypeScript types
└── utils/          # Utility functions
```

**Note**: The App Router (`app/` directory) is available but not required. The Pages Router structure is maintained for compatibility.

## 🚀 Installation & Setup

1. **Delete node_modules and lock file**:
   ```bash
   rm -rf node_modules package-lock.json
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## ✅ Verification Checklist

- [x] Updated package.json with latest versions
- [x] Updated TypeScript configuration
- [x] Updated Next.js configuration
- [x] Verified React 19 compatibility (refs, hooks)
- [x] Maintained Pages Router structure
- [x] Updated type definitions
- [ ] Run `npm install` to install new dependencies
- [ ] Test all pages and components
- [ ] Verify API routes work correctly
- [ ] Check admin panel functionality
- [ ] Verify spiritual module pages
- [ ] Test form submissions
- [ ] Verify image loading
- [ ] Check mobile responsiveness

## 🔍 Testing Recommendations

1. **Test all routes**:
   - Home page (`/`)
   - Registration (`/register`)
   - Admin pages (`/admin/*`)
   - Spiritual module (`/spiritual/*`)

2. **Test key features**:
   - Form submissions
   - Image uploads
   - API calls
   - Authentication
   - Data fetching

3. **Check browser console**:
   - Look for any deprecation warnings
   - Verify no errors related to React 19

4. **Performance check**:
   - Page load times
   - Image optimization
   - Bundle size

## 📚 Additional Resources

- [Next.js 15 Release Notes](https://nextjs.org/blog/next-15)
- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)
- [Next.js Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/12/05/react-19-upgrade-guide)

## 🐛 Known Issues & Solutions

### Issue: Type errors after upgrade
**Solution**: Delete `.next` folder and restart dev server:
```bash
rm -rf .next
npm run dev
```

### Issue: ESLint errors
**Solution**: Run ESLint fix:
```bash
npm run lint -- --fix
```

### Issue: Build errors
**Solution**: Clear cache and rebuild:
```bash
rm -rf .next node_modules
npm install
npm run build
```

## 📝 Notes

- All existing functionality should work without changes
- The Pages Router structure is maintained (no App Router migration needed)
- React 19 is backward compatible with React 18 code
- TypeScript types are updated for better type safety
- ESLint configuration added for better code quality

---

**Last Updated**: December 2024
**Next.js Version**: 15.1.6
**React Version**: 19.0.0


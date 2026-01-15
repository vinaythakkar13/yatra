# App Router Migration Guide

This document outlines the complete migration from Pages Router to App Router for Next.js 15+ with React 19.

## 📁 New Folder Structure

```
src/
├── app/                          # App Router (NEW)
│   ├── layout.tsx               # Root layout (replaces _app.tsx)
│   ├── page.tsx                 # Home page (replaces pages/index.tsx)
│   ├── loading.tsx              # Global loading UI
│   ├── error.tsx                 # Global error boundary
│   ├── not-found.tsx             # 404 page (replaces pages/404.tsx)
│   ├── components/
│   │   └── ClientLayoutWrapper.tsx  # Client component wrapper
│   ├── register/
│   │   ├── page.tsx             # Register page (replaces pages/register.tsx)
│   │   └── components/
│   │       ├── RegisterError.tsx
│   │       └── RegisterLoading.tsx
│   ├── history/
│   │   └── page.tsx             # History page (replaces pages/history.tsx)
│   ├── admin/
│   │   ├── layout.tsx           # Admin layout wrapper
│   │   ├── login/
│   │   │   └── page.tsx         # Admin login (replaces pages/admin/login.tsx)
│   │   ├── page.tsx             # Admin dashboard (replaces pages/admin/index.tsx)
│   │   ├── yatras/
│   │   │   └── page.tsx         # Admin yatras (replaces pages/admin/yatras.tsx)
│   │   ├── hotels/
│   │   │   └── page.tsx         # Admin hotels (replaces pages/admin/hotels.tsx)
│   │   ├── users/
│   │   │   └── page.tsx         # Admin users (replaces pages/admin/users.tsx)
│   │   ├── reports/
│   │   │   └── page.tsx         # Admin reports (replaces pages/admin/reports.tsx)
│   │   └── calendar/
│   │       └── page.tsx         # Admin calendar (replaces pages/admin/calendar.tsx)
│   ├── spiritual/
│   │   ├── page.tsx             # Spiritual home (replaces pages/spiritual/index.tsx)
│   │   ├── about/
│   │   │   └── page.tsx         # About page (replaces pages/spiritual/about.tsx)
│   │   ├── charity/
│   │   │   └── page.tsx         # Charity page (replaces pages/spiritual/charity/index.tsx)
│   │   ├── contact/
│   │   │   └── page.tsx         # Contact page (replaces pages/spiritual/contact.tsx)
│   │   ├── gallery/
│   │   │   └── page.tsx         # Gallery page (replaces pages/spiritual/gallery.tsx)
│   │   ├── medical/
│   │   │   └── page.tsx         # Medical page (replaces pages/spiritual/medical.tsx)
│   │   └── volunteer/
│   │       └── page.tsx         # Volunteer page (replaces pages/spiritual/volunteer.tsx)
│   └── api/                      # API Routes (NEW structure)
│       ├── locations/
│       │   └── states/
│       │       └── route.ts     # GET /api/locations/states
│       ├── cloudinary/
│       │   └── upload-base64/
│       │       └── route.ts    # POST /api/cloudinary/upload-base64
│       └── spiritual/
│           └── contact/
│               └── route.ts    # POST /api/spiritual/contact
│
├── pages/                        # OLD Pages Router (can be removed after migration)
│   ├── _app.tsx                 # → app/layout.tsx
│   ├── _document.tsx            # → app/layout.tsx (metadata)
│   ├── index.tsx                # → app/page.tsx
│   ├── register.tsx             # → app/register/page.tsx
│   ├── history.tsx              # → app/history/page.tsx
│   ├── admin/                   # → app/admin/
│   └── api/                     # → app/api/
│
└── components/                   # Shared components (unchanged)
    ├── layout/
    │   ├── Header.tsx           # Updated to use next/navigation
    │   └── Footer.tsx
    └── ...
```

## 🔄 Key Changes

### 1. Root Layout (`app/layout.tsx`)

**Before (Pages Router):**
```tsx
// pages/_app.tsx
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </ReduxProvider>
  );
}
```

**After (App Router):**
```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
```

### 2. Pages

**Before (Pages Router):**
```tsx
// pages/index.tsx
export default function Home() {
  return <div>Home</div>;
}
```

**After (App Router):**
```tsx
// app/page.tsx
export default function Home() {
  return <div>Home</div>;
}
```

### 3. Server-Side Data Fetching

**Before (Pages Router):**
```tsx
// pages/register.tsx
export const getServerSideProps: GetServerSideProps = async () => {
  const data = await fetchData();
  return { props: { data } };
};

export default function Register({ data }) {
  return <div>{data}</div>;
}
```

**After (App Router):**
```tsx
// app/register/page.tsx
async function getData() {
  const data = await fetchData();
  return data;
}

export default async function RegisterPage() {
  const data = await getData();
  return <div>{data}</div>;
}
```

### 4. API Routes

**Before (Pages Router):**
```tsx
// pages/api/users/route.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    return res.status(200).json({ data: [] });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
```

**After (App Router):**
```tsx
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({ data: [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({ success: true });
}
```

### 5. Navigation

**Before (Pages Router):**
```tsx
import { useRouter } from 'next/router';

const router = useRouter();
router.push('/register');
router.pathname; // Current pathname
```

**After (App Router):**
```tsx
import { useRouter, usePathname } from 'next/navigation';

const router = useRouter();
const pathname = usePathname();
router.push('/register');
pathname; // Current pathname
```

### 6. Client Components

**Before:**
```tsx
// No 'use client' needed in Pages Router
```

**After:**
```tsx
'use client';

// Required for components using:
// - useState, useEffect, useRef
// - Event handlers (onClick, onChange)
// - Browser APIs (window, document)
// - React Context
```

## 📝 Migration Checklist

### Completed ✅
- [x] Root layout (`app/layout.tsx`)
- [x] Home page (`app/page.tsx`)
- [x] Register page (`app/register/page.tsx`)
- [x] History page (`app/history/page.tsx`)
- [x] Admin login (`app/admin/login/page.tsx`)
- [x] Admin layout (`app/admin/layout.tsx`)
- [x] API routes converted
- [x] Header component updated to use `next/navigation`
- [x] Loading, error, and not-found pages

### Remaining 🔄
- [ ] Convert remaining admin pages
- [ ] Convert spiritual module pages
- [ ] Update all components using `next/router` to `next/navigation`
- [ ] Remove React imports where not needed (React 19)
- [ ] Test all routes and functionality
- [ ] Remove old `pages/` directory after verification

## 🚀 Next Steps

1. **Convert Remaining Pages:**
   - Copy each page from `pages/` to `app/`
   - Convert `getServerSideProps` to async Server Components
   - Add `'use client'` where needed
   - Update imports (`next/router` → `next/navigation`)

2. **Update Components:**
   - Search for `useRouter` from `next/router`
   - Replace with `useRouter` from `next/navigation`
   - Replace `router.pathname` with `usePathname()`
   - Remove `React` imports where not needed

3. **Test Everything:**
   - Test all routes
   - Test API endpoints
   - Test navigation
   - Test form submissions
   - Test authentication flows

4. **Clean Up:**
   - Remove `pages/` directory
   - Update any remaining references
   - Update documentation

## ⚠️ Important Notes

1. **Server Components by Default**: All components are Server Components unless marked with `'use client'`

2. **Metadata**: Use `metadata` export instead of `<Head>` component:
   ```tsx
   export const metadata: Metadata = {
     title: 'Page Title',
     description: 'Page description',
   };
   ```

3. **No `getServerSideProps`**: Use async Server Components instead

4. **No `getStaticProps`**: Use `generateStaticParams` for dynamic routes

5. **Route Handlers**: API routes use `route.ts` files with named exports (`GET`, `POST`, etc.)

6. **Layouts**: Use `layout.tsx` files for shared layouts

7. **Loading States**: Use `loading.tsx` for loading UI

8. **Error Boundaries**: Use `error.tsx` for error handling

## 🔗 Resources

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Migrating to App Router](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [React 19 Documentation](https://react.dev/blog/2024/12/05/react-19)

---

**Migration Status**: In Progress
**Last Updated**: December 2024


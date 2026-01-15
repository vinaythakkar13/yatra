# Yatra Management System - Setup Guide

This guide will help you set up and run the Yatra Management System on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0 or higher)
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`

- **npm** (comes with Node.js) or **yarn**
  - Verify installation: `npm --version`

- **Git** (optional, for version control)
  - Download from: https://git-scm.com/

## Installation Steps

### Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required dependencies including:
- Next.js
- React
- TypeScript
- Tailwind CSS
- React Hook Form
- Framer Motion
- Lucide React (icons)

**Note:** If you encounter any errors, try:
```bash
npm install --legacy-peer-deps
```

### Step 2: Verify Installation

After installation completes, verify that all packages are installed:

```bash
npm list --depth=0
```

You should see all dependencies listed without errors.

### Step 3: Run Development Server

Start the development server:

```bash
npm run dev
```

The application will start on `http://localhost:3000`

You should see output similar to:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Step 4: Open in Browser

Open your web browser and navigate to:
```
http://localhost:3000
```

You should see the Yatra Management System landing page.

## Application Overview

### User Module Access

1. **Home Page** - `http://localhost:3000/`
   - Enter PNR number to validate
   - View upcoming Yatra information

2. **Registration** - `http://localhost:3000/register`
   - Fill in personal details
   - Add traveler information
   - Submit registration

3. **History** - `http://localhost:3000/history`
   - View past registrations
   - Check room assignments
   - See upcoming Yatra events

### Admin Module Access

To access admin features:

1. Click **"Admin Login"** button in the header
   - This will log you in as an admin user (demo mode)

2. Click **"Admin Panel"** button that appears after login

3. Admin Routes:
   - **Dashboard** - `http://localhost:3000/admin`
   - **User Management** - `http://localhost:3000/admin/users`
   - **Hotel Management** - `http://localhost:3000/admin/hotels`
   - **Reports** - `http://localhost:3000/admin/reports`

## Demo Credentials

The application currently uses mock authentication for demonstration:

### User Login
- Click "User Login" - Creates a guest user session
- No password required (demo mode)

### Admin Login
- Click "Admin Login" - Creates an admin user session
- Grants access to admin panel
- No password required (demo mode)

## Features to Test

### User Features
- ✅ PNR validation (try PNR: `1234567890` - exists in mock data)
- ✅ New registration with multiple travelers
- ✅ Form validation
- ✅ View registration history
- ✅ Mobile responsive design

### Admin Features
- ✅ View all registrations
- ✅ Search and filter users
- ✅ View detailed user information
- ✅ Add new hotels
- ✅ Configure floors and rooms
- ✅ Assign rooms to users
- ✅ View comprehensive reports
- ✅ Track occupancy rates
- ✅ Analyze city-wise participation

## Project Structure

```
Yatra/
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React Context for state management
│   ├── pages/           # Next.js pages (routes)
│   ├── styles/          # Global CSS styles
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
├── package.json         # Project dependencies
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── README.md           # Project documentation
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Use a different port
npm run dev -- -p 3001
```

### Module Not Found Errors

Clear cache and reinstall:

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### TypeScript Errors

If you see TypeScript errors, make sure TypeScript is installed:

```bash
npm install --save-dev typescript @types/node @types/react @types/react-dom
```

### Styling Issues

If Tailwind styles aren't loading:

1. Check that `tailwind.config.js` exists
2. Verify `postcss.config.js` exists
3. Restart the dev server

```bash
# Stop the server (Ctrl+C) and restart
npm run dev
```

### Build Errors

If you encounter build errors:

```bash
# Clean build cache
rm -rf .next
npm run dev
```

## Building for Production

To create a production build:

```bash
npm run build
```

To run the production build:

```bash
npm start
```

## Development Tips

### Hot Reload
- Changes to files automatically reload the browser
- No need to manually refresh

### Viewing on Mobile
- Find your computer's IP address
- Access from mobile: `http://YOUR_IP:3000`
- Example: `http://192.168.1.100:3000`

### Debugging
- React DevTools: Install browser extension
- Console: Press F12 to open browser console
- Check for errors in the terminal and browser console

## Next Steps

### For Development
1. Explore the codebase in `src/` folder
2. Modify components in `src/components/ui/`
3. Customize colors in `tailwind.config.js`
4. Add new pages in `src/pages/`

### For Production
1. Set up a backend API
2. Implement real authentication
3. Connect to a database
4. Add environment variables
5. Deploy to hosting platform (Vercel, Netlify, etc.)

## Additional Resources

- **Next.js Documentation:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **React Hook Form:** https://react-hook-form.com/
- **TypeScript:** https://www.typescriptlang.org/docs/

## Support

For issues or questions:
1. Check the README.md file
2. Review the code comments
3. Check browser console for errors
4. Review terminal output for server errors

## Common Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

**Happy Coding!** 🚀

If you encounter any issues not covered here, check the main README.md file or review the code comments for more details.


# Yatra Management System

A modern, responsive web application for managing pilgrimage journeys (Yatra) with separate Admin and User modules. Built with Next.js, TypeScript, Tailwind CSS, and React Hook Form.

## ✨ Features

### User Module
- **Welcome/Landing Page**
  - PNR validation for Indian Railway tickets
  - Auto-fetch user details if PNR exists
  - Upload ticket image if PNR not found
  - View upcoming Yatra information and deadlines

- **Registration System**
  - Complete registration form with React Hook Form
  - Add multiple travelers with details (name, age, gender)
  - Boarding point selection (city & state)
  - Arrival and return date management
  - Real-time form validation

- **Yatra History**
  - View all previous registrations
  - Track upcoming Yatra events
  - View room assignment status
  - Monitor submission deadlines

### Admin Module
- **Dashboard**
  - Overview of system statistics
  - Quick access to all admin features
  - Real-time metrics and KPIs

- **User Management**
  - View all registered users in a table
  - Search by name, PNR, or contact
  - Filter by date, city, or room status
  - View detailed user information
  - Assign rooms to users

- **Hotel Management**
  - Add new hotels with floor and room configuration
  - Auto-generate room numbers
  - View room occupancy status
  - Track available vs occupied rooms

- **Reports & Analytics**
  - Comprehensive statistics dashboard
  - City-wise participation trends
  - Age demographics analysis
  - Occupancy rate tracking
  - Export functionality for reports

## 🎨 Design Features

- **Modern UI/UX**
  - Glass morphism effects
  - Gradient backgrounds
  - Smooth animations and transitions
  - Responsive design (mobile, tablet, desktop)

- **Color Theme**
  - Primary: Blue gradient (#0ea5e9 to #0369a1)
  - Secondary: Purple gradient (#d946ef to #a21caf)
  - Accent: Amber/Orange for highlights
  - Clean, professional appearance

- **Reusable Components**
  - Button (multiple variants and sizes)
  - Input (with icons, validation, and error states)
  - Card (with glass effect, hover animations, hotel info)
  - Modal (with React Portal, animations, and keyboard support)
  - Table (with sorting and empty states)
  - SelectDropdown (searchable dropdown with react-dropdown-select)
  - DatePicker (calendar picker with react-datepicker)
  - ImageUpload (camera capture & file upload)

## 🛠️ Technology Stack

- **Frontend Framework:** Next.js 14 (Pages Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Form Management:** React Hook Form
- **Date Picker:** React DatePicker (with custom styling)
- **Select Dropdown:** React Dropdown Select (searchable)
- **Icons:** Lucide React
- **State Management:** React Context API
- **Animations:** Framer Motion & Custom CSS

## 📦 Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```
   This installs all required packages including:
   - react-dropdown-select (enhanced select dropdowns)
   - react-datepicker (beautiful date picker)
   - All other dependencies

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

**Note:** See `INSTALLATION_STEPS.md` for detailed setup guide and troubleshooting.

## 🚀 Getting Started

### For Users
1. Visit the home page
2. Enter your PNR number to check existing registration
3. Or start a new registration
4. Fill in personal and travel details
5. View your history and upcoming Yatra events

### For Admins
1. Click "Admin Login" in the header (demo mode)
2. Access the admin dashboard
3. Manage users, assign rooms
4. Add hotels and configure accommodations
5. Generate reports and analytics

## 📁 Project Structure

```
Yatra/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   └── Select.tsx
│   │   └── layout/          # Layout components
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── contexts/
│   │   └── AppContext.tsx   # Global state management
│   ├── pages/
│   │   ├── index.tsx        # Landing page
│   │   ├── register.tsx     # Registration form
│   │   ├── history.tsx      # User history
│   │   └── admin/           # Admin pages
│   │       ├── index.tsx    # Admin dashboard
│   │       ├── users.tsx    # User management
│   │       ├── hotels.tsx   # Hotel management
│   │       └── reports.tsx  # Reports & analytics
│   ├── styles/
│   │   └── globals.css      # Global styles
│   └── types/
│       └── index.ts         # TypeScript types
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🎯 Key Implementation Details

### State Management
- Uses React Context API for global state
- Mock data for demonstration
- Easily replaceable with real API calls

### Form Validation
- React Hook Form for efficient form handling
- Real-time validation with error messages
- Field arrays for dynamic traveler inputs

### Protected Routes
- Admin pages check for admin rights
- Automatic redirect for unauthorized access
- User session stored in localStorage (demo)

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Hamburger menu for mobile navigation

## 🔒 Security Considerations

**Note:** This is a demonstration application. For production:
- Implement proper authentication (JWT, OAuth)
- Add backend API for data persistence
- Secure admin routes with middleware
- Validate all inputs server-side
- Use environment variables for sensitive data
- Implement CSRF protection

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
colors: {
  primary: { ... },
  secondary: { ... },
  accent: { ... }
}
```

### Components
All components in `src/components/ui/` are reusable and customizable with props.

## 📝 Future Enhancements

- [ ] Backend API integration (Node.js/Express or Next.js API routes)
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Real authentication system
- [ ] Email notifications
- [ ] Payment gateway integration
- [ ] PDF generation for reports
- [ ] Real-time updates with WebSockets
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

## 🤝 Contributing

This is a demonstration project. Feel free to fork and enhance!

## 📄 License

MIT License - feel free to use this project for learning or production.

## 👤 Author

Created as a comprehensive Next.js application demonstrating modern web development practices.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS
- React Hook Form for form management
- Lucide React for beautiful icons

---

**Note:** This application uses mock data for demonstration. To use in production, connect to a real backend API and database.


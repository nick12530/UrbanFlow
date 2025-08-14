# UrbanFlow - Nairobi's Urban Living Companion

UrbanFlow is a comprehensive urban living platform designed to make navigating Nairobi's vibrant city life seamless and enjoyable. From transport planning to food delivery, local markets, and AI-powered assistance, UrbanFlow connects you with everything you need for modern urban living in Kenya's capital.

## 🌆 Features

### 🚌 Smart Transport Planning
- **Multi-modal Route Planning**: Find the best routes combining metro, buses, taxis, and bikes
- **Real-time Updates**: Live tracking and schedule information
- **Interactive Maps**: Visual route planning with Leaflet integration
- **Bike Sharing**: Locate and hire bikes from stations across the city
- **Itinerary Management**: Plan and save your daily transport routes

### 🍔 Food & Markets
- **Restaurant Discovery**: Explore local restaurants with detailed menus and reviews
- **Fresh Markets**: Connect with local markets for fresh produce and crafts
- **Delivery Integration**: Order food with real-time tracking
- **Cultural Experiences**: Discover authentic Kenyan cuisine and local markets
- **Payment Integration**: Seamless checkout with Pesapal integration

### 🤖 AI Assistant (UrbanBuddy)
- **24/7 Support**: Get instant help with urban living questions
- **Personalized Recommendations**: AI-powered suggestions based on your preferences
- **Service Discovery**: Find nearby services and amenities
- **Smart Navigation**: Get directions and route suggestions

### 🏛️ City Services
- **Emergency Contacts**: Quick access to police, ambulance, and fire services
- **Government Services**: Information about local government services
- **Utilities**: Access to essential city utilities and resources
- **Local Information**: Weather updates, events, and city news

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account (for authentication)
- Pesapal account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/urbanflow.git
   cd urbanflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_PESAPAL_CONSUMER_KEY=your_pesapal_consumer_key
   VITE_PESAPAL_CONSUMER_SECRET=your_pesapal_consumer_secret
   VITE_PESAPAL_BASE_URL=https://www.pesapal.com/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Start the backend server** (in a separate terminal)
   ```bash
   npm run server
   ```

## 🏗️ Project Structure

```
UrbanFlow/
├── api/                    # Backend API endpoints
│   └── pesapal/           # Payment integration
├── components/            # Reusable React components
│   ├── auth/             # Authentication components
│   └── ...               # Other UI components
├── src/
│   ├── pages/            # Main application pages
│   │   ├── Home.jsx      # Landing page with services overview
│   │   ├── Transport.jsx # Transport planning and services
│   │   ├── Food.jsx      # Food delivery and markets
│   │   ├── Assistant.jsx # AI assistant interface
│   │   └── ...           # Other pages
│   ├── context/          # React context providers
│   ├── lib/              # Utility libraries and configurations
│   └── styles/           # Global styles and themes
├── server/               # Express.js backend server
└── public/               # Static assets
```

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Material-UI** - Component library for consistent UI
- **Leaflet** - Interactive maps
- **React Icons** - Icon library

### Backend
- **Express.js** - Node.js web framework
- **Firebase** - Authentication and database
- **Pesapal** - Payment processing
- **CORS** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **React DevTools** - Development debugging

## 🎨 Design System

UrbanFlow uses a modern, accessible design system with:
- **Responsive Design**: Works seamlessly across all devices
- **Dark/Light Mode**: User preference support
- **Accessibility**: WCAG compliant components
- **Performance**: Optimized for fast loading and smooth interactions

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication (Email/Password)
3. Set up Firestore database
4. Add your Firebase configuration to environment variables

### Pesapal Integration
1. Create a Pesapal merchant account
2. Get your consumer key and secret
3. Configure webhook endpoints for payment notifications
4. Add credentials to environment variables

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
# Deploy the dist/ folder to your hosting provider
```

### Backend Deployment
```bash
# Deploy server/index.js to your Node.js hosting provider
# Ensure environment variables are configured
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Nairobi Community** - For inspiration and local insights
- **Open Source Community** - For the amazing tools and libraries
- **Pesapal** - For seamless payment integration
- **Firebase** - For robust backend services

## 📞 Support

For support and questions:
- Email: support@urbanflow.ke
- GitHub Issues: [Create an issue](https://github.com/yourusername/urbanflow/issues)
- Documentation: [UrbanFlow Docs](https://docs.urbanflow.ke)

---

**UrbanFlow** - Making Nairobi's urban living seamless, one connection at a time. 🌆✨

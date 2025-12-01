# 🏖️ ShoreSquad

**Rally your crew, track weather, and hit the next beach cleanup with our dope map app!**

ShoreSquad creates value by mobilizing young people to clean beaches, using weather and maps for easy planning and social features to make eco-action fun and connected.

## 🌊 Features

### 🗺️ **Interactive Maps**
- **Google Maps Integration** with embedded iframe
- **Cleanup Location Pins** showing next cleanup at Pasir Ris
- **Responsive Map Display** with overlay information
- **Coordinates Display** for precise meetup locations

### 🌤️ **Real-time Weather Integration**
- **Singapore NEA API** integration for accurate local weather
- **4-Day Weather Forecast** with detailed daily predictions
- **Current Conditions** including temperature, humidity, wind, and rainfall
- **Smart Recommendations** for cleanup planning based on weather
- **Location-specific Data** from Pasir Ris and Changi weather stations

### 👥 **Crew Management**
- **Social Squad Features** for organizing cleanup groups
- **Crew Statistics** tracking active crews and impact
- **Event Discovery** with filtering options (Today, Weekend, Upcoming)
- **Join/Create Events** functionality
- **Impact Tracking** showing cleanups completed and trash collected

### 🎨 **Modern Design System**
- **Ocean-inspired Color Palette** targeting young eco-warriors
- **Mobile-first Responsive Design** optimized for smartphones
- **Accessibility Features** with ARIA labels and keyboard navigation
- **Performance Optimized** with debounced events and lazy loading

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- VS Code with Live Server extension (recommended)
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ShoreSquad
   ```

2. **Open in VS Code**
   ```bash
   code .
   ```

3. **Start Live Server**
   - Right-click on `index.html`
   - Select "Open with Live Server"
   - App will open at `http://127.0.0.1:3000`

### Project Structure
```
ShoreSquad/
├── index.html              # Main HTML file with semantic structure
├── css/
│   └── styles.css          # Complete CSS with design system
├── js/
│   └── app.js              # JavaScript app with NEA API integration
├── .vscode/
│   └── settings.json       # Live Server configuration
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🇸🇬 Singapore Integration

### Weather API
- **Data Source**: Singapore NEA (National Environment Agency)
- **API Endpoint**: `https://api.data.gov.sg/v1`
- **Features**: 
  - Real-time weather readings
  - 4-day weather forecast
  - Station-specific data from Pasir Ris area

### Location Focus
- **Primary Location**: Pasir Ris, Singapore
- **Coordinates**: 1.381497, 103.955574
- **Google Maps**: Embedded with cleanup location pin

## 🎨 Design System

### Color Palette
- **Primary**: Ocean Blue (#1E88E5) - Trust & ocean connection
- **Secondary**: Coral (#FF6B6B) - Energy & beach vibes
- **Accent**: Sunshine Yellow (#FFD54F) - Optimism & fun
- **Success**: Sea Green (#26A69A) - Environmental action
- **Neutral**: Sand Beige (#F5F5DC) - Beach aesthetic

### Typography
- **Primary**: Poppins (headings) - Modern, friendly
- **Secondary**: Inter (body text) - Readable, professional

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🛠️ Technical Features

### Performance Optimizations
- **Debounced Events** for search and filtering
- **Throttled Scroll** handlers for smooth performance
- **Lazy Loading** for images and heavy content
- **Service Worker** ready for PWA functionality

### Accessibility
- **WCAG AA Compliance** with proper contrast ratios
- **Semantic HTML** with proper heading hierarchy
- **ARIA Labels** for screen reader support
- **Keyboard Navigation** with focus management
- **44px Touch Targets** for mobile accessibility

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Support**: iOS Safari 14+, Chrome Mobile 90+
- **Progressive Enhancement** for older browsers

## 🌟 Key Components

### Navigation
- **Fixed Header** with scroll effects
- **Mobile Hamburger Menu** for smaller screens
- **Smooth Scroll** to sections
- **Accessible Menu** with proper ARIA attributes

### Hero Section
- **Engaging Call-to-Action** with gradient text effects
- **Dual Action Buttons** for different user paths
- **Visual Map Preview** placeholder

### Weather Widget
- **Current Conditions** with Singapore-specific data
- **4-Day Forecast Grid** with interactive cards
- **Weather Icons** matching local conditions
- **Smart Recommendations** for cleanup planning

### Event Discovery
- **Interactive Event Cards** with join functionality
- **Filtering System** by date and type
- **Distance Calculations** from user location
- **Social Proof** with participant counts

## 🔧 Development

### Live Server Configuration
```json
{
  "liveServer.settings.port": 3000,
  "liveServer.settings.root": "/",
  "liveServer.settings.file": "index.html"
}
```

### Git Workflow
```bash
# Make changes
git add .
git commit -m "feat: description of changes"
git push origin master
```

### CSS Architecture
- **CSS Custom Properties** for consistent theming
- **Mobile-first** media queries
- **Modular Components** with BEM-like naming
- **Performance CSS** with efficient selectors

### JavaScript Architecture
- **ES6+ Features** with modern syntax
- **Modular Classes** for different services
- **Error Handling** with fallbacks
- **API Integration** with proper error states

## 🌍 Environmental Impact

### Mission
ShoreSquad aims to make beach cleanup activities social, engaging, and impactful for young environmentalists in Singapore.

### Features Supporting Mission
- **Weather Planning** prevents wasted trips
- **Social Features** encourage group participation
- **Location Mapping** makes events discoverable
- **Impact Tracking** shows collective results

## 📱 Mobile Experience

### Optimizations
- **Touch-friendly Interface** with large tap targets
- **Swipe Gestures** for navigation (planned)
- **Offline Capability** with service workers (planned)
- **App-like Experience** with proper viewport settings

## 🚀 Future Enhancements

### Planned Features
- **User Authentication** and profiles
- **Real-time Chat** for crew coordination
- **Photo Sharing** of cleanup results
- **Gamification** with points and badges
- **Push Notifications** for event reminders
- **Offline PWA** functionality

### Technical Roadmap
- **Backend API** for data persistence
- **Database Integration** for user and event data
- **Real-time Updates** with WebSockets
- **Mobile App** with React Native/Flutter

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Singapore NEA** for providing open weather data
- **Google Maps** for location services
- **data.gov.sg** for the comprehensive API ecosystem
- **Young Environmental Activists** for inspiration

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Made with 💚 for the planet and 🌊 for Singapore's beautiful coastlines.**
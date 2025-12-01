/**
 * ShoreSquad - Beach Cleanup App
 * Interactive features for crew rallying, weather tracking, and map functionality
 */

// ===== APP CONFIGURATION =====
const CONFIG = {
  // Weather API (OpenWeatherMap - requires free API key)
  WEATHER_API_KEY: 'your-openweather-api-key', // Replace with actual key
  WEATHER_API_URL: 'https://api.openweathermap.org/data/2.5',
  
  // Map configuration (will use browser geolocation)
  DEFAULT_LOCATION: {
    lat: 37.7749,
    lng: -122.4194,
    name: 'San Francisco Bay Area'
  },
  
  // Animation durations
  ANIMATION_DURATION: 300,
  
  // Debounce delays
  DEBOUNCE_DELAY: 300,
  
  // Local storage keys
  STORAGE_KEYS: {
    USER_LOCATION: 'shoresquad_user_location',
    CREW_DATA: 'shoresquad_crew_data',
    CLEANUP_EVENTS: 'shoresquad_cleanup_events',
    USER_PREFERENCES: 'shoresquad_preferences'
  }
};

// ===== UTILITY FUNCTIONS =====
class Utils {
  // Debounce function for performance optimization
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle function for scroll/resize events
  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Format distance for display
  static formatDistance(distance) {
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  }

  // Format date for display
  static formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date(date));
  }

  // Generate unique ID
  static generateId() {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Safe localStorage operations
  static getLocalStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading from localStorage: ${error.message}`);
      return defaultValue;
    }
  }

  static setLocalStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Error writing to localStorage: ${error.message}`);
      return false;
    }
  }
}

// ===== GEOLOCATION SERVICE =====
class GeolocationService {
  static getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          Utils.setLocalStorage(CONFIG.STORAGE_KEYS.USER_LOCATION, location);
          resolve(location);
        },
        error => {
          console.warn('Geolocation error:', error.message);
          // Use default location
          resolve(CONFIG.DEFAULT_LOCATION);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  static calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }
}

// ===== WEATHER SERVICE =====
class WeatherService {
  static async getCurrentWeather(lat, lng) {
    try {
      if (!CONFIG.WEATHER_API_KEY || CONFIG.WEATHER_API_KEY === 'your-openweather-api-key') {
        // Mock weather data for demo
        return this.getMockWeatherData();
      }

      const response = await fetch(
        `${CONFIG.WEATHER_API_URL}/weather?lat=${lat}&lon=${lng}&appid=${CONFIG.WEATHER_API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error('Weather API request failed');
      }

      const data = await response.json();
      return this.formatWeatherData(data);
    } catch (error) {
      console.warn('Weather service error:', error.message);
      return this.getMockWeatherData();
    }
  }

  static getMockWeatherData() {
    const conditions = ['sunny', 'cloudy', 'partly-cloudy'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
      temperature: Math.round(Math.random() * 15 + 20), // 20-35°C
      condition: randomCondition,
      humidity: Math.round(Math.random() * 30 + 40), // 40-70%
      windSpeed: Math.round(Math.random() * 10 + 5), // 5-15 km/h
      uvIndex: Math.round(Math.random() * 8 + 2), // 2-10
      description: this.getConditionDescription(randomCondition),
      icon: this.getWeatherIcon(randomCondition)
    };
  }

  static formatWeatherData(data) {
    return {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main.toLowerCase(),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
      description: data.weather[0].description,
      icon: this.getWeatherIcon(data.weather[0].main.toLowerCase())
    };
  }

  static getConditionDescription(condition) {
    const descriptions = {
      'sunny': 'Perfect weather for beach cleanup!',
      'cloudy': 'Great conditions for outdoor activities',
      'partly-cloudy': 'Nice day with some cloud cover',
      'rain': 'Consider rescheduling your cleanup'
    };
    return descriptions[condition] || 'Weather conditions are variable';
  }

  static getWeatherIcon(condition) {
    const icons = {
      'sunny': '☀️',
      'cloudy': '☁️',
      'partly-cloudy': '⛅',
      'rain': '🌧️',
      'clear': '☀️'
    };
    return icons[condition] || '🌤️';
  }
}

// ===== DATA MANAGEMENT =====
class DataManager {
  static getCleanupEvents() {
    const defaultEvents = [
      {
        id: 'event_1',
        title: 'Ocean Beach Morning Cleanup',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        location: { lat: 37.7594, lng: -122.5107, name: 'Ocean Beach, SF' },
        participants: 12,
        maxParticipants: 25,
        organizer: 'EcoWarriors Squad',
        description: 'Join us for a morning beach cleanup at Ocean Beach!'
      },
      {
        id: 'event_2',
        title: 'Baker Beach Earth Day Special',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        location: { lat: 37.7937, lng: -122.4842, name: 'Baker Beach, SF' },
        participants: 8,
        maxParticipants: 20,
        organizer: 'Green Coast Collective',
        description: 'Earth Day celebration with beach cleanup and lunch!'
      },
      {
        id: 'event_3',
        title: 'Crissy Field Weekend Warriors',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        location: { lat: 37.8024, lng: -122.4652, name: 'Crissy Field, SF' },
        participants: 15,
        maxParticipants: 30,
        organizer: 'Bay Area Beach Squad',
        description: 'Weekend cleanup with post-activity BBQ!'
      }
    ];

    return Utils.getLocalStorage(CONFIG.STORAGE_KEYS.CLEANUP_EVENTS, defaultEvents);
  }

  static getCrews() {
    const defaultCrews = [
      {
        id: 'crew_1',
        name: 'EcoWarriors Squad',
        members: 24,
        cleanups: 8,
        avatar: '🌊',
        description: 'Young environmentalists making waves in SF!',
        nextEvent: 'Ocean Beach Morning Cleanup'
      },
      {
        id: 'crew_2',
        name: 'Green Coast Collective',
        members: 18,
        cleanups: 12,
        avatar: '🏖️',
        description: 'Dedicated to keeping our coastlines pristine',
        nextEvent: 'Baker Beach Earth Day Special'
      },
      {
        id: 'crew_3',
        name: 'Bay Area Beach Squad',
        members: 31,
        cleanups: 15,
        avatar: '♻️',
        description: 'The largest beach cleanup crew in the Bay Area',
        nextEvent: 'Crissy Field Weekend Warriors'
      }
    ];

    return Utils.getLocalStorage(CONFIG.STORAGE_KEYS.CREW_DATA, defaultCrews);
  }

  static addCleanupEvent(event) {
    const events = this.getCleanupEvents();
    events.push({ ...event, id: Utils.generateId() });
    Utils.setLocalStorage(CONFIG.STORAGE_KEYS.CLEANUP_EVENTS, events);
    return events;
  }
}

// ===== UI COMPONENTS =====
class UIComponents {
  // Create weather widget HTML
  static createWeatherWidget(weatherData) {
    return `
      <div class="weather__current">
        <div class="weather__icon">${weatherData.icon}</div>
        <div class="weather__temp">${weatherData.temperature}°C</div>
        <div class="weather__condition">${weatherData.description}</div>
      </div>
      <div class="weather__details">
        <div class="weather__detail">
          <span class="weather__label">Humidity</span>
          <span class="weather__value">${weatherData.humidity}%</span>
        </div>
        <div class="weather__detail">
          <span class="weather__label">Wind</span>
          <span class="weather__value">${weatherData.windSpeed} km/h</span>
        </div>
      </div>
    `;
  }

  // Create event card HTML
  static createEventCard(event, userLocation) {
    const distance = userLocation 
      ? Utils.formatDistance(GeolocationService.calculateDistance(
          userLocation.lat, userLocation.lng,
          event.location.lat, event.location.lng
        ))
      : '';

    return `
      <div class="event-card" data-event-id="${event.id}">
        <div class="event-card__header">
          <h3 class="event-card__title">${event.title}</h3>
          <div class="event-card__date">${Utils.formatDate(event.date)}</div>
        </div>
        <div class="event-card__body">
          <div class="event-card__location">
            📍 ${event.location.name} ${distance ? `• ${distance}` : ''}
          </div>
          <div class="event-card__participants">
            👥 ${event.participants}/${event.maxParticipants} participants
          </div>
          <div class="event-card__organizer">
            Organized by ${event.organizer}
          </div>
          <p class="event-card__description">${event.description}</p>
        </div>
        <div class="event-card__actions">
          <button class="btn btn--primary" data-action="join-event">Join Event</button>
          <button class="btn btn--outline" data-action="share-event">Share</button>
        </div>
      </div>
    `;
  }

  // Create crew card HTML
  static createCrewCard(crew) {
    return `
      <div class="crew-card" data-crew-id="${crew.id}">
        <div class="crew-card__header">
          <div class="crew-card__avatar">${crew.avatar}</div>
          <div class="crew-card__info">
            <h3 class="crew-card__name">${crew.name}</h3>
            <div class="crew-card__stats">
              ${crew.members} members • ${crew.cleanups} cleanups
            </div>
          </div>
        </div>
        <p class="crew-card__description">${crew.description}</p>
        <div class="crew-card__next-event">
          Next: ${crew.nextEvent}
        </div>
        <div class="crew-card__actions">
          <button class="btn btn--primary" data-action="join-crew">Join Crew</button>
          <button class="btn btn--outline" data-action="view-crew">View Details</button>
        </div>
      </div>
    `;
  }
}

// ===== MAIN APPLICATION CLASS =====
class ShoreSquadApp {
  constructor() {
    this.userLocation = null;
    this.weatherData = null;
    this.cleanupEvents = [];
    this.crews = [];
    this.activeFilters = new Set(['all']);
    
    // Bind methods
    this.handleNavToggle = this.handleNavToggle.bind(this);
    this.handleFilterChange = Utils.debounce(this.handleFilterChange.bind(this), CONFIG.DEBOUNCE_DELAY);
    this.handleScroll = Utils.throttle(this.handleScroll.bind(this), 100);
    this.handleResize = Utils.throttle(this.handleResize.bind(this), 250);
  }

  // Initialize the application
  async init() {
    try {
      console.log('🏖️ Initializing ShoreSquad...');
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Load user location
      await this.loadUserLocation();
      
      // Load weather data
      await this.loadWeatherData();
      
      // Load and render data
      this.loadData();
      this.render();
      
      // Initialize animations
      this.initializeAnimations();
      
      console.log('✅ ShoreSquad initialized successfully!');
    } catch (error) {
      console.error('❌ Error initializing ShoreSquad:', error);
      this.showErrorMessage('Failed to initialize app. Please refresh the page.');
    }
  }

  // Setup all event listeners
  setupEventListeners() {
    // Navigation toggle
    const navToggle = document.querySelector('.nav__toggle');
    if (navToggle) {
      navToggle.addEventListener('click', this.handleNavToggle);
    }

    // CTA buttons
    document.addEventListener('click', this.handleButtonClicks.bind(this));

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        this.handleFilterChange(filter, button);
      });
    });

    // Scroll handling for header effects
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', this.handleAnchorClick.bind(this));
    });
  }

  // Handle navigation toggle for mobile
  handleNavToggle() {
    const navMenu = document.querySelector('.nav__menu');
    const isOpen = navMenu.classList.contains('nav__menu--open');
    
    navMenu.classList.toggle('nav__menu--open', !isOpen);
    
    // Update aria-expanded for accessibility
    const navToggle = document.querySelector('.nav__toggle');
    navToggle.setAttribute('aria-expanded', !isOpen);
  }

  // Handle button clicks with delegation
  handleButtonClicks(event) {
    const target = event.target;
    
    if (!target.matches('button, .btn')) return;

    const action = target.dataset.action || target.id;
    
    switch (action) {
      case 'get-started-btn':
      case 'start-cleanup-btn':
        this.handleStartCleanup();
        break;
      case 'join-crew-btn':
        this.scrollToSection('#crew');
        break;
      case 'create-event-btn':
        this.handleCreateEvent();
        break;
      case 'join-event':
        this.handleJoinEvent(target);
        break;
      case 'join-crew':
        this.handleJoinCrew(target);
        break;
      case 'create-crew-btn':
        this.handleCreateCrew();
        break;
      case 'find-crews-btn':
        this.handleFindCrews();
        break;
    }
  }

  // Handle filter changes
  handleFilterChange(filter, button) {
    // Update active filter
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('filter-btn--active');
    });
    button.classList.add('filter-btn--active');
    
    this.activeFilters = new Set([filter]);
    this.renderFilteredEvents();
  }

  // Handle scroll events
  handleScroll() {
    const header = document.querySelector('.header');
    const scrollY = window.scrollY;
    
    // Add/remove scrolled class for header styling
    header.classList.toggle('header--scrolled', scrollY > 50);
  }

  // Handle resize events
  handleResize() {
    // Close mobile menu on resize to larger screen
    if (window.innerWidth > 768) {
      const navMenu = document.querySelector('.nav__menu');
      navMenu.classList.remove('nav__menu--open');
    }
  }

  // Handle anchor link clicks
  handleAnchorClick(event) {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute('href');
    this.scrollToSection(targetId);
  }

  // Smooth scroll to section
  scrollToSection(targetId) {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerHeight = document.querySelector('.header').offsetHeight;
      const targetPosition = targetElement.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  // Load user location
  async loadUserLocation() {
    try {
      this.userLocation = await GeolocationService.getCurrentPosition();
      console.log('📍 Location loaded:', this.userLocation);
    } catch (error) {
      console.warn('📍 Location loading failed, using default location');
      this.userLocation = CONFIG.DEFAULT_LOCATION;
    }
  }

  // Load weather data
  async loadWeatherData() {
    try {
      const location = this.userLocation || CONFIG.DEFAULT_LOCATION;
      this.weatherData = await WeatherService.getCurrentWeather(location.lat, location.lng);
      console.log('🌤️ Weather data loaded:', this.weatherData);
    } catch (error) {
      console.warn('🌤️ Weather loading failed');
      this.weatherData = WeatherService.getMockWeatherData();
    }
  }

  // Load application data
  loadData() {
    this.cleanupEvents = DataManager.getCleanupEvents();
    this.crews = DataManager.getCrews();
    console.log(`📊 Data loaded: ${this.cleanupEvents.length} events, ${this.crews.length} crews`);
  }

  // Main render method
  render() {
    this.renderWeather();
    this.renderEvents();
    this.renderCrews();
    this.renderStats();
  }

  // Render weather widget
  renderWeather() {
    const weatherWidget = document.querySelector('#weather-widget');
    const weatherLoading = document.querySelector('#weather-loading');
    
    if (weatherWidget && this.weatherData) {
      if (weatherLoading) {
        weatherLoading.style.display = 'none';
      }
      
      weatherWidget.innerHTML = UIComponents.createWeatherWidget(this.weatherData);
      
      // Add weather-specific styling
      weatherWidget.style.cssText = `
        display: grid;
        grid-template-columns: auto 1fr;
        gap: var(--space-xl);
        align-items: center;
      `;
    }
  }

  // Render cleanup events
  renderEvents() {
    const mapContainer = document.querySelector('#cleanup-map');
    if (mapContainer) {
      const eventsHtml = this.cleanupEvents
        .map(event => UIComponents.createEventCard(event, this.userLocation))
        .join('');
      
      mapContainer.innerHTML = `
        <div class="events-grid">
          ${eventsHtml}
        </div>
      `;
    }
  }

  // Render filtered events
  renderFilteredEvents() {
    const now = new Date();
    const filteredEvents = this.cleanupEvents.filter(event => {
      if (this.activeFilters.has('all')) return true;
      
      const eventDate = new Date(event.date);
      
      if (this.activeFilters.has('today')) {
        return eventDate.toDateString() === now.toDateString();
      }
      
      if (this.activeFilters.has('weekend')) {
        const dayOfWeek = eventDate.getDay();
        return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
      }
      
      if (this.activeFilters.has('upcoming')) {
        return eventDate > now;
      }
      
      return true;
    });

    const mapContainer = document.querySelector('#cleanup-map');
    if (mapContainer) {
      const eventsHtml = filteredEvents
        .map(event => UIComponents.createEventCard(event, this.userLocation))
        .join('');
      
      mapContainer.innerHTML = `
        <div class="events-grid">
          ${eventsHtml}
        </div>
      `;
    }
  }

  // Render crews
  renderCrews() {
    const crewList = document.querySelector('#crew-list');
    if (crewList && this.crews.length > 0) {
      const crewsHtml = this.crews
        .map(crew => UIComponents.createCrewCard(crew))
        .join('');
      
      crewList.innerHTML = `
        <div class="crews-grid">
          ${crewsHtml}
        </div>
      `;
    }
  }

  // Render statistics
  renderStats() {
    // Update crew stats with real data
    const activeCrews = document.querySelector('#active-crews');
    const cleanupsCompleted = document.querySelector('#cleanups-completed');
    const trashCollected = document.querySelector('#trash-collected');
    
    if (activeCrews) {
      activeCrews.textContent = this.crews.length;
    }
    
    if (cleanupsCompleted) {
      const totalCleanups = this.crews.reduce((sum, crew) => sum + crew.cleanups, 0);
      cleanupsCompleted.textContent = totalCleanups.toLocaleString();
    }
    
    if (trashCollected) {
      // Mock calculation based on cleanups
      const totalCleanups = this.crews.reduce((sum, crew) => sum + crew.cleanups, 0);
      const avgTrashPerCleanup = 8.2; // kg
      const totalTrash = (totalCleanups * avgTrashPerCleanup).toFixed(1);
      trashCollected.textContent = `${totalTrash}k`;
    }
  }

  // Initialize animations and interactions
  initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe animated elements
    document.querySelectorAll('.feature-card, .stat-card, .crew-card, .event-card').forEach(el => {
      observer.observe(el);
    });

    // Add animation CSS classes
    this.addAnimationStyles();
  }

  // Add CSS animations dynamically
  addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .feature-card,
      .stat-card,
      .crew-card,
      .event-card {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }
      
      .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
      
      .events-grid,
      .crews-grid {
        display: grid;
        gap: var(--space-xl);
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      }
      
      .weather__current {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-sm);
      }
      
      .weather__icon {
        font-size: 3rem;
      }
      
      .weather__temp {
        font-size: var(--font-size-3xl);
        font-weight: var(--font-weight-bold);
        margin: 0;
      }
      
      .weather__condition {
        font-size: var(--font-size-lg);
        opacity: 0.9;
        text-align: center;
      }
      
      .weather__details {
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
      }
      
      .weather__detail {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-sm) 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      }
      
      .header--scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: var(--shadow-md);
      }
    `;
    document.head.appendChild(style);
  }

  // Event handlers for user interactions
  handleStartCleanup() {
    this.scrollToSection('#map');
    this.showNotification('Find a cleanup near you or create your own event!', 'info');
  }

  handleCreateEvent() {
    // In a real app, this would open a modal or navigate to a form
    this.showNotification('Event creation feature coming soon! 🚀', 'info');
  }

  handleJoinEvent(button) {
    const eventCard = button.closest('.event-card');
    const eventId = eventCard.dataset.eventId;
    
    // Mock join event
    this.showNotification('Successfully joined the cleanup event! 🎉', 'success');
    button.textContent = 'Joined ✓';
    button.disabled = true;
    button.classList.add('btn--success');
  }

  handleJoinCrew(button) {
    const crewCard = button.closest('.crew-card');
    const crewId = crewCard.dataset.crewId;
    
    // Mock join crew
    this.showNotification('Welcome to the crew! 👋', 'success');
    button.textContent = 'Joined ✓';
    button.disabled = true;
    button.classList.add('btn--success');
  }

  handleCreateCrew() {
    this.showNotification('Crew creation feature coming soon! Start planning your squad! 💪', 'info');
  }

  handleFindCrews() {
    // Mock location-based crew search
    this.showNotification('Found 8 crews within 5km of your location! 📍', 'info');
  }

  // Show notification to user
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
      <div class="notification__content">
        <span class="notification__message">${message}</span>
        <button class="notification__close" type="button" aria-label="Close notification">&times;</button>
      </div>
    `;

    // Add notification styles
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: var(--color-white);
      color: var(--color-neutral-800);
      padding: var(--space-lg);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      z-index: var(--z-tooltip);
      max-width: 300px;
      border-left: 4px solid var(--color-${type === 'success' ? 'success' : type === 'error' ? 'secondary' : 'primary'});
      transform: translateX(100%);
      transition: transform var(--transition-normal);
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);

    // Setup close functionality
    const closeButton = notification.querySelector('.notification__close');
    const closeNotification = () => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    };

    closeButton.addEventListener('click', closeNotification);

    // Auto close after 5 seconds
    setTimeout(closeNotification, 5000);
  }

  // Show error message
  showErrorMessage(message) {
    this.showNotification(message, 'error');
  }
}

// ===== APPLICATION INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize ShoreSquad app
  const app = new ShoreSquadApp();
  app.init();

  // Make app available globally for debugging
  window.ShoreSquadApp = app;
});

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator && 'PushManager' in window) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('🔧 Service Worker registered successfully');
      })
      .catch(error => {
        console.log('🔧 Service Worker registration failed:', error);
      });
  });
}
# VocationTracker

## Project Overview
VocationTracker is a comprehensive web application designed to manage and track employee vacations, time off, and work schedules.

## Technology Stack
- Angular 17+
- TypeScript
- Angular Material
- RxJS
- ngx-translate
- Firebase/Firestore (optional)

## Prerequisites
- Node.js (v18+)
- npm (v9+)
- Angular CLI

## Setup and Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/VocationTracker.git
cd VocationTracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Development Server
```bash
ng serve
```
Navigate to `http://localhost:4200/`

## Project Structure
```
src/
├── app/
│   ├── core/           # Core services and interceptors
│   ├── shared/         # Shared components and modules
│   ├── pages/          # Feature modules
│   │   ├── dashboard/
│   │   ├── profile/
│   │   └── ...
│   └── ...
├── assets/             # Static assets
└── environments/       # Environment configurations
```

## Build and Deployment
```bash
# Production build
ng build --configuration=production

# Build with stats
ng build --stats-json
```

## Running Tests
```bash
# Unit tests
ng test

# End-to-end tests
ng e2e
```

## Key Features
- User Profile Management
- Vacation Request System
- Responsive Design
- Internationalization Support

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Contact
Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/VocationTracker](https://github.com/yourusername/VocationTracker)

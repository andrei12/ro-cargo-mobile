# RO Cargo Mobile

A React Native mobile application for cargo management and logistics in Romania, built with Expo and TypeScript.

## 📱 Features

- **Bilingual Support**: Romanian and English localization
- **Cross-Platform**: iOS, Android, and Web support
- **Modern Architecture**: Built with Expo Router for navigation
- **API Integration**: Real-time health monitoring and data fetching
- **TypeScript**: Full type safety and better developer experience
- **Responsive Design**: Optimized for mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 20.18.1)
- Yarn (>= 1.22.0)
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/ro-cargo-mobile.git
cd ro-cargo-mobile
```

2. Install dependencies:

```bash
yarn install
```

3. Start the development server:

```bash
yarn start
```

## 📱 Running the App

### iOS

```bash
yarn ios
```

### Android

```bash
yarn android
```

### Web

```bash
yarn web
```

## 🛠️ Development

### Available Scripts

- `yarn start` - Start the Expo development server
- `yarn ios` - Run on iOS simulator
- `yarn android` - Run on Android emulator
- `yarn web` - Run in web browser
- `yarn lint` - Run ESLint and Prettier checks
- `yarn format` - Format code with ESLint and Prettier
- `yarn typecheck` - Run TypeScript type checking
- `yarn openapi-ts` - Generate TypeScript types from OpenAPI spec

### Project Structure

```
src/
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Home screen
│   ├── details.tsx        # Details screen
│   └── +not-found.tsx     # 404 page
├── components/            # Reusable UI components
│   ├── Button.tsx
│   ├── Container.tsx
│   └── ScreenContent.tsx
├── client/               # API client and types
│   ├── types.gen.ts      # Generated TypeScript types
│   ├── sdk.gen.ts        # Generated SDK
│   └── client.gen.ts     # API client configuration
├── i18n/                 # Internationalization
│   ├── i18n.ts           # i18n configuration
│   └── locales/          # Translation files
│       ├── en.json       # English translations
│       └── ro.json       # Romanian translations
└── assets/               # Static assets (images, fonts, etc.)
scripts/                  # Development and CI/CD scripts
├── test-workflows.sh     # Test GitHub Actions workflows locally
└── act-debug.sh          # Debug failed workflows with minimal output
```

### Tech Stack

- **Frontend**: React Native with Expo
- **Navigation**: Expo Router
- **State Management**: TanStack Query (React Query)
- **Styling**: React Native StyleSheet
- **Internationalization**: react-i18next
- **Type Safety**: TypeScript
- **Code Quality**: ESLint + Prettier
- **CI/CD**: GitHub Actions

## 🌐 API Integration

The app integrates with a backend API using auto-generated TypeScript clients from OpenAPI specifications. API health status is monitored in real-time on the home screen.

To regenerate API types:

```bash
yarn openapi-ts
```

## 🌍 Internationalization

The app supports multiple languages:

- 🇺🇸 English (en)
- 🇷🇴 Romanian (ro)

Translation files are located in `src/i18n/locales/`. To add a new language:

1. Create a new JSON file in `src/i18n/locales/`
2. Add the language configuration in `src/i18n/i18n.ts`
3. Update the language switcher in the app

## 🚀 Building for Production

### Development Build

```bash
expo build:android
expo build:ios
```

### EAS Build (Recommended)

```bash
eas build --platform android
eas build --platform ios
```

## 📋 Testing

Run tests locally using GitHub Actions with the provided scripts. See the [Scripts section](#-scripts) for detailed instructions on using `test-workflows.sh` and `act-debug.sh`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

This project uses ESLint and Prettier for code formatting. Run `yarn format` to automatically format your code.

## 📄 License

This project is private. All rights reserved.

## 👥 Maintainers

- [@bogdan2510](https://github.com/bogdan2510) - Project Owner

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

Built with ❤️ for Romanian cargo and logistics industry.

## 📜 Scripts

The `scripts/` folder contains helpful development and debugging scripts:

### `test-workflows.sh`

Test GitHub Actions workflows locally using [act](https://github.com/nektos/act):

```bash
# Make script executable (first time only)
chmod +x scripts/test-workflows.sh

# Run the script
./scripts/test-workflows.sh
```

This script:

- Checks if `act` and Docker are installed
- Lists available workflows
- Runs the CI workflow automatically
- Provides clear success/failure feedback

### `act-debug.sh`

Debug failed GitHub Actions workflows with minimal output:

```bash
# Make script executable (first time only)
chmod +x scripts/act-debug.sh

# Run the script
./scripts/act-debug.sh
```

This script:

- Debugs failed workflows with focused error output
- Filters out noise to show only relevant errors
- Provides common troubleshooting tips

### Prerequisites for Scripts

To use these scripts, you need:

1. **act** - GitHub Actions runner for local testing:

   ```bash
   # macOS
   brew install act

   # Other platforms: https://github.com/nektos/act#installation
   ```

2. **Docker** - Required by act to run workflows:
   ```bash
   # Make sure Docker is running
   docker info
   ```

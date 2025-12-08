# Arev

Transform your Chrome new tab into a beautiful, weather-responsive experience. Clean, minimalist design that adapts to your local weather—no clutter, just serenity.

---

## Features

- **Dynamic Backgrounds**: Weather-responsive backgrounds that change based on current conditions (clear, cloudy, rain, snow, thunderstorm, fog, and more)
- **Current Weather**: Real-time temperature, feels-like temperature, wind speed, and humidity
- **3-Day Forecast**: Extended weather outlook at a glance
- **Smart Location Detection**: Automatic location via IP geolocation with fallback to browser geolocation
- **Weather Icons**: Beautiful SVG weather icons from MeteoIcons
- **Clothing Recommendations**: Contextual wardrobe advice based on temperature and conditions
- **Performance Optimized**: Intelligent caching reduces API calls
- **Settings Page**: Refresh location, view details, access credits
- **Popup Widget**: Quick weather check via extension popup

---

## Installation

### From Source

1. Clone the repository:
```bash
git clone https://github.com/Shirak22/arev.git
```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable **Developer mode** (toggle in top-right)

4. Click **Load unpacked** and select the extension directory

5. Open a new tab to see Arev in action

---

## Usage

- **New Tab**: Automatically displays weather for your detected location
- **Extension Popup**: Click the extension icon for quick weather info
- **Settings**: Access via popup gear icon or navigate to `chrome-extension://[extension-id]/settings.html`

### Location Detection

The extension attempts location detection in this order:
1. Cached location (if available)
2. IP-based geolocation
3. Browser geolocation (requires permission)

To refresh location: Settings → Refresh Location

---

## Technical Details

### Architecture

- **Manifest Version**: 3
- **Service Worker**: Background script handles API communication
- **Modules**: ES6 modules for clean code organization
- **Storage**: Chrome Storage API for caching

### APIs Used

- **Open-Meteo**: Weather data and forecasts
- **ip-api.com**: IP-based geolocation
- **BigDataCloud**: Reverse geocoding (coordinates → city name)

### Permissions

- `activeTab`: For new tab override
- `storage`: Local caching
- `geolocation`: Browser geolocation fallback
- `tabs`: Settings navigation

---

## Project Structure

```
arev/
├── assets/
│   ├── backgrounds/     # Weather-responsive background images
│   ├── icons/           # Weather icons (SVG)
│   └── logo/            # Extension icons
├── css/                 # Stylesheets
├── js/
│   ├── location/        # Location detection modules
│   ├── weather/         # Weather data and rendering
│   ├── render/          # UI rendering modules
│   └── *.js             # Core scripts
├── index.html           # New tab page
├── popup.html           # Extension popup
├── settings.html        # Settings page
└── manifest.json        # Extension manifest
```

---

## Attribution

- **Weather Icons**: [MeteoIcons](https://basmilius.github.io/weather-icons/) by Bas Milius (MIT License)
- **Weather Data**: [Open-Meteo](https://open-meteo.com/)
- **IP Geolocation**: [ip-api.com](https://ip-api.com/)
- **Reverse Geocoding**: [BigDataCloud](https://www.bigdatacloud.com/)

See [ATTRIBUTIONS.md](ATTRIBUTIONS.md) for full details.

---

## License

MIT License

Copyright (c) 2025 Shirak Soghomonian

See [LICENSE](LICENSE) for full terms.

---

## Author

**Shirak Soghomonian**

- GitHub: [@Shirak22](https://github.com/Shirak22)
- Repository: [arev](https://github.com/Shirak22/arev)

---

## Contributing

Contributions welcome. Please open an issue or submit a pull request.


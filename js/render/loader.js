const renderLoader = () => {
    const loader = document.createElement('div');
    loader.classList.add('loader');
    loader.innerHTML = `
    <section id="main-container-loader">
        <main id="weather-container-loader">
            <!-- Forecast skeleton -->
            <section class="weather-forecast-loader">
                <section class="weather-forecast-days-loader">
                    <div class="skeleton-forecast-day"></div>
                    <div class="skeleton-forecast-day"></div>
                    <div class="skeleton-forecast-day"></div>
                </section>
                <div class="skeleton-forecast-title"></div>
            </section>
            
            <!-- Header skeleton -->
            <header id="weather-header-loader">
                <div class="skeleton-text skeleton-location"></div>
                <div class="skeleton-text skeleton-time"></div>
            </header>
            
            <!-- Content skeleton -->
            <section id="weather-content-loader">
                <section class="weather-icons-loader">
                    <div class="skeleton-icon"></div>
                    <div class="skeleton-text skeleton-description"></div>
                </section>
                <section class="weather-temperature-loader">
                    <div class="skeleton-temperature"></div>
                    <div class="skeleton-text skeleton-feels-like"></div>
                    <div class="weather-temperature-details-loader">
                        <div class="skeleton-text skeleton-detail"></div>
                        <div class="skeleton-text skeleton-detail"></div>
                    </div>
                </section>
            </section>
            
            <!-- Footer skeleton -->
            <footer id="weather-footer-loader">
                <div class="skeleton-recommendation"></div>
            </footer>
        </main>
        
        <!-- Credits skeleton -->
        <section id="photograph-credits-loader">
            <div class="skeleton-credits"></div>
        </section>
    </section>
    `;
    return loader;
}

export default renderLoader;
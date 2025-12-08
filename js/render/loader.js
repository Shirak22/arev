/**
 * @fileoverview Loading skeleton renderer for new tab page
 * @author Shirak Soghomonian
 * @license MIT
 * Copyright (c) 2025 Shirak Soghomonian
 * GitHub: https://github.com/Shirak22/arev
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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
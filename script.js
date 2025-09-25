document.addEventListener("DOMContentLoaded", () => {
    const cityInput = document.querySelector(".city-input");
    const searchButton = document.querySelector(".search-btn");
    const initialMessage = document.querySelector(".initial-message");
    const weatherInfo = document.querySelector(".weather-info");

    // New DOM element selectors
    const conditionTxt = document.querySelector(".condition-txt");
    const tempTxt = document.querySelector(".temp-txt");
    const locationTxt = document.querySelector(".location-txt");
    const windValueTxt = document.querySelector(".wind-value-txt");
    const humidityValueTxt = document.querySelector(".humidity-value-txt");
    const sunriseTxt = document.querySelector(".sunrise-txt");
    const sunsetTxt = document.querySelector(".sunset-txt");
    const body = document.querySelector("body");

    // Chart.js instance
    let forecastChart;
    const chartCanvas = document.getElementById('forecastChart').getContext('2d');

    const API_KEY = "b744298a4d3a48a2a9e200533250209"; // Your WeatherAPI.com API key

    const getWeatherDetails = (cityName) => {
        // Free tier only supports 3 days, so we request 3
        const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=3&aqi=no&alerts=no`;

        fetch(API_URL)
            .then(response => {
                if (!response.ok) throw new Error("City not found.");
                return response.json();
            })
            .then(data => {
                // --- Update Main Weather Display ---
                const { current, location, forecast } = data;
                conditionTxt.textContent = current.condition.text;
                tempTxt.textContent = `${Math.round(current.temp_c)}°`;
                locationTxt.textContent = `${location.name}, ${location.country}`;
                windValueTxt.textContent = `${current.wind_kph} km/h`;
                humidityValueTxt.textContent = `${current.humidity}%`;
                sunriseTxt.textContent = forecast.forecastday[0].astro.sunrise;
                sunsetTxt.textContent = forecast.forecastday[0].astro.sunset;

                // --- Update Background Image based on weather ---
                updateBackground(current.condition.text);

                // --- Update Forecast Chart ---
                updateChart(forecast.forecastday);

                // Show weather info and hide initial message
                initialMessage.style.display = "none";
                weatherInfo.style.display = "flex";
            })
            .catch(() => {
                alert("An error occurred. Please check the city name and try again.");
                initialMessage.style.display = "block";
                weatherInfo.style.display = "none";
            });
    };

    const updateBackground = (condition) => {
        const weather = condition.toLowerCase();
        // Default background
        let imageUrl = "https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=2070&auto=format&fit=crop"; 

        if (weather.includes("sun") || weather.includes("clear")) {
            imageUrl = "https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=1974&auto=format&fit=crop";
        } else if (weather.includes("rain") || weather.includes("drizzle")) {
            imageUrl = "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=1935&auto=format&fit=crop";
        } else if (weather.includes("cloud") || weather.includes("overcast")) {
            imageUrl = "https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1951&auto=format&fit=crop";
        } else if (weather.includes("snow") || weather.includes("blizzard") || weather.includes("ice")) {
            imageUrl = "https://images.unsplash.com/photo-1547754980-3df97fed72a8?q=80&w=1974&auto=format&fit=crop";
        } else if (weather.includes("thunder") || weather.includes("storm")) {
            imageUrl = "https://images.unsplash.com/photo-1605727226462-cd383d699e4c?q=80&w=2070&auto=format&fit=crop";
        } else if (weather.includes("mist") || weather.includes("fog") || weather.includes("haze")) {
            imageUrl = "https://unsplash.com/photos/ugnrXk1129g/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzU4ODIxMzgyfA&force=true&w=1920";
        }
        body.style.backgroundImage = `url('${imageUrl}')`;
    };

    const updateChart = (forecastDays) => {
        const labels = forecastDays.map(day => {
            const date = new Date(day.date);
            return date.toLocaleDateString('en-US', { weekday: 'long' });
        });
        const data = forecastDays.map(day => day.day.avgtemp_c);

        if (forecastChart) {
            forecastChart.destroy();
        }

        forecastChart = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Average Temperature (°C)',
                    data: data,
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: 'rgba(255, 255, 255, 1)',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 7,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: 'white' }, grid: { color: 'rgba(255, 255, 255, 0.2)' } },
                    y: { ticks: { color: 'white' }, grid: { color: 'rgba(255, 255, 255, 0.2)' } }
                }
            }
        });
    };

    const handleSearch = () => {
        const cityName = cityInput.value.trim();
        if (cityName) getWeatherDetails(cityName);
    };

    searchButton.addEventListener("click", handleSearch);
    cityInput.addEventListener("keyup", e => e.key === "Enter" && handleSearch());
});
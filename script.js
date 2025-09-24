const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const weatherInfo = document.querySelector(".weather-info");
const initialMessage = document.querySelector(".search-city");

// DOM elements to update
const countryTxt = document.querySelector(".country-txt");
const currentDateTxt = document.querySelector(".current-date-txt");
const weatherSummaryImg = document.querySelector(".weather-summary-img");
const tempTxt = document.querySelector(".temp-txt");
const conditionTxt = document.querySelector(".condition-txt");
const humidityValueTxt = document.querySelector(".humidity-value-txt");
const windValueTxt = document.querySelector(".wind-value-txt");
const forecastContainer = document.querySelector(".forecast-items-container");

// Your WeatherAPI.com API key
const API_KEY = "b744298a4d3a48a2a9e200533250209"; 

const formatDate = (date) => {
    const options = { weekday: 'short', day: '2-digit', month: 'short' };
    return date.toLocaleDateString('en-US', options);
};

const getWeatherDetails = (cityName) => {
    // We request 5 days, but the free tier of WeatherAPI may only return 3.
    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=5&aqi=no&alerts=no`;

    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error("City not found.");
            }
            return response.json();
        })
        .then(data => {
            // --- Update Current Weather ---
            const current = data.current;
            const location = data.location;

            countryTxt.textContent = `${location.name}, ${location.country}`;
            currentDateTxt.textContent = formatDate(new Date(location.localtime));
            tempTxt.textContent = `${Math.round(current.temp_c)} °C`;
            conditionTxt.textContent = current.condition.text;
            humidityValueTxt.textContent = `${current.humidity}%`;
            // Convert wind speed from kph to m/s
            windValueTxt.textContent = `${(current.wind_kph / 3.6).toFixed(1)} M/s`;
            weatherSummaryImg.src = `https:${current.condition.icon}`;
            weatherSummaryImg.onerror = () => { weatherSummaryImg.src = 'https://placehold.co/160x140/facc15/000000?text=Weather'; };

            // --- Update Forecast ---
            const forecastDays = data.forecast.forecastday;
            
            forecastContainer.innerHTML = ""; // Clear previous forecast
            forecastDays.forEach(day => {
                const forecastDate = new Date(day.date);
                // The API provides the icon URL directly
                const forecastImgSrc = `https:${day.day.condition.icon}`;
                
                const forecastItemHTML = `
                    <div class="forecast-items">
                        <h5 class="forecast-items-date regular-txt">${formatDate(forecastDate).split(', ')[1]}</h5>
                        <img src="${forecastImgSrc}" class="forecast-item-img" onerror="this.src='https://placehold.co/35x35/facc15/000000?text=Icon'">
                        <h5 class="forecast-item-temp">${Math.round(day.day.avgtemp_c)} °C</h5>
                    </div>`;
                forecastContainer.innerHTML += forecastItemHTML;
            });

            // Show weather info and hide initial message
            initialMessage.style.display = "none";
            weatherInfo.style.display = "flex";

        })
        .catch(() => {
            alert("An error occurred. Please check the city name.");
            // In case of error, show the initial message again
            initialMessage.style.display = "flex";
            weatherInfo.style.display = "none";
        });
};


const handleSearch = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    getWeatherDetails(cityName);
};

searchButton.addEventListener("click", handleSearch);
cityInput.addEventListener("keyup", e => e.key === "Enter" && handleSearch());


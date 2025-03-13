const apiKey = '8e45cfc60463d38ce6af6132c0edd194';
const apiUrl = 'https://api.openweathermap.org/data/2.5/';

const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('windSpeed');
const dateTimeElement = document.getElementById('dateTime');
const weatherChart = document.getElementById('weatherChart').getContext('2d');

searchButton.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        fetchWeather(location);
    }
});

function fetchWeather(location) {
    const url = `${apiUrl}weather?q=${location}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const { lat, lon } = data.coord;
            locationElement.textContent = data.name;
            temperatureElement.textContent = `Temperature: ${Math.round(data.main.temp)}°C`;
            descriptionElement.textContent = `Condition: ${data.weather[0].description}`;
            humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
            windSpeedElement.textContent = `Wind Speed: ${data.wind.speed} m/s`;
            dateTimeElement.textContent = `Date & Time: ${new Date(data.dt * 1000).toLocaleString()}`;
            fetchForecast(lat, lon);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function fetchForecast(lat, lon) {
    const url = `${apiUrl}onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const labels = data.daily.map(item => new Date(item.dt * 1000).toLocaleDateString());
            const temps = data.daily.map(item => item.temp.day);
            const humidities = data.daily.map(item => item.humidity);
            const conditions = data.daily.map(item => item.weather[0].description);

            new Chart(weatherChart, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Temperature (°C)',
                            data: temps,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            fill: false
                        },
                        {
                            label: 'Humidity (%)',
                            data: humidities,
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1,
                            fill: false
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchWeather('Delhi');
});


// filepath: js/weather.js

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

/**
 * Obtiene las coordenadas (latitud, longitud) de una ciudad usando la API de Geocoding de Open-Meteo
 * @param {string} cityName - Nombre de la ciudad a buscar
 * @returns {Promise<Object>} - Objeto con latitud, longitud y nombre de la ciudad
 */
async function getCoordinates(cityName) {
    const url = `${GEOCODING_API}?name=${encodeURIComponent(cityName)}&count=1&language=es&format=json`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error('Error al conectar con el servicio de geocodificación');
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
        throw new Error(`No se encontró la ciudad: ${cityName}`);
    }
    
    const location = data.results[0];
    return {
        latitude: location.latitude,
        longitude: location.longitude,
        name: location.name,
        country: location.country || ''
    };
}

/**
 * Obtiene los datos meteorológicos actuales para una ubicación específica
 * @param {number} lat - Latitud
 * @param {number} lon - Longitud
 * @returns {Promise<Object>} - Datos meteorológicos actuales
 */
async function getCurrentWeather(lat, lon) {
    const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
        timezone: 'auto'
    });
    
    const response = await fetch(`${WEATHER_API}?${params}`);
    
    if (!response.ok) {
        throw new Error('Error al obtener datos meteorológicos');
    }
    
    return response.json();
}

/**
 * Obtiene el forecast diario para un rango de fechas
 * @param {number} lat - Latitud
 * @param {number} lon - Longitud
 * @param {string} startDate - Fecha de inicio (YYYY-MM-DD)
 * @param {string} endDate - Fecha de fin (YYYY-MM-DD)
 * @returns {Promise<Object>} - Datos del forecast
 */
async function getDailyForecast(lat, lon, startDate, endDate) {
    const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        daily: 'temperature_2m_max,temperature_2m_min,weather_code',
        start_date: startDate,
        end_date: endDate,
        timezone: 'auto'
    });
    
    const response = await fetch(`${WEATHER_API}?${params}`);
    
    if (!response.ok) {
        throw new Error('Error al obtener el pronóstico');
    }
    
    return response.json();
}

/**
 * Convierte el código del clima a descripción legible
 * @param {number} code - Código WMO del clima
 * @returns {string} - Descripción del clima
 */
function getWeatherDescription(code) {
    const weatherCodes = {
        0: 'Cielo despejado',
        1: 'Mayormente despejado',
        2: 'Parcialmente nublado',
        3: 'Nublado',
        45: 'Niebla',
        48: 'Niebla escarcha',
        51: 'Llovizna ligera',
        53: 'Llovizna moderada',
        55: 'Llovizna densa',
        56: 'Llovizna helada ligera',
        57: 'Llovizna helada densa',
        61: 'Lluvia ligera',
        63: 'Lluvia moderada',
        65: 'Lluvia fuerte',
        66: 'Lluvia helada ligera',
        67: 'Lluvia helada fuerte',
        71: 'Nevada ligera',
        73: 'Nevada moderada',
        75: 'Nevada fuerte',
        77: 'Granos de nieve',
        80: 'Chubascos ligeros',
        81: 'Chubascos moderados',
        82: 'Chubascos fuertes',
        85: 'Chubascos de nieve ligeros',
        86: 'Chubascos de nieve fuertes',
        95: 'Tormenta',
        96: 'Tormenta con granizo ligero',
        99: 'Tormenta con granizo fuerte'
    };
    
    return weatherCodes[code] || 'Desconocido';
}

/**
 * Función principal que recibe el nombre de una ciudad y devuelve los datos del clima
 * @param {string} cityName - Nombre de la ciudad
 * @param {string} startDate - Fecha de inicio opcional (YYYY-MM-DD)
 * @param {string} endDate - Fecha de fin opcional (YYYY-MM-DD)
 * @returns {Promise<Object>} - Objeto con nombre, temperatura y descripción
 */
async function getWeatherData(cityName, startDate = null, endDate = null) {
    try {
        // 1. Obtener coordenadas de la ciudad
        const coordinates = await getCoordinates(cityName);
        
        // 2. Obtener clima actual
        const currentData = await getCurrentWeather(coordinates.latitude, coordinates.longitude);
        
        const result = {
            city: coordinates.name,
            country: coordinates.country,
            temperature: Math.round(currentData.current.temperature_2m),
            description: getWeatherDescription(currentData.current.weather_code),
            humidity: currentData.current.relative_humidity_2m,
            windSpeed: currentData.current.wind_speed_10m,
            timezone: currentData.timezone
        };
        
        // 3. Si hay rango de fechas, obtener forecast
        if (startDate && endDate) {
            const forecastData = await getDailyForecast(
                coordinates.latitude, 
                coordinates.longitude, 
                startDate, 
                endDate
            );
            
            result.forecast = forecastData.daily.time.map((date, index) => ({
                date: date,
                tempMax: Math.round(forecastData.daily.temperature_2m_max[index]),
                tempMin: Math.round(forecastData.daily.temperature_2m_min[index]),
                description: getWeatherDescription(forecastData.daily.weather_code[index])
            }));
        }
        
        return result;
        
    } catch (error) {
        console.error('Error en getWeatherData:', error);
        throw error;
    }
}

/**
 * Muestra el clima actual en el DOM
 * @param {Object} weatherData - Datos del clima
 */
function displayCurrentWeather(weatherData) {
    document.getElementById('cityName').textContent = `${weatherData.city}${weatherData.country ? ', ' + weatherData.country : ''}`;
    document.getElementById('temperature').innerHTML = `${weatherData.temperature}<span class="unit">°C</span>`;
    document.getElementById('weatherDescription').textContent = weatherData.description;
    
    document.getElementById('weatherDetails').innerHTML = `
        <div class="detail-item">
            <div class="detail-label">Humedad</div>
            <div class="detail-value">${weatherData.humidity}%</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Viento</div>
            <div class="detail-value">${weatherData.windSpeed} km/h</div>
        </div>
    `;
    
    document.getElementById('currentWeather').classList.remove('d-none');
}

/**
 * Muestra el forecast en un carrusel
 * @param {Array} forecast - Array de datos del forecast
 */
function displayForecast(forecast) {
    const indicators = document.getElementById('carouselIndicators');
    const inner = document.getElementById('carouselInner');
    
    indicators.innerHTML = '';
    inner.innerHTML = '';
    
    forecast.forEach((day, index) => {
        // Indicador
        const indicatorBtn = document.createElement('button');
        indicatorBtn.setAttribute('data-bs-target', '#forecastCarousel');
        indicatorBtn.setAttribute('data-bs-slide-to', index);
        if (index === 0) indicatorBtn.classList.add('active');
        indicators.appendChild(indicatorBtn);
        
        // Slide
        const dateObj = new Date(day.date);
        const dayName = dateObj.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase();
        const dayNum = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).toUpperCase();
        
        const slide = document.createElement('div');
        slide.className = `carousel-item${index === 0 ? ' active' : ''}`;
        slide.innerHTML = `
            <div class="forecast-card">
                <div class="forecast-date">${dayName} ${dayNum}</div>
                <div class="forecast-temp">${day.tempMax}° / ${day.tempMin}°</div>
                <div class="forecast-desc">${day.description}</div>
            </div>
        `;
        inner.appendChild(slide);
    });
    
    document.getElementById('forecastSection').classList.remove('d-none');
}

/**
 * Muestra un mensaje de error usando SweetAlert
 * @param {string} message - Mensaje de error
 */
function showError(message) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        confirmButtonColor: '#4a5568'
    });
}

/**
 * Muestra un mensaje de éxito
 * @param {string} message - Mensaje
 */
function showSuccess(message) {
    Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: message,
        confirmButtonColor: '#4a5568',
        timer: 2000,
        showConfirmButton: false
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('weatherForm');
    const loading = document.getElementById('loading');
    const currentWeather = document.getElementById('currentWeather');
    const forecastSection = document.getElementById('forecastSection');
    
    // Establecer fecha mínima en los inputs de fecha
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').min = today;
    document.getElementById('endDate').min = today;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const city = document.getElementById('cityInput').value.trim();
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        if (!city) {
            showError('Por favor ingresa el nombre de una ciudad');
            return;
        }
        
        // Validar rango de fechas
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            showError('La fecha de inicio debe ser anterior a la fecha fin');
            return;
        }
        
        // Validar máximo 16 días de forecast
        if (startDate && endDate) {
            const diffDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
            if (diffDays > 16) {
                showError('El rango máximo de días es 16');
                return;
            }
        }
        
        // Mostrar loading
        loading.classList.remove('d-none');
        currentWeather.classList.add('d-none');
        forecastSection.classList.add('d-none');
        
        try {
            const weatherData = await getWeatherData(city, startDate || null, endDate || null);
            
            displayCurrentWeather(weatherData);
            
            if (weatherData.forecast && weatherData.forecast.length > 0) {
                displayForecast(weatherData.forecast);
            } else {
                forecastSection.classList.add('d-none');
            }
            
        } catch (error) {
            showError(error.message);
        } finally {
            loading.classList.add('d-none');
        }
    });
});

// Exportar funciones para testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getWeatherData, getCoordinates, getWeatherDescription };
}
import React from 'react';
import './Card.scss';

const Card = ({ weatherData, isForecast }) => {
  const getWeatherClass = (condition) => {
    if (!condition) return '';
    const conditionText = condition.toLowerCase();
    if (conditionText.includes('sunny')) return 'weather-sunny';
    if (conditionText.includes('cloud')) return 'weather-cloudy';
    if (conditionText.includes('rain')) return 'weather-rainy';
    if (conditionText.includes('snow')) return 'weather-snowy';
    return '';
  };

  if (!weatherData) return null;

  if (isForecast) {
    return (
      <div className={`weather-card forecast ${getWeatherClass(weatherData.day.condition.text)}`}>
        <div className="weather-icon">
          <img src={weatherData.day.condition.icon} alt="weather icon" />
        </div>
        <div className="weather-info">
          <div className="date">{new Date(weatherData.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric' })}</div>
          <div className="temperature">
            <span className="max">{Math.round(weatherData.day.maxtemp_c)}°</span>
            <span className="min">{Math.round(weatherData.day.mintemp_c)}°</span>
          </div>
          <div className="condition">{weatherData.day.condition.text}</div>
          <div className="details">
            <div>Pluie: {weatherData.day.daily_chance_of_rain}%</div>
            <div>Vent: {Math.round(weatherData.day.maxwind_kph)} km/h</div>
          </div>
        </div>
        <div className="weather-effects"></div>
      </div>
    );
  }

  return (
    <div className={`weather-card current ${getWeatherClass(weatherData.current.condition.text)}`}>
      <div className="weather-icon">
        <img src={weatherData.current.condition.icon} alt="weather icon" />
      </div>
      <div className="weather-info">
        <h2>{weatherData.location.name}</h2>
        <div className="temperature">{weatherData.current.temp_c}°C</div>
        <div className="condition">{weatherData.current.condition.text}</div>
        <div className="details">
          <div>Humidité: {weatherData.current.humidity}%</div>
          <div>Vent: {weatherData.current.wind_kph} km/h</div>
        </div>
      </div>
      <div className="weather-effects"></div>
    </div>
  );
};

export default Card; 
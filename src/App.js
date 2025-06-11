import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './components/Card';
import './App.scss';

const App = () => {
  const [currentData, setCurrentData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [city, setCity] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCity(e.target.value);
    setError('');
  }

  const addToRecentSearches = (cityName) => {
    setRecentSearches(prev => {
      const updated = [cityName, ...prev.filter(c => c !== cityName)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  }

  const fetchWeather = async (cityName) => {
    setLoading(true);
    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        axios.get(
          `http://api.weatherapi.com/v1/current.json?key=eee08b80e0f34a6c8b5112133250906&q=${cityName}&aqi=no`
        ),
        axios.get(
          `http://api.weatherapi.com/v1/forecast.json?key=eee08b80e0f34a6c8b5112133250906&q=${cityName}&days=7&aqi=no`
        )
      ]);
      
      setCurrentData(currentResponse.data);
      setForecastData(forecastResponse.data);
      addToRecentSearches(cityName);
      setError('');
    } catch (error) {
      setError('Ville non trouvée. Veuillez réessayer.');
      console.error('Error:', error);
    }
    setLoading(false);
  }

  const handleClick = () => {
    if (city.trim()) {
      fetchWeather(city);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && city.trim()) {
      fetchWeather(city);
    }
  }

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
    fetchWeather('Paris');
  }, []);

  return (
    <div className="app-container">
      <div className="search-container">
        <input 
          type="text" 
          value={city} 
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Entrez une ville..."
          className="search-input"
        />
        <button onClick={handleClick} className="search-button" disabled={loading}>
          {loading ? 'Chargement...' : 'Voir la météo'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="recent-searches">
        {recentSearches.map((city, index) => (
          <button 
            key={index} 
            onClick={() => fetchWeather(city)}
            className="recent-search-button"
          >
            {city}
          </button>
        ))}
      </div>

      <div className="weather-container">
        {currentData && <Card weatherData={currentData} />}
      </div>

      {forecastData && (
        <div className="forecast-section">
          <h2 className="forecast-title">Prévisions sur 7 jours</h2>
          <div className="forecast-container">
            {forecastData.forecast.forecastday.map((day) => (
              <Card key={day.date} weatherData={day} isForecast={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

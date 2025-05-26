import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState("");
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

    useEffect(() => {
        const lastCity = localStorage.getItem("lastCity");
        if (lastCity) {
            setCity(lastCity);
            axios.get(`${backendUrl}/api/weather/?city=${lastCity}`)
                .then(res => {
                    setWeather(res.data.weather);
                    setError("");
                })
                .catch(err => {
                    console.error("Ошибка при получении погоды:", err);
                    setError("Не удалось загрузить данные для последнего города.");
                });
        }
    }, [backendUr]);

    const handleSearch = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/weather/?city=${city}`);
            setWeather(res.data.weather);
            setError("");
            localStorage.setItem("lastCity", city);
        } catch (err) {
            console.error("Ошибка при поиске города:", err);
            if (err.response && err.response.status === 404) {
                setError("Город не найден. Убедитесь, что вы ввели его латиницей.");
            } else {
                setError("Ошибка сети. Проверьте подключение к серверу.");
            }
            setWeather(null);
        }
    };

    return (
        <div>
            <h1>Прогноз погоды</h1>
            <input
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Введите город (латиницей)"
            />
            <button onClick={handleSearch}>Поиск</button>
            <p>Вводите название города латиницей, например: "Miami", "Moscow"</p>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {weather && (
                <div>
                    <h2>Погода в {city}</h2>
                    <p>Температура: {weather.current_weather.temperature}°C</p>
                </div>
            )}
        </div>
    );
}

export default App;

async function fetchWeather() {
  const weatherEl = document.getElementById('weather-content');
  try {
    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
    const city = 'Seoul';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=kr`;

    const res = await fetch(url);
    const data = await res.json();

    if(data.weather && data.main) {
      weatherEl.innerHTML = `
        <div>${data.name}</div>
        <div>${data.weather[0].description}</div>
        <div>온도: ${data.main.temp}°C</div>
        <div>습도: ${data.main.humidity}%</div>
      `;
    } else {
      weatherEl.textContent = '날씨 정보를 가져올 수 없습니다.';
    }
  } catch(e) {
    weatherEl.textContent = '날씨 정보를 가져오는 중 오류 발생';
  }
}

fetchWeather();
setInterval(fetchWeather, 10 * 60 * 1000);

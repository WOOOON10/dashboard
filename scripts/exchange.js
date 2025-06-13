async function fetchExchangeRates() {
  const exchangeEl = document.getElementById('exchange-content');
  try {
    const url = 'https://api.exchangerate.host/latest?base=KRW&symbols=USD,JPY,EUR';
    const res = await fetch(url);
    const data = await res.json();

    if(data.rates) {
      exchangeEl.innerHTML = `
        <ul>
          <li>USD: ${data.rates.USD.toFixed(4)}</li>
          <li>JPY: ${data.rates.JPY.toFixed(4)}</li>
          <li>EUR: ${data.rates.EUR.toFixed(4)}</li>
        </ul>
      `;
    } else {
      exchangeEl.textContent = '환율 정보를 가져올 수 없습니다.';
    }
  } catch(e) {
    exchangeEl.textContent = '환율 정보를 가져오는 중 오류 발생';
  }
}

fetchExchangeRates();
setInterval(fetchExchangeRates, 10 * 60 * 1000);

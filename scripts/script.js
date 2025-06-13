const grid = document.getElementById('grid');
const cellSize = 60;
const gridCols = 16;
const gridRows = 12;
const widgets = Array.from(document.querySelectorAll('.widget'));

let dragged = null;
let offsetX, offsetY;
let originalPos = {left: 0, top: 0};

function snapToGrid(value) {
  return Math.round(value / cellSize) * cellSize;
}

// 현재 위치에서 겹치는지 체크
function isOverlapping(draggedEl, newLeft, newTop) {
  const draggedRect = {
    left: newLeft,
    top: newTop,
    right: newLeft + draggedEl.offsetWidth,
    bottom: newTop + draggedEl.offsetHeight
  };

  return widgets.some(widget => {
    if (widget === draggedEl) return false;
    const rect = {
      left: parseInt(widget.style.left),
      top: parseInt(widget.style.top),
      right: parseInt(widget.style.left) + widget.offsetWidth,
      bottom: parseInt(widget.style.top) + widget.offsetHeight
    };

    return !(
      draggedRect.right <= rect.left ||
      draggedRect.left >= rect.right ||
      draggedRect.bottom <= rect.top ||
      draggedRect.top >= rect.bottom
    );
  });
}

// 그리드 내에서 가능한 빈 공간 찾기 (가장 가까운 곳)
// 최대 탐색 반경 지정 (ex: 5칸 반경)
function findNearestFreePosition(draggedEl, currentLeft, currentTop) {
  const maxRadius = 5;
  const width = draggedEl.offsetWidth;
  const height = draggedEl.offsetHeight;

  // 모든 가능한 그리드 위치(좌표)를 리스트에 넣음
  let candidates = [];

  for(let row = 0; row <= gridRows; row++) {
    for(let col = 0; col <= gridCols; col++) {
      let left = col * cellSize;
      let top = row * cellSize;

      // 그리드 영역 벗어나면 제외
      if(left + width > grid.clientWidth || top + height > grid.clientHeight) continue;

      // 겹침 체크
      if(!isOverlapping(draggedEl, left, top)) {
        // 현재 위치와 거리 계산 (유클리드 거리)
        const dist = Math.hypot(left - currentLeft, top - currentTop);
        candidates.push({left, top, dist});
      }
    }
  }

  // 거리가 가장 가까운 후보 선택
  candidates.sort((a, b) => a.dist - b.dist);
  return candidates.length > 0 ? candidates[0] : null;
}

// 드래그 시작
widgets.forEach(widget => {
  widget.addEventListener('mousedown', (e) => {
    dragged = widget;
    const rect = widget.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    originalPos.left = parseInt(widget.style.left);
    originalPos.top = parseInt(widget.style.top);
    widget.style.cursor = 'grabbing';
    widget.style.zIndex = 1000;
  });
});

// 드래그 중
document.addEventListener('mousemove', (e) => {
  if (!dragged) return;

  const gridRect = grid.getBoundingClientRect();
  let left = e.clientX - gridRect.left - offsetX;
  let top = e.clientY - gridRect.top - offsetY;

  // 그리드 경계 내로 제한
  left = Math.max(0, Math.min(left, grid.clientWidth - dragged.offsetWidth));
  top = Math.max(0, Math.min(top, grid.clientHeight - dragged.offsetHeight));

  // 스냅 처리 (그리드 단위 맞춤)
  dragged.style.left = snapToGrid(left) + 'px';
  dragged.style.top = snapToGrid(top) + 'px';
});

// 드래그 끝났을 때
document.addEventListener('mouseup', (e) => {
  if (!dragged) return;

  const left = parseInt(dragged.style.left);
  const top = parseInt(dragged.style.top);

  if (isOverlapping(dragged, left, top)) {
    // 겹침 있으면 가장 가까운 빈 자리 찾아 재배치
    const pos = findNearestFreePosition(dragged, left, top);
    if(pos) {
      dragged.style.left = pos.left + 'px';
      dragged.style.top = pos.top + 'px';
    } else {
      // 빈 자리 없으면 원래 자리로
      dragged.style.left = originalPos.left + 'px';
      dragged.style.top = originalPos.top + 'px';
    }
  }

  dragged.style.cursor = 'grab';
  dragged.style.zIndex = '';
  dragged = null;
});

// 시계 업데이트
function updateClock() {
  const clock = document.getElementById('clock-content');
  if (!clock) return;
  
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  clock.textContent = `${h}:${m}:${s}`;
}

setInterval(updateClock, 1000);
updateClock();

// TODO 리스트 기능
const todoList = document.getElementById('todo-list');
const todoInput = document.getElementById('todo-input');

todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && todoInput.value.trim() !== '') {
    const li = document.createElement('li');
    li.textContent = todoInput.value.trim();
    li.addEventListener('click', () => {
      li.classList.toggle('completed');
    });
    todoList.appendChild(li);
    todoInput.value = '';
  }
});

//날씨 위젯 기능
async function fetchWeather() {
  const weatherEl = document.getElementById('weather-content');
  try {
    // 예시로 오픈웨더맵 API (API 키 필요, 무료 가입 가능)
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
setInterval(fetchWeather, 10 * 60 * 1000); // 10분마다 갱신

// 환율 기능
async function fetchExchangeRates() {
  const exchangeEl = document.getElementById('exchange-content');
  try {
    // 무료 환율 API (예: exchangerate.host)
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
setInterval(fetchExchangeRates, 10 * 60 * 1000); // 10분마다 갱신


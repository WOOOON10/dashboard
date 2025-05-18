console.log("스크립트 실행됨!");

initGridStack();

function initGridStack() {
  if (window.grid) {
    window.grid.destroy();
    window.grid = null;
  }

  window.grid = GridStack.init({
  column: 1,
  cellHeight: 150,  // 기본 150px로 높게 잡음 (원하는 값으로 조절)
  margin: 10,       // 칸 사이 간격
  float: false,
  animate: true,


  // 반응형 비활성화 관련 옵션
  disableOneColumnMode: true,  // 모바일에서 1컬럼 모드로 안 바뀌게 함
  resizable: false,            // 크기 조절 안 되게 할 수도 있음
  draggable: true,             // 드래그는 필요하면 켜고 끌 수 있음
});


  window.grid.removeAll();

  addWidget("clock", 0, 0, 4, 2);
  addWidget("memo", 4, 4, 4, 3);
  addWidget("todo", 8, 8, 4, 3);

  startClock();
  console.log("✅ 시계 시작됨");
}

function addWidget(type, x, y, w, h) {
  let content = "";
  if (type === "clock") {
    content = `<div class="widget-content"><h3>시계</h3><div id="clock-display">00:00:00</div></div>`;
  } else if (type === "memo") {
    content = `<div class="widget-content"><h3>메모</h3><textarea placeholder="메모를 입력하세요..."></textarea></div>`;
  } else if (type === "todo") {
    content = `<div class="widget-content"><h3>할 일 목록</h3><ul><li>샘플 할 일</li></ul></div>`;
  }

  // GridStack의 addWidget(HTMLElement, options) 함수 사용
  const el = document.createElement('div');
  el.classList.add('grid-stack-item');
  el.innerHTML = `<div class="grid-stack-item-content">${content}</div>`;

  // 위치, 크기 옵션 지정
  window.grid.addWidget(el, { x: x, y: y, w: w, h: h });
}



function startClock() {
  const clockEl = document.getElementById("clock-display");
  if (!clockEl) return;

  function updateTime() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, "0");
    const m = now.getMinutes().toString().padStart(2, "0");
    const s = now.getSeconds().toString().padStart(2, "0");
    clockEl.textContent = `${h}:${m}:${s}`;
  }
  updateTime();
  setInterval(updateTime, 1000);
}


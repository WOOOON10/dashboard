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

function findNearestFreePosition(draggedEl, currentLeft, currentTop) {
  const maxRadius = 5;
  const width = draggedEl.offsetWidth;
  const height = draggedEl.offsetHeight;

  let candidates = [];

  for(let row = 0; row <= gridRows; row++) {
    for(let col = 0; col <= gridCols; col++) {
      let left = col * cellSize;
      let top = row * cellSize;

      if(left + width > grid.clientWidth || top + height > grid.clientHeight) continue;

      if(!isOverlapping(draggedEl, left, top)) {
        const dist = Math.hypot(left - currentLeft, top - currentTop);
        candidates.push({left, top, dist});
      }
    }
  }

  candidates.sort((a, b) => a.dist - b.dist);
  return candidates.length > 0 ? candidates[0] : null;
}

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

document.addEventListener('mousemove', (e) => {
  if (!dragged) return;

  const gridRect = grid.getBoundingClientRect();
  let left = e.clientX - gridRect.left - offsetX;
  let top = e.clientY - gridRect.top - offsetY;

  left = Math.max(0, Math.min(left, grid.clientWidth - dragged.offsetWidth));
  top = Math.max(0, Math.min(top, grid.clientHeight - dragged.offsetHeight));

  dragged.style.left = snapToGrid(left) + 'px';
  dragged.style.top = snapToGrid(top) + 'px';
});

document.addEventListener('mouseup', () => {
  if (!dragged) return;

  const left = parseInt(dragged.style.left);
  const top = parseInt(dragged.style.top);

  if (isOverlapping(dragged, left, top)) {
    const pos = findNearestFreePosition(dragged, left, top);
    if(pos) {
      dragged.style.left = pos.left + 'px';
      dragged.style.top = pos.top + 'px';
    } else {
      dragged.style.left = originalPos.left + 'px';
      dragged.style.top = originalPos.top + 'px';
    }
  }

  dragged.style.cursor = 'grab';
  dragged.style.zIndex = '';
  dragged = null;
});

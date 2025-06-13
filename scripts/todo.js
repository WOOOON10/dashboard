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

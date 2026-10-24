(() => {
  const defaults = [['practice','Practice 10 minutes','Complete a short practice session.'],['focus','Finish one helpful task','Check off something useful at home or school.'],['champion','Complete your daily goal','Finish one goal you chose for today.']];
  const customTasks = () => JSON.parse(localStorage.pfCustomTodos || '[]');
  const allTasks = () => [...defaults, ...customTasks()];
  const completed = () => JSON.parse(localStorage.pfTodos || '{}');
  const saveCustom = tasks => localStorage.setItem('pfCustomTodos', JSON.stringify(tasks));
  function updateGames() {
    const unlocked = Number(localStorage.pfPoints || 0) >= 3;
    document.querySelectorAll('[data-game]').forEach(button => { const game = button.dataset.game; const allowed = game === 'claw' || (game === 'boxing' || game === 'target' ? unlocked : true); button.disabled = !allowed; button.classList.toggle('is-locked', !allowed); if (!allowed) button.title = 'Complete 3 claw-picked tasks to unlock this game.'; });
  }
  function render() {
    const board = document.querySelector('#heroMissions'); if (!board) return;
    const done = completed();
    board.innerHTML = `<div class="todo-head"><div><p class="eyebrow">// MISSION CONTROL</p><h2>Pick a mission. Earn a game.</h2><p>Drop the claw to randomly choose a task. Only a claw reveal can unlock completion.</p></div><strong>${Number(localStorage.pfPoints || 0)} POINTS</strong></div><div class="task-picked">DROP THE CLAW TO PICK A TASK</div><form class="add-task-form" id="addTaskForm"><input id="newTaskText" maxlength="80" required placeholder="Add a new task..."><button class="button small" type="submit">ADD TASK</button></form><div class="todo-list">${allTasks().map(([id,title,detail]) => `<label class="todo-item ${done[id] ? 'is-done' : ''}"><input type="checkbox" disabled ${done[id] ? 'checked' : ''}><span><b>${title}</b><small>${detail}</small></span><button type="button" class="todo-remove" data-remove-task="${id}" aria-label="Remove ${title}">×</button></label>`).join('')}</div>`;
    board.querySelector('#addTaskForm').onsubmit = event => { event.preventDefault(); const input = board.querySelector('#newTaskText'); const title = input.value.trim(); if (!title) return; const tasks = customTasks(); tasks.push([`custom-${Date.now()}`, title, 'A task added to your mission list.']); saveCustom(tasks); input.value = ''; render(); };
    board.querySelectorAll('[data-remove-task]').forEach(button => button.onclick = () => { const id = button.dataset.removeTask; saveCustom(customTasks().filter(task => task[0] !== id)); const saved = completed(); if (saved[id]) { delete saved[id]; localStorage.setItem('pfTodos', JSON.stringify(saved)); localStorage.pfPoints = Math.max(0, Number(localStorage.pfPoints || 0) - 1); } render(); });
    updateGames();
  }
  window.addEventListener('todo-changed', render);
  const board = document.createElement('section'); board.id = 'heroMissions'; board.className = 'todo-board hero-missions'; document.querySelector('.hero')?.appendChild(board); render();
})();

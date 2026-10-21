(() => {
  const tasks = [
    ['practice','Practice 10 minutes', 'Complete a short practice session.'],
    ['focus','Finish one helpful task', 'Check off something useful at home or school.'],
    ['champion','Complete your daily goal', 'Finish one goal you chose for today.']
  ];
  const saved = JSON.parse(localStorage.pfTodos || '{}');

  function render() {
    const board = document.querySelector('#todoBoard');
    if (!board) return;
    const count = tasks.filter(task => saved[task[0]]).length;
    board.innerHTML = `<div class="todo-head"><div><p class="eyebrow">// DAILY MISSION BOARD</p><h2>Do a task. Earn a game.</h2><p>Complete missions to unlock the arcade cabinets. Your progress stays saved.</p></div><span class="todo-progress">${count} / ${tasks.length} COMPLETE</span></div><div class="todo-list">${tasks.map((task, index) => `<label class="todo-item ${saved[task[0]] ? 'done' : ''}"><input type="checkbox" data-todo="${task[0]}" ${saved[task[0]] ? 'checked' : ''}><span class="todo-check">${saved[task[0]] ? '✓' : String(index + 1).padStart(2,'0')}</span><span><b>${task[1]}</b><small>${task[2]}</small></span><em>${index === 0 ? 'UNLOCK TARGET RUSH' : index === 1 ? 'UNLOCK CLAW' : 'UNLOCK BOXING'}</em></label>`).join('')}</div>`;
    board.querySelectorAll('[data-todo]').forEach(input => input.onchange = () => { saved[input.dataset.todo] = input.checked; localStorage.pfTodos = JSON.stringify(saved); render(); updateGames(); });
    updateGames();
  }

  function updateGames() {
    const unlocked = tasks.map(task => Boolean(saved[task[0]]));
    document.querySelectorAll('[data-game]').forEach(button => {
      const game = button.dataset.game;
      const allowed = game === 'target' ? unlocked[0] : game === 'claw' ? unlocked[1] : game === 'boxing' ? unlocked[2] : true;
      button.disabled = !allowed;
      button.classList.toggle('locked-game', !allowed);
      if (!allowed) button.dataset.lockLabel = game === 'target' ? 'FINISH MISSION 01' : game === 'claw' ? 'FINISH MISSION 02' : 'FINISH MISSION 03';
    });
  }

  const board = document.createElement('section');
  board.id = 'todoBoard';
  board.className = 'todo-board wrap';
  document.querySelector('#games')?.before(board);
  render();
})();

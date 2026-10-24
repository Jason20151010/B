(() => {
  const defaults = [['practice','Practice 10 minutes','Complete a short practice session.'],['focus','Finish one helpful task','Check off something useful at home or school.'],['champion','Complete your daily goal','Finish one goal you chose for today.']];
  const saved = JSON.parse(localStorage.pfTodos || '{}');
  let custom = JSON.parse(localStorage.pfCustomTodos || '[]');
  const allTasks = () => [...defaults, ...custom];
  const persist = () => { localStorage.pfTodos=JSON.stringify(saved); localStorage.pfCustomTodos=JSON.stringify(custom); };
  function render() {
    const board=document.querySelector('#todoBoard'); if(!board)return;
    const tasks=allTasks(); const count=tasks.filter(task=>saved[task[0]]).length; const points=Number(localStorage.pfPoints||0);
    board.innerHTML=`<div class="todo-head"><div><p class="eyebrow">// DAILY MISSION BOARD</p><h2>Do a task. Earn a game.</h2><p>Complete missions or let the claw pick one for you. Bonus games unlock at 3 points.</p></div><span class="todo-progress">${count} / ${tasks.length} COMPLETE · ${points} POINTS</span></div><form class="todo-add"><input id="newTodo" maxlength="60" placeholder="Add a task..." autocomplete="off"><button type="submit">+ ADD TASK</button></form><div class="todo-list">${tasks.map((task,index)=>`<label class="todo-item ${saved[task[0]]?'done':''}"><input type="checkbox" data-todo="${task[0]}" ${saved[task[0]]?'checked':''}><span class="todo-check">${saved[task[0]]?'✓':String(index+1).padStart(2,'0')}</span><span><b>${task[1]}</b><small>${task[2]}</small></span><em>${index<3?'BONUS PROGRESS':'PERSONAL GOAL'}</em><button type="button" class="todo-remove" data-remove="${task[0]}" aria-label="Remove ${task[1]}">×</button></label>`).join('')}</div>`;
    board.querySelector('.todo-add').onsubmit=e=>{e.preventDefault();const input=board.querySelector('#newTodo');const title=input.value.trim();if(!title)return;custom.push(['custom-'+Date.now(),title,'Your custom mission.']);persist();render();};
    board.querySelectorAll('[data-todo]').forEach(input=>input.onchange=()=>{const was=Boolean(saved[input.dataset.todo]);saved[input.dataset.todo]=input.checked;let next=Number(localStorage.pfPoints||0)+(input.checked&&!was?1:(!input.checked&&was?-1:0));localStorage.pfPoints=Math.max(0,next);persist();render();});
    board.querySelectorAll('[data-remove]').forEach(button=>button.onclick=()=>{const was=Boolean(saved[button.dataset.remove]);if(was)localStorage.pfPoints=Math.max(0,Number(localStorage.pfPoints||0)-1);delete saved[button.dataset.remove];custom=custom.filter(task=>task[0]!==button.dataset.remove);persist();render();});
    updateGames();
  }
  function updateGames(){const unlocked=Number(localStorage.pfPoints||0)>=3;document.querySelectorAll('[data-game]').forEach(button=>{const game=button.dataset.game;const allowed=game==='claw'||(game==='target'||game==='boxing'?unlocked:true);button.disabled=!allowed;button.classList.toggle('locked-game',!allowed);if(!allowed)button.dataset.lockLabel='EARN 3 TASK POINTS';});}
  window.addEventListener('todo-changed',render);
  const board=document.createElement('section');board.id='todoBoard';board.className='todo-board wrap';document.querySelector('#games')?.before(board);render();
})();

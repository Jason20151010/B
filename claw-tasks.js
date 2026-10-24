(() => {
  const modal=document.querySelector('#gameModal'), body=document.querySelector('#modalBody');
  const defaults=[['practice','Practice 10 minutes','Complete a short practice session.'],['focus','Finish one helpful task','Check off something useful at home or school.'],['champion','Complete your daily goal','Finish one goal you chose for today.']];
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-game="claw"]'); if(!button)return;
    event.preventDefault(); event.stopImmediatePropagation();
    const custom=JSON.parse(localStorage.pfCustomTodos||'[]'); const tasks=[...defaults,...custom]; const saved=JSON.parse(localStorage.pfTodos||'{}');
    const open=tasks.filter(task=>!saved[task[0]]); const task=(open.length?open:tasks)[Math.floor(Math.random()*(open.length?open:tasks).length)];
    modal.showModal(); body.innerHTML=`<div class="task-claw"><p class="eyebrow">// CLAW MACHINE TASK PICKER</p><h2>YOUR RANDOM TASK</h2><div class="picked-task">${task[1]}</div><p>${task[2]}</p><small>Complete it to earn +1 point. Bonus games unlock at 3 points.</small><button class="arena-primary" id="completePickedTask">TASK COMPLETE +1 POINT</button></div>`;
    body.querySelector('#completePickedTask').onclick=()=>{saved[task[0]]=true;localStorage.pfTodos=JSON.stringify(saved);localStorage.pfPoints=Number(localStorage.pfPoints||0)+1;window.dispatchEvent(new Event('todo-changed'));body.querySelector('.picked-task').textContent='TASK COMPLETE! +1 POINT';body.querySelector('#completePickedTask').disabled=true;};
  },true);
})();

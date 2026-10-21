// Adds clear visual feedback to the live arena after each fighter action.
const boxingFeedback = new MutationObserver(() => {
  const arena = document.querySelector('.boxing-arena');
  const message = document.querySelector('#arenaMessage');
  if (!arena || !message) return;
  const text = message.textContent;
  const player = arena.querySelector('.arena-boxer.p1');
  const rival = arena.querySelector('.arena-boxer.p2');
  arena.querySelectorAll('.arena-boxer').forEach(boxer => {
    if (!boxer.querySelector('.hair')) boxer.insertAdjacentHTML('afterbegin', '<span class="hair"></span><span class="neck"></span><span class="face-detail"></span><span class="guard-shield"></span>');
    if (!boxer.querySelector('.off-arm')) boxer.insertAdjacentHTML('beforeend', '<span class="off-arm"></span><span class="off-glove"></span>');
  });
  const stage = arena.querySelector('.boxing-stage');
  if (stage && !stage.querySelector('.referee')) stage.insertAdjacentHTML('beforeend', '<div class="referee"><span></span></div>');
  const flash = (element, className) => {
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
    setTimeout(() => element.classList.remove(className), 360);
  };

  if (text.includes('AI RIVAL lands') || text.includes('PLAYER 2 lands')) flash(rival, 'attack');
  if (text.includes('PLAYER 1 lands')) flash(player, 'attack');
  if (text.includes('blocked most')) flash(player, 'block');
  if (text.includes('perfect dodge')) flash(player, 'dodge');
  if (text.includes('PLAYER 1 is protecting')) player.classList.add('block');
  if (text.includes('PLAYER 1 lowered')) player.classList.remove('block');
  if (text.includes('PLAYER 2 is protecting') || text.includes('AI RIVAL is protecting')) rival.classList.add('block');
  if (text.includes('PLAYER 2 lowered') || text.includes('AI RIVAL lowered')) rival.classList.remove('block');
  if (text.includes('WINS THE ROUND') && !arena.querySelector('#nextRound')) {
    arena.querySelectorAll('[data-action]').forEach(button => { button.disabled = true; });
    arena.querySelector('.boxing-stage')?.classList.add('round-over');
    const next = document.createElement('button');
    next.id = 'nextRound';
    next.className = 'arena-primary';
    next.textContent = 'PLAY AGAIN';
    next.onclick = () => {
      const back = arena.querySelector('#arenaBack');
      if (back) back.click();
      setTimeout(() => document.querySelector('#startArena')?.click(), 0);
    };
    arena.querySelector('.arena-bottom')?.prepend(next);
  }
  const guardButton = arena.querySelector('[data-action="p1-guard"]');
  if (guardButton) guardButton.classList.toggle('active', text.includes('PLAYER 1 is protecting'));
});
boxingFeedback.observe(document.body, { childList: true, subtree: true, characterData: true });

(() => {
  const rewards = { normal:10, hard:100, super:500 };
  const names = { normal:'NORMAL', hard:'HARD', super:'SUPER HARD' };
  const observer = new MutationObserver(() => {
    const setup = document.querySelector('.arena-setup');
    if (setup && !setup.querySelector('.difficulty-picker')) {
      const picker = document.createElement('div');
      picker.className = 'difficulty-picker';
      picker.innerHTML = '<b>CHOOSE AI DIFFICULTY</b><div class="difficulty-options">' + Object.keys(names).map(key => `<button type="button" data-difficulty="${key}">${names[key]}<small>+${rewards[key]} COINS</small></button>`).join('') + '</div><span class="difficulty-note">Super Hard AI is stronger, but every clean hit can bring it down.</span>';
      setup.insertBefore(picker, setup.querySelector('#startArena'));
      const selected = localStorage.pfDifficulty || 'normal';
      picker.querySelectorAll('[data-difficulty]').forEach(button => {
        button.classList.toggle('selected', button.dataset.difficulty === selected);
        button.onclick = () => { localStorage.pfDifficulty = button.dataset.difficulty; picker.querySelectorAll('[data-difficulty]').forEach(item => item.classList.toggle('selected', item === button)); };
      });
    }
    const arena = document.querySelector('.boxing-arena:not(.arena-setup)');
    if (arena && !arena.dataset.matchUi) {
      arena.dataset.matchUi = 'true';
      const hud = arena.querySelector('.arena-hud');
      const level = localStorage.pfDifficulty || 'normal';
      const info = document.createElement('div');
      info.className = 'match-info';
      info.innerHTML = `<b>${names[level]} MODE</b><span>ROUND <strong>1</strong> / 3</span><span class="match-clock">2:00</span><span>WIN +${rewards[level]} COINS · +1 POINT</span>`;
      hud?.appendChild(info);
      let seconds = 120;
      const timer = setInterval(() => {
        if (!document.body.contains(arena) || arena.querySelector('.round-over')) return clearInterval(timer);
        seconds--;
        const clock = arena.querySelector('.match-clock');
        if (clock) clock.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2,'0')}`;
        if (seconds <= 0) {
          clearInterval(timer);
          arena.querySelector('#arenaMessage').textContent = 'ROUND 1 OVER — the timer ended. Play again to run the next three-round match.';
          arena.querySelectorAll('[data-action]').forEach(button => button.disabled = true);
          arena.querySelector('.boxing-stage')?.classList.add('round-over');
        }
      }, 1000);
    }
    if (arena && arena.querySelector('#arenaMessage')?.textContent.includes('WINS THE ROUND') && !arena.dataset.rewarded) {
      arena.dataset.rewarded = 'true';
      const level = localStorage.pfDifficulty || 'normal';
      const reward = rewards[level];
      const coins = Number(localStorage.pfTokens || 0) + reward;
      const points = Number(localStorage.pfPoints || 0) + 1;
      localStorage.pfTokens = coins; localStorage.pfPoints = points;
      const coin = document.querySelector('#coinCount'); if (coin) coin.textContent = coins;
      const message = arena.querySelector('#arenaMessage');
      if (message) message.textContent += `  +${reward} COINS · +1 POINT · POWER UP READY`;
    }
  });
  observer.observe(document.body, { childList:true, subtree:true, characterData:true });
})();

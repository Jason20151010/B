(() => {
  const nativeInterval = window.setInterval;
  window.setInterval = (callback, delay, ...args) => {
    const source = String(callback);
    if (source.includes("action('p2'")) {
      return nativeInterval(() => {
        const arena = document.querySelector('.boxing-arena:not(.arena-setup)');
        const left = arena?.querySelector('.arena-boxer.p1');
        const right = arena?.querySelector('.arena-boxer.p2');
        if (!arena || !left || !right) return;
        const a = left.getBoundingClientRect();
        const b = right.getBoundingClientRect();
        const distance = Math.abs((a.left + a.width / 2) - (b.left + b.width / 2));
        if (distance > 120) {
          const message = arena.querySelector('#arenaMessage');
          if (message) message.textContent = 'AI is too far away — move closer before attacking.';
          return;
        }
        if (Math.random() < .35) {
          const message = arena.querySelector('#arenaMessage');
          if (message) message.textContent = 'The AI hesitated — this is your opening!';
          return;
        }
        callback(...args);
        const level = localStorage.pfDifficulty || 'normal';
        if (level === 'hard') callback(...args);
        if (level === 'super') { callback(...args); callback(...args); }
      }, delay);
    }
    return nativeInterval(callback, delay, ...args);
  };

  nativeInterval(() => {
    const arena = document.querySelector('.boxing-arena:not(.arena-setup)');
    if (!arena || !arena.querySelector('.arena-bottom')?.textContent.includes('AI MODE') || arena.querySelector('.boxing-stage.round-over')) return;
    const player = arena.querySelector('.arena-boxer.p1');
    const rival = arena.querySelector('.arena-boxer.p2');
    if (!player || !rival) return;
    const p = player.getBoundingClientRect();
    const r = rival.getBoundingClientRect();
    const current = Number(rival.dataset.enemyX || 18);
    const direction = (r.left + r.width / 2) > (p.left + p.width / 2) ? 3 : -3;
    const next = Math.max(8, Math.min(42, current + direction + (Math.random() < .25 ? (Math.random() < .5 ? -5 : 5) : 0)));
    rival.dataset.enemyX = next;
    rival.style.right = next + '%';
    rival.classList.remove('step'); void rival.offsetWidth; rival.classList.add('step');
  }, 850);

  const faces = ['classic','smile','scar','mask'];
  const observer = new MutationObserver(() => {
    const setup = document.querySelector('.arena-setup');
    if (setup && !setup.querySelector('.face-picker')) {
      const picker = document.createElement('div');
      picker.className = 'face-picker';
      picker.innerHTML = '<b>CHOOSE YOUR FACE</b><div class="face-options">' + faces.map(face => `<button type="button" class="face-choice" data-face-choice="${face}">${face.toUpperCase()}</button>`).join('') + '</div>';
      setup.insertBefore(picker, setup.querySelector('#startArena'));
      const selected = localStorage.pfFace || 'classic';
      picker.querySelectorAll('[data-face-choice]').forEach(button => {
        button.classList.toggle('selected', button.dataset.faceChoice === selected);
        button.onclick = () => { localStorage.pfFace = button.dataset.faceChoice; picker.querySelectorAll('[data-face-choice]').forEach(item => item.classList.toggle('selected', item === button)); };
      });
    }
    const fight = document.querySelector('.boxing-arena:not(.arena-setup)');
    if (fight && !fight.dataset.faceApplied) {
      fight.dataset.faceApplied = 'true';
      fight.querySelector('.arena-boxer.p1')?.setAttribute('data-face', localStorage.pfFace || 'classic');
    }
    if (fight && !fight.querySelector('[data-action="p1-kick"]')) {
      const controls = fight.querySelector('.arena-controls');
      const kick = document.createElement('button');
      kick.dataset.action = 'p1-kick';
      kick.innerHTML = 'KICK<small>O · close range</small>';
      kick.onclick = () => controls.querySelector('[data-action="p1-heavy"]')?.click();
      controls.appendChild(kick);
    }
  });
  observer.observe(document.body, { childList:true, subtree:true });

  document.addEventListener('keydown', event => {
    const arena = document.querySelector('.boxing-arena:not(.arena-setup)');
    if (!arena || event.target.matches('input, textarea, select')) return;
    const key = event.key.toLowerCase();
    const action = { j:'p1-jab', i:'p1-heavy', o:'p1-kick', k:'p1-guard', l:'p1-dodge' }[key];
    if (action) {
      event.preventDefault();
      event.stopImmediatePropagation();
      arena.querySelector(`[data-action="${action}"]`)?.click();
      return;
    }
    if (!'wasd'.includes(key)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const boxer = arena.querySelector('.arena-boxer.p1');
    const x = Number(boxer.dataset.x || 18);
    const y = Number(boxer.dataset.y || 28);
    const nextX = Math.max(8, Math.min(68, x + (key === 'a' ? -3 : key === 'd' ? 3 : 0)));
    const nextY = Math.max(18, Math.min(40, y + (key === 'w' ? 3 : key === 's' ? -3 : 0)));
    boxer.dataset.x = nextX; boxer.dataset.y = nextY;
    boxer.style.left = nextX + '%'; boxer.style.bottom = nextY + 'px';
    boxer.classList.remove('step'); void boxer.offsetWidth; boxer.classList.add('step');
  });

  document.addEventListener('click', event => {
    const button = event.target.closest('.boxing-arena:not(.arena-setup) [data-action]');
    if (!button || button.dataset.action.endsWith('-guard') || button.dataset.action.endsWith('-dodge')) return;
    const arena = button.closest('.boxing-arena');
    const [who] = button.dataset.action.split('-');
    const attacker = arena.querySelector(`.arena-boxer.${who}`);
    const defender = arena.querySelector(`.arena-boxer.${who === 'p1' ? 'p2' : 'p1'}`);
    if (!attacker || !defender) return;
    const a = attacker.getBoundingClientRect();
    const d = defender.getBoundingClientRect();
    const distance = Math.abs((a.left + a.width / 2) - (d.left + d.width / 2));
    if (distance > 120) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const message = arena.querySelector('#arenaMessage');
      if (message) message.textContent = 'OUT OF RANGE — move closer before you punch or kick.';
      attacker.classList.remove('whiff'); void attacker.offsetWidth; attacker.classList.add('whiff');
      return;
    }
    if (defender.classList.contains('block')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const message = arena.querySelector('#arenaMessage');
      if (message) message.textContent = 'BLOCKED — zero damage. Wait for the guard to drop.';
      defender.classList.add('block-hit');
      setTimeout(() => defender.classList.remove('block-hit'), 260);
    }
  }, true);

})();

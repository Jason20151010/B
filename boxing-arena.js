(() => {
  const modal = document.querySelector('#gameModal');
  const body = document.querySelector('#modalBody');
  const toast = document.querySelector('#toast');
  let mode = 'ai';

  const say = text => { if (toast) { toast.textContent = text; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2200); } };
  const code = () => Math.random().toString(36).slice(2, 6).toUpperCase();

  function setup() {
    body.innerHTML = `<div class="boxing-arena arena-setup"><span class="arena-kicker">// GOLDEN RING MATCHMAKER</span><h3>PRIZE PUNCH</h3><p>Read the shoulders, protect your face, and wait for an opening. Choose a real opponent or practice against the AI.</p><div class="arena-mode-row"><button class="arena-mode active" data-mode="ai">VS AI</button><button class="arena-mode" data-mode="two">2 PLAYERS</button></div><div class="arena-room" hidden><span class="arena-help">Create a room for a local pass-and-play match. Share the gold code with Player 2.</span><button class="arena-primary" id="createRoom">CREATE ROOM</button><div class="arena-room-code" id="roomCode"></div></div><button class="arena-primary" id="startArena">START MATCH</button><span class="arena-help">Player 1: J jab · H heavy · G guard · D dodge<br>Player 2: ← jab · ↑ heavy · ↓ guard · → dodge</span></div>`;
    body.querySelectorAll('[data-mode]').forEach(button => button.onclick = () => { mode = button.dataset.mode; body.querySelectorAll('[data-mode]').forEach(item => item.classList.toggle('active', item === button)); body.querySelector('.arena-room').hidden = mode !== 'two'; });
    body.querySelector('#createRoom').onclick = () => { body.querySelector('#roomCode').textContent = 'ROOM ' + code(); say('Room created for local Player 2.'); };
    body.querySelector('#startArena').onclick = () => fight();
  }

  function fight() {
    const twoPlayers = mode === 'two';
    const keys = { p1: { jab:'j', heavy:'h', guard:'g', dodge:'d' }, p2: { jab:'arrowleft', heavy:'arrowup', guard:'arrowdown', dodge:'arrowright' } };
    let p1 = { hp:100, stamina:100, guarding:false, dodging:false }, p2 = { hp:100, stamina:100, guarding:false, dodging:false }, over = false, aiTimer;
    body.innerHTML = `<div class="boxing-arena"><div class="boxing-stage"><div class="arena-ring"></div><div class="arena-rope one"></div><div class="arena-rope two"></div><div class="arena-rope three"></div><div class="arena-corner"></div><div class="arena-hud"><div class="arena-health"><label>PLAYER 1 · <span id="p1HpText">100</span></label><div class="arena-bar"><i id="p1Hp"></i></div></div><div class="arena-health enemy"><label>${twoPlayers ? 'PLAYER 2' : 'AI RIVAL'} · <span id="p2HpText">100</span></label><div class="arena-bar"><i id="p2Hp"></i></div></div></div><div class="arena-boxer p1"><span class="arm"></span><span class="glove"></span><span class="shorts"></span><span class="leg left"></span><span class="leg right"></span><span class="shoe left"></span><span class="shoe right"></span></div><div class="arena-boxer p2"><span class="arm"></span><span class="glove"></span><span class="shorts"></span><span class="leg left"></span><span class="leg right"></span><span class="shoe left"></span><span class="shoe right"></span></div></div><p class="arena-message" id="arenaMessage">Protect yourself with guard, then counter when the rival is open.</p><div class="arena-controls"><h4>PLAYER 1 <span class="arena-gold">· J H G D</span></h4><button data-action="p1-jab">JAB<small>J · 8 dmg</small></button><button data-action="p1-heavy">HEAVY<small>H · 18 dmg</small></button><button data-action="p1-guard">GUARD<small>G · blocks 75%</small></button><button data-action="p1-dodge">DODGE<small>D · avoids 1 hit</small></button></div>${twoPlayers ? `<div class="arena-controls"><h4>PLAYER 2 <span class="arena-gold">· ARROW KEYS</span></h4><button data-action="p2-jab">JAB<small>← · 8 dmg</small></button><button data-action="p2-heavy">HEAVY<small>↑ · 18 dmg</small></button><button data-action="p2-guard">GUARD<small>↓ · blocks 75%</small></button><button data-action="p2-dodge">DODGE<small>→ · avoids 1 hit</small></button></div>` : ''}<div class="arena-bottom"><span class="arena-gold">GOLDEN RING · ${twoPlayers ? 'LOCAL 2 PLAYER' : 'AI MODE'}</span><button id="arenaBack">CHANGE MODE</button></div></div>`;
    const $ = selector => body.querySelector(selector);
    const update = () => { $('#p1Hp').style.width = p1.hp + '%'; $('#p2Hp').style.width = p2.hp + '%'; $('#p1HpText').textContent = p1.hp; $('#p2HpText').textContent = p2.hp; };
    const message = text => { $('#arenaMessage').textContent = text; };
    const end = winner => { over = true; clearInterval(aiTimer); message(winner + ' WINS THE ROUND! Protect yourself, then press CHANGE MODE to play again.'); say(winner + ' wins the Golden Ring!'); };
    const attack = (attacker, defender, kind, label) => { if (over) return; const cost = kind === 'heavy' ? 23 : 8; if (attacker.stamina < cost) { message(label + ' is too tired — recover before attacking.'); return; } attacker.stamina -= cost; let damage = kind === 'heavy' ? 18 : 8; const boxer = defender === p1 ? '.p1' : '.p2'; if (defender.dodging) { defender.dodging = false; message(label + ' missed — perfect dodge!'); return; } if (defender.guarding) { $(boxer).classList.add('block'); message(label + ' blocked it completely — zero damage.'); } else { defender.hp = Math.max(0, defender.hp - damage); $(boxer).classList.add('hit'); setTimeout(() => $(boxer).classList.remove('hit'), 260); message(label + ' lands a clean ' + kind + '!'); } update(); if (defender.hp <= 0) end(label + ' wins'); };
    const action = (who, kind) => { const a = who === 'p1' ? p1 : p2, d = who === 'p1' ? p2 : p1, label = who === 'p1' ? 'PLAYER 1' : (twoPlayers ? 'PLAYER 2' : 'AI RIVAL'); if (kind === 'guard') { a.guarding = !a.guarding; message(label + (a.guarding ? ' is protecting their face.' : ' lowered their guard.')); } else if (kind === 'dodge') { if (a.stamina < 15) return message(label + ' is too tired to dodge.'); a.stamina -= 15; a.dodging = true; message(label + ' is ready to slip the next punch.'); } else attack(a, d, kind, label); };
    body.querySelectorAll('[data-action]').forEach(button => button.onclick = () => { const [who, kind] = button.dataset.action.split('-'); action(who, kind); });
    const keyHandler = event => { if (over) return; const key = event.key.toLowerCase(); for (const who of ['p1','p2']) for (const kind of ['jab','heavy','guard','dodge']) if (key === keys[who][kind]) { event.preventDefault(); action(who, kind); } };
    document.addEventListener('keydown', keyHandler);
    $('#arenaBack').onclick = () => { document.removeEventListener('keydown', keyHandler); clearInterval(aiTimer); setup(); };
    if (!twoPlayers) aiTimer = setInterval(() => { p1.stamina = Math.min(100, p1.stamina + 8); p2.stamina = Math.min(100, p2.stamina + 12); if (Math.random() < .3) action('p2','guard'); else action('p2', Math.random() < .45 ? 'heavy' : 'jab'); }, 1200);
    update();
    modal.addEventListener('close', () => { document.removeEventListener('keydown', keyHandler); clearInterval(aiTimer); }, { once:true });
  }

  document.addEventListener('click', event => { const button = event.target.closest('[data-game="boxing"]'); if (!button) return; event.preventDefault(); event.stopImmediatePropagation(); modal.showModal(); setup(); }, true);
})();

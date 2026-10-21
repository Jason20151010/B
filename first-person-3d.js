(() => {
  if (localStorage.pfViewVersion !== '2') {
    localStorage.pfView = 'first';
    localStorage.pfViewVersion = '2';
  }
  const observer = new MutationObserver(() => {
    const setup = document.querySelector('.arena-setup');
    if (setup && !setup.querySelector('.view-picker')) {
      const picker = document.createElement('div');
      picker.className = 'view-picker';
      picker.innerHTML = '<b>RING VIEW</b><div><button type="button" data-view="arcade">ARCADE VIEW</button><button type="button" data-view="first">3D FIRST PERSON</button></div><small>In first person, the first clean hit starts the exchange.</small>';
      setup.insertBefore(picker, setup.querySelector('#startArena'));
      const selected = localStorage.pfView || 'first';
      picker.querySelectorAll('[data-view]').forEach(button => { button.classList.toggle('selected', button.dataset.view === selected); button.onclick = () => { localStorage.pfView = button.dataset.view; picker.querySelectorAll('[data-view]').forEach(item => item.classList.toggle('selected', item === button)); }; });
    }
    const arena = document.querySelector('.boxing-arena:not(.arena-setup)');
    if (arena && localStorage.pfView === 'first' && !arena.classList.contains('first-person')) {
      arena.classList.add('first-person');
      const stage = arena.querySelector('.boxing-stage');
      stage?.insertAdjacentHTML('beforeend', '<div class="pov-crosshair">+</div><div class="pov-hands"><i></i><i></i></div><div class="pov-target">TARGET</div>');
    }
  });
  observer.observe(document.body, { childList:true, subtree:true });
})();

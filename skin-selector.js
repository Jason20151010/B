(() => {
  const skins = [
    ['ruby','RUBY',' #d85867'], ['volt','VOLT','#3bd0e6'], ['gold','GOLD','#f4cf54'],
    ['emerald','EMERALD','#4bd28b'], ['violet','VIOLET','#b989ff'], ['ice','ICE','#b9f2f4'],
    ['shadow','SHADOW','#6f748d'], ['sunset','SUNSET','#ff9a62']
  ];
  const observer = new MutationObserver(() => {
    const setup = document.querySelector('.arena-setup');
    if (setup && !setup.querySelector('.skin-picker')) {
      const picker = document.createElement('div');
      picker.className = 'skin-picker';
      picker.innerHTML = '<b>CHOOSE YOUR FIGHTER SKIN</b><div class="skin-options">' + skins.map(([id,name]) => `<button type="button" data-skin-choice="${id}" class="skin-choice">${name}</button>`).join('') + '</div>';
      setup.insertBefore(picker, setup.querySelector('#startArena'));
      const selected = localStorage.pfSkin || 'ruby';
      picker.querySelectorAll('[data-skin-choice]').forEach(button => {
        button.classList.toggle('selected', button.dataset.skinChoice === selected);
        button.onclick = () => { localStorage.pfSkin = button.dataset.skinChoice; picker.querySelectorAll('[data-skin-choice]').forEach(item => item.classList.toggle('selected', item === button)); };
      });
    }
    const fight = document.querySelector('.boxing-arena:not(.arena-setup)');
    if (fight && !fight.dataset.skinApplied) {
      fight.dataset.skinApplied = 'true';
      fight.querySelector('.arena-boxer.p1')?.setAttribute('data-skin', localStorage.pfSkin || 'ruby');
    }
  });
  observer.observe(document.body, { childList:true, subtree:true });
})();

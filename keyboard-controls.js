// Keyboard controls for Prize Punch.
document.addEventListener('keydown', event => {
  if (!document.querySelector('.real-fight')) return;
  if (event.target.matches('input, textarea, select')) return;

  const keys = { j: '#jab', h: '#heavy', g: '#guard', d: '#dodge' };
  const button = document.querySelector(keys[event.key.toLowerCase()]);
  if (!button || button.disabled) return;

  event.preventDefault();
  button.click();
  button.classList.add('key-pressed');
  window.setTimeout(() => button.classList.remove('key-pressed'), 140);
});

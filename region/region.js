(() => {
  const root = document.getElementById('region-preview');
  const panel = root.querySelector('.expanded');
  const image = panel.querySelector('img');
  const description = panel.querySelector('.image-description');
  const close = panel.querySelector('button');
  let trigger;
  const hide = () => {
    panel.hidden = true;
    if (trigger) trigger.focus();
  };
  root.querySelectorAll('.gallery button').forEach(button => {
    button.addEventListener('click', () => {
      trigger = button;
      const thumbnail = button.querySelector('img');
      image.src = thumbnail.src;
      image.alt = thumbnail.alt;
      description.textContent = thumbnail.alt;
      panel.hidden = false;
      close.focus({ preventScroll: true });
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
  close.addEventListener('click', hide);
  root.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) hide();
  });
})();

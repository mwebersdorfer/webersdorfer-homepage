// Mobile-Navigation: einfacher, barrierefreier Umschalter ohne Abhängigkeiten.
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var closeBtn = document.querySelector('.mobile-nav-close');
  var menu = document.querySelector('.mobile-nav');
  if (!toggle || !menu) return;

  function openMenu() {
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    var firstLink = menu.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggle.focus();
  }

  toggle.addEventListener('click', function () {
    var isOpen = menu.classList.contains('is-open');
    if (isOpen) { closeMenu(); } else { openMenu(); }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  menu.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
});

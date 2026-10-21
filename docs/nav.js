(function () {
  const path = document.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar a[data-nav]').forEach((link) => {
    const target = link.getAttribute('data-nav');
    if (target === path || (path === '' && target === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  const toggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      const open = sidebar.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
})();

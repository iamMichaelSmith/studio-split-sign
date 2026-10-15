document.addEventListener('submit', event => {
  const message = event.target.dataset.confirm;
  if (message && !window.confirm(message)) event.preventDefault();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    document.querySelectorAll('.mobile-navigation[open]').forEach(menu => {
      menu.open = false;
      menu.querySelector('summary').focus();
    });
  }
});

(() => {
  document.querySelectorAll('[data-direction]').forEach(button => {
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      const filter = document.querySelector(`[data-filter="${button.dataset.direction}"]`);
      filter?.click();
      document.querySelectorAll('[data-direction]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      document.querySelector('.selected-heading')?.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    });
  });
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-direction]').forEach(direction => direction.setAttribute('aria-pressed', String(direction.dataset.direction === button.dataset.filter)));
  }));
})();

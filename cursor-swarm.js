/* Automatic cursor swarm: visual overlay only; never intercepts page clicks. */
(() => {
  if (window.__aftabCursorSwarmStarted) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {
    position: 'fixed', inset: '0', width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: '2147483646'
  });
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) { canvas.remove(); return; }
  window.__aftabCursorSwarmStarted = true;

  let width = 0, height = 0, dpr = 1, centerX = 0, centerY = 0;
  let mouseX = 0, mouseY = 0, lastPointer = -Infinity;
  const dots = Array.from({length: 26}, (_, i) => ({
    x: 0, y: 0, vx: 0, vy: 0, phase: i * 2.39996
  }));
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!centerX && !centerY) {
      centerX = width * 0.5;
      centerY = height * 0.5;
      dots.forEach((p, i) => {
        p.x = centerX + Math.cos(p.phase) * (12 + Math.sqrt(i) * 7);
        p.y = centerY + Math.sin(p.phase) * (12 + Math.sqrt(i) * 7);
      });
    }
  };
  resize();
  window.addEventListener('resize', resize, {passive: true});
  window.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    mouseX = e.clientX;
    mouseY = e.clientY;
    lastPointer = performance.now();
  }, {passive: true});

  const draw = time => {
    if (!document.hidden) {
      const t = time * 0.001;
      const autoX = width * (0.5 + 0.22 * Math.sin(t * 0.27) + 0.06 * Math.sin(t * 0.69));
      const autoY = height * (0.5 + 0.18 * Math.cos(t * 0.31) + 0.06 * Math.sin(t * 0.48));
      const followMouse = time - lastPointer < 3500;
      const targetX = followMouse ? mouseX : autoX;
      const targetY = followMouse ? mouseY : autoY;
      centerX += (targetX - centerX) * 0.045;
      centerY += (targetY - centerY) * 0.045;
      ctx.clearRect(0, 0, width, height);

      dots.forEach((p, i) => {
        const orbit = 12 + Math.sqrt(i) * 7;
        const angle = p.phase + t * (i % 2 ? 0.9 : -0.8);
        const tx = centerX + Math.cos(angle) * orbit;
        const ty = centerY + Math.sin(angle) * orbit;
        p.vx = (p.vx + (tx - p.x) * 0.055) * 0.78;
        p.vy = (p.vy + (ty - p.y) * 0.055) * 0.78;
        p.x += p.vx;
        p.y += p.vy;
        ctx.beginPath();
        ctx.arc(p.x, p.y, i % 5 === 0 ? 2.1 : 1.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(49,92,126,' + (0.20 + (1 - i / dots.length) * 0.42) + ')';
        ctx.fill();
      });
    }
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
})();

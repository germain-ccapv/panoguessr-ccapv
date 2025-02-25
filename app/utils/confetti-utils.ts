import confetti from 'canvas-confetti';

// Configuration de base pour les confettis
const defaults = {
  spread: 360,
  ticks: 100,
  gravity: 0.8,
  decay: 0.95,
  startVelocity: 30,
  shapes: ['square', 'circle'],
  colors: ['#FF0000', '#FFA500', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#EE82EE']
};

// Pluie de confettis
export function launchConfettiShower() {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  (function frame() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) return;

    const particleCount = 50 * (timeLeft / duration);

    // Lancer des confettis de deux côtés
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    });

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    });

    requestAnimationFrame(frame);
  })();
}

// Effet d'explosion de confettis
export function launchConfettiExplosion(origin = { x: 0.5, y: 0.5 }) {
  confetti({
    ...defaults,
    particleCount: 100,
    origin,
    scalar: 1.2
  });
}

// Effet scintillant pour la première place
export function celebrateWinner(continuous = false) {
  launchConfettiExplosion({ x: 0.5, y: 0.3 });

  if (continuous) {
    setTimeout(launchConfettiShower, 500);
  } else {
    setTimeout(() => launchConfettiExplosion({ x: 0.2, y: 0.5 }), 700);
    setTimeout(() => launchConfettiExplosion({ x: 0.8, y: 0.5 }), 1000);
  }
}

export function fireworkEffect() {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  let skew = 1;

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  (function frame() {
    const timeLeft = animationEnd - Date.now();
    const ticks = Math.max(200, 500 * (timeLeft / duration));
    skew = Math.max(0.8, skew - 0.001);

    confetti({
      particleCount: 1,
      startVelocity: 0,
      ticks: ticks,
      origin: {
        x: Math.random(),
        y: (Math.random() * skew) - 0.2
      },
      colors: [defaults.colors[Math.floor(Math.random() * defaults.colors.length)]],
      shapes: ['circle'],
      gravity: randomInRange(0.4, 0.6),
      scalar: randomInRange(0.4, 1),
      drift: randomInRange(-0.4, 0.4)
    });

    if (timeLeft > 0) {
      requestAnimationFrame(frame);
    }
  }());
}
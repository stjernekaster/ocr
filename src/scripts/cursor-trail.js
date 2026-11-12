// Rediger tegnene her for at vælge, hvad musehalen skal vise.
const GLYPHS =
  "{}[]<>/\\|;:!?+-=*#%&@アイウエオカキクケコ*.✫ᕯ⍟✧✢✴☺x¹x⁹¢℃✡Ðŭ";
const SPAWN_DISTANCE = 40;
const TRAIL_SPREAD = 14;
const MAX_TILT = 55;
const MAX_PARTICLES = 60;

export function setupCursorTrail() {
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  if (!canHover.matches || prefersReducedMotion.matches) return;

  const trail = document.createElement("div");
  trail.className = "cursor-trail";
  trail.setAttribute("aria-hidden", "true");
  document.body.append(trail);

  const particles = new Set();
  let lastSpawn = null;

  const removeParticle = (particle) => {
    particle.remove();
    particles.delete(particle);
  };

  const spawnParticle = (x, y) => {
    if (particles.size >= MAX_PARTICLES) {
      removeParticle(particles.values().next().value);
    }

    const particle = document.createElement("span");
    particle.className = "cursor-trail__glyph";
    particle.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty(
      "--trail-opacity",
      (0.24 + Math.random() * 0.5).toFixed(2),
    );
    particle.style.setProperty("--trail-size", `${12 + Math.random() * 10}px`);
    particle.style.setProperty(
      "--trail-drift-x",
      `${(Math.random() - 0.5) * 32}px`,
    );
    particle.style.setProperty(
      "--trail-drift-y",
      `${-10 - Math.random() * 30}px`,
    );
    particle.style.setProperty(
      "--trail-rotation",
      `${(Math.random() * 2 - 1) * MAX_TILT}deg`,
    );
    particle.style.setProperty(
      "--trail-duration",
      `${650 + Math.random() * 500}ms`,
    );
    particle.addEventListener("animationend", () => removeParticle(particle), {
      once: true,
    });

    particles.add(particle);
    trail.append(particle);
  };

  const handlePointerMove = (event) => {
    if (event.pointerType === "touch") return;

    const point = { x: event.clientX, y: event.clientY };
    if (!lastSpawn) {
      spawnParticle(point.x, point.y);
      lastSpawn = point;
      return;
    }

    const distance = Math.hypot(point.x - lastSpawn.x, point.y - lastSpawn.y);
    const count = Math.floor(distance / SPAWN_DISTANCE);
    if (!count) return;

    const perpendicularX = -(point.y - lastSpawn.y) / distance;
    const perpendicularY = (point.x - lastSpawn.x) / distance;
    const spawnCount = Math.min(count, 4);
    for (let index = 1; index <= spawnCount; index += 1) {
      const progress = index / spawnCount;
      const spread = (Math.random() * 2 - 1) * TRAIL_SPREAD;
      spawnParticle(
        lastSpawn.x +
          (point.x - lastSpawn.x) * progress +
          perpendicularX * spread,
        lastSpawn.y +
          (point.y - lastSpawn.y) * progress +
          perpendicularY * spread,
      );
    }

    lastSpawn = point;
  };

  const resetTrail = () => {
    lastSpawn = null;
  };
  const handlePointerOut = (event) => {
    if (!event.relatedTarget) resetTrail();
  };

  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerout", handlePointerOut);

  return () => {
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerout", handlePointerOut);
    trail.remove();
  };
}

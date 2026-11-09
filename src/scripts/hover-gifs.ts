export function setupHoverGifs() {
  const gifImages = document.querySelectorAll<HTMLImageElement>(
    "[data-gif-src]",
  );

  gifImages.forEach((image) => {
    const gifSrc = image.dataset.gifSrc;
    const posterSrc = image.getAttribute("src");
    const interactionTarget = image.closest("a, button") ?? image;

    if (!gifSrc || !posterSrc) return;

    const play = () => {
      image.src = gifSrc;
    };
    const pause = () => {
      image.src = posterSrc;
    };

    interactionTarget.addEventListener("pointerenter", (event) => {
      if (event.pointerType !== "touch") play();
    });
    interactionTarget.addEventListener("pointerleave", pause);
    interactionTarget.addEventListener("focus", play);
    interactionTarget.addEventListener("blur", pause);
  });
}

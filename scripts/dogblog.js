// Gallery adapted from Hoang Tran (https://fb.com/99.hoangtran).
const gallery = document.getElementById("rotate");
const odrag = document.getElementById("drag-container");
const ospin = document.getElementById("spin-container");
const photos = Array.from(ospin.querySelectorAll("img, video"));
const ground = document.getElementById("ground");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const imgWidth = 145;
const imgHeight = 200;
let radius = 240;
let tX = 0;
let tY = 10;
let pointer = null;
let inertia = null;

ospin.style.width = `${imgWidth}px`;
ospin.style.height = `${imgHeight}px`;
photos.forEach((photo) => { photo.draggable = false; });

function init() {
  radius = Math.min(240, Math.max(80, (gallery.clientWidth - imgWidth - 32) / 2));
  ground.style.width = `${radius * 3}px`;
  ground.style.height = `${radius * 3}px`;
  photos.forEach((photo, index) => {
    photo.style.transform = `rotateY(${index * 360 / photos.length}deg) translateZ(${radius}px)`;
  });
}

function applyTransform() {
  tY = Math.max(0, Math.min(180, tY));
  odrag.style.transform = `rotateX(${-tY}deg) rotateY(${tX}deg)`;
}

function playSpin(playing) {
  ospin.style.animationPlayState = playing && !reducedMotion.matches ? "running" : "paused";
}

function stopInertia() {
  if (inertia !== null) cancelAnimationFrame(inertia);
  inertia = null;
}

function coast(dx, dy) {
  if (reducedMotion.matches || (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5)) {
    inertia = null;
    playSpin(true);
    return;
  }
  tX += dx * 0.1;
  tY += dy * 0.1;
  applyTransform();
  inertia = requestAnimationFrame(() => coast(dx * 0.95, dy * 0.95));
}

gallery.addEventListener("pointerdown", (event) => {
  if (!event.isPrimary || event.button !== 0) return;
  stopInertia();
  pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, dy: 0 };
  gallery.setPointerCapture(event.pointerId);
  playSpin(false);
});

gallery.addEventListener("pointermove", (event) => {
  if (!pointer || pointer.id !== event.pointerId) return;
  pointer.dx = event.clientX - pointer.x;
  // On a phone, vertical gestures belong to page scrolling.
  pointer.dy = event.pointerType === "touch" ? 0 : event.clientY - pointer.y;
  tX += pointer.dx * 0.1;
  tY += pointer.dy * 0.1;
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  applyTransform();
});

function endDrag(event) {
  if (!pointer || pointer.id !== event.pointerId) return;
  const { dx, dy } = pointer;
  pointer = null;
  if (gallery.hasPointerCapture(event.pointerId)) gallery.releasePointerCapture(event.pointerId);
  if (event.type === "pointercancel") playSpin(true);
  else coast(dx, dy);
}

gallery.addEventListener("pointerup", endDrag);
gallery.addEventListener("pointercancel", endDrag);
window.addEventListener("resize", init);
reducedMotion.addEventListener("change", () => {
  stopInertia();
  playSpin(!pointer);
});
ospin.style.animation = "spinRevert 60s infinite linear";
init();
playSpin(true);

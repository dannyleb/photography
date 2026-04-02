/* ============================================================
   HEADER — scroll state
   ============================================================ */
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ============================================================
   MOBILE NAV
   ============================================================ */
const hamburger  = document.querySelector('.hamburger');
const mobileNav  = document.querySelector('.mobile-nav');
const mobileClose = document.querySelector('.mobile-nav-close');

function openMobileNav() {
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileNav.classList.add('open');
  mobileNav.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('open');
  mobileNav.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', openMobileNav);
mobileClose?.addEventListener('click', closeMobileNav);

// Close on nav link click
mobileNav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', closeMobileNav);
});

/* ============================================================
   LIGHTBOX
   ============================================================ */
const lightbox    = document.getElementById('lightbox');
const lightboxImg = lightbox?.querySelector('.lightbox-img');
const closeBtn    = lightbox?.querySelector('.lightbox-close');
const prevBtn     = lightbox?.querySelector('.lightbox-prev');
const nextBtn     = lightbox?.querySelector('.lightbox-next');

let gallery = [];  // all grid images on page
let current = 0;

function buildGallery() {
  gallery = Array.from(document.querySelectorAll('.grid-item img'));
}

function openLightbox(index) {
  current = index;
  showImage(current);
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function showImage(index) {
  const img = gallery[index];
  if (!img || !lightboxImg) return;
  lightboxImg.style.opacity = '0';
  // Use the real src (not the onerror fallback placeholder path)
  const src = img.currentSrc || img.src;
  lightboxImg.src = src;
  lightboxImg.alt = img.alt;
  lightboxImg.onload = () => { lightboxImg.style.opacity = '1'; };
  // If already cached it may not fire onload
  if (lightboxImg.complete) lightboxImg.style.opacity = '1';
}

function prevImage() {
  current = (current - 1 + gallery.length) % gallery.length;
  showImage(current);
}

function nextImage() {
  current = (current + 1) % gallery.length;
  showImage(current);
}

// Wire up grid items
function initLightbox() {
  buildGallery();
  gallery.forEach((img, i) => {
    const item = img.closest('.grid-item');
    if (item) {
      item.addEventListener('click', () => openLightbox(i));
      item.setAttribute('tabindex', '0');
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
      });
    }
  });
}

closeBtn?.addEventListener('click', closeLightbox);
prevBtn?.addEventListener('click', prevImage);
nextBtn?.addEventListener('click', nextImage);

// Close on backdrop click
lightbox?.addEventListener('click', e => {
  if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-img-wrap')) {
    closeLightbox();
  }
});

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (!lightbox?.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   prevImage();
  if (e.key === 'ArrowRight')  nextImage();
});

// Touch swipe support
let touchStartX = 0;
lightbox?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
lightbox?.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) { dx < 0 ? nextImage() : prevImage(); }
}, { passive: true });

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initLightbox();
});

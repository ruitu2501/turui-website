// TURUI logo:
// - page load: full SVG animation (mark + TURUI)
// - hover header/nav or hero: mark + TURUI replay together
let turuiLoadReady = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
window.setTimeout(() => { turuiLoadReady = true; }, 2600);

function replayTuruiFull(box) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!turuiLoadReady) return;
  if (!box || box.dataset.replaying === '1') return;
  box.dataset.replaying = '1';
  const html = box.innerHTML;
  box.innerHTML = '';
  box.innerHTML = html;
  window.setTimeout(() => {
    box.dataset.replaying = '0';
  }, 2500);
}

// Nav bar: hover anywhere on header → logo mark + TURUI animate
const header = document.querySelector('.header');
const navLogo = document.querySelector('.header .logo[data-turui-logo]');
if (header && navLogo) {
  header.addEventListener('mouseenter', () => replayTuruiFull(navLogo));
}

// Hero lockup: mark + TURUI together
document.querySelectorAll('.hero-lockup[data-turui-logo]').forEach(el => {
  el.addEventListener('mouseenter', () => replayTuruiFull(el));
});

document.querySelectorAll('[data-turui-logo]').forEach(el => {
  el.addEventListener('click', (e) => {
    const href = el.tagName === 'A' ? el.getAttribute('href') : '';
    if (href === '#home') {
      e.preventDefault();
      replayTuruiFull(el);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href && href !== '#' && !href.startsWith('#')) {
      // allow navigation to other pages
    } else if (el.classList.contains('hero-lockup')) {
      e.preventDefault();
      replayTuruiFull(el);
    }
  });
});

// Local videos: quieter default volume; only one plays at a time
(() => {
  const videos = Array.from(document.querySelectorAll('.video-media video'));
  const DEFAULT_VOLUME = 0.25;

  videos.forEach(video => {
    video.volume = DEFAULT_VOLUME;

    video.addEventListener('play', () => {
      videos.forEach(other => {
        if (other !== video && !other.paused) other.pause();
      });
    });

    video.addEventListener('ended', () => {
      video.pause();
      video.currentTime = 0;
      video.load();
      video.volume = DEFAULT_VOLUME;
    });
  });
})();

// Tab switching
const videosJumpNav = document.getElementById('videos-jump-nav');

function setWorkTab(target) {
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === target);
  });
  const photos = document.getElementById('photos');
  const videos = document.getElementById('videos');
  if (photos) photos.style.display = target === 'photos' ? 'flex' : 'none';
  if (videos) videos.style.display = target === 'videos' ? 'block' : 'none';
  if (videosJumpNav) videosJumpNav.hidden = target !== 'videos';
}

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => setWorkTab(tab.dataset.tab));
});

document.querySelectorAll('[data-back-to-photos]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    setWorkTab('photos');
    const work = document.getElementById('work');
    if (work) work.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Lightbox gallery (click to enlarge, ←/→ to navigate)
(() => {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const galleryImgs = Array.from(document.querySelectorAll('[data-gallery], .series-page-grid img, .gallery-item img'));
  let index = 0;

  function sources() {
    return galleryImgs.map(img => img.currentSrc || img.src).filter(Boolean);
  }

  function show(i) {
    const list = sources();
    if (!list.length) return;
    index = (i + list.length) % list.length;
    lightboxImg.src = list[index];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  galleryImgs.forEach((img, i) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => show(i));
  });

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    show(index - 1);
  });
  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    show(index + 1);
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
})();

// Series / videos page: jump to top / bottom
(() => {
  document.querySelectorAll('.series-jump-nav').forEach(nav => {
    nav.querySelectorAll('.series-jump').forEach(btn => {
      btn.addEventListener('click', () => {
        const toTop = btn.dataset.jump === 'top';
        window.scrollTo({
          top: toTop ? 0 : document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      });
    });
  });
})();

// Resume: direct PDF download (no print dialog)
(() => {
  document.querySelectorAll('[data-download-pdf]').forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      const name = link.getAttribute('download') || '涂锐-个人简介.pdf';
      if (!href) return;
      try {
        const res = await fetch(href);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (_) {
        window.location.href = href;
      }
    });
  });
})();

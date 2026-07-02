document.addEventListener('DOMContentLoaded', () => {

  // ===== NAV TOGGLE =====
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });

  // ===== SCROLL ANIMATIONS (Intersection Observer) =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  const observeSections = () => {
    const sections = document.querySelectorAll(
      '.full-bleed-section, .software, #especializacion, footer'
    );
    sections.forEach(section => {
      section.classList.add('fade-in');
      observer.observe(section);
    });
  };
  observeSections();

  // ===== NAV LINKS SMOOTH SCROLL =====
  document.querySelectorAll('.nav-menu a, .btn-gothic').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = 80;
          const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  // ===== FLOATING BATS (parallax effect) =====
  const bats = document.querySelectorAll('.bat');
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    bats.forEach((bat, i) => {
      const factor = (i + 1) * 8;
      bat.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });

  // ===== GALLERY LIGHTBOX =====
  const galeriaItems = document.querySelectorAll('.works-grid img, .works-grid video');
  galeriaItems.forEach(item => {
    item.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.className = 'lightbox-overlay';
      const caption = item.getAttribute('data-caption') || '';
      const isVideo = item.tagName === 'VIDEO';
      const src = isVideo ? item.querySelector('source')?.src || item.src : item.src;
      const mediaTag = isVideo
        ? `<video src="${src}" controls autoplay class="lightbox-video"></video>`
        : `<img src="${item.src}" alt="${item.alt || ''}">`;
      overlay.innerHTML = `
        <div class="lightbox-content">
          <span class="lightbox-close">&times;</span>
          ${mediaTag}
          ${caption ? `<p class="lightbox-caption">${caption}</p>` : ''}
        </div>
      `;
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.classList.contains('lightbox-close')) {
          overlay.remove();
          document.body.style.overflow = '';
        }
      });
    });
  });

  // ===== FOLDER CAROUSEL (PHOTOSHOP) =====
  const folderItems = document.querySelectorAll('.folder-item');

  function openCarousel(images, startIndex) {
    let currentIndex = startIndex;
    const total = images.length;

    const overlay = document.createElement('div');
    overlay.className = 'carousel-overlay';

    function render() {
      const img = images[currentIndex];
      const caption = img.getAttribute('data-caption') || '';
      overlay.innerHTML = `
        <div class="carousel-container">
          <div class="carousel-header">
            <span class="carousel-counter">${currentIndex + 1} / ${total}</span>
            <span class="carousel-close">&times;</span>
          </div>
          <div class="carousel-image-wrapper">
            <button class="carousel-nav carousel-prev"><i class="fas fa-chevron-left"></i></button>
            <img src="${img.src}" alt="${img.alt || ''}">
            <button class="carousel-nav carousel-next"><i class="fas fa-chevron-right"></i></button>
          </div>
          ${caption ? `<p class="carousel-caption">${caption}</p>` : ''}
        </div>
      `;

      overlay.querySelector('.carousel-close').addEventListener('click', close);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
      });
      overlay.querySelector('.carousel-prev').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + total) % total;
        render();
      });
      overlay.querySelector('.carousel-next').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % total;
        render();
      });
      document.addEventListener('keydown', onKeydown);
    }

    function onKeydown(e) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + total) % total;
        render();
      }
      if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % total;
        render();
      }
    }

    function close() {
      overlay.remove();
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeydown);
    }

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    render();
  }

  folderItems.forEach(folder => {
    folder.addEventListener('click', () => {
      const images = Array.from(folder.querySelectorAll('.folder-images img'));
      if (images.length > 0) {
        openCarousel(images, 0);
      }
    });
  });

});

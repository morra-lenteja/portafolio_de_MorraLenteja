document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR SCROLL =====
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 100);
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
  document.querySelectorAll('.nav-links a, .btn-gothic').forEach(link => {
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

  // ===== GALLERY IMAGE LIGHTBOX =====
  const galeriaImgs = document.querySelectorAll('.works-grid img');
  galeriaImgs.forEach(img => {
    img.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.className = 'lightbox-overlay';
      overlay.innerHTML = `
        <div class="lightbox-content">
          <span class="lightbox-close">&times;</span>
          <img src="${img.src}" alt="${img.alt || ''}">
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

});

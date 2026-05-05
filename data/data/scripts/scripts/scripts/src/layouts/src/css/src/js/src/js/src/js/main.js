/**
 * ═══════════════════════════════════════════════════════
 * ZAKIHUB CORE ENGINE v3.0
 * ═══════════════════════════════════════════════════════
 * 
 * - Particle background
 * - Search & filter
 * - Tool cards interaction
 * - Focus mode
 * - Mobile menu
 * - Lazy loading
 * - PWA support
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavigation();
  initSearch();
  initFocusMode();
  initMobileMenu();
  initLazyLoad();
  initToolCards();
  initScrollAnimations();
  hideLoader();
});

// ═══════════════════════════════════════════════════════
// PARTICLE BACKGROUND
// ═══════════════════════════════════════════════════════
function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 30 : 60;
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resize();
  window.addEventListener('resize', resize);
  
  class Particle {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = ['#00ff88', '#00ccff', '#ff6b9d', '#ffd700'][Math.floor(Math.random() * 4)];
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    // Connect nearby particles
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 255, 136, ${0.1 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

// ═══════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════
function initNavigation() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    
    if (current > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    lastScroll = current;
  });
}

// ═══════════════════════════════════════════════════════
// SEARCH & FILTER
// ═══════════════════════════════════════════════════════
function initSearch() {
  const searchInput = document.querySelector('.search-bar');
  if (!searchInput) return;
  
  let toolsData = [];
  
  // جلب البيانات
  fetch('/data/tools.json')
    .then(r => r.json())
    .then(data => { toolsData = data.tools || []; })
    .catch(() => {});
  
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const grid = document.querySelector('.tools-grid');
    if (!grid) return;
    
    const cards = grid.querySelectorAll('.tool-card');
    
    cards.forEach(card => {
      const name = card.querySelector('.tool-name')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.tool-desc')?.textContent.toLowerCase() || '';
      const category = card.querySelector('.tool-category')?.textContent.toLowerCase() || '';
      
      const match = name.includes(query) || desc.includes(query) || category.includes(query);
      card.style.display = match ? 'flex' : 'none';
      card.style.animation = match ? 'fadeInUp 0.3s ease' : 'none';
    });
    
    // نقاط للبحث
    if (query.length > 2 && window.dopamine) {
      window.dopamine.addPoints(2, 'بحث نشط');
    }
  });
}

// ═══════════════════════════════════════════════════════
// FOCUS MODE
// ═══════════════════════════════════════════════════════
function initFocusMode() {
  const btn = document.getElementById('focus-mode-btn');
  if (!btn) return;
  
  btn.addEventListener('click', () => {
    document.body.classList.toggle('focus-mode');
    const isActive = document.body.classList.contains('focus-mode');
    btn.innerHTML = isActive ? '<span>🔙</span>' : '<span>🎯</span>';
    btn.title = isActive ? 'إلغاء وضع التركيز' : 'وضع التركيز';
    
    if (window.dopamine) {
      if (isActive) {
        window.dopamine.showToast('🎯 وضع التركيز مفعل! اضغط مرة أخرى للخروج', 'info');
      } else {
        window.dopamine.showToast('رجوع للوضع العادي', 'info');
      }
    }
  });
}

// ═══════════════════════════════════════════════════════
// MOBILE MENU
// ═══════════════════════════════════════════════════════
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;
  
  btn.addEventListener('click', () => {
    links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
    links.style.position = 'absolute';
    links.style.top = '100%';
    links.style.left = '0';
    links.style.right = '0';
    links.style.flexDirection = 'column';
    links.style.background = 'rgba(5, 5, 16, 0.98)';
    links.style.padding = 'var(--space-md)';
    links.style.backdropFilter = 'blur(20px)';
  });
}

// ═══════════════════════════════════════════════════════
// LAZY LOADING
// ═══════════════════════════════════════════════════════
function initLazyLoad() {
  const images = document.querySelectorAll('img[data-src]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '50px' });
  
  images.forEach(img => observer.observe(img));
}

// ═══════════════════════════════════════════════════════
// TOOL CARDS INTERACTION
// ═══════════════════════════════════════════════════════
function initToolCards() {
  document.querySelectorAll('.tool-card').forEach(card => {
    // تأثير Tilt ثلاثي الأبعاد
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
    
    // نقاط عند الضغط
    card.addEventListener('click', () => {
      const toolId = card.dataset.toolId;
      if (toolId && window.dopamine) {
        window.dopamine.discoverTool(toolId);
        window.dopamine.microSatisfy(card);
      }
    });
    
    // تأثير صوتي بصري عند الضغط على زر
    card.querySelectorAll('.btn-tool').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.dopamine) {
          window.dopamine.microSatisfy(btn);
        }
      });
    });
  });
}

// ═══════════════════════════════════════════════════════
// SCROLL ANIMATIONS
// ═══════════════════════════════════════════════════════
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.tool-card, .category-card, .section-title').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

// ═══════════════════════════════════════════════════════
// LOADER
// ═══════════════════════════════════════════════════════
function hideLoader() {
  const loader = document.getElementById('loading-overlay');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 500);
    }, 800);
  }
}

// ═══════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════════════════
document.addEventListener('keydown', (e) => {
  // / للبحث
  if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
    e.preventDefault();
    document.querySelector('.search-bar')?.focus();
  }
  
  // ESC للخروج
  if (e.key === 'Escape') {
    document.body.classList.remove('focus-mode');
    document.getElementById('zaki-panel')?.classList.remove('open');
  }
});

// ═══════════════════════════════════════════════════════
// BEFORE UNLOAD - SAVE STATE
// ═══════════════════════════════════════════════════════
window.addEventListener('beforeunload', () => {
  if (window.dopamine) {
    window.dopamine.saveData();
  }
});

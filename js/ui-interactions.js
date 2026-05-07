// تحسينات التفاعل مع الواجهة
class UIInteractions {
  static initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    window.addEventListener('mousemove', (e) => {
      parallaxElements.forEach(el => {
        const speed = el.dataset.parallax || 5;
        const x = (window.innerWidth - e.clientX * speed) / 100;
        const y = (window.innerHeight - e.clientY * speed) / 100;
        el.style.transform = `translateX(${x}px) translateY(${y}px)`;
      });
    });
  }

  static initRipple() {
    const buttons = document.querySelectorAll('button, .ripple');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  static initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(el => {
      el.addEventListener('mouseenter', function() {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = this.dataset.tooltip;
        tooltip.style.cssText = `
          position: absolute;
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          z-index: 10000;
          white-space: nowrap;
        `;
        document.body.appendChild(tooltip);
        const rect = this.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
        
        const hideTooltip = () => {
          tooltip.remove();
          this.removeEventListener('mouseleave', hideTooltip);
        };
        this.addEventListener('mouseleave', hideTooltip);
      });
    });
  }

  static initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  static initDarkModeToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'dark-mode-toggle';
    toggle.innerHTML = '🌙';
    toggle.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(0, 212, 255, 0.1);
      border: 1px solid rgba(0, 212, 255, 0.3);
      color: #00d4ff;
      cursor: pointer;
      z-index: 5000;
      transition: all 0.3s ease;
    `;
    
    toggle.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      toggle.innerHTML = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
    });
    
    document.body.appendChild(toggle);
  }
}

// تهيئة التفاعلات عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', () => {
  UIInteractions.initParallax();
  UIInteractions.initRipple();
  UIInteractions.initTooltips();
  UIInteractions.initSmoothScroll();
  UIInteractions.initDarkModeToggle();
});
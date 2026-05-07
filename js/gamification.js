// نظام التلعيب المتقدم
class GamificationEngine {
  constructor() {
    this.particles = [];
    this.combos = {};
  }

  // نظام التحقق من المستويات
  calculateLevel(points) {
    return Math.floor(Math.sqrt(points / 100)) + 1;
  }

  // نظام الكومبو
  startCombo(key) {
    if (!this.combos[key]) {
      this.combos[key] = {
        count: 0,
        lastTime: Date.now(),
        multiplier: 1
      };
    }
    this.combos[key].count++;
    this.combos[key].lastTime = Date.now();
    this.updateComboMultiplier(key);
    return this.combos[key];
  }

  updateComboMultiplier(key) {
    const combo = this.combos[key];
    if (combo.count < 3) combo.multiplier = 1;
    else if (combo.count < 5) combo.multiplier = 1.5;
    else if (combo.count < 10) combo.multiplier = 2;
    else combo.multiplier = 3;
  }

  // إنشاء جزيئات الاحتفال
  createConfetti(x, y) {
    for (let i = 0; i < 10; i++) {
      const particle = {
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: -Math.random() * 8,
        life: 1,
        emoji: ['🎉', '⭐', '✨', '🎊', '🏆'][Math.floor(Math.random() * 5)]
      };
      this.particles.push(particle);
    }
    this.animateParticles();
  }

  animateParticles() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // الجاذبية
        p.life -= 0.02;

        if (p.life > 0) {
          ctx.globalAlpha = p.life;
          ctx.font = '30px Arial';
          ctx.fillText(p.emoji, p.x, p.y);
        } else {
          this.particles.splice(i, 1);
        }
      }

      if (this.particles.length > 0) {
        requestAnimationFrame(animate);
      } else {
        canvas.remove();
      }
    };
    animate();
  }

  // نظام الشارات البصرية
  showBadge(badgeName, points) {
    const badge = document.createElement('div');
    badge.className = 'badge-popup';
    badge.innerHTML = `
      <div class="badge-content">
        <h3>${badgeName}</h3>
        <p>+${points} نقطة</p>
      </div>
    `;
    badge.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: linear-gradient(135deg, #00d4ff 0%, #a78bfa 100%);
      color: white;
      padding: 20px 30px;
      border-radius: 15px;
      z-index: 10000;
      animation: slideInRight 0.5s ease;
    `;
    document.body.appendChild(badge);
    setTimeout(() => badge.remove(), 3000);
  }

  // نظام التنبيهات البصرية
  showPulse(element) {
    element.style.animation = 'pulse 0.6s ease';
    setTimeout(() => {
      element.style.animation = 'none';
    }, 600);
  }
}

window.gamification = new GamificationEngine();
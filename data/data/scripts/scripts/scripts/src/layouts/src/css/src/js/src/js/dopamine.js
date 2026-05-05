/**
 * ═══════════════════════════════════════════════════════
 * ZAKIHUB DOPAMINE ENGINE v3.0
 * ═══════════════════════════════════════════════════════
 * 
 * 10 محركات إدمان:
 * 1. Mystery Box (صندوق غامض يومي)
 * 2. Streak Chain (سلسلة الأيام)
 * 3. Fortune Wheel (عجلة الحظ)
 * 4. Live Leaderboard (لوحة صدارة)
 * 5. Random Surprises (مفاجآت عشوائية)
 * 6. Daily Challenges (تحديات يومية)
 * 7. Zaki Emotional (تفاعلات عاطفية)
 * 8. Micro-Satisfaction (مؤثرات رضا)
 * 9. Instant Customization (تخصيص فوري)
 * 10. Progress Bars (شريط تقدم)
 */

class DopamineEngine {
  constructor() {
    this.data = this.loadData();
    this.knowledge = null;
    this.init();
  }

  async init() {
    try {
      const res = await fetch('/data/zaki-knowledge.json');
      this.knowledge = await res.json();
    } catch (e) {
      this.knowledge = { achievements: [], dailyChallenges: [], wheelRewards: [], mysteryBoxRewards: [] };
    }
    
    this.checkStreak();
    this.updateHUD();
    this.setupMysteryBox();
    this.setupWheel();
    this.setupChallenges();
    this.setupSurprises();
    this.setupProgress();
    
    // تحديث كل دقيقة
    setInterval(() => this.updateHUD(), 60000);
  }

  loadData() {
    const defaults = {
      points: 0,
      streak: 0,
      lastVisit: null,
      lastBoxOpen: null,
      lastWheelSpin: null,
      achievements: [],
      dailyChallenge: null,
      challengeCompleted: false,
      challengesCompleted: 0,
      toolsDiscovered: [],
      level: 1,
      theme: 'default',
      soundEnabled: true
    };
    
    try {
      const saved = localStorage.getItem('zaki-dopamine');
      return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    } catch {
      return defaults;
    }
  }

  saveData() {
    localStorage.setItem('zaki-dopamine', JSON.stringify(this.data));
    localStorage.setItem('zaki-points', this.data.points);
  }

  // ═══════════════════════════════════════════════════════
  // 1. MYSTERY BOX (صندوق غامض)
  // ═══════════════════════════════════════════════════════
  setupMysteryBox() {
    const box = document.getElementById('mystery-box');
    const timer = document.getElementById('box-timer');
    if (!box) return;
    
    const updateTimer = () => {
      const now = Date.now();
      const last = this.data.lastBoxOpen || 0;
      const elapsed = now - last;
      const cooldown = 24 * 60 * 60 * 1000; // 24 ساعة
      
      if (elapsed >= cooldown) {
        box.disabled = false;
        timer.textContent = 'جاهز! 🎁';
        box.style.borderColor = 'var(--neon-gold)';
        box.style.animation = 'boxFloat 3s ease-in-out infinite';
      } else {
        box.disabled = true;
        const remaining = cooldown - elapsed;
        const hours = Math.floor(remaining / 3600000);
        const mins = Math.floor((remaining % 3600000) / 60000);
        timer.textContent = `${hours}س ${mins}د`;
        box.style.borderColor = 'var(--border-glass)';
        box.style.animation = 'none';
      }
    };
    
    updateTimer();
    setInterval(updateTimer, 60000);
    
    box.addEventListener('click', () => {
      if (box.disabled) return;
      this.openMysteryBox();
    });
  }

  openMysteryBox() {
    const rewards = this.knowledge.mysteryBoxRewards || [
      { type: 'points', min: 10, max: 200, weight: 50 },
      { type: 'streak_boost', value: 1, weight: 20 },
      { type: 'exclusive_tip', weight: 15 },
      { type: 'avatar_unlock', weight: 10 },
      { type: 'double_points', duration: '24h', weight: 5 }
    ];
    
    // اختيار عشوائي مرجح
    const totalWeight = rewards.reduce((s, r) => s + r.weight, 0);
    let random = Math.random() * totalWeight;
    let reward = rewards[0];
    
    for (const r of rewards) {
      random -= r.weight;
      if (random <= 0) {
        reward = r;
        break;
      }
    }
    
    this.data.lastBoxOpen = Date.now();
    
    let message = '';
    let points = 0;
    
    switch (reward.type) {
      case 'points':
        points = Math.floor(Math.random() * (reward.max - reward.min) + reward.min);
        this.data.points += points;
        message = `🎉 فزت بـ ${points} نقطة!`;
        break;
      case 'streak_boost':
        this.data.streak += reward.value;
        message = `🔥 بوست! +${reward.value} يوم للسلسلة!`;
        break;
      case 'exclusive_tip':
        message = `🤫 نصيحة سرية: ${this.getRandomTip()}`;
        break;
      case 'avatar_unlock':
        message = `🎭 فتحت شكل جديد لذاكي! اضغط عليه لتجربته!`;
        break;
      case 'double_points':
        message = `💰 ضعف النقاط لمدة 24 ساعة!`;
        localStorage.setItem('zaki-double-points', Date.now().toString());
        break;
    }
    
    this.saveData();
    this.updateHUD();
    this.showToast(message, 'success');
    this.spawnConfetti();
    
    // تأثير بصري
    const box = document.getElementById('mystery-box');
    if (box) {
      box.style.transform = 'scale(1.3)';
      setTimeout(() => box.style.transform = '', 300);
    }
  }

  // ═══════════════════════════════════════════════════════
  // 2. STREAK CHAIN (سلسلة الأيام)
  // ═══════════════════════════════════════════════════════
  checkStreak() {
    const now = new Date();
    const today = now.toDateString();
    const last = this.data.lastVisit ? new Date(this.data.lastVisit).toDateString() : null;
    
    if (last === today) return; // زيارة اليوم محسوبة
    
    const yesterday = new Date(now - 86400000).toDateString();
    
    if (last === yesterday) {
      this.data.streak++;
      this.showToast(`سلسلة ${this.data.streak} أيام! 🔥`, 'success');
      
      // مكافآت تصاعدية
      if (this.data.streak === 3) this.award('streak_3', 100);
      if (this.data.streak === 7) this.award('streak_7', 300);
      if (this.data.streak === 30) this.award('streak_30', 2000);
    } else if (last) {
      this.data.streak = 1;
      this.showToast('بدأت سلسلة جديدة! 💪', 'info');
    } else {
      this.data.streak = 1;
    }
    
    this.data.lastVisit = now.toISOString();
    this.data.challengeCompleted = false;
    this.saveData();
  }

  // ═══════════════════════════════════════════════════════
  // 3. FORTUNE WHEEL (عجلة الحظ)
  // ═══════════════════════════════════════════════════════
  setupWheel() {
    // تظهر كـ modal عند الضغط على زر في الصفحة
    // هنا نربطها بحدث مخصص
    document.addEventListener('keydown', (e) => {
      if (e.key === 'w' && e.ctrlKey) {
        e.preventDefault();
        this.spinWheel();
      }
    });
  }

  spinWheel() {
    const now = Date.now();
    const last = this.data.lastWheelSpin || 0;
    const cooldown = 7 * 24 * 60 * 60 * 1000; // أسبوع
    
    if (now - last < cooldown) {
      const daysLeft = Math.ceil((cooldown - (now - last)) / 86400000);
      this.showToast(`عجلة الحظ متاحة بعد ${daysLeft} يوم 🎰`, 'warning');
      return;
    }
    
    const rewards = this.knowledge.wheelRewards || [
      { type: 'points', value: 100, chance: 30, message: '100 نقطة! 🎉' },
      { type: 'points', value: 500, chance: 15, message: '500 نقطة! 🔥' },
      { type: 'badge', value: 'lucky', chance: 10, message: 'شارة الحظ! 🍀' },
      { type: 'tip', value: 'secret', chance: 25, message: 'نصيحة سرية! 🤫' },
      { type: 'jackpot', value: 1000, chance: 5, message: 'جاكبوت! 1000 نقطة! 💰' },
      { type: 'nothing', value: 0, chance: 15, message: 'المرة الجاية أفضل! 💪' }
    ];
    
    // محاكاة دوران
    this.showToast('🎰 الدوران...', 'info');
    
    setTimeout(() => {
      const random = Math.random() * 100;
      let cumulative = 0;
      let reward = rewards[0];
      
      for (const r of rewards) {
        cumulative += r.chance;
        if (random <= cumulative) {
          reward = r;
          break;
        }
      }
      
      this.data.lastWheelSpin = now;
      
      if (reward.type === 'points') {
        this.data.points += reward.value;
      }
      
      this.saveData();
      this.updateHUD();
      this.showToast(reward.message, reward.type === 'nothing' ? 'info' : 'success');
      this.spawnConfetti();
    }, 2000);
  }

  // ═══════════════════════════════════════════════════════
  // 4. LEADERBOARD (لوحة صدارة)
  // ═══════════════════════════════════════════════════════
  getLeaderboard() {
    // في النسخة الحقيقية، هيجيب من API
    // هنا نعمل محاكاة محلية
    const local = JSON.parse(localStorage.getItem('zaki-leaderboard') || '[]');
    const me = { name: 'أنت', score: this.data.points, isMe: true };
    
    const demo = [
      { name: 'ZakiMaster', score: 15000 },
      { name: 'AI_Explorer', score: 12300 },
      { name: 'CodeNinja', score: 9800 },
      { name: 'PixelArtist', score: 8500 },
      { name: 'DataWizard', score: 7200 }
    ];
    
    const all = [...demo, ...local, me].sort((a, b) => b.score - a.score);
    return all.slice(0, 10);
  }

  // ═══════════════════════════════════════════════════════
  // 5. RANDOM SURPRISES (مفاجآت عشوائية)
  // ═══════════════════════════════════════════════════════
  setupSurprises() {
    // مفاجأة كل 30-60 ثانية لو المستخدم نشط
    let inactive = 0;
    
    const checkActivity = () => {
      inactive++;
      if (inactive > 3 && Math.random() > 0.7) {
        this.triggerSurprise();
        inactive = 0;
      }
    };
    
    document.addEventListener('mousemove', () => { inactive = 0; });
    document.addEventListener('click', () => { inactive = 0; });
    document.addEventListener('scroll', () => { inactive = 0; });
    
    setInterval(checkActivity, 30000);
  }

  triggerSurprise() {
    const surprises = [
      { msg: '💎 وجدت كنز! +50 نقطة!', points: 50 },
      { msg: '🌟 نجمة ساقطة! +25 نقطة!', points: 25 },
      { msg: '🎁 هدية مفاجئة! +100 نقطة!', points: 100 },
      { msg: '🔥 بونوس نشاط! +30 نقطة!', points: 30 }
    ];
    
    const s = surprises[Math.floor(Math.random() * surprises.length)];
    this.data.points += s.points;
    this.saveData();
    this.updateHUD();
    this.showToast(s.msg, 'success');
    this.spawnConfetti();
  }

  // ═══════════════════════════════════════════════════════
  // 6. DAILY CHALLENGES (تحديات يومية)
  // ═══════════════════════════════════════════════════════
  setupChallenges() {
    if (!this.data.dailyChallenge || this.isNewDay(this.data.dailyChallenge.date)) {
      this.generateDailyChallenge();
    }
  }

  generateDailyChallenge() {
    const challenges = this.knowledge.dailyChallenges || [
      { id: 'dc1', text: 'اكتشف أداة في فئة جديدة', reward: 30 },
      { id: 'dc2', text: 'اقرأ وصف 3 أدوات بالكامل', reward: 20 },
      { id: 'dc3', text: 'افتح الصندوق الغامض', reward: 50 },
      { id: 'dc4', text: 'شارك أداة واحدة', reward: 40 },
      { id: 'dc5', text: 'جرب وضع التركيز لمدة 5 دقائق', reward: 35 }
    ];
    
    this.data.dailyChallenge = {
      ...challenges[Math.floor(Math.random() * challenges.length)],
      date: new Date().toDateString(),
      completed: false
    };
    this.data.challengeCompleted = false;
    this.saveData();
  }

  completeChallenge() {
    if (this.data.challengeCompleted) return;
    
    const challenge = this.data.dailyChallenge;
    if (!challenge) return;
    
    this.data.points += challenge.reward;
    this.data.challengesCompleted++;
    this.data.challengeCompleted = true;
    this.data.dailyChallenge.completed = true;
    
    this.saveData();
    this.updateHUD();
    this.showToast(`🎯 تحدي مكتمل! +${challenge.reward} نقطة!`, 'success');
    this.spawnConfetti();
    
    // فحص الإنجازات
    if (this.data.challengesCompleted >= 5) this.award('challenger', 200);
  }

  // ═══════════════════════════════════════════════════════
  // 7. ZAKI EMOTIONAL (تفاعلات عاطفية)
  // ═══════════════════════════════════════════════════════
  reactToAction(action) {
    const reactions = {
      discover: ['واو! اكتشاف رائع! 🎉', 'أنا فخور فيك! ✨', 'ده إنجاز خرافي! 🚀'],
      share: ['نشرت المعرفة! 📢', 'صديقك هيفرح! 😊', 'انتشار الخير! 🌟'],
      streak: ['استمر! 🔥', 'ما شاء الله! 💪', 'أسطورة! 👑'],
      levelup: ['مستوى جديد! 🆙', 'تطورت! 🌟', 'خارق! 💎']
    };
    
    const msgs = reactions[action] || ['رائع! ✨'];
    const msg = msgs[Math.floor(Math.random() * msgs.length)];
    
    if (window.zaki) {
      window.zaki.say(msg);
    }
  }

  // ═══════════════════════════════════════════════════════
  // 8. MICRO-SATISFACTION (مؤثرات رضا مصغرة)
  // ═══════════════════════════════════════════════════════
  microSatisfy(element) {
    if (!element) return;
    
    // Ripple effect
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(0, 255, 136, 0.3);
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (rect.width / 2 - size / 2) + 'px';
    ripple.style.top = (rect.height / 2 - size / 2) + 'px';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    
    // Scale bounce
    element.style.transform = 'scale(0.95)';
    setTimeout(() => element.style.transform = '', 150);
  }

  // ═══════════════════════════════════════════════════════
  // 9. INSTANT CUSTOMIZATION (تخصيص فوري)
  // ═══════════════════════════════════════════════════════
  setupCustomization() {
    // تغيير الثيم
    const themes = {
      default: { primary: '#00ff88', secondary: '#ff6b9d' },
      ocean: { primary: '#00ccff', secondary: '#0066ff' },
      sunset: { primary: '#ff8c00', secondary: '#ff0066' },
      forest: { primary: '#00ff66', secondary: '#66ff00' }
    };
    
    // يمكن تفعيله من الإعدادات
    window.setTheme = (themeName) => {
      const theme = themes[themeName];
      if (!theme) return;
      
      document.documentElement.style.setProperty('--neon-green', theme.primary);
      document.documentElement.style.setProperty('--neon-pink', theme.secondary);
      this.data.theme = themeName;
      this.saveData();
      this.showToast(`🎨 ثيم ${themeName} مفعل!`, 'success');
    };
  }

  // ═══════════════════════════════════════════════════════
  // 10. PROGRESS BARS (أشرطة التقدم)
  // ═══════════════════════════════════════════════════════
  setupProgress() {
    this.updateLevel();
  }

  updateLevel() {
    const oldLevel = this.data.level;
    this.data.level = Math.floor(this.data.points / 500) + 1;
    
    if (this.data.level > oldLevel) {
      this.reactToAction('levelup');
      this.showToast(`🆙 مستوى ${this.data.level}! مبروك!`, 'success');
      this.spawnConfetti();
    }
    
    this.saveData();
  }

  // ═══════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════
  updateHUD() {
    const streakEl = document.getElementById('streak-value');
    const pointsEl = document.getElementById('points-value');
    const levelEl = document.getElementById('level-value');
    
    if (streakEl) streakEl.textContent = this.data.streak;
    if (pointsEl) pointsEl.textContent = this.data.points.toLocaleString();
    if (levelEl) levelEl.textContent = this.data.level;
  }

  award(achievementId, bonusPoints = 0) {
    if (this.data.achievements.includes(achievementId)) return;
    
    this.data.achievements.push(achievementId);
    this.data.points += bonusPoints;
    this.saveData();
    this.updateHUD();
    
    const achievements = this.knowledge.achievements || [];
    const ach = achievements.find(a => a.id === achievementId);
    const name = ach ? ach.name : achievementId;
    const icon = ach ? ach.icon : '🏆';
    
    this.showToast(`${icon} إنجاز جديد: ${name}! +${bonusPoints}`, 'success');
    this.spawnConfetti();
  }

  addPoints(amount, reason = '') {
    // فحص ضعف النقاط
    const doubleStart = localStorage.getItem('zaki-double-points');
    if (doubleStart && Date.now() - parseInt(doubleStart) < 86400000) {
      amount *= 2;
      reason += ' (×2)';
    }
    
    this.data.points += amount;
    this.updateLevel();
    this.saveData();
    this.updateHUD();
    
    if (reason) {
      this.showToast(`+${amount} نقطة ${reason}`, 'success');
    }
  }

  discoverTool(toolId) {
    if (!this.data.toolsDiscovered.includes(toolId)) {
      this.data.toolsDiscovered.push(toolId);
      this.addPoints(10, 'اكتشاف جديد');
      this.saveData();
      
      if (this.data.toolsDiscovered.length >= 10) this.award('explorer', 50);
      
      // فحص التحدي اليومي
      if (this.data.dailyChallenge?.id === 'dc1' && !this.data.challengeCompleted) {
        this.completeChallenge();
      }
    }
  }

  showToast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  spawnConfetti() {
    const colors = ['#00ff88', '#ff6b9d', '#00ccff', '#ffd700', '#b829dd'];
    for (let i = 0; i < 30; i++) {
      const c = document.createElement('div');
      c.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        left: 50%;
        top: 50%;
        pointer-events: none;
        z-index: 9999;
      `;
      
      const angle = (Math.PI * 2 * i) / 30;
      const velocity = 100 + Math.random() * 200;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity - 100;
      
      c.style.setProperty('--tx', tx + 'px');
      c.style.setProperty('--ty', ty + 'px');
      c.style.animation = `particleFly ${0.8 + Math.random() * 0.4}s ease-out forwards`;
      
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 1200);
    }
  }

  getRandomTip() {
    const tips = this.knowledge?.tips || ['استمر في الاستكشاف!'];
    return tips[Math.floor(Math.random() * tips.length)];
  }

  isNewDay(dateStr) {
    return dateStr !== new Date().toDateString();
  }
}

// Initialize
window.dopamine = new DopamineEngine();

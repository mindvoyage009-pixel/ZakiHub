/**
 * ═══════════════════════════════════════════════════════
 * ZAKI AI COMPANION ENGINE v3.0
 * ═══════════════════════════════════════════════════════
 * 
 * - شخصية ديناميكية تتغير حسب الوقت والمزاج
 * - ذاكرة محلية (localStorage) تتذكر المستخدم
 * - مضاد تكرار (لا يكرر نفس الرد مرتين متتاليتين)
 * - نظام نصائح ذكي
 * - تحليل مشاعر المستخدم من رسائله
 */

class ZakiEngine {
  constructor() {
    this.memory = this.loadMemory();
    this.knowledge = null;
    this.mood = 'happy';
    this.lastResponses = [];
    this.maxHistory = 5;
    this.init();
  }

  async init() {
    // جلب معرفة ذاكي
    try {
      const res = await fetch('/data/zaki-knowledge.json');
      this.knowledge = await res.json();
    } catch (e) {
      this.knowledge = this.getFallbackKnowledge();
    }

    this.updateMood();
    this.setupUI();
    this.greetUser();
    
    // تحديث المزاج كل 5 دقائق
    setInterval(() => this.updateMood(), 300000);
  }

  loadMemory() {
    const defaultMemory = {
      visits: 0,
      firstVisit: Date.now(),
      lastVisit: Date.now(),
      totalMessages: 0,
      favoriteCategory: null,
      achievements: [],
      avatar: '🤖',
      userName: null,
      streak: 0,
      lastStreakDate: null
    };
    
    try {
      const saved = localStorage.getItem('zaki-memory');
      return saved ? { ...defaultMemory, ...JSON.parse(saved) } : defaultMemory;
    } catch {
      return defaultMemory;
    }
  }

  saveMemory() {
    localStorage.setItem('zaki-memory', JSON.stringify(this.memory));
  }

  getFallbackKnowledge() {
    return {
      personality: {
        moods: {
          happy: ['أهلاً! 🎉', 'يوم سعيد! ✨'],
          supportive: ['أنا هنا! 💪', 'معاك خطوة بخطوة 🤗']
        }
      },
      greetings: {
        morning: ['صباح الخير! ☀️'],
        afternoon: ['مساء النور! 🌤️'],
        evening: ['مساء الخير! 🌙'],
        night: ['تصبح على خير! 🌌']
      },
      tips: ['💡 جرب أدوات جديدة كل يوم!']
    };
  }

  updateMood() {
    const moods = ['happy', 'curious', 'supportive', 'excited'];
    const hour = new Date().getHours();
    
    if (hour < 6) this.mood = 'supportive';
    else if (hour < 12) this.mood = 'happy';
    else if (hour < 18) this.mood = 'curious';
    else this.mood = 'excited';
    
    this.updateAvatar();
  }

  updateAvatar() {
    const avatarEl = document.getElementById('zaki-avatar');
    const moodEl = document.getElementById('zaki-mood');
    
    if (avatarEl) {
      avatarEl.textContent = this.memory.avatar;
      avatarEl.style.animation = 'none';
      avatarEl.offsetHeight; // trigger reflow
      avatarEl.style.animation = 'zakiFloat 3s ease-in-out infinite';
    }
    
    if (moodEl && this.knowledge) {
      const moods = this.knowledge.personality.moods[this.mood] || [];
      moodEl.textContent = this.getRandom(moods);
    }
  }

  getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  }

  greetUser() {
    this.memory.visits++;
    this.memory.lastVisit = Date.now();
    this.saveMemory();
    
    if (!this.knowledge) return;
    
    const timeOfDay = this.getTimeOfDay();
    const greetings = this.knowledge.greetings[timeOfDay] || ['أهلاً!'];
    const greeting = this.getRandom(greetings);
    
    // لو أول زيارة
    if (this.memory.visits === 1) {
      this.say(`أهلاً بيك في ZakiHub! 🧠\nأنا ذاكي، رفيقك في عالم AI.\nاسألني عن أي أداة وأنا أرشدك!`);
      return;
    }
    
    // لو رجوع بعد غياب
    const daysSince = Math.floor((Date.now() - this.memory.lastVisit) / 86400000);
    if (daysSince > 7) {
      this.say(`اشتقتلك! 😊 غبت ${daysSince} يوم. جرب أدوات جديدة كتير ظهرت!`);
      return;
    }
    
    this.say(`${greeting} زيارة رقم ${this.memory.visits}! 🎉`);
    
    // نصيحة عشوائية كل 3 زيارات
    if (this.memory.visits % 3 === 0) {
      setTimeout(() => this.giveTip(), 1500);
    }
  }

  giveTip() {
    if (!this.knowledge) return;
    const tip = this.getRandom(this.knowledge.tips);
    this.say(tip);
  }

  getRandom(arr) {
    if (!arr || arr.length === 0) return '';
    // مضاد تكرار: تجنب آخر 5 ردود
    let attempts = 0;
    let selected;
    do {
      selected = arr[Math.floor(Math.random() * arr.length)];
      attempts++;
    } while (this.lastResponses.includes(selected) && attempts < 10);
    
    this.lastResponses.push(selected);
    if (this.lastResponses.length > this.maxHistory) {
      this.lastResponses.shift();
    }
    return selected;
  }

  analyzeSentiment(text) {
    const positive = ['شكرا', 'ممتاز', 'رائع', 'حلو', 'عظيم', 'أحب', '❤️', '😍', '🔥'];
    const negative = ['سيء', 'مشكلة', 'خطأ', 'فاشل', '😠', '😢', '💔'];
    
    let score = 0;
    positive.forEach(w => { if (text.includes(w)) score++; });
    negative.forEach(w => { if (text.includes(w)) score--; });
    
    return score;
  }

  processMessage(text) {
    this.memory.totalMessages++;
    this.saveMemory();
    
    const sentiment = this.analyzeSentiment(text);
    const lower = text.toLowerCase();
    
    // ردود على كلمات مفتاحية
    if (lower.includes('مرحبا') || lower.includes('أهلا')) {
      return this.getRandom(this.knowledge.greetings[this.getTimeOfDay()]);
    }
    
    if (lower.includes('شكرا') || lower.includes('thanks')) {
      const responses = ['العفو! 🌟', 'في خدمتك دائماً! 💚', 'ده واجب! 😊'];
      return this.getRandom(responses);
    }
    
    if (lower.includes('مجاني') || lower.includes('free')) {
      return 'أفضل الأدوات المجانية: Stable Diffusion, Hugging Face, و Descript (نسخته المجانية). جربهم! 🆓';
    }
    
    if (lower.includes('برمجة') || lower.includes('code')) {
      return 'للبرمجة: GitHub Copilot و Cursor هما الأفضل. Cursor مجاني جزئياً وبيفهم مشروعك كامل! 💻';
    }
    
    if (lower.includes('صور') || lower.includes('image')) {
      return 'للصور: Midjourney للجودة السينمائية، و Leonardo AI للألعاب. Stable Diffusion مجاني تماماً! 🎨';
    }
    
    if (lower.includes('فيديو') || lower.includes('video')) {
      return 'لفيديو: Runway ML للتأثيرات السينمائية، و HeyGen للأفاتار المتحدث. جربهم! 🎬';
    }
    
    if (lower.includes('صوت') || lower.includes('voice')) {
      return 'للصوت: ElevenLabs أطبيعي صوت بشري 100%. Suno AI يولد موسيقى كاملة! 🎵';
    }
    
    if (lower.includes('نصائح') || lower.includes('نصيحة')) {
      this.giveTip();
      return null;
    }
    
    if (lower.includes('مستواي') || lower.includes('نقاطي')) {
      const points = localStorage.getItem('zaki-points') || 0;
      const level = Math.floor(points / 500) + 1;
      return `عندك ${points} نقطة! 🏆 مستواك: ${level}. كمل عشان تفتح مكافآت جديدة!`;
    }
    
    if (lower.includes('تحدي') || lower.includes('challenge')) {
      return 'تحدي اليوم: اكتشف 3 أدوات في فئة جديدة! هتكسب 100 نقطة إضافية! 🎯';
    }
    
    // ردود عامة حسب المشاعر
    if (sentiment > 0) {
      const happy = ['مبسوط إنك مبسوط! 🎉', 'ده اللي بنحبه! 🔥', 'كمل! أنت أسطورة! 💪'];
      return this.getRandom(happy);
    }
    
    if (sentiment < 0) {
      const supportive = ['متقلقش، أنا معاك! 💚', 'كل شيء بيتحسن! 🌟', 'خد نفس عميق وجرب تاني! 🤗'];
      return this.getRandom(supportive);
    }
    
    // رد افتراضي
    const defaults = [
      'ممكن توضح أكتر؟ 🤔',
      'شيقة! قولي تبي أداة في مجال معين؟ 🎯',
      'جرب تكتب "مجاني" أو "برمجة" أو "صور" 🛠️',
      'أنا هنا أساعدك! اسأل عن أي أداة 💡'
    ];
    return this.getRandom(defaults);
  }

  say(text, type = 'zaki') {
    const chat = document.getElementById('zaki-chat');
    if (!chat) return;
    
    const msg = document.createElement('div');
    msg.className = `chat-message ${type}`;
    msg.textContent = text;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
    
    // تأثير صوتي بصري
    this.spawnParticles(msg);
  }

  spawnParticles(element) {
    const rect = element.getBoundingClientRect();
    for (let i = 0; i < 5; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.textContent = ['✨', '💫', '⭐', '💚', '💎'][Math.floor(Math.random() * 5)];
      p.style.left = rect.left + rect.width / 2 + 'px';
      p.style.top = rect.top + 'px';
      p.style.fontSize = '14px';
      p.style.setProperty('--tx', (Math.random() - 0.5) * 100 + 'px');
      p.style.setProperty('--ty', -Math.random() * 100 + 'px');
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1000);
    }
  }

  setupUI() {
    // فتح/قفل البانل
    const toggle = document.getElementById('zaki-toggle');
    const panel = document.getElementById('zaki-panel');
    const close = document.getElementById('zaki-close');
    
    if (toggle && panel) {
      toggle.addEventListener('click', () => {
        panel.classList.toggle('open');
        if (panel.classList.contains('open')) {
          document.getElementById('zaki-input')?.focus();
        }
      });
    }
    
    if (close && panel) {
      close.addEventListener('click', () => panel.classList.remove('open'));
    }
    
    // إرسال رسالة
    const input = document.getElementById('zaki-input');
    const send = document.getElementById('zaki-send');
    
    const sendMessage = () => {
      const text = input?.value.trim();
      if (!text) return;
      
      this.say(text, 'user');
      input.value = '';
      
      // كتابة...
      setTimeout(() => {
        const response = this.processMessage(text);
        if (response) this.say(response);
      }, 500 + Math.random() * 500);
    };
    
    send?.addEventListener('click', sendMessage);
    input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
    
    // تغيير الأفاتار
    const avatarEl = document.getElementById('zaki-avatar');
    if (avatarEl && this.knowledge) {
      const avatars = this.knowledge.personality.avatarVariants || ['🤖'];
      let idx = avatars.indexOf(this.memory.avatar);
      if (idx === -1) idx = 0;
      
      avatarEl.style.cursor = 'pointer';
      avatarEl.title = 'اضغط لتغيير شكل ذاكي';
      avatarEl.addEventListener('click', () => {
        idx = (idx + 1) % avatars.length;
        this.memory.avatar = avatars[idx];
        this.saveMemory();
        this.updateAvatar();
        this.say('شكل جديد! أعجبك؟ ✨');
      });
    }
  }
}

// Initialize
window.zaki = new ZakiEngine();

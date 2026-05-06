/**
 * ═══════════════════════════════════════════════════════
 * ZAKI AI COMPANION ENGINE v3.0 - ENGLISH EDITION
 * ═══════════════════════════════════════════════════════
 * 
 * - Dynamic personality that changes based on time and mood
 * - Local memory (localStorage) that remembers the user
 * - Anti-repetition (never repeats the same response twice)
 * - Smart tips system
 * - User sentiment analysis from messages
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
    try {
      const res = await fetch('/data/zaki-knowledge.json');
      this.knowledge = await res.json();
    } catch (e) {
      this.knowledge = this.getFallbackKnowledge();
    }

    this.updateMood();
    this.setupUI();
    this.greetUser();
    
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
          happy: ['Hello! 🎉', 'Great day! ✨'],
          supportive: ['I\'m here! 💪', 'With you step by step 🤗']
        }
      },
      greetings: {
        morning: ['Good morning! ☀️'],
        afternoon: ['Good afternoon! 🌤️'],
        evening: ['Good evening! 🌙'],
        night: ['Good night! 🌌']
      },
      tips: ['💡 Try discovering new tools every day!']
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
      avatarEl.offsetHeight;
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
    const greetings = this.knowledge.greetings[timeOfDay] || ['Hello!'];
    const greeting = this.getRandom(greetings);
    
    if (this.memory.visits === 1) {
      this.say(`Welcome to ZakiHub! 🧠\nI'm Zaki, your companion in the AI world.\nAsk me about any tool and I'll guide you!`);
      return;
    }
    
    const daysSince = Math.floor((Date.now() - this.memory.lastVisit) / 86400000);
    if (daysSince > 7) {
      this.say(`Missed you! 😊 You were gone for ${daysSince} days. Tons of new tools appeared!`);
      return;
    }
    
    this.say(`${greeting} Visit #${this.memory.visits}! 🎉`);
    
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
    const positive = ['thanks', 'great', 'awesome', 'good', 'love', 'like', 'amazing', '❤️', '😍', '🔥', 'cool', 'nice', 'perfect'];
    const negative = ['bad', 'problem', 'error', 'fail', 'hate', 'suck', 'terrible', '😠', '😢', '💔', 'worst', 'broken'];
    
    let score = 0;
    const lower = text.toLowerCase();
    positive.forEach(w => { if (lower.includes(w)) score++; });
    negative.forEach(w => { if (lower.includes(w)) score--; });
    
    return score;
  }

  processMessage(text) {
    this.memory.totalMessages++;
    this.saveMemory();
    
    const sentiment = this.analyzeSentiment(text);
    const lower = text.toLowerCase();
    
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return this.getRandom(this.knowledge.greetings[this.getTimeOfDay()]);
    }
    
    if (lower.includes('thank') || lower.includes('thanks')) {
      const responses = ['You\'re welcome! 🌟', 'Always at your service! 💚', 'My pleasure! 😊'];
      return this.getRandom(responses);
    }
    
    if (lower.includes('free')) {
      return 'Best free tools: Stable Diffusion, Hugging Face, and Descript (free tier). Try them! 🆓';
    }
    
    if (lower.includes('code') || lower.includes('coding') || lower.includes('program')) {
      return 'For coding: GitHub Copilot and Cursor are the best. Cursor is partially free and understands your entire project! 💻';
    }
    
    if (lower.includes('image') || lower.includes('picture') || lower.includes('photo')) {
      return 'For images: Midjourney for cinematic quality, and Leonardo AI for games. Stable Diffusion is completely free! 🎨';
    }
    
    if (lower.includes('video') || lower.includes('movie')) {
      return 'For video: Runway ML for cinematic effects, and HeyGen for talking avatars. Try them! 🎬';
    }
    
    if (lower.includes('voice') || lower.includes('audio') || lower.includes('sound') || lower.includes('music')) {
      return 'For audio: ElevenLabs is 100% natural human voice. Suno AI generates full music! 🎵';
    }
    
    if (lower.includes('tip') || lower.includes('advice')) {
      this.giveTip();
      return null;
    }
    
    if (lower.includes('points') || lower.includes('level') || lower.includes('score')) {
      const points = localStorage.getItem('zaki-points') || 0;
      const level = Math.floor(points / 500) + 1;
      return `You have ${points} points! 🏆 Level: ${level}. Keep going to unlock new rewards!`;
    }
    
    if (lower.includes('challenge')) {
      return 'Today\'s challenge: Discover 3 tools in a new category! Earn 100 bonus points! 🎯';
    }
    
    if (sentiment > 0) {
      const happy = ['Glad you\'re happy! 🎉', 'That\'s what we love! 🔥', 'Keep going! You\'re a legend! 💪'];
      return this.getRandom(happy);
    }
    
    if (sentiment < 0) {
      const supportive = ['Don\'t worry, I\'m with you! 💚', 'Everything gets better! 🌟', 'Take a deep breath and try again! 🤗'];
      return this.getRandom(supportive);
    }
    
    const defaults = [
      'Can you clarify? 🤔',
      'Interesting! Tell me, want a tool in a specific field? 🎯',
      'Try typing "free" or "coding" or "images" 🛠️',
      'I\'m here to help! Ask about any tool 💡'
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
    
    const input = document.getElementById('zaki-input');
    const send = document.getElementById('zaki-send');
    
    const sendMessage = () => {
      const text = input?.value.trim();
      if (!text) return;
      
      this.say(text, 'user');
      input.value = '';
      
      setTimeout(() => {
        const response = this.processMessage(text);
        if (response) this.say(response);
      }, 500 + Math.random() * 500);
    };
    
    send?.addEventListener('click', sendMessage);
    input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
    
    const avatarEl = document.getElementById('zaki-avatar');
    if (avatarEl && this.knowledge) {
      const avatars = this.knowledge.personality.avatarVariants || ['🤖'];
      let idx = avatars.indexOf(this.memory.avatar);
      if (idx === -1) idx = 0;
      
      avatarEl.style.cursor = 'pointer';
      avatarEl.title = 'Click to change Zaki\'s look';
      avatarEl.addEventListener('click', () => {
        idx = (idx + 1) % avatars.length;
        this.memory.avatar = avatars[idx];
        this.saveMemory();
        this.updateAvatar();
        this.say('New look! Like it? ✨');
      });
    }
  }
}

window.zaki = new ZakiEngine();

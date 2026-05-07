// إدارة الحالة العامة
const AppState = {
  user: {
    points: 0,
    level: 1,
    streak: 0,
    achievements: [],
    completedChallenges: [],
    favoriteTools: []
  },
  settings: {
    notifications: true,
    darkMode: true,
    language: 'ar'
  }
};

// نظام التخزين المحلي
class StorageManager {
  static save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static get(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  static remove(key) {
    localStorage.removeItem(key);
  }

  static clear() {
    localStorage.clear();
  }
}

// نظام الإنجازات
class AchievementSystem {
  constructor() {
    this.achievements = [
      {
        id: 'first_discovery',
        name: 'المستكشف الأول',
        description: 'اكتشف أول أداة',
        icon: '🔍',
        points: 10,
        unlocked: false
      },
      {
        id: 'tool_master',
        name: 'سيد الأدوات',
        description: 'اكتشف 10 أدوات مختلفة',
        icon: '🏆',
        points: 50,
        unlocked: false
      },
      {
        id: 'daily_warrior',
        name: 'محارب يومي',
        description: 'أكمل تحدي يومي',
        icon: '⚔️',
        points: 25,
        unlocked: false
      },
      {
        id: 'week_streak',
        name: 'متوالي الأسبوع',
        description: 'حافظ على 7 أيام متتالية',
        icon: '🔥',
        points: 100,
        unlocked: false
      },
      {
        id: 'expert_level',
        name: 'خبير',
        description: 'اجمع 500 نقطة',
        icon: '⭐',
        points: 200,
        unlocked: false
      }
    ];
  }

  unlockAchievement(id) {
    const achievement = this.achievements.find(a => a.id === id);
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      AppState.user.points += achievement.points;
      AppState.user.achievements.push(id);
      this.showAchievementNotification(achievement);
      StorageManager.save('appState', AppState);
      return achievement;
    }
    return null;
  }

  showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-popup show" style="position: fixed; bottom: 30px; left: 30px;">
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-title">إنجاز جديد! 🎉</div>
        <div class="achievement-text">${achievement.name} - ${achievement.points} نقطة</div>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
  }

  getAchievements() {
    return this.achievements;
  }
}

// نظام التحديات
class ChallengeSystem {
  constructor() {
    this.challenges = [
      {
        id: 1,
        title: 'اكتشف أداة جديدة',
        description: 'استكشف واستخدم أداة لم تجربها من قبل',
        reward: 50,
        difficulty: 'سهل',
        icon: '🔍'
      },
      {
        id: 2,
        title: 'اتقن أداة واحدة',
        description: 'اقض ساعة كاملة في استخدام أداة واحدة',
        reward: 150,
        difficulty: 'متوسط',
        icon: '💪'
      },
      {
        id: 3,
        title: 'المجستير',
        description: 'استخدم 20 أداة مختلفة في أسبوع واحد',
        reward: 500,
        difficulty: 'صعب',
        icon: '👑'
      },
      {
        id: 4,
        title: 'محارب متسلسل',
        description: 'أكمل تحديات لمدة 5 أيام متتالية',
        reward: 300,
        difficulty: 'صعب',
        icon: '🔥'
      }
    ];
  }

  completeChallenge(id) {
    const challenge = this.challenges.find(c => c.id === id);
    if (challenge && !AppState.user.completedChallenges.includes(id)) {
      AppState.user.completedChallenges.push(id);
      AppState.user.points += challenge.reward;
      AppState.user.streak += 1;
      StorageManager.save('appState', AppState);
      return challenge;
    }
    return null;
  }

  getChallenges() {
    return this.challenges;
  }

  getDailyChallenge() {
    const today = new Date().toDateString();
    const seed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const index = seed % this.challenges.length;
    return this.challenges[index];
  }
}

// نظام الإشعارات
class NotificationSystem {
  static show(title, message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <h4>${title}</h4>
        <p>${message}</p>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
  }

  static success(title, message) {
    this.show(title, message, 'success');
  }

  static error(title, message) {
    this.show(title, message, 'error');
  }

  static info(title, message) {
    this.show(title, message, 'info');
  }
}

// نظام تتبع الأدوات المفضلة
class ToolManager {
  static addFavorite(toolName) {
    if (!AppState.user.favoriteTools.includes(toolName)) {
      AppState.user.favoriteTools.push(toolName);
      StorageManager.save('appState', AppState);
      return true;
    }
    return false;
  }

  static removeFavorite(toolName) {
    AppState.user.favoriteTools = AppState.user.favoriteTools.filter(t => t !== toolName);
    StorageManager.save('appState', AppState);
    return true;
  }

  static isFavorite(toolName) {
    return AppState.user.favoriteTools.includes(toolName);
  }

  static getFavorites() {
    return AppState.user.favoriteTools;
  }
}

// نظام Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('✅ Service Worker مسجل بنجاح');
    }).catch(err => {
      console.log('❌ خطأ في تسجيل Service Worker:', err);
    });
  });
}

// تهيئة التطبيق
function initializeApp() {
  // استرجاع البيانات المحفوظة
  const savedState = StorageManager.get('appState');
  if (savedState) {
    Object.assign(AppState, savedState);
  }

  // إنشاء الأنظمة
  window.achievements = new AchievementSystem();
  window.challenges = new ChallengeSystem();

  // تحديث واجهة المستخدم
  updateUI();

  // تسجيل الأحداث
  registerEventListeners();
}

function updateUI() {
  const pointsEl = document.getElementById('user-points');
  const levelEl = document.getElementById('user-level');
  const streakEl = document.getElementById('user-streak');

  if (pointsEl) pointsEl.textContent = AppState.user.points;
  if (levelEl) levelEl.textContent = AppState.user.level;
  if (streakEl) streakEl.textContent = AppState.user.streak;
}

function registerEventListeners() {
  // يمكن إضافة مستمعي الأحداث هنا
  document.addEventListener('toolDiscovered', (e) => {
    ToolManager.addFavorite(e.detail.toolName);
    window.achievements.unlockAchievement('first_discovery');
  });
}

// تحديث البيانات كل دقيقة
setInterval(() => {
  StorageManager.save('appState', AppState);
  updateUI();
}, 60000);

// تشغيل التطبيق
window.addEventListener('DOMContentLoaded', initializeApp);
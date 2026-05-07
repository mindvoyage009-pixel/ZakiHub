// نظام التحليلات البسيط
class AnalyticsSystem {
  constructor() {
    this.events = [];
    this.sessionStart = new Date();
  }

  trackEvent(eventName, eventData = {}) {
    const event = {
      name: eventName,
      timestamp: new Date(),
      data: eventData,
      sessionDuration: new Date() - this.sessionStart
    };
    this.events.push(event);
    this.saveEvents();
    console.log(`📊 حدث مسجل: ${eventName}`);
  }

  trackToolView(toolName) {
    this.trackEvent('tool_viewed', { tool: toolName });
  }

  trackChallengeCompleted(challengeId) {
    this.trackEvent('challenge_completed', { challengeId });
  }

  trackAchievementUnlocked(achievementId) {
    this.trackEvent('achievement_unlocked', { achievementId });
  }

  trackPageView(pageName) {
    this.trackEvent('page_view', { page: pageName });
  }

  saveEvents() {
    localStorage.setItem('analytics_events', JSON.stringify(this.events.slice(-100)));
  }

  getAnalytics() {
    return {
      totalEvents: this.events.length,
      sessionDuration: new Date() - this.sessionStart,
      events: this.events
    };
  }

  exportData() {
    return JSON.stringify(this.getAnalytics(), null, 2);
  }
}

// إنشاء نسخة عامة
window.analytics = new AnalyticsSystem();

// تتبع المشاهدات الأساسية
window.addEventListener('DOMContentLoaded', () => {
  analytics.trackPageView('home');
});
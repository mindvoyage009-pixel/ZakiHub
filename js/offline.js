// معالج العمل بدون إنترنت
class OfflineManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.setupListeners();
    this.syncQueue = [];
  }

  setupListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.showStatus('عاد الاتصال بالإنترنت ✅', 'success');
      this.syncData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.showStatus('لا يوجد اتصال إنترنت 📴', 'warning');
    });
  }

  addToSyncQueue(action) {
    this.syncQueue.push(action);
    localStorage.setItem('syncQueue', JSON.stringify(this.syncQueue));
  }

  async syncData() {
    const queue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
    for (const action of queue) {
      try {
        // محاولة مزامنة الإجراء
        await this.executeAction(action);
      } catch (error) {
        console.error('خطأ في المزامنة:', error);
      }
    }
    localStorage.setItem('syncQueue', JSON.stringify([]));
  }

  async executeAction(action) {
    // يمكن تطوير نظام المزامنة هنا
    return new Promise(resolve => resolve(true));
  }

  showStatus(message, type = 'info') {
    const status = document.createElement('div');
    status.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : '#f59e0b'};
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      z-index: 9999;
      animation: slideInRight 0.3s ease;
    `;
    status.textContent = message;
    document.body.appendChild(status);
    setTimeout(() => status.remove(), 3000);
  }
}

window.offlineManager = new OfflineManager();
# 🚀 ZakiHub v3.0 - Monetized Edition

> منصة دليل أدوات الذكاء الاصطناعي مع نظام إعلانات متكامل للربح 💰

## 📦 الملفات

| الملف | الوصف |
|-------|-------|
| `index.html` | الصفحة الرئيسية مع الإعلانات |
| `styles.css` | التصميم + أماكن الإعلانات |
| `script.js` | JavaScript + محرك الإعلانات |
| `game.html` | لعبة Zaki's Tool Run |
| `admin.html` | لوحة التحكم المحلية |
| `blog.html` | المدونة مع 6 مقالات SEO |
| `404.html` | صفحة الخطأ |
| `manifest.json` | إعدادات PWA |
| `service-worker.js` | Service Worker للـ Offline |
| `favicon.svg` | الأيقونة |

## 💰 نظام الإعلانات المدمج

### الإعلانات النشطة:
1. **Popunder** - يفتح عند أول نقرة
2. **Social Bar** - يظهر بعد 3 ثواني
3. **Native Banner** - بين الأدوات (كل 3 أدوات)
4. **Banner 728x90** - أعلى الصفحة
5. **Banner 300x250** - بين الأقسام
6. **Banner 468x60** - في الفوتر
7. **Banner 160x600** - Sidebar (Desktop)
8. **Banner 160x300** - Sidebar (Desktop)
9. **Banner 320x50** - Mobile Sticky
10. **Smartlink** - على أزرار CTA (30% chance)
11. **Interstitial** - أول زيارة فقط

## 🚀 خطوات النشر

### 1. رفع على GitHub Pages
```bash
# أنشئ repo جديد
# ارفع كل الملفات
# فعّل GitHub Pages من Settings
```

### 2. أو استخدم Netlify/Vercel
```bash
# اسحب وأسقط المجلد
# أو اربط بـ GitHub repo
```

## ⚡ تخصيص الإعلانات

### تغيير أكواد الإعلانات:
افتح `script.js` وابحث عن:
- `loadBanner('KEY', ...)` - غير الـ KEY
- `goSmartlink()` - غير الرابط
- `triggerPopunder()` - غير الـ script src
- `loadSocialBar()` - غير الـ script src

### إضافة إعلانات Google AdSense:
1. سجل في [Google AdSense](https://google.com/adsense)
2. احصل على كود الإعلان
3. ضعه في أي `div` بـ class `ad-container`

## 📊 توقعات الربح

| الزيارات/يوم | تقدير الدخل/يوم |
|-------------|----------------|
| 1,000 | $2 - $5 |
| 5,000 | $10 - $25 |
| 10,000 | $25 - $60 |
| 50,000 | $150 - $400 |

*التقديرات تقريبية وتعتمد على دولة الزوار*

## 🔧 تخصيص الموقع

### تغيير الاسم:
ابحث عن "ZakiHub" في `index.html` واستبدله

### تغيير الألوان:
عدل المتغيرات في `styles.css`:
```css
:root {
  --primary: #00d4ff;
  --secondary: #a78bfa;
  --accent: #f97316;
}
```

### إضافة أدوات:
افتح `script.js` وأضف في مصفوفة `tools`:
```js
{ name: 'اسم الأداة', desc: 'الوصف', category: 'writing', emoji: '🤖' }
```

## 📱 PWA

- قابل للتثبيت كتطبيق
- يعمل Offline
- أيقونة على الشاشة الرئيسية

## ⚠️ ملاحظات مهمة

1. **لا تضغط على إعلاناتك بنفسك** - Google يحظر ذلك
2. **محتوى أصلي** - ضروري لموافقة AdSense
3. **ترافيك حقيقي** - لا تستخدم بوتات
4. **SEO** - اكتب مقالات عن أدوات AI لجلب زوار

## 📄 الترخيص

MIT License - استخدم كما تشاء 💪

---

**تم التحديث**: 2026-05-07
**الإصدار**: v3.0 Monetized

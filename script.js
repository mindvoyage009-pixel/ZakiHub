// ═══════════════════════════════════════════════════════
// ZAKIHUB CORE ENGINE v3.0
// ═══════════════════════════════════════════════════════

const tools = [
    { name: 'ChatGPT', desc: 'نموذج لغة متقدم للحوار والإجابة على الأسئلة', category: 'writing', emoji: '🤖' },
    { name: 'Midjourney', desc: 'توليد الصور من النصوص بجودة احترافية', category: 'design', emoji: '🎨' },
    { name: 'GitHub Copilot', desc: 'مساعد برمجة ذكي يكتب الكود معك', category: 'code', emoji: '💻' },
    { name: 'DALL-E 3', desc: 'أداة متقدمة لإنشاء صور من الأوصاف النصية', category: 'design', emoji: '🖼️' },
    { name: 'Runway ML', desc: 'أداة متقدمة لتحرير وإنشاء الفيديوهات بالذكاء الاصطناعي', category: 'video', emoji: '🎬' },
    { name: 'Synthesia', desc: 'إنشاء فيديوهات بسرعة مع شخصيات افتراضية', category: 'video', emoji: '📹' },
    { name: 'Jasper', desc: 'أداة كتابة محتوى ذكية للمسوقين والكتاب', category: 'writing', emoji: '✍️' },
    { name: 'Grammarly', desc: 'تحسين الكتابة والنحو بذكاء اصطناعي', category: 'writing', emoji: '📝' },
    { name: 'Descript', desc: 'تحرير الفيديو والتسجيلات الصوتية بالنصوص', category: 'video', emoji: '🎙️' },
    { name: 'ElevenLabs', desc: 'تحويل النصوص إلى صوت احترافي متعدد اللغات', category: 'audio', emoji: '🔊' },
    { name: 'Murf AI', desc: 'إنشاء صوت طبيعي من النصوص', category: 'audio', emoji: '🎵' },
    { name: 'Claude', desc: 'نموذج ذكاء اصطناعي متقدم للكتابة والتحليل', category: 'writing', emoji: '📚' },
];

function createStars() {
    const starsContainer = document.getElementById('stars');
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = Math.random() * 2 + 'px';
        star.style.height = star.style.width;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDuration = Math.random() * 3 + 2 + 's';
        star.style.animationDelay = Math.random() * 2 + 's';
        starsContainer.appendChild(star);
    }
}

function displayTools(filter) {
    const toolsGrid = document.getElementById('toolsGrid');
    toolsGrid.innerHTML = '';
    const filtered = filter === 'all' ? tools : tools.filter(t => t.category === filter);
    filtered.forEach((tool, index) => {
        const toolCard = document.createElement('div');
        toolCard.className = 'tool-card';
        toolCard.style.animationDelay = (index * 0.05) + 's';
        toolCard.innerHTML = `
            <div style="font-size: 2em; margin-bottom: 10px;">${tool.emoji}</div>
            <div class="tool-name">${tool.name}</div>
            <div class="tool-desc">${tool.desc}</div>
            <button class="btn-primary" style="margin-top: 15px; width: 100%; padding: 8px;" onclick="visitTool('${tool.name}')">تفاصيل</button>
        `;
        toolsGrid.appendChild(toolCard);
    });
}

function filterTools(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    displayTools(category);
}

function scrollToTools() {
    document.getElementById('tools').scrollIntoView({ behavior: 'smooth' });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', () => {
    const scrollIndicator = document.getElementById('scrollIndicator');
    if (window.scrollY > 500) {
        scrollIndicator.classList.add('show');
    } else {
        scrollIndicator.classList.remove('show');
    }
});

function completeChallenge() {
    showAchievement('تحدي مكتمل!', 'لقد أكملت التحدي اليومي وحصلت على 50 نقطة! 🎉');
    const progressFill = document.getElementById('progressFill');
    progressFill.style.width = '100%';
    document.getElementById('progressText').textContent = 'تقدمك: 100% ✅';
}

function showAchievement(title, text) {
    const popup = document.getElementById('achievementPopup');
    document.getElementById('achievementTitle').textContent = title;
    document.getElementById('achievementText').textContent = text;
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 5000);
}

function showNotification() {
    showAchievement('معلومة مهمة', 'ZakiHub يتحدث يومياً عن أدوات جديدة ومثيرة!');
}

function visitTool(toolName) {
    showAchievement('قريباً! ⏳', `سيتم فتح صفحة ${toolName} قريباً جداً`);
}

// ═══════════════════════════════════════════════════════
// ADS & MONETIZATION ENGINE - MAX REVENUE
// ═══════════════════════════════════════════════════════

// ─── Smartlink Handler ───
function goSmartlink() {
    window.open('https://www.profitablecpmratenetwork.com/jq0pcdxf?key=be341c6dcba5c5cd299858b0271bbbe6', '_blank');
}

// ─── Attach smartlink to tool detail buttons ───
function attachSmartlinks() {
    document.querySelectorAll('.btn-tool, .tool-card button').forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (Math.random() < 0.30) {
                goSmartlink();
            }
        });
    });
}

// ─── Native Banner Injector (In-feed) ───
function injectNativeAds() {
    const grid = document.getElementById('toolsGrid');
    if (!grid) return;
    const cards = grid.querySelectorAll('.tool-card');
    [2, 6, 10].forEach((idx, i) => {
        if (cards[idx]) {
            const adDiv = document.createElement('div');
            adDiv.className = 'tool-card ad-infeed';
            adDiv.style.cssText = 'display:flex;align-items:center;justify-content:center;min-height:250px;background:rgba(0,212,255,0.03);border:1px dashed rgba(0,212,255,0.3);';
            adDiv.innerHTML = '<div style="color:var(--muted);font-size:0.8em;">إعلان</div>';
            cards[idx].after(adDiv);
            // Load native script
            const ns = document.createElement('script');
            ns.async = true;
            ns.setAttribute('data-cfasync', 'false');
            ns.src = 'https://pl29343492.profitablecpmratenetwork.com/2dd3e1bbf97c4c9ff588286aa0579fd8/invoke.js';
            adDiv.appendChild(ns);
        }
    });
}

// ─── Popunder Trigger (once per session) ───
function triggerPopunder() {
    if (!sessionStorage.getItem('popunderFired')) {
        sessionStorage.setItem('popunderFired', '1');
        const pu = document.createElement('script');
        pu.src = 'https://pl29343187.profitablecpmratenetwork.com/e0/fb/03/e0fb0368da611542da976cbf9a2d59c5.js';
        document.body.appendChild(pu);
    }
}

// ─── Social Bar Loader ───
function loadSocialBar() {
    const sb = document.createElement('script');
    sb.src = 'https://pl29343495.profitablecpmratenetwork.com/cc/4f/d3/cc4fd3a658121f3e0c7c0dd88998176a.js';
    document.body.appendChild(sb);
}

// ─── Banner Loaders by ID ───
function loadBanner(key, containerId, width, height) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const script1 = document.createElement('script');
    script1.type = 'text/javascript';
    script1.text = "atOptions = {'key': '" + key + "','format': 'iframe','height': " + height + ",'width': " + width + ",'params': {}};";
    container.appendChild(script1);
    const script2 = document.createElement('script');
    script2.type = 'text/javascript';
    script2.src = 'https://www.highperformanceformat.com/' + key + '/invoke.js';
    container.appendChild(script2);
}

// ─── Interstitial on page load ───
function loadInterstitial() {
    const inter = document.createElement('script');
    inter.type = 'text/javascript';
    inter.text = "atOptions = {'key': 'e68c05c95fb7752495fe2cf1a9dfdcd6','format': 'iframe','height': 250,'width': 300,'params': {}};";
    const inter2 = document.createElement('script');
    inter2.type = 'text/javascript';
    inter2.src = 'https://www.highperformanceformat.com/e68c05c95fb7752495fe2cf1a9dfdcd6/invoke.js';
    const overlay = document.createElement('div');
    overlay.id = 'interstitial-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:20px;';
    overlay.innerHTML = '<div style="color:var(--light);font-size:1.2em;">جاري التحميل...</div><button onclick="document.getElementById('interstitial-overlay').remove()" style="padding:10px 30px;background:var(--primary);border:none;border-radius:50px;color:var(--dark);font-weight:700;cursor:pointer;">تخطي الإعلان</button>';
    overlay.appendChild(inter);
    overlay.appendChild(inter2);
    document.body.appendChild(overlay);
    setTimeout(() => { const o = document.getElementById('interstitial-overlay'); if(o) o.remove(); }, 8000);
}

// ─── Initialize all ads on DOM ready ───
document.addEventListener('DOMContentLoaded', function() {
    createStars();
    displayTools('all');

    // Load banners
    loadBanner('bad51f87ef80d0eb81cd43d40e5401c2', 'ad-728x90', 728, 90);
    loadBanner('e68c05c95fb7752495fe2cf1a9dfdcd6', 'ad-300x250', 300, 250);
    loadBanner('6b241b3fe5278cdfa489ac924e4b78fb', 'ad-468x60', 468, 60);
    loadBanner('96531542723fc03951c9f6652c893e96', 'ad-160x300', 160, 300);
    loadBanner('1967414f203476ae35465a7608d8429e', 'ad-160x600', 160, 600);
    loadBanner('35078bd6fffc731bff0380b63ecf8132', 'ad-320x50', 320, 50);

    // Inject native ads
    injectNativeAds();

    // Attach smartlinks
    attachSmartlinks();

    // Popunder on first click
    document.addEventListener('click', function() {
        triggerPopunder();
    }, { once: true });

    // Social bar after 3 seconds
    setTimeout(loadSocialBar, 3000);

    // Interstitial after 5 seconds (first visit only)
    if (!localStorage.getItem('interstitialShown')) {
        localStorage.setItem('interstitialShown', '1');
        setTimeout(loadInterstitial, 5000);
    }
});

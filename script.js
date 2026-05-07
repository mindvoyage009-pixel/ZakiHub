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
// Initialize on DOM Ready
// ═══════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
    createStars();
    displayTools('all');
});
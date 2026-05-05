/**
 * ═══════════════════════════════════════════════════════
 * ZAKIHUB VALIDATION GATE v3.0
 * ═══════════════════════════════════════════════════════
 * 
 * يفحص البيانات قبل النشر. لو فيه خطأ خطير، يمنع النشر.
 * SELF-HEALING: يكتب تقرير مفصل ويسترجع من cache لو لزم الأمر.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');

const RULES = {
  minTools: 5,        // على الأقل 5 أدوات
  maxTools: 10000,    // على الأكثر 10000
  requiredFields: ['id', 'name', 'category', 'description', 'url', 'rating'],
  validRatings: { min: 0, max: 5 },
  validPricing: ['Free', 'Freemium', 'Paid', 'Enterprise']
};

const ERRORS = [];
const WARNINGS = [];

function fail(msg) {
  ERRORS.push(`❌ ${msg}`);
}

function warn(msg) {
  WARNINGS.push(`⚠️ ${msg}`);
}

async function validate() {
  console.log("🔍 بدء فحص البيانات (Validation Gate)...");
  console.log("═══════════════════════════════════════");
  
  let data;
  
  // ─── الخطوة 1: التأكد من وجود الملف ───
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, 'tools.json'), 'utf8');
    data = JSON.parse(raw);
    console.log("✅ الملف موجود وصالح JSON");
  } catch (e) {
    fail(`ملف tools.json تالف أو مفقود: ${e.message}`);
    console.log("🛡️ SELF-HEALING: محاولة استرجاع من cache...");
    
    try {
      const cacheRaw = await fs.readFile(path.join(DATA_DIR, 'cache.json'), 'utf8');
      data = JSON.parse(cacheRaw);
      console.log("✅ تم الاسترجاع من cache.json");
    } catch (ce) {
      fail(`cache.json أيضاً تالف: ${ce.message}`);
      data = { tools: [] };
    }
  }
  
  // ─── الخطوة 2: فحص الهيكل ───
  if (!data.tools || !Array.isArray(data.tools)) {
    fail("البنية: 'tools' يجب أن يكون مصفوفة");
    return false;
  }
  
  const { tools } = data;
  
  // ─── الخطوة 3: فحص العدد ───
  if (tools.length < RULES.minTools) {
    fail(`عدد الأدوات (${tools.length}) أقل من الحد الأدنى (${RULES.minTools})`);
  }
  if (tools.length > RULES.maxTools) {
    fail(`عدد الأدوات (${tools.length}) أكبر من الحد الأقصى (${RULES.maxTools})`);
  }
  
  console.log(`📊 عدد الأدوات: ${tools.length}`);
  
  // ─── الخطوة 4: فحص كل أداة ───
  const ids = new Set();
  let validTools = 0;
  
  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];
    const prefix = `أداة #${i + 1} (${tool.id || 'unknown'})`;
    
    // حقول مطلوبة
    for (const field of RULES.requiredFields) {
      if (!tool[field] || tool[field] === '') {
        fail(`${prefix}: الحقل '${field}' مفقود أو فارغ`);
      }
    }
    
    // تكرار ID
    if (tool.id) {
      if (ids.has(tool.id)) {
        fail(`${prefix}: ID '${tool.id}' مكرر`);
      }
      ids.add(tool.id);
    }
    
    // Rating صالح
    if (tool.rating !== undefined) {
      const r = parseFloat(tool.rating);
      if (isNaN(r) || r < RULES.validRatings.min || r > RULES.validRatings.max) {
        fail(`${prefix}: التقييم ${tool.rating} غير صالح (يجب 0-5)`);
      }
    }
    
    // Pricing صالح
    if (tool.pricing && !RULES.validPricing.includes(tool.pricing)) {
      warn(`${prefix}: pricing '${tool.pricing}' غير معروف`);
    }
    
    // URL صالح
    if (tool.url) {
      try {
        new URL(tool.url);
      } catch {
        warn(`${prefix}: URL '${tool.url}' غير صالح`);
      }
    }
    
    // Schema.org صالح
    if (tool.schema) {
      if (!tool.schema['@type']) {
        warn(`${prefix}: schema يفتقر '@type'`);
      }
    }
    
    validTools++;
  }
  
  // ─── الخطوة 5: فحص التصنيفات ───
  const categories = [...new Set(tools.map(t => t.category).filter(Boolean))];
  if (categories.length === 0) {
    fail("لا توجد تصنيفات صالحة");
  }
  console.log(`📂 التصنيفات: ${categories.join(', ')}`);
  
  // ─── الخطوة 6: التقرير النهائي ───
  console.log("═══════════════════════════════════════");
  console.log(`📋 التقرير:`);
  console.log(`   ✅ أدوات صالحة: ${validTools}/${tools.length}`);
  console.log(`   ⚠️ تحذيرات: ${WARNINGS.length}`);
  console.log(`   ❌ أخطاء: ${ERRORS.length}`);
  
  if (WARNINGS.length > 0) {
    console.log("\n⚠️ التحذيرات:");
    WARNINGS.forEach(w => console.log(`   ${w}`));
  }
  
  if (ERRORS.length > 0) {
    console.log("\n❌ الأخطاء:");
    ERRORS.forEach(e => console.log(`   ${e}`));
    console.log("\n🚫 VALIDATION FAILED - النشر متوقف");
    return false;
  }
  
  console.log("\n✅ VALIDATION PASSED - جاهز للنشر!");
  return true;
}

// Run
validate().then(passed => {
  if (!passed) process.exit(1);
}).catch(err => {
  console.error("❌ فشل غير متوقع:", err);
  process.exit(1);
});

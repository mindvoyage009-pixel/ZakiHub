/**
 * ═══════════════════════════════════════════════════════
 * ZAKIHUB SEO GENERATOR v3.0
 * ═══════════════════════════════════════════════════════
 * 
 * يولد تلقائياً:
 * - sitemap.xml (للفهارس)
 * - robots.txt (للزحف)
 * - schema.org JSON-LD (للـ rich snippets)
 * - meta tags data (للصفحات)
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const SITE_URL = 'https://zakihub.eu.org';

async function generate() {
  console.log("🏗️ بدء توليد ملفات SEO...");
  
  let data;
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, 'tools.json'), 'utf8');
    data = JSON.parse(raw);
  } catch (e) {
    console.error("❌ فشل قراءة tools.json:", e.message);
    return;
  }
  
  const { tools, categories } = data;
  
  // ═══════════════════════════════════════════════════════
  // 1. robots.txt
  // ═══════════════════════════════════════════════════════
  const robots = `User-agent: *
Allow: /
Disallow: /admin.html
Disallow: /game.html

Sitemap: ${SITE_URL}/sitemap.xml

# ZakiHub - AI Tools Directory
# Crawl-delay: 1
`;
  
  await fs.writeFile(path.join(PUBLIC_DIR, 'robots.txt'), robots);
  console.log("✅ robots.txt");
  
  // ═══════════════════════════════════════════════════════
  // 2. sitemap.xml
  // ═══════════════════════════════════════════════════════
  const today = new Date().toISOString().split('T')[0];
  
  let sitemapUrls = [
    { loc: SITE_URL, priority: '1.0', changefreq: 'daily' },
    { loc: `${SITE_URL}/game/`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${SITE_URL}/about/`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${SITE_URL}/privacy/`, priority: '0.3', changefreq: 'yearly' }
  ];
  
  // صفحات التصنيفات
  categories.forEach(cat => {
    const slug = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    sitemapUrls.push({
      loc: `${SITE_URL}/tools/${slug}/`,
      priority: '0.9',
      changefreq: 'daily'
    });
  });
  
  // صفحات الأدوات
  tools.forEach(tool => {
    sitemapUrls.push({
      loc: `${SITE_URL}/tools/${tool.id}/`,
      priority: '0.7',
      changefreq: 'weekly'
    });
  });
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  await fs.writeFile(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
  console.log(`✅ sitemap.xml (${sitemapUrls.length} URL)`);
  
  // ═══════════════════════════════════════════════════════
  // 3. JSON-LD Knowledge Graph
  // ═══════════════════════════════════════════════════════
  const knowledgeGraph = {
    "@context": "https://schema.org",
    "@graph": [
      // الموقع كـ Organization
      {
        "@type": "Organization",
        "@id": `${SITE_URL}#organization`,
        name: "ZakiHub",
        alternateName: "ذاكي هاب",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/favicon.svg`
        },
        description: "أكبر دليل أدوات الذكاء الاصطناعي في العالم العربي",
        sameAs: [
          "https://github.com/zakihub"
        ]
      },
      // الصفحة الرئيسية
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        url: SITE_URL,
        name: "ZakiHub - دليل أدوات الذكاء الاصطناعي",
        publisher: { "@id": `${SITE_URL}#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      // FAQ Page
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "ما هو ZakiHub؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "ZakiHub هو دليل شامل لأدوات الذكاء الاصطناعي، يضم أكثر من 50 أداة مصنفة ومرتبة حسب الاستخدام."
            }
          },
          {
            "@type": "Question",
            name: "هل ZakiHub مجاني؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "نعم، ZakiHub مجاني 100% للأبد. لا يوجد اشتراكات أو رسوم مخفية."
            }
          },
          {
            "@type": "Question",
            name: "كيف يتم تحديث الأدوات؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "يتم التحديث تلقائياً كل 3 ساعات باستخدام أنظمة ذكية تجلب البيانات من مصادر موثوقة."
            }
          }
        ]
      }
    ]
  };
  
  await fs.writeFile(
    path.join(DATA_DIR, 'schema-knowledge.json'),
    JSON.stringify(knowledgeGraph, null, 2)
  );
  console.log("✅ schema-knowledge.json");
  
  // ═══════════════════════════════════════════════════════
  // 4. Tool Schemas (لكل أداة)
  // ═══════════════════════════════════════════════════════
  const toolSchemas = tools.map(tool => ({
    ...tool.schema,
    "@context": "https://schema.org",
    name: tool.name,
    description: tool.description,
    url: tool.url,
    image: tool.screenshot,
    applicationSubCategory: tool.category,
    featureList: tool.features?.join(', '),
    softwareVersion: "2026",
    author: { "@type": "Organization", name: tool.name.split(' ')[0] }
  }));
  
  await fs.writeFile(
    path.join(DATA_DIR, 'schema-tools.json'),
    JSON.stringify(toolSchemas, null, 2)
  );
  console.log(`✅ schema-tools.json (${toolSchemas.length} schema)`);
  
  // ═══════════════════════════════════════════════════════
  // 5. Meta Data for Pages
  // ═══════════════════════════════════════════════════════
  const metaData = {
    home: {
      title: "ZakiHub 🧠 | دليل أدوات الذكاء الاصطناعي الأكثر إبداعاً",
      description: "اكتشف أفضل 50+ أداة AI مجانية ومدفوعة. تصنيفات ذكية، مقارنات تفاعلية، وتحديات يومية. انضم لمليون مستخدم!",
      keywords: "أدوات AI, ذكاء اصطناعي, ChatGPT, Midjourney, دليل AI, أدوات مجانية",
      ogImage: `${SITE_URL}/og-image.jpg`
    },
    game: {
      title: "Zaki's Tool Run 3.0 🎮 | لعبة استكشاف أدوات AI",
      description: "استكشف عالم AI في لعبة مغامرة مثيرة. اجمع النقاط، اكسر الأرقام، واكتشف أدوات خارقة!",
      keywords: "لعبة AI, gamification, تحديات, نقاط, مكافآت"
    }
  };
  
  await fs.writeFile(
    path.join(DATA_DIR, 'meta.json'),
    JSON.stringify(meta, null, 2)
  );
  console.log("✅ meta.json");
  
  console.log("═══════════════════════════════════════");
  console.log("✅ اكتمل توليد SEO!");
}

generate().catch(err => {
  console.error("❌ فشل:", err);
  process.exit(1);
});

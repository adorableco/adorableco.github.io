/** @format */

const fs = require("fs");
const path = require("path");

const articlesDir = path.join(__dirname, "../articles");
const outputFile = path.join(__dirname, "../articles.json");

// articles 폴더의 모든 md 파일을 읽어서 정보를 추출
function parseFrontMatter(lines) {
  let meta = {};
  let i = 1;
  while (i < lines.length && lines[i].trim() !== "---") {
    const line = lines[i].trim();
    if (!line || line.startsWith("#")) {
      i++;
      continue;
    }
    // key: value 또는 key: "value"
    const match = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (match) {
      let key = match[1];
      let value = match[2];
      // 따옴표 제거
      value = value.replace(/^"|"$/g, "");
      // tags: [a, b, c] 형태 지원 (간단하게)
      if (value.startsWith("[") && value.endsWith("]")) {
        value = value
          .slice(1, -1)
          .split(",")
          .map((v) => v.trim().replace(/^"|"$/g, ""));
      }
      meta[key] = value;
    }
    i++;
  }
  return { meta, contentStartIndex: i + 1 };
}

const posts = fs
  .readdirSync(articlesDir)
  .filter((file) => file.endsWith(".md"))
  .map((file) => {
    const content = fs.readFileSync(path.join(articlesDir, file), "utf8");
    const lines = content.split("\n");

    let meta = {};
    let contentStartIndex = 0;
    if (lines[0].trim() === "---") {
      const result = parseFrontMatter(lines);
      meta = result.meta;
      contentStartIndex = result.contentStartIndex;
    }

    const title = meta.title ? String(meta.title) : "제목 없음";
    const tag = meta.tags
      ? Array.isArray(meta.tags)
        ? meta.tags.join(", ")
        : meta.tags
      : "General";
    const date = meta.lastmod || new Date().toISOString().slice(0, 10);

    // excerpt 추출 (본문 첫 문장)
    let excerpt = "";
    for (let i = contentStartIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (
        line &&
        !line.startsWith("#") &&
        !line.startsWith("!") &&
        !line.startsWith(">") &&
        !line.startsWith("---")
      ) {
        excerpt = line.replace(/[#*`_]/g, "").trim();
        break;
      }
    }
    if (excerpt.length > 50) {
      excerpt = excerpt.substring(0, 50) + "...더보기";
    }

    return {
      file: encodeURIComponent(file),
      title,
      date,
      tag,
      excerpt: excerpt || title,
      wordCount: content.split(/\s+/).length,
    };
  });

fs.writeFileSync(outputFile, JSON.stringify({ posts }, null, 2));
console.log("Posts generated successfully!");

// 추가: sitemap.xml 생성
const sitemapFile = path.join(__dirname, "../sitemap.xml");

const siteUrl = "https://adorableco.github.io/"; // 사이트 기본 URL

const sitemapHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

const sitemapFooter = `</urlset>`;

const sitemapUrls = posts
  .map((post, index) => {
    // posts 배열의 각 글에서 lastmod를 가져옴
    const lastmodDate = new Date(post.date);

    // ISO 8601 포맷으로 변환
    const lastmod = lastmodDate.toISOString();
    return `
  <url>
    <loc>${siteUrl}/blog.html?id=${index + 1}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
  })
  .join("");

const sitemapContent = `${sitemapHeader}${sitemapUrls}${sitemapFooter}`;

// sitemap.xml 파일로 저장
fs.writeFileSync(sitemapFile, sitemapContent.trim());
console.log("Sitemap generated successfully!");

const fs = require('fs');
const path = require('path');
const { marked, Renderer } = require('marked');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'source/_posts/20260624_黑客精神的延伸.md');
const outputDir = path.join(root, 'source/images/20260624_黑客精神的延伸');
const fragmentPath = path.join(outputDir, 'wechat-body-fragment.html');
const previewPath = path.join(outputDir, 'wechat-visual-preview.html');

let markdown = fs.readFileSync(source, 'utf8');
markdown = markdown
  .replace(/^---\n[\s\S]*?\n---\n/, '')
  .replace(/<!--\s*more\s*-->/g, '');

const escapeAttribute = (value) => String(value || '')
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const renderer = new Renderer();
let imageIndex = 0;

renderer.heading = function heading(token) {
  const text = this.parser.parseInline(token.tokens);

  if (token.depth === 1 && token.text === '黑客精神的延伸——读《生活黑客》') {
    return '';
  }

  if (token.depth === 1 && token.text === '序') {
    return '<section style="margin:30px 0 16px;padding-top:18px;border-top:1px solid #c8bda9;">'
      + '<p style="margin:0;color:#8b6a35;font-size:12px;line-height:1.5;letter-spacing:0.22em;font-weight:700;">序章 · 一次偶然的相遇</p>'
      + '</section>';
  }

  if (token.depth === 1) {
    return `<h2 style="margin:44px 0 20px;padding:18px 0 12px;border-top:4px solid #17243d;border-bottom:1px solid #a99d87;color:#17243d;font-size:25px;line-height:1.35;font-weight:800;letter-spacing:0.03em;">${text}</h2>`;
  }

  const number = {
    '他们到底在"黑"什么？': '01',
    '六类黑客，各有执念': '02',
    '每个方法都有副作用': '03',
    '黑客精神的落地': '04'
  }[token.text] || '•';

  return '<section style="margin:40px 0 18px;">'
    + `<p style="margin:0 0 7px;color:#b06f36;font-size:12px;line-height:1.5;font-weight:800;letter-spacing:0.18em;">SECTION ${number}</p>`
    + `<h2 style="margin:0;padding:0 0 11px;border-bottom:2px solid #17243d;color:#17243d;font-size:22px;line-height:1.45;font-weight:800;">${text}</h2>`
    + '</section>';
};

renderer.strong = function strong(token) {
  return `<strong style="color:#111827;font-weight:800;">${this.parser.parseInline(token.tokens)}</strong>`;
};

renderer.em = function em(token) {
  return `<em style="color:#735b39;font-style:normal;border-bottom:1px dotted #b89b6d;">${this.parser.parseInline(token.tokens)}</em>`;
};

renderer.image = function image(token) {
  const basename = path.basename(decodeURIComponent(token.href));
  return `<img src="${escapeAttribute(basename)}" alt="${escapeAttribute(token.text)}" style="display:block;width:100%;height:auto;margin:0;border-radius:2px;" />`;
};

renderer.paragraph = function paragraph(token) {
  const onlyImage = token.tokens.length === 1 && token.tokens[0].type === 'image';
  if (onlyImage) {
    imageIndex += 1;
    const image = this.parser.parseInline(token.tokens);
    const caption = escapeAttribute(token.tokens[0].text);
    const guide = imageIndex === 1
      ? '<section style="margin:26px 0 34px;padding:18px 17px 14px;background:#17243d;border-radius:3px;">'
        + '<p style="margin:0 0 13px;color:#d6a869;font-size:12px;line-height:1.5;font-weight:800;letter-spacing:0.18em;">阅读路线</p>'
        + '<p style="margin:0;color:#f7f1e5;font-size:14px;line-height:1.9;text-align:left;">'
        + '<span style="white-space:nowrap;">掌控系统</span>　→　'
        + '<span style="white-space:nowrap;">六种执念</span>　→　'
        + '<span style="white-space:nowrap;">优化副作用</span>　→　'
        + '<span style="white-space:nowrap;">AI 自主循环</span>　→　'
        + '<span style="white-space:nowrap;">不可优化的生活</span>'
        + '</p></section>'
      : '';

    return '<figure style="margin:26px 0 9px;padding:7px;background:#ffffff;border:1px solid #d7cdbb;box-shadow:0 8px 22px rgba(24,36,61,0.08);">'
      + image
      + `<figcaption style="margin:8px 2px 2px;color:#7b6f5e;font-size:12px;line-height:1.5;text-align:center;letter-spacing:0.08em;">${String(imageIndex).padStart(2, '0')} · ${caption}</figcaption>`
      + '</figure>'
      + guide;
  }

  const inline = this.parser.parseInline(token.tokens);
  const hackerTypes = ['时间黑客', '动机黑客', '物质黑客', '健康黑客', '关系黑客', '意义黑客'];
  const hackerIndex = hackerTypes.findIndex((name) => token.text.startsWith(`**${name}**`));
  if (hackerIndex >= 0) {
    return '<section style="margin:10px 0;padding:15px 16px;background:#ffffff;border-left:4px solid #b06f36;box-shadow:0 3px 14px rgba(23,36,61,0.06);">'
      + `<p style="margin:0 0 5px;color:#b06f36;font-size:11px;line-height:1.4;font-weight:800;letter-spacing:0.16em;">0${hackerIndex + 1} / LIFE HACKER</p>`
      + `<p style="margin:0;color:#302d28;font-size:15px;line-height:1.9;text-align:justify;">${inline}</p>`
      + '</section>';
  }

  if (token.text.includes('他们真正在意的不是某个方法有没有用')) {
    return `<blockquote style="margin:22px 0;padding:18px 19px;background:#e8edf3;border-left:5px solid #17243d;color:#17243d;font-size:17px;line-height:1.9;font-weight:650;">${inline}</blockquote>`;
  }

  if (token.text.includes('用来开始一段关系的有效技巧')) {
    return `<blockquote style="margin:22px 0;padding:18px 19px;background:#f3e8e4;border-left:5px solid #8c3d37;color:#452522;font-size:16px;line-height:1.9;">${inline}</blockquote>`;
  }

  if (token.text === '或许，能发呆才是人和机器的最大区别。') {
    return '<section style="margin:30px 0 20px;padding:25px 20px;background:#17243d;color:#f7f1e5;text-align:center;">'
      + `<p style="margin:0;color:#d6a869;font-size:12px;line-height:1.5;font-weight:800;letter-spacing:0.18em;">最后留下的答案</p>`
      + `<p style="margin:11px 0 0;color:#ffffff;font-size:21px;line-height:1.75;font-weight:800;">${inline}</p>`
      + '</section>';
  }

  return `<p style="margin:0 0 17px;color:#34312c;font-size:16px;line-height:1.95;text-align:justify;word-break:break-word;letter-spacing:0.015em;">${inline}</p>`;
};

const rendered = marked.parse(markdown, {
  renderer,
  gfm: true,
  breaks: false
});

const hero = '<section style="margin:0 0 27px;padding:24px 20px 22px;background:#17243d;color:#ffffff;border-top:6px solid #b06f36;">'
  + '<p style="margin:0 0 11px;color:#d6a869;font-size:12px;line-height:1.5;font-weight:800;letter-spacing:0.2em;">读书笔记 · LIFE HACKER</p>'
  + '<h1 style="margin:0;color:#ffffff;font-size:30px;line-height:1.28;font-weight:850;letter-spacing:0.02em;">黑客精神的延伸</h1>'
  + '<p style="margin:8px 0 0;color:#e5e9ef;font-size:16px;line-height:1.75;">读《生活黑客》：当“优化一切”成为信仰，我们还剩下什么不可优化？</p>'
  + '<p style="margin:18px 0 0;padding-top:14px;border-top:1px solid rgba(255,255,255,0.22);color:#bfc8d6;font-size:12px;line-height:1.7;">系统化 · 量化自我 · 自主循环 · 发呆的自由</p>'
  + '</section>';

const footer = '<section style="margin:34px 0 0;padding:18px 18px;background:#efe7d8;border-top:1px solid #cbbda5;text-align:center;">'
  + '<p style="margin:0;color:#786b58;font-size:12px;line-height:1.8;">读书不是为了把生活变成仪表盘。<br />有时，合上工具，才是对工具最好的使用。</p>'
  + '</section>';

const fragment = '<section style="max-width:677px;margin:0 auto;padding:0 17px 32px;background:#f8f4eb;color:#34312c;font-family:-apple-system,BlinkMacSystemFont,\'PingFang SC\',\'Hiragino Sans GB\',\'Microsoft YaHei\',sans-serif;">'
  + hero
  + rendered
  + footer
  + '</section>';

const preview = '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">'
  + '<meta name="viewport" content="width=device-width,initial-scale=1">'
  + '<title>黑客精神的延伸 - 微信排版预览</title>'
  + '<style>*{box-sizing:border-box}body{margin:0;padding:32px 12px;background:#d9d2c5}.phone{width:min(430px,100%);margin:auto;background:#f8f4eb;box-shadow:0 28px 80px rgba(25,31,42,.25)}.label{padding:12px;background:#111827;color:#d6a869;font:11px/1.5 -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif;text-align:center;letter-spacing:.14em}</style>'
  + '</head><body><main class="phone"><div class="label">MD2WECHAT · CODEX LOCAL PREVIEW · 10 IMAGES</div>'
  + fragment
  + '</main></body></html>';

fs.writeFileSync(fragmentPath, fragment);
fs.writeFileSync(previewPath, preview);

console.log(JSON.stringify({
  fragment: fragmentPath,
  preview: previewPath,
  images: imageIndex
}, null, 2));

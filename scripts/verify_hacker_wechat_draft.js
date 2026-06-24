const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const mediaId = process.argv[2];
if (!mediaId) {
  throw new Error('Usage: node scripts/verify_hacker_wechat_draft.js <media_id>');
}

const configPath = path.join(process.env.HOME, '.config/md2wechat/config.yaml');
const config = yaml.load(fs.readFileSync(configPath, 'utf8'));
const appid = config.wechat?.appid || config.wechat_appid || config.appid;
const secret = config.wechat?.secret || config.wechat_secret || config.secret;

if (!appid || !secret) {
  throw new Error('WeChat credentials are not configured');
}

async function main() {
  const tokenResponse = await fetch(
    `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${encodeURIComponent(appid)}&secret=${encodeURIComponent(secret)}`
  );
  const tokenData = await tokenResponse.json();
  if (!tokenData.access_token) {
    throw new Error(`Failed to obtain WeChat access token: ${tokenData.errcode || 'unknown'}`);
  }

  const draftResponse = await fetch(
    `https://api.weixin.qq.com/cgi-bin/draft/get?access_token=${encodeURIComponent(tokenData.access_token)}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ media_id: mediaId })
    }
  );
  const draftData = await draftResponse.json();
  if (draftData.errcode) {
    throw new Error(`Failed to retrieve WeChat draft: ${draftData.errcode}`);
  }

  const article = draftData.news_item?.[0];
  if (!article) {
    throw new Error('WeChat draft contains no article');
  }

  const content = article.content || '';
  const imageSources = [...content.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map((match) => match[1]);
  const dataSources = [...content.matchAll(/<img\b[^>]*\bdata-src="([^"]+)"/g)].map((match) => match[1]);
  const allSources = imageSources.length > 0 ? imageSources : dataSources;

  console.log(JSON.stringify({
    title: article.title,
    digest: article.digest,
    show_cover_pic: article.show_cover_pic,
    content_length: content.length,
    image_count: (content.match(/<img\b/g) || []).length,
    wechat_image_count: allSources.filter((src) => src.includes('mmbiz.qpic.cn')).length,
    inline_style_count: (content.match(/style="/g) || []).length,
    has_dark_hero: content.includes('background:#17243d'),
    has_warm_paper: content.includes('background:#f8f4eb'),
    has_final_quote: content.includes('或许，能发呆才是人和机器的最大区别。')
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

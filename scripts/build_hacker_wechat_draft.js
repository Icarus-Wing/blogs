const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const assetDir = path.join(root, 'source/images/20260624_黑客精神的延伸');
const outputDir = path.join(root, 'output/md2wechat');
const fragmentPath = path.join(assetDir, 'wechat-body-fragment.html');
const uploadsPath = path.join(assetDir, 'wechat-uploaded-images.json');
const remoteBodyPath = path.join(outputDir, '20260624_黑客精神的延伸_wechat-body-remote.html');
const draftPath = path.join(outputDir, '20260624_黑客精神的延伸_draft.json');

const uploads = JSON.parse(fs.readFileSync(uploadsPath, 'utf8'));
let content = fs.readFileSync(fragmentPath, 'utf8');

for (const upload of uploads) {
  if (!content.includes(`src="${upload.file}"`)) {
    throw new Error(`Missing local image reference: ${upload.file}`);
  }
  content = content.replaceAll(`src="${upload.file}"`, `src="${upload.wechat_url}"`);
}

const unresolved = [...content.matchAll(/src="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((src) => !src.startsWith('http://mmbiz.qpic.cn/'));

if (unresolved.length > 0) {
  throw new Error(`Unresolved image sources: ${unresolved.join(', ')}`);
}

const cover = uploads.find((upload) => upload.file === '01_午后图书馆的入口.png');
if (!cover) {
  throw new Error('Cover upload is missing');
}

const draft = {
  articles: [
    {
      title: '202632：黑客人生——《生活黑客》',
      author: '',
      digest: '或许，能发呆才是人和机器的最大区别。',
      content,
      content_source_url: '',
      thumb_media_id: cover.media_id,
      show_cover_pic: 1,
      need_open_comment: 0,
      only_fans_can_comment: 0
    }
  ]
};

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(remoteBodyPath, content);
fs.writeFileSync(draftPath, `${JSON.stringify(draft, null, 2)}\n`);

console.log(JSON.stringify({
  draft: draftPath,
  remote_body: remoteBodyPath,
  title_length: [...draft.articles[0].title].length,
  digest_length: [...draft.articles[0].digest].length,
  content_length: content.length,
  image_count: (content.match(/<img\b/g) || []).length,
  remote_image_count: (content.match(/src="http:\/\/mmbiz\.qpic\.cn\//g) || []).length,
  inline_style_count: (content.match(/style="/g) || []).length,
  thumb_media_id: cover.media_id
}, null, 2));

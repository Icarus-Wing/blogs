/* global hexo */
'use strict';

const { escapeHTML, unescapeHTML } = require('hexo-util');

// Frame standalone Markdown images and show their alt text below the image.
// Run before excerpt splitting to keep the homepage and article consistent.
// Skip code and existing figures, including raw HTML examples in old posts.
hexo.extend.filter.register('after_post_render', data => {
  data.content = data.content.replace(
    /<(pre|code|figure)\b[^>]*>[\s\S]*?<\/\1>|<p>\s*(<img\b[^>]*>)\s*<\/p>/gi,
    (match, protectedTag, image) => {
      if (protectedTag) return match;
      const alt = image.match(/\balt=(?:"([^"]*)"|'([^']*)')/i);
      const caption = alt ? escapeHTML(unescapeHTML(alt[1] ?? alt[2])) : '';
      return `<figure class="editorial-figure">${image}${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
    }
  );
  return data;
}, 5);

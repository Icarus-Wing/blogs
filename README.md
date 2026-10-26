# 我心中的香格里拉

Hexo 8 + NexT Pisces。主题参考[盗火者的公众号排版](https://mp.weixin.qq.com/s/MkkI16mCDXCO08lU4RkGQg?scene=1)，采用暖纸色、海军蓝标题区、铜橙色章节线和宋体正文。

## 本地预览

使用 Node.js 22 或更高版本：

```sh
npm ci
npm run dev
```

打开 <http://127.0.0.1:4000>。生成静态站点使用 `npm run build`；主题配置、渲染脚本变更后如有缓存，先运行 `npm run clean`。

## 主题文件

| 文件 | 用途 |
| --- | --- |
| `_config.next.yml` | NexT 导航、目录、字体和阅读设置 |
| `source/_data/variables.styl` | 纸色、文字、链接等基础色板 |
| `source/_data/styles.styl` | 页面布局、标题、正文、图片框和手机适配 |
| `scripts/editorial-images.js` | 为独立图片添加画框与图注 |

全部改动通过 NexT 的扩展接口加载，升级 npm 主题不会覆盖自定义样式。正文使用本机字体（macOS 优先宋体，其它平台回退到可用的衬线字体），不下载网络字体。为保持参考文章的纸张效果，当前关闭自动深色模式。

## 写文章

保留原来的 Markdown 写法即可：一级标题居中，二级标题带橙色竖线，引用块显示为深蓝底重点段落。

```md
# 序

正文段落。

<!-- more -->

## 章节标题

![图片说明](/images/文章目录/图片.png)

> **核心判断**
>
> 想强调的一段话。
```

独立成段的图片会显示画框，其替代文字会作为图注；行内图片、链接图片、代码示例和已有的 `figure` 保持原样。首页摘要继续使用 `<!-- more -->`，搜索采用 JSON 索引，避免文章内容破坏 XML CDATA。

本机临时排版工具已从 Hexo 自动加载的 `scripts/` 移至 `tools/`，仍可手动运行，例如 `node tools/render_20260722_wechat_preview.js`。这些工具和本机草稿数据不纳入 Git。

GitHub Actions 会在 `master` 推送后构建并部署到 GitHub Pages。本地预览与构建不执行部署。

# 蓝莓谷异闻录

![蓝莓谷异闻录 第一季 · 全十二话](public/og.png)

《蓝莓谷异闻录》第一季漫画官网。十二则发生在蓝莓谷的东方民俗异闻，共 12 话、96 页完整成稿。

在线阅读：<https://blueberry-valley-tales.littlezhangsan.workers.dev>

## 站点功能

- 第一季全 12 话在线阅读
- 连续滚动与单页翻阅两种模式
- 有字成稿与无字原图切换
- 章节目录与本地阅读进度保存
- 键盘翻页与移动端响应式布局
- Open Graph 社交分享封面

## 本地运行

需要 Node.js `>=22.13.0`。

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

## 部署到 Cloudflare

完成 Wrangler 登录后运行：

```bash
npm run deploy:cloudflare
```

## 部署到 Vercel

仓库包含独立的 Vercel 静态构建，避免把 Cloudflare Worker 产物误当成静态站点：

```bash
npm run build:vercel
```

Vercel 会根据 `vercel.json` 使用该命令，并发布 `dist-vercel`。Sites 与
Cloudflare 继续使用原有的 `npm run build`，三端共享同一套漫画组件、样式和资源。

三个平台都可以设置 `SITE_ORIGIN` 来生成对应的分享链接。未设置时暂时使用当前
Cloudflare 地址；确定正式域名后只需更新各平台的这个值。

项目基于 React 19、vinext、Vite 和 Cloudflare Workers 构建。

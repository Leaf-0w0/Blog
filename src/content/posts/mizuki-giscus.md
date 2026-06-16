---
title: Mizuki实现Giscus评论区
published: 2025-09-13
description: 在Mizuki主题中实现Giscus评论区的教程
tags:
  - Mizuki
  - Comments
category: Tutorial
draft: false
updated: 2026-03-31
---
# 前言
> [!TIP]
> 在 Mizuki 主题 9.0 版本默认已集成 Giscus 评论系统，本文适用于旧版本手动集成。

Mizuki 主题默认使用 Twikoo 作为评论系统。Giscus 基于 GitHub Discussions，无需数据库、无第三方服务依赖，且支持 Markdown 和代码高亮。本文介绍如何在旧版 Mizuki 主题中手动集成 Giscus。
# 准备工作
## 1. 创建评论仓库
1. 在 GitHub 新建一个 **公开（`public`）** 仓库，用于存储评论数据。
2. 进入仓库 **Settings → General**，在 **Features** 区域勾选 **Discussions** 并保存。
## 2. 获取 Giscus 配置
访问 [giscus.app](https://giscus.app/zh-CN)，按向导完成配置。完成后会生成如下代码，记下其中的关键参数：
```javascript
<script src="https://giscus.app/client.js"
  data-repo="your-github-username/your-repo-name"
  data-repo-id="your-repo-id"
  data-category="Announcements"
  data-category-id="your-category-id"
  data-mapping="pathname"
  data-strict="0"
  data-reactions-enabled="1"
  data-emit-metadata="0"
  data-input-position="top"
  data-theme="preferred_color_scheme"
  data-lang="zh-CN"
  data-loading="lazy"
  crossorigin="anonymous"
  async>
</script>
```
# 修改主题配置
## 1. 更新评论配置
编辑 `src/config.ts`，将 Twikoo 配置替换为 Giscus：
```diff
 export const commentConfig: CommentConfig = {
-	enable: false,
-	twikoo: {
-		envId: "https://twikoo.vercel.app",
-		lang: "en",
-	},
+	enable: true,
+	giscus: {
+		enable: true,
+		repo: "your-github-username/your-repo-name",
+		repoId: "your-repo-id",
+		category: "Announcements",
+		categoryId: "your-category-id",
+		mapping: "pathname",
+		strict: "0",
+		reactionsEnabled: "1",
+		emitMetadata: "0",
+		inputPosition: "top",
+		theme: "preferred_color_scheme",
+		lang: "zh-CN",
+	},
 };
```
## 2. 添加 Giscus 组件
在 `src/components/comment/` 目录下新建 `Giscus.astro`（可删除原 `Twikoo.astro`）：
```astro
---
import { commentConfig } from "@/config";

interface Props {
  path: string;
}

const giscusConfig = commentConfig.giscus;
---

<div class="giscus-container"></div>

<script is:inline define:vars={{ giscusConfig }}>
  (() => {
    const getTheme = () => document.documentElement.classList.contains('dark') ? 'dark' : 'light';

    const loadGiscus = () => {
      const root = document.querySelector('.giscus-container');
      if (!root || root.querySelector('iframe.giscus-frame')) return;

      const s = document.createElement('script');
      s.src = 'https://giscus.app/client.js';
      s.async = true;

      Object.entries({
        'data-repo': giscusConfig.repo,
        'data-repo-id': giscusConfig.repoId,
        'data-category': giscusConfig.category,
        'data-category-id': giscusConfig.categoryId,
        'data-mapping': giscusConfig.mapping || 'pathname',
        'data-strict': giscusConfig.strict || '0',
        'data-reactions-enabled': giscusConfig.reactionsEnabled || '1',
        'data-emit-metadata': giscusConfig.emitMetadata || '0',
        'data-input-position': giscusConfig.inputPosition || 'top',
        'data-lang': giscusConfig.lang || 'zh-CN',
        'data-loading': 'lazy',
        'data-theme': getTheme()
      }).forEach(([key, value]) => s.setAttribute(key, value));

      root.appendChild(s);
    };

    const updateTheme = () => {
      const iframe = document.querySelector('iframe.giscus-frame');
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage({ giscus: { setConfig: { theme: getTheme() } } }, 'https://giscus.app');
      }
    };

    loadGiscus();

    if (!window._giscusObserver) {
      const observer = new MutationObserver((mutations) => {
        if (mutations.some(m => m.type === 'attributes' && m.attributeName === 'class')) {
          updateTheme();
        }
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      window._giscusObserver = observer;
    }

    const handleSwup = () => loadGiscus();
    if (window.swup) {
      window.swup.hooks.on('content:replace', handleSwup);
    } else {
      document.addEventListener('swup:enable', () => {
        window.swup?.hooks.on('content:replace', handleSwup);
      }, { once: true });
    }
  })();
</script>

<style>
  .giscus-container {
    width: 100%;
    margin-top: 1rem;
    transition: color 0.15s, background-color 0.15s, border-color 0.15s;
  }
  .giscus-container iframe.giscus-frame {
    width: 100% !important;
    border-radius: var(--radius-large);
    border: 1px solid var(--line-divider);
    background: transparent;
    transition: border-color 0.15s, background-color 0.15s;
  }
  .giscus-container:hover iframe.giscus-frame {
    border-color: var(--primary);
  }
  :root:not(.dark) .giscus-container {
    color-scheme: light;
  }
  :root.dark .giscus-container {
    color-scheme: dark;
  }
</style>
```
## 3. 更新评论组件入口
编辑 `src/components/comment/index.astro`：
```diff
-import Twikoo from "./Twikoo.astro";
+import Giscus from "./Giscus.astro";

-if (commentConfig?.enable && commentConfig?.twikoo) {
-	commentService = "twikoo";
+if (commentConfig?.enable) {
+	if (commentConfig?.giscus) {
+		commentService = "giscus";
+	}

-{commentService === 'twikoo' && <Twikoo path={path} />}
+{commentService === 'giscus' && <Giscus path={path} />}
```
## 4. 添加类型定义

编辑 `src/types/config.ts`，补充 Giscus 类型：

```diff
-twikoo?: TwikooConfig;
+giscus?: GiscusConfig;

-type TwikooConfig = {
-	envId: string;
-	region?: string;
-};
+type GiscusConfig = {
+	enable: boolean;
+	repo: string;
+	repoId: string;
+	category: string;
+	categoryId: string;
+	mapping?: string;
+	strict?: string;
+	reactionsEnabled?: string;
+	emitMetadata?: string;
+	inputPosition?: string;
+	theme?: string;
+	lang?: string;
+};
```
# 结语
完成以上步骤后，你的 Mizuki 博客就成功集成了 Giscus 评论系统。现在，读者可以通过 GitHub Discussions 与您互动，享受更丰富的评论体验。希望这篇教程对你有所帮助！如果有任何问题或建议，欢迎在评论区留言讨论。
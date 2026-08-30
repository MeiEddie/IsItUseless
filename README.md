# IS IT USELESS ?

一个随机冷知识抽签站。点一下「换一条」，从 `Knowledge.md` 里随机抽出一条没用但忍不住想知道的知识。

## 三个模块

1. **标题** —— `IS IT USELESS ?`
2. **展示窗口** —— 一张知识卡片，显示学科、标题、正文和一键复制
3. **随机按钮** —— 换一条，也可以直接按 `空格` 或 `R`

顺带做的：分类筛选、深浅色主题、一键复制、本轮进度（抽完一轮自动重新洗牌，且不会和上一条重复）。

## 开始

```bash
npm install
npm run dev      # 开发，默认 http://localhost:5173
npm run build    # 构建到 site/
npm run preview  # 预览构建产物
```

## 直接打开网页

构建好的网页是一个独立的单文件：

```
site/index.html
```

可以直接双击用浏览器打开，不需要起服务器。

> 注意：Vite 默认产物 `dist/` 是带外链 JS/CSS 的，双击打开会因为浏览器 CORS 策略白屏。这里的构建配置已把所有代码内联到单个 HTML 里。

## 部署到 GitHub Pages

仓库里已经配好了 Actions（`.github/workflows/deploy.yml`），推到 `main` 会自动构建并发布。

第一次部署：

1. 在 GitHub 上新建一个仓库，**必须选 Public**（免费版 Pages 不支持私有仓库）
2. 本地初始化并推送：

   ```bash
   git init
   git add .
   git commit -m "init: IS IT USELESS ?"
   git branch -M main
   git remote add origin https://github.com/<用户名>/<仓库名>.git
   git push -u origin main
   ```

3. **开启 GitHub Pages**：打开仓库 → **Settings** → **Pages** → Source 选 **GitHub Actions**

   > 这一步必须做，否则 Actions 会报 `Not Found` 错误。如果你已经更新到最新代码，工作流里加了 `enablement: true`，理论上会自动开，但手动确认一下最稳。

4. 等 Actions 跑完（约 1 分钟），访问 `https://<用户名>.github.io/<仓库名>/`

以后更新内容：

- 改完 `Knowledge.md` 直接 push，Actions 自动重新构建发布
- 也可以直接在 GitHub 网页上编辑 `Knowledge.md`，提交后网站自动更新，**本地不用跑构建**
- `site/` 目录不进版本库，是 Actions 每次现构建的

## 添加知识：编辑 Knowledge.md

所有知识点都存在项目根目录的 **Knowledge.md** 里，改它就行了，**不用动代码，也不用重新配置**。

```markdown
## 【物理】

### 在珠穆朗玛峰顶，水约 71°C 就开了

水的沸点取决于气压。珠峰顶的气压只有海平面的三分之一左右，
所以水在约 71°C 就会沸腾。
```

| 部分 | 写法 | 说明 |
| --- | --- | --- |
| 学科 | `## 【物理】` | 两个井号，学科名写在【】里。它下面所有 `###` 都归这个学科 |
| 条目 | `### 标题` | 三个井号 + 空格，表示一条知识开始 |
| 正文 | 标题下面的所有行 | 支持多行，空一行分段 |

规则补充：

- 学科用 `【】` 或 `[]` 都行，解析器只取括号里的文字。
- 一个 `##` 下面可以放任意多条 `###`。
- 没放在任何 `##` 下面的 `###`，会归到「杂项」。
- 想给单条临时换学科，可以写 `### [化学] 标题`，优先级高于 `##`。
- 筛选栏里学科的顺序，跟 `##` 在文件里出现的顺序一致。
- 文件顶部 `###` 之前的内容不会被解析，可以自由写说明；` ``` ` 代码块也会被跳过。

## 目录结构

```
Knowledge.md                  知识库（唯一的数据源，改这里）
src/
├─ App.tsx                    页面整体布局
├─ App.css                    卡片动画、背景点阵
├─ main.tsx                   入口，包了 next-themes 的 ThemeProvider
├─ types/knowledge.ts         知识条目的类型定义
├─ lib/
│  ├─ parseKnowledge.ts       Markdown → 结构化数据
│  └─ knowledge.ts            通过 ?raw 读取 Knowledge.md
├─ hooks/useRandomPicker.ts   洗牌袋随机抽取
└─ components/
   ├─ KnowledgeCard.tsx       展示窗口
   ├─ CategoryFilter.tsx      分类筛选
   └─ ThemeToggle.tsx         深浅色切换
```

## 技术栈

React 19 · TypeScript · Vite 7 · Tailwind CSS 3.4 · shadcn/ui · Radix UI · lucide-react · next-themes

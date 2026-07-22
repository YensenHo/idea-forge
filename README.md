# IdeaForge — Trade Sparks, Not Templates

一个连接「有想法的人」和「有能力实现的人」的创意灵感交换社区。

- **Seeker** 自由发帖描述想要的 App
- **Builder** 在广场浏览热门需求并认领制作
- **AI 驱动**：自动将自由描述拆解为结构化需求（标题、描述、目标用户、痛点、标签）

## 技术栈

- Next.js 16（App Router）+ Turbopack
- Tailwind CSS
- SQLite（better-sqlite3，本地/开发）
- TypeScript

## 快速开始

```bash
npm install
npm run dev
```

打开 http://localhost:3000

## AI 需求分析

在 `.env.local` 中配置：

```env
OPENAI_API_KEY=sk-your-key-here
```

配置后，发帖时 AI 会自动将用户的自由描述拆解为结构化字段：标题、描述、目标用户、痛点、标签。未配置时，自动降级为简单的首行标题提取。

## 部署到 Vercel

### 前置条件

项目依赖 SQLite 本地文件存储。**Vercel Serverless 环境不支持本地文件持久化**，需要以下任一方案：

#### 方案 A：Vercel 快速预览（数据不持久）

直接部署即可预览 UI 和交互，但数据在每次请求后可能丢失：

```bash
npx vercel
```

#### 方案 B：Turso 云端 SQLite（推荐生产方案）

1. 注册 [Turso](https://turso.tech)（免费额度足够）
2. 安装 CLI 并创建数据库：
   ```bash
   brew install tursodatabase/tap/turso
   turso auth signup
   turso db create idea-forge
   turso db show idea-forge    # 获取 URL
   turso db tokens create idea-forge  # 获取 token
   ```
3. 在 Vercel 项目设置中添加环境变量：
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `OPENAI_API_KEY`（可选）

> Turso 兼容版 db.ts 已预装 `@libsql/client`，如需切换请参考 `src/lib/db-turso.example.ts`。

## 项目结构

```
src/
├── app/
│   ├── api/posts/           # REST API
│   │   ├── route.ts         # GET 列表 + POST 创建
│   │   └── [id]/
│   │       ├── route.ts     # GET 详情
│   │       ├── upvote/      # POST 点赞
│   │       ├── comments/    # POST 评论
│   │       └── claim/       # POST 认领
│   ├── posts/
│   │   ├── new/page.tsx     # 发需求页
│   │   └── [id]/page.tsx    # 帖子详情页
│   ├── layout.tsx           # 全局布局
│   ├── page.tsx             # 首页广场
│   └── globals.css          # 全局样式
├── lib/
│   ├── db.ts                # SQLite 数据库
│   ├── ranking.ts           # 热度算法
│   └── ai.ts                # AI 需求分析
└── data/
    └── idea-forge.db        # SQLite 数据文件
```

## 设计系统

- 底色：#f8f5ee（暖纸白）
- 强调色：#a8573e（赤陶棕）
- 字体：Cormorant Garamond（标题）+ Plus Jakarta Sans（正文）
- 纹理：5% 噪点纹理 + 手绘 SVG 波浪线
- 风格：复古手作工坊风

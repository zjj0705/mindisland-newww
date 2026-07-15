# 房树人 MindIsland — 部署指南

## 一键体验（手机/电脑/平板）

下载 `index.html` → 双击打开 → 立即体验（自动连真实 AI）。

---

## 提交方式 1：部署公开链接（推荐）

### Netlify（30 秒，永久免费，不要银行卡）

1. 打开 https://app.netlify.com/drop
2. 把 `index.html` 文件拖到那个虚线框里
3. 5 秒后得到公网 URL，类似 `https://xxxxx-xxxxx.netlify.app`
4. 把这个 URL 提交给比赛

**评委打开 URL 就能体验**：手机、平板、电脑浏览器都支持，触摸手绘 + 真实 AI 对话。

---

## 提交方式 2：HTML Zip 上传社区

```bash
cd demo
zip -r mindisland-demo.zip index.html
```

把 `mindisland-demo.zip` 上传到比赛社区。评委下载解压后双击 `index.html` 即用。

---

## App 功能说明

### 7 步完整流程

| Step | 功能 | AI 真实调用 |
|------|------|-------------|
| 1 | 首页呼吸灯 | 无 |
| 2 | 手绘画布（6 色 + 3 档粗细 + 撤销/清空 + 触摸/鼠标） | 无 |
| 2.5 | ✨ 给我灵感（4 张 AI 候选图） | 通义万相 `wan2.2-t2i-flash` |
| 3 | SSE 对话（3 轮，打字机效果） | Qwen-VL-Max（首轮看画，后续文本） |
| 4 | 选 3 张重构方案卡 | Qwen-VL-Max 生成 JSON |
| 5 | grounding（AI 看画给虚线框定位） | Qwen-VL-Max 视觉 + JSON |
| 6 | 成长反馈（温暖文案 + 成长光点） | Qwen-VL-Max 视觉 + JSON |

### 真实 AI（不是 mock）

- **Qwen-VL-Max**（阿里云 DashScope）：看画对话、生成重构卡、grounding 定位、成长反馈
- **通义万相 wan2.2-t2i-flash**：给我灵感 4 张候选图

### 技术特点

- **纯静态单文件 HTML**：无框架、无构建、无后端
- **直连 DashScope**：CORS 已支持，浏览器原生 fetch
- **响应式**：CSS media query 768px 断点，手机单栏 / 桌面居中卡片
- **触摸优先**：pointer events 统一处理触摸/鼠标手绘
- **打字机效果**：逐字呈现 AI 文案
- **蚂蚁线动画**：grounding 虚线框动画引导
- **成长光点**：完成后的光点点亮动画

---

## API Key 说明

文件内嵌 API Key（已接受风险）。建议比赛结束后到 [DashScope 控制台](https://dashscope.console.aliyun.com/) 禁用该 Key。

---

## 本地验证

```bash
cd demo
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

注意：直接双击打开 `file://` 协议也能用，但有些浏览器对本地文件的 fetch 有限制，建议用 http 服务。

---

## 故障排查

| 问题 | 解决 |
|------|------|
| 评委打开页面白屏 | 检查浏览器控制台，可能 API Key 被禁用 |
| 「让 AI 看看」按钮转圈不停 | Qwen-VL-Max 看画可能需要 30-45 秒，耐心等 |
| 「给我灵感」按钮失败 | 通义万相生成 4 张图需要 20-40 秒，失败重试 |
| AI 回答重复或固定 | 检查 prompt 是否正确，或重试 |

# 语音翻译应用 🎤➡️📝

基于 DeepSeek API 的语音翻译工具，支持英语、日语语音输入，实时翻译为简体中文。

## 功能特点

- 🎤 语音识别输入（支持英语、日语）
- 🔄 实时文本翻译
- 📱 响应式设计，支持移动端
- 🚀 基于 Netlify 部署
- 🤖 使用 DeepSeek AI 进行翻译

## 部署到 Netlify

### 方法一：直接部署

1. 点击下方按钮一键部署：

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=YOUR_REPO_URL)

### 方法二：手动部署

1. Fork 或下载本项目代码
2. 登录 [Netlify](https://app.netlify.com/)
3. 选择 "Add new site" → "Deploy manually"
4. 上传项目 ZIP 文件或连接 GitHub 仓库

## 环境变量配置

部署后需要在 Netlify 控制台中设置环境变量：

1. 进入 Netlify 站点控制台
2. 选择 "Site settings" → "Environment variables"
3. 添加以下变量：
   - `DEEPSEEK_API_KEY` - 您的 DeepSeek API 密钥

## 获取 DeepSeek API 密钥

1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/)
2. 注册账号并登录
3. 在控制台中创建 API 密钥
4. 将密钥配置到 Netlify 环境变量中

## 本地开发

如需本地开发，可以安装 Netlify CLI：

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 克隆项目
git clone <your-repo-url>
cd voice-translate-netlify-deepseek

# 安装依赖
npm install

# 设置环境变量（创建 .env 文件）
echo "DEEPSEEK_API_KEY=your_actual_api_key" > .env

# 启动本地开发服务器
netlify dev
# 神探销售系统后端

## 功能说明
- 提供AI大模型API调用服务
- 解决浏览器CORS限制问题
- 支持文心一言、通义千问、DeepSeek、豆包等大模型

## 技术栈
- Node.js + Express
- Axios（用于API调用）
- CORS（跨域支持）

## 安装和运行

### 1. 安装依赖
```bash
cd backend
npm install
```

### 2. 启动服务器
```bash
# 生产模式
npm start

# 开发模式（自动重启）
npm run dev
```

服务器默认运行在 `http://localhost:3001`

## API端点

### 健康检查
- **URL**: `/health`
- **方法**: GET
- **响应**: `{"status": "ok", "message": "Backend server is running"}`

### AI分析
- **URL**: `/api/ai-analyze`
- **方法**: POST
- **请求体**:
```json
{
  "model": "wenxin", // 模型类型：wenxin, tongyi, deepseek, doubao
  "apiKey": "your-api-key", // API Key
  "apiUrl": "https://api.example.com", // 可选，自定义API URL
  "modelId": "ep-20240101000000-xxxxx", // 可选，豆包等需要模型ID
  "prompt": "请分析以下销售线索..." // 分析提示词
}
```
- **响应**:
```json
{
  "success": true,
  "response": "AI分析结果..."
}
```

## 前端配置
在前端设置页面，将API URL设置为：
```
http://localhost:3001/api/ai-analyze
```

然后在模型选择中选择对应的大模型，并输入API Key即可。
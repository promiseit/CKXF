const express = require('express');
const cors = require('cors');
const axios = require('axios');
const config = require('./config');

const app = express();
const PORT = config.port;

// 中间件
app.use(cors());
app.use(express.json());

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// AI分析API - GET请求（用于测试）
app.get('/api/ai-analyze', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'AI分析API正常运行，请使用POST方法调用',
    usage: 'POST /api/ai-analyze with JSON body: { model, apiKey, prompt, modelId? }'
  });
});

// AI分析API - POST请求
app.post('/api/ai-analyze', async (req, res) => {
  try {
    const {
      model,
      apiKey,
      apiUrl,
      modelId,
      prompt
    } = req.body;

    if (!model || !apiKey || !prompt) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // 获取模型配置
    const modelConfig = config.models[model];
    if (!modelConfig) {
      return res.status(400).json({ error: 'Unsupported model' });
    }

    // 构建请求URL
    const url = apiUrl || modelConfig.defaultUrl;

    // 构建请求体
    let requestBody = {
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    };

    // 添加模型ID（如果需要）
    if (modelId) {
      requestBody.model = modelId;
    } else if (model === 'tongyi') {
      requestBody.model = 'qwen-turbo';
    } else if (model === 'deepseek') {
      requestBody.model = 'deepseek-chat';
    }

    // 发送请求到AI模型
    const response = await axios.post(url, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    // 记录完整响应
    console.log('AI模型完整响应:', JSON.stringify(response.data, null, 2));

    // 处理响应
    let aiResponse;
    
    // 检查响应类型
    if (typeof response.data === 'string' && response.data.includes('<html>')) {
      console.error('AI模型返回了HTML响应，可能是错误页面或重定向:', response.data.substring(0, 500) + '...');
      throw new Error('AI model returned HTML response instead of JSON');
    }
    
    if (model === 'wenxin') {
      aiResponse = response.data.result || response.data.choices?.[0]?.message?.content;
    } else if (model === 'doubao') {
      // 豆包可能有不同的响应格式
      aiResponse = response.data.choices?.[0]?.message?.content || response.data.result;
    } else {
      aiResponse = response.data.choices?.[0]?.message?.content;
    }

    if (!aiResponse) {
      console.error('无法提取AI响应，完整响应:', response.data);
      throw new Error('No response from AI model');
    }

    res.json({ success: true, response: aiResponse });

  } catch (error) {
    console.error('AI analysis error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to analyze with AI model' 
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`AI analysis API: http://localhost:${PORT}/api/ai-analyze`);
});
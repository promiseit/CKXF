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

    // 处理响应
    let aiResponse;
    if (model === 'wenxin') {
      aiResponse = response.data.result || response.data.choices?.[0]?.message?.content;
    } else {
      aiResponse = response.data.choices?.[0]?.message?.content;
    }

    if (!aiResponse) {
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
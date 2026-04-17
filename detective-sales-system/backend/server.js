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

// 数据匿名化处理函数
function anonymizeData(data) {
  if (!data) return data;
  
  // 替换可能的敏感信息
  let sanitized = data
    .replace(/[0-9]{4,}/g, '****') // 替换长数字
    .replace(/[@\w\.-]+@[\w\.-]+\.\w+/g, 'user@example.com') // 替换邮箱
    .replace(/客户名称|公司名称|企业名称/g, '客户') // 替换客户相关词汇
    .replace(/项目名称|产品名称/g, '项目'); // 替换项目相关词汇
  
  return sanitized;
}

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

    // 匿名化处理提示词
    const anonymizedPrompt = anonymizeData(prompt);

    // 构建请求体
    let requestBody = {
      messages: [
        { role: 'user', content: anonymizedPrompt }
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
    } else if (model === 'doubao') {
      requestBody.model = 'ep-20240101000000-xxxxx';
    } else if (model === 'qianwen') {
      requestBody.model = 'qianwen-turbo';
    } else if (model === 'kimi') {
      requestBody.model = 'kimi';
    } else if (model === 'zhipu') {
      requestBody.model = 'glm-4';
    }

    // 为不同模型设置特定参数
    if (model === 'doubao') {
      // 豆包API可能需要不同的请求格式
      requestBody = {
        model: requestBody.model,
        messages: [
          {
            role: 'user',
            content: anonymizedPrompt
          }
        ],
        temperature: 0.7
      };
    } else if (model === 'tongyi') {
      // 通义千问API格式
      requestBody = {
        model: requestBody.model || 'qwen-turbo',
        input: {
          messages: [
            {
              role: 'user',
              content: anonymizedPrompt
            }
          ]
        },
        parameters: {
          temperature: 0.7
        }
      };
    }

    // 发送请求到AI模型
    let response;
    
    if (model === 'wenxin') {
      // 文心一言API格式
      response = await axios.post(url, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });
    } else if (model === 'tongyi') {
      // 通义千问API格式
      response = await axios.post(url, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });
    } else if (model === 'deepseek') {
      // DeepSeek API格式
      response = await axios.post(url, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });
    } else if (model === 'doubao') {
      // 豆包API格式
      response = await axios.post(url, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });
    } else if (model === 'qianwen') {
      // 千问百炼API格式
      response = await axios.post(url, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });
    } else if (model === 'kimi') {
      // Kimi API格式
      response = await axios.post(url, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });
    } else if (model === 'zhipu') {
      // 智谱AI API格式
      response = await axios.post(url, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });
    } else {
      // 默认格式
      response = await axios.post(url, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });
    }

    // 记录响应摘要（不记录完整响应，保护隐私）
    console.log('AI模型响应摘要:', {
      model: model,
      responseLength: response.data ? JSON.stringify(response.data).length : 0,
      status: response.status
    });

    // 处理响应
    let aiResponse;
    
    // 检查响应类型
    if (typeof response.data === 'string' && response.data.includes('<html>')) {
      console.error('AI模型返回了HTML响应，可能是错误页面或重定向');
      throw new Error('AI model returned HTML response instead of JSON');
    }
    
    if (model === 'wenxin') {
      aiResponse = response.data.result || response.data.choices?.[0]?.message?.content;
    } else if (model === 'tongyi') {
      // 通义千问响应格式
      aiResponse = response.data.output?.text || response.data.choices?.[0]?.message?.content;
    } else if (model === 'doubao') {
      // 豆包可能有不同的响应格式
      aiResponse = response.data.choices?.[0]?.message?.content || response.data.result;
    } else if (model === 'qianwen') {
      // 千问百炼响应格式
      aiResponse = response.data.choices?.[0]?.message?.content;
    } else if (model === 'kimi') {
      // Kimi响应格式
      aiResponse = response.data.choices?.[0]?.message?.content;
    } else if (model === 'zhipu') {
      // 智谱AI响应格式
      aiResponse = response.data.choices?.[0]?.message?.content;
    } else {
      aiResponse = response.data.choices?.[0]?.message?.content;
    }

    if (!aiResponse) {
      console.error('无法提取AI响应');
      throw new Error('No response from AI model');
    }

    res.json({ success: true, response: aiResponse });

  } catch (error) {
    console.error('AI analysis error:', error.message);
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
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const config = require('./config');

const app = express();
const PORT = config.port;

// 限流配置
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60000; // 1分钟
const RATE_LIMIT_MAX_REQUESTS = 60; // 每分钟最多60个请求

// 中间件
app.use(cors());
app.use(express.json());

// 请求限流中间件
app.use((req, res, next) => {
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    
    if (!rateLimitMap.has(clientId)) {
        rateLimitMap.set(clientId, { count: 1, startTime: now });
    } else {
        const clientData = rateLimitMap.get(clientId);
        if (now - clientData.startTime > RATE_LIMIT_WINDOW_MS) {
            // 重置窗口
            clientData.count = 1;
            clientData.startTime = now;
        } else {
            clientData.count++;
            if (clientData.count > RATE_LIMIT_MAX_REQUESTS) {
                return res.status(429).json({ 
                    success: false, 
                    error: '请求过于频繁，请稍后再试' 
                });
            }
        }
    }
    next();
});

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

// 获取模型特定配置
function getModelConfig(model, requestBody, apiKey) {
    const modelConfig = config.models[model];
    let updatedRequestBody = { ...requestBody };
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    switch (model) {
        case 'wenxin':
            // 文心一言特定配置
            break;
        case 'tongyi':
            // 通义千问特定配置
            updatedRequestBody = {
                model: requestBody.model || 'qwen-turbo',
                input: {
                    messages: requestBody.messages
                },
                parameters: {
                    temperature: 0.7
                }
            };
            break;
        case 'deepseek':
            updatedRequestBody.model = 'deepseek-chat';
            break;
        case 'doubao':
            updatedRequestBody.model = 'ep-20240101000000-xxxxx';
            break;
        case 'qianwen':
            updatedRequestBody.model = 'qianwen-turbo';
            break;
        case 'kimi':
            updatedRequestBody.model = 'kimi';
            break;
        case 'zhipu':
            updatedRequestBody.model = 'glm-4';
            break;
        case 'local':
            // 本地模型处理
            return { isLocal: true };
    }

    return { requestBody: updatedRequestBody, headers, isLocal: false };
}

// 从响应中提取 AI 回答
function extractAIResponse(model, responseData) {
    switch (model) {
        case 'wenxin':
            return responseData.result || responseData.choices?.[0]?.message?.content;
        case 'tongyi':
            return responseData.output?.text || responseData.choices?.[0]?.message?.content;
        case 'doubao':
            return responseData.choices?.[0]?.message?.content || responseData.result;
        case 'qianwen':
        case 'kimi':
        case 'zhipu':
        case 'deepseek':
        default:
            return responseData.choices?.[0]?.message?.content;
    }
}

// AI分析API - POST请求
app.post('/api/ai-analyze', async (req, res) => {
    try {
        const { model, apiKey, apiUrl, modelId, prompt } = req.body;

        if (!model || !apiKey || !prompt) {
            return res.status(400).json({ error: '缺少必要参数' });
        }

        // 获取模型配置
        const modelConfig = config.models[model];
        if (!modelConfig && model !== 'local') {
            return res.status(400).json({ error: '不支持的模型' });
        }

        // 匿名化处理提示词
        const anonymizedPrompt = anonymizeData(prompt);

        // 构建请求体
        let requestBody = {
            messages: [
                { role: 'user', content: anonymizedPrompt }
            ],
            temperature: 0.7
        };

        // 添加模型 ID
        if (modelId) {
            requestBody.model = modelId;
        }

        // 获取模型特定配置
        const modelSpecificConfig = getModelConfig(model, requestBody, apiKey);
        
        // 处理本地模型情况
        if (modelSpecificConfig.isLocal) {
            // 模拟本地模型响应
            const localResponse = `收到您的请求，这是本地模拟的响应。您的输入是：\n"${anonymizedPrompt.substring(0, 100)}${anonymizedPrompt.length > 100 ? '...' : ''}"`;
            return res.json({ success: true, response: localResponse });
        }

        const url = apiUrl || modelConfig.defaultUrl;

        // 发送请求到 AI 模型，设置超时
        const response = await axios.post(url, modelSpecificConfig.requestBody, {
            headers: modelSpecificConfig.headers,
            timeout: 30000 // 30秒超时
        });

        // 记录响应摘要（不记录完整响应，保护隐私）
        console.log('AI模型响应摘要:', {
            model: model,
            responseLength: response.data ? JSON.stringify(response.data).length : 0,
            status: response.status
        });

        // 检查响应类型
        if (typeof response.data === 'string' && response.data.includes('<html>')) {
            console.error('AI模型返回了HTML响应，可能是错误页面或重定向');
            throw new Error('AI model returned HTML response instead of JSON');
        }

        // 提取 AI 响应
        const aiResponse = extractAIResponse(model, response.data);

        if (!aiResponse) {
            console.error('无法提取AI响应');
            throw new Error('No response from AI model');
        }

        res.json({ success: true, response: aiResponse });

    } catch (error) {
        console.error('AI analysis error:', error.message);
        
        let errorMessage = '使用AI模型分析失败';
        let statusCode = 500;

        if (error.code === 'ECONNABORTED') {
            errorMessage = '请求超时，请稍后再试';
            statusCode = 408;
        } else if (error.response) {
            statusCode = error.response.status;
            errorMessage = `AI服务返回错误: ${error.response.statusText || error.message}`;
        }

        res.status(statusCode).json({ 
            success: false, 
            error: errorMessage 
        });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`AI analysis API: http://localhost:${PORT}/api/ai-analyze`);
});

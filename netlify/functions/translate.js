const axios = require('axios');

exports.handler = async function(event, context) {
  // 设置 CORS 头部
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // 处理预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { text } = JSON.parse(event.body || "{}");
    
    // 验证输入
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'text is required' })
      };
    }

    // 检查 API 密钥
    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
    if (!DEEPSEEK_API_KEY) {
      throw new Error('DeepSeek API key is not configured');
    }

    // 调用 DeepSeek API
    const response = await axios.post('https://api.deepseek.com/chat/completions', {
      model: "deepseek-chat",
      messages: [
        { 
          role: "system", 
          content: "你是一个专业的翻译助手。将用户提供的文本从英语或日语准确翻译成简体中文，保持原文含义和语气，不添加额外解释，只返回翻译结果。" 
        },
        { 
          role: "user", 
          content: `请将以下内容翻译成简体中文：\n\n${text}` 
        }
      ],
      max_tokens: 1000,
      temperature: 0.1,
      stream: false
    }, {
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000 // 增加超时时间
    });

    const translation = response.data.choices?.[0]?.message?.content || '';
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        translation: translation.trim(),
        original: text
      })
    };
    
  } catch (err) {
    console.error('Translation error:', err);
    
    // 更详细的错误处理
    let errorMessage = '翻译服务暂时不可用';
    let statusCode = 500;
    
    if (err.response) {
      // DeepSeek API 返回的错误
      errorMessage = `翻译API错误: ${err.response.status}`;
      if (err.response.status === 401) {
        errorMessage = 'API密钥无效或过期';
        statusCode = 401;
      } else if (err.response.status === 429) {
        errorMessage = '请求过于频繁，请稍后重试';
        statusCode = 429;
      }
    } else if (err.request) {
      // 网络错误
      errorMessage = '网络连接失败，请检查网络设置';
    } else if (err.message.includes('API key')) {
      // API 密钥错误
      errorMessage = 'API密钥未配置';
      statusCode = 500;
    }
    
    return {
      statusCode,
      headers,
      body: JSON.stringify({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      })
    };
  }
};
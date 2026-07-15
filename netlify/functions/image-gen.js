// Netlify Function: 通义万相文生图代理
const IMAGE_ENDPOINT = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';
const TASK_ENDPOINT = 'https://dashscope.aliyuncs.com/api/v1/tasks/';
const API_KEY = process.env.DASHSCOPE_API_KEY;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }
  if (!API_KEY) {
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'DASHSCOPE_API_KEY 环境变量未设置' }) };
  }
  try {
    const body = JSON.parse(event.body || '{}');
    const action = body.action;

    if (action === 'create') {
      const prompt = body.prompt;
      if (!prompt) return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: '缺少 prompt 参数' }) };
      const resp = await fetch(IMAGE_ENDPOINT, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json', 'X-DashScope-Async': 'enable' },
        body: JSON.stringify({ model: 'wan2.2-t2i-flash', input: { prompt: prompt }, parameters: { n: 1, size: '512*512' } }),
      });
      const data = await resp.json();
      return { statusCode: resp.status, headers: CORS_HEADERS, body: JSON.stringify(data) };
    }

    if (action === 'status') {
      const taskId = body.taskId;
      if (!taskId) return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: '缺少 taskId 参数' }) };
      const resp = await fetch(TASK_ENDPOINT + taskId, { method: 'GET', headers: { 'Authorization': `Bearer ${API_KEY}` } });
      const data = await resp.json();
      return { statusCode: resp.status, headers: CORS_HEADERS, body: JSON.stringify(data) };
    }

    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'action 必须是 create 或 status' }) };
  } catch (e) {
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: e.message }) };
  }
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 关键点：从环境变量读取 Token
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const TEAM_PASSWORD = 'ZHSZHMB';
  const GITHUB_OWNER = 'banananasn';
  const GITHUB_REPO = 'project-results-data';

  try {
    const { password, endpoint, method, body } = req.body;

    if (password !== TEAM_PASSWORD) {
      return res.status(401).json({ error: '密码错误' });
    }

    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/${endpoint}`;
    const fetchOptions = {
      method: method,
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    };

    if (method !== 'GET' && body) {
      fetchOptions.headers['Content-Type'] = 'application/json';
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

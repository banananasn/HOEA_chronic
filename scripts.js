// 获取 GitHub Token（仅在需要上传时调用）
let pendingTokenPromise = null;

async function getGitHubTokenForUpload() {
    // 先检查是否已有 Token
    let token = localStorage.getItem('github_token');
    if (token) return token;
    
    // 没有 Token，弹窗提示
    if (pendingTokenPromise) return pendingTokenPromise;
    
    pendingTokenPromise = new Promise((resolve, reject) => {
        const userToken = prompt('请输入 GitHub Token：\n\n（请联系管理员获取）');
        if (userToken) {
            localStorage.setItem('github_token', userToken);
            resolve(userToken);
        } else {
            reject(new Error('未提供 GitHub Token'));
        }
        pendingTokenPromise = null;
    });
    
    return pendingTokenPromise;
}

// 读取成果时不需要 Token（公开读取）
async function githubRequestRead(endpoint) {
    // 注意：读取 Issues 不需要认证，因为是公开仓库
    const url = `https://api.github.com/repos/banananasn/project-results-data/${endpoint}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    
    if (!response.ok) {
        throw new Error(`GitHub API 错误: ${response.status}`);
    }
    return response.json();
}

// 写入成果时需要 Token
async function githubRequestWrite(endpoint, method, body) {
    const token = await getGitHubTokenForUpload();
    const url = `https://api.github.com/repos/banananasn/project-results-data/${endpoint}`;
    const headers = {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
    };
    
    const response = await fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(body)
    });
    
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`GitHub API 错误: ${response.status} - ${error}`);
    }
    return response.json();
}

// 读取所有成果（公开，不需要 Token）
async function loadResultsFromGitHub() {
    try {
        const issues = await githubRequestRead('issues');
        const resultIssues = issues.filter(issue => 
            issue.labels && issue.labels.some(label => label.name === '成果')
        );
        
        const results = [];
        for (const issue of resultIssues) {
            let bodyData = {};
            try {
                bodyData = JSON.parse(issue.body || '{}');
            } catch(e) {
                console.error('解析 Issue body 失败:', e);
            }
            
            let type = null;
            if (issue.labels && issue.labels.some(l => l.name === '在研动态')) {
                type = 'ongoing';
            } else if (issue.labels && issue.labels.some(l => l.name === '产出成果')) {
                type = 'output';
            }
            
            results.push({
                id: issue.id,
                title: issue.title,
                type: type,
                image: bodyData.image || null,
                link: bodyData.link || null,
                file: bodyData.file || null,
                fileName: bodyData.fileName || null,
                uploaderId: issue.user?.login || 'unknown',
                createTime: issue.created_at
            });
        }
        return results;
    } catch (error) {
        console.error('加载成果失败:', error);
        return [];
    }
}

// 添加新成果（需要 Token，会触发弹窗）
async function addResultToGitHub(type, title, imageData, link, fileData, fileName) {
    const body = {
        image: imageData || null,
        link: link || null,
        file: fileData || null,
        fileName: fileName || null
    };
    const labels = ['成果'];
    if (type === 'ongoing') {
        labels.push('在研动态');
    } else {
        labels.push('产出成果');
    }
    
    const newIssue = await githubRequestWrite('issues', 'POST', {
        title: title,
        body: JSON.stringify(body),
        labels: labels
    });
    
    return {
        id: newIssue.id,
        title: newIssue.title,
        type: type,
        image: imageData,
        link: link,
        file: fileData,
        fileName: fileName,
        uploaderId: newIssue.user.login,
        createTime: newIssue.created_at
    };
}

// ========== 以下是你原有的静态数据函数（保持不变） ==========

const newsCardsData = [
    { 
        title: "2025年9月26日丨国家科技重大专项课题“整合式智慧慢病管理模式研究”启动会顺利举行", 
        url: "https://mp.weixin.qq.com/s/zj19z1DcZdE7bgmVevohcA",
        image: "images/250926启动会.jpg" 
    },
    { 
        title: "2026年1月29日丨国家科技重大专项课题“整合式智慧慢病管理模式研究”年度研讨会顺利举行", 
        url: "https://mp.weixin.qq.com/s/RPzWc1Bv88lnvJsBbUJ32Q",
        image: "images/260129研讨会.jpg" 
    }
];

// ============== 调研现状更新 ==================
const interviewLinks = [
    { title: "2026年4月7日 项目组赴四川省肿瘤医院开展调研学习", url: "interview.html?id=260407" },
    { title: "2026年4月8日 项目组赴华西医院开展调研学习", url: "interview.html?id=260408" },
    { title: "2026年4月15日 项目组赴四川省第二中医医院开展调研学习", url: "interview.html?id=260415" },
    { title: "2026年4月17日 项目组赴成都高新区桂溪社区卫生服务中心开展调研学习", url: "interview.html?id=2604171" },
    { title: "2026年4月17日 项目组赴成都高新区石羊社区卫生服务中心开展调研学习", url: "interview.html?id=260417_2" },
    { title: "2026年5月15日 项目组赴成都高新区西园社区卫生服务中心开展调研学习", url: "interview.html?id=2605151" },
    { title: "2026年5月15日 项目组赴成都高新区合作社区卫生服务中心开展调研学习", url: "interview.html?id=2605152" },
];

const resultsCardsData = [
    { 
        title: "《柳叶刀-西太平洋》期刊发表中国版门急诊服务敏感疾病目录", 
        url: "https://mp.weixin.qq.com/s/-RhQ7OUv2TKwkpLKOrL3fA",
        image: "images/王健健-lancet西太平洋.png"  
    },
    { 
        title: "《四川大学学报（医学版）》发表四川省德阳市罗江区医防融合创新实践分析", 
        url: "https://mp.weixin.qq.com/s/umA2DdQ79LStldjVmP3-cg",
        image: "images/陈玺玥-川大学报.png" 
    }
];

function loadNewsCards() {
    const container = document.getElementById('news-cards');
    if (!container) return;
    newsCardsData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.onclick = () => window.location.href = item.url;
        card.innerHTML = `
            <div class="card-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="card-title">${item.title}</div>
        `;
        container.appendChild(card);
    });
}

function loadInterviewLinks() {
    const interviewList = document.getElementById("interview-links");
    if (!interviewList) return;
    if (interviewLinks.length > 0) {
        interviewList.innerHTML = "";
        interviewLinks.forEach(link => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = link.url;
            a.textContent = link.title;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            li.appendChild(a);
            interviewList.appendChild(li);
        });
    }
}

function loadResultsCards() {
    const container = document.getElementById('results-cards');
    if (!container) return;
    resultsCardsData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'results-card';
        card.onclick = () => window.location.href = item.url;
        card.innerHTML = `
            <div class="card-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="card-title">${item.title}</div>
        `;
        container.appendChild(card);
    });
}

if (document.getElementById('news-cards')) loadNewsCards();
if (document.getElementById('results-cards')) loadResultsCards();
if (document.getElementById("interview-links")) loadInterviewLinks();

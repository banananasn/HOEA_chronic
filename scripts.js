// ========== GitHub API 配置 ==========
const GITHUB_OWNER = 'banananasn';
const GITHUB_REPO = 'project-results-data';
const GITHUB_TOKEN = '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';  // 替换成生成的 token //

// 通用 GitHub API 请求函数
async function githubRequest(endpoint, method, body = null) {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/${endpoint}`;
    const headers = {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
    };
    if (body) {
        headers['Content-Type'] = 'application/json';
    }
    
    const response = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : null });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`GitHub API 错误: ${response.status} - ${error}`);
    }
    return response.json();
}

// 读取所有成果（从 GitHub Issues）
async function loadResultsFromGitHub(storageKey) {
    try {
        const issues = await githubRequest('issues', 'GET');
        // 过滤出带有"成果"标签的 Issue
        const resultIssues = issues.filter(issue => 
            issue.labels && issue.labels.some(label => label.name === '成果')
        );
        
        // 转换为成果数据格式
        const results = [];
        for (const issue of resultIssues) {
            let bodyData = {};
            try {
                bodyData = JSON.parse(issue.body || '{}');
            } catch(e) {
                console.error('解析 Issue body 失败:', e);
            }
            
            // 判断类型
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
// 添加新成果（创建 GitHub Issue）
async function addResultToGitHub(type, title, imageData, link, fileData, fileName) {
    const body = JSON.stringify({
        image: imageData || null,
        link: link || null,
        file: fileData || null,
        fileName: fileName || null
    });
    const labels = ['成果'];
    if (type === 'ongoing') {
        labels.push('在研动态');
    } else {
        labels.push('产出成果');
    }
    const newIssue = await githubRequest('issues', 'POST', {
        title: title,
        body: body,
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

// ========== 会议资讯数据 ==========
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

// ========== 调研访谈链接列表 ==========
const interviewLinks = [
    // { title: "2026年3月 某某专家访谈", url: "https://example.com/interview1" },
];

// ========== 研究成果文档列表 ==========
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

// ========== 动态生成会议资讯卡片 ==========
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

// ========== 动态填充调研访谈 ==========
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

// ========== 动态生成研究成果卡片 ==========
function loadResultsCards() {
    const container = document.getElementById('results-cards');
    if (!container) return;
    
    resultsCardsData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'results-card';  // 可单独定义样式
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


// ========== 页面加载时执行 ==========
if (document.getElementById('news-cards')) {
    loadNewsCards();
}

if (document.getElementById('results-cards')) {
    loadResultsCards();
}

if (document.getElementById("interview-links")) {
    loadInterviewLinks();
}


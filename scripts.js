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
    { title: "2026年4月7日丨项目组赴四川省肿瘤医院开展调研学习", url: "interview.html?id=260407" },
    { title: "2026年4月8日丨项目组赴四川大学华西医院开展调研学习", url: "interview.html?id=260408" },
    { title: "2026年4月15日丨项目组赴四川省第二中医医院开展调研学习", url: "interview.html?id=260415" },
    { title: "2026年4月17日丨项目组赴成都高新区桂溪社区卫生服务中心开展调研学习", url: "interview.html?id=2604171" },
    { title: "2026年4月17日丨项目组赴成都高新区石羊社区卫生服务中心开展调研学习", url: "interview.html?id=2604172" },
    { title: "2026年4月27日丨项目组赴四川大学华西第四医院心血管内科开展调研学习" },
    { title: "2026年5月15日丨项目组赴成都高新区西园社区卫生服务中心开展调研学习", url: "interview.html?id=2605151" },
    { title: "2026年5月15日丨项目组赴成都高新区合作社区卫生服务中心开展调研学习", url: "interview.html?id=2605152" },
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


// ========== 成果页面核心函数 ==========（这后面所有的代码都是让成果可以保存在云端而不是本地的代码）
// 当前页面的存储键（由每个成果页面调用设置）
let CURRENT_ONGOING_KEY = 'ongoingResults';
let CURRENT_OUTPUT_KEY = 'outputResults';

function setStorageKeys(ongoingKey, outputKey) {
    CURRENT_ONGOING_KEY = ongoingKey;
    CURRENT_OUTPUT_KEY = outputKey;
}

// 全局变量
let isAdminMode = false;
let ongoingResults = [];
let outputResults = [];
let currentImageData = null;
let currentFileData = null;
let currentFileName = null;

const ADMIN_PASSWORD = 'admin123';

// 从 GitHub 加载数据并保存到 localStorage
async function loadDataFromGitHub() {
    const allResults = await loadResultsFromGitHub();
    ongoingResults = allResults.filter(r => r.type === 'ongoing');
    outputResults = allResults.filter(r => r.type === 'output');
    
    // 保存到 localStorage
    localStorage.setItem(CURRENT_ONGOING_KEY, JSON.stringify(ongoingResults));
    localStorage.setItem(CURRENT_OUTPUT_KEY, JSON.stringify(outputResults));
    
    renderResults();
}

// 保存数据到 GitHub
async function saveDataToGitHub(type, title, imageData, link, fileData, fileName) {
    return await addResultToGitHub(type, title, imageData, link, fileData, fileName);
}

// 渲染卡片
function renderResults() {
    const ongoingContainer = document.getElementById('ongoingResults');
    const outputContainer = document.getElementById('outputResults');
    
    if (!ongoingContainer && !outputContainer) return;
    
    if (ongoingContainer) {
        if (ongoingResults.length === 0) {
            ongoingContainer.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📋</div><div class="empty-state-text">暂无在研动态，点击右上方按钮添加</div></div>`;
        } else {
            ongoingContainer.innerHTML = ongoingResults.map(result => {
                const hasLink = result.link && result.link.trim() !== '';
                const hasFile = result.file && result.fileName;
                const showDelete = canDelete(result);
                
                return `<div class="result-card" data-link="${hasLink ? result.link : ''}">
                    ${hasFile ? `<div class="download-btn" data-file="${result.file}" data-filename="${result.fileName}">📎</div>` : ''}
                    ${showDelete ? `<button class="delete-btn" onclick="deleteResult('ongoing', '${result.id}', event)">×</button>` : ''}
                    <div class="card-image">${result.image ? `<img src="${result.image}" alt="${result.title}">` : '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#999;">暂无图片</div>'}</div>
                    <div class="card-title">${result.title}</div>
                </div>`;
            }).join('');
        }
    }
    
    if (outputContainer) {
        if (outputResults.length === 0) {
            outputContainer.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📄</div><div class="empty-state-text">暂无产出成果，点击右上方按钮添加</div></div>`;
        } else {
            outputContainer.innerHTML = outputResults.map(result => {
                const hasLink = result.link && result.link.trim() !== '';
                const hasFile = result.file && result.fileName;
                const showDelete = canDelete(result);
                
                return `<div class="result-card" data-link="${hasLink ? result.link : ''}">
                    ${hasFile ? `<div class="download-btn" data-file="${result.file}" data-filename="${result.fileName}">📎</div>` : ''}
                    ${showDelete ? `<button class="delete-btn" onclick="deleteResult('output', '${result.id}', event)">×</button>` : ''}
                    <div class="card-image">${result.image ? `<img src="${result.image}" alt="${result.title}">` : '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#999;">暂无图片</div>'}</div>
                    <div class="card-title">${result.title}</div>
                </div>`;
            }).join('');
        }
    }
    
    // 绑定卡片点击事件
    document.querySelectorAll('.result-card').forEach(card => {
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
        const link = newCard.getAttribute('data-link');
        if (link && link.trim() !== '') {
            newCard.addEventListener('click', function(e) {
                if (e.target.classList.contains('download-btn') || e.target.classList.contains('delete-btn')) {
                    return;
                }
                window.location.href = link;
            });
        }
    });
    
    // 绑定下载按钮事件
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const fileData = this.getAttribute('data-file');
            const fileName = this.getAttribute('data-filename');
            if (fileData && fileName) {
                downloadFile(fileData, fileName);
            }
        });
    });
}

// 删除成果
async function deleteResult(type, id, event) {
    event.stopPropagation();
    event.preventDefault();
    
    const result = type === 'ongoing' 
        ? ongoingResults.find(r => r.id === id)
        : outputResults.find(r => r.id === id);
    
    if (!result) return;
    
    if (!isAdminMode) {
        alert('请先进入管理员模式（点击右下角红色按钮，输入 admin123）');
        return;
    }
    
    if (confirm(`确定要删除成果「${result.title}」吗？`)) {
        try {
            await githubRequestWrite(`issues/${id}`, 'PATCH', { state: 'closed' });
            
            if (type === 'ongoing') {
                ongoingResults = ongoingResults.filter(r => r.id !== id);
                localStorage.setItem(CURRENT_ONGOING_KEY, JSON.stringify(ongoingResults));
            } else {
                outputResults = outputResults.filter(r => r.id !== id);
                localStorage.setItem(CURRENT_OUTPUT_KEY, JSON.stringify(outputResults));
            }
            renderResults();
            alert('删除成功！');
        } catch (error) {
            alert('删除失败：' + error.message);
        }
    }
}

// 检查删除权限
function canDelete(result) {
    return isAdminMode;
}

// 更新管理员徽章
function updateAdminBadge() {
    const badge = document.getElementById('adminBadge');
    if (!badge) return;
    if (isAdminMode) {
        badge.innerHTML = '👑 管理员模式 (已启用)';
        badge.style.background = '#28a745';
    } else {
        badge.innerHTML = '🔒 管理员模式';
        badge.style.background = '#8B0000';
    }
}

function openAdminLoginModal() {
    const modal = document.getElementById('adminLoginModal');
    if (modal) modal.classList.add('active');
    const passwordInput = document.getElementById('adminPassword');
    if (passwordInput) passwordInput.value = '';
}

function closeAdminLoginModal() {
    const modal = document.getElementById('adminLoginModal');
    if (modal) modal.classList.remove('active');
}

function verifyAdmin() {
    const password = document.getElementById('adminPassword');
    if (!password) return;
    if (password.value === ADMIN_PASSWORD) {
        isAdminMode = true;
        sessionStorage.setItem('isAdminMode', 'true');
        closeAdminLoginModal();
        updateAdminBadge();
        renderResults();
        alert('管理员模式已启用！');
    } else {
        alert('密码错误！');
    }
}

function checkAdminMode() {
    const saved = sessionStorage.getItem('isAdminMode');
    if (saved === 'true') {
        isAdminMode = true;
    }
    updateAdminBadge();
}

// 下载文件
function downloadFile(dataUrl, fileName) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 图片预览
function previewImage(input) {
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            if (previewImg) previewImg.src = e.target.result;
            if (preview) preview.style.display = 'block';
            currentImageData = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        if (preview) preview.style.display = 'none';
        currentImageData = null;
    }
}

function previewFile(input) {
    const filePreview = document.getElementById('filePreview');
    const fileNameSpan = document.getElementById('fileName');
    
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const fileSize = file.size / 1024 / 1024;
        if (fileSize > 10) {
            alert('文件大小不能超过 10MB！');
            input.value = '';
            if (filePreview) filePreview.style.display = 'none';
            currentFileData = null;
            currentFileName = null;
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            currentFileData = e.target.result;
            currentFileName = file.name;
            if (fileNameSpan) fileNameSpan.innerHTML = `📎 已选择：${file.name}`;
            if (filePreview) filePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        if (filePreview) filePreview.style.display = 'none';
        currentFileData = null;
        currentFileName = null;
    }
}

function clearFile() {
    const fileInput = document.getElementById('resultFile');
    const filePreview = document.getElementById('filePreview');
    if (fileInput) fileInput.value = '';
    if (filePreview) filePreview.style.display = 'none';
    currentFileData = null;
    currentFileName = null;
}

function openAddResultModal() {
    const modal = document.getElementById('resultModal');
    if (modal) modal.classList.add('active');
    const form = document.getElementById('addResultForm');
    if (form) form.reset();
    const imagePreview = document.getElementById('imagePreview');
    const filePreview = document.getElementById('filePreview');
    if (imagePreview) imagePreview.style.display = 'none';
    if (filePreview) filePreview.style.display = 'none';
    currentImageData = null;
    currentFileData = null;
    currentFileName = null;
}

function closeModal() {
    const modal = document.getElementById('resultModal');
    if (modal) modal.classList.remove('active');
    const form = document.getElementById('addResultForm');
    if (form) form.reset();
    const imagePreview = document.getElementById('imagePreview');
    const filePreview = document.getElementById('filePreview');
    if (imagePreview) imagePreview.style.display = 'none';
    if (filePreview) filePreview.style.display = 'none';
    currentImageData = null;
    currentFileData = null;
    currentFileName = null;
}

// 添加新成果
async function addNewResult(type, title, imageData, link, fileData, fileName) {
    // ========== 必填项验证 ==========
    if (!type) {
        alert('请选择成果类型');
        return;
    }
    if (!title || title.trim() === '') {
        alert('请输入成果名称');
        return;
    }
    if (!imageData) {
        alert('请上传封面图片');
        return;
    }
    // ================================
    
    try {
        const newResult = await saveDataToGitHub(type, title, imageData, link, fileData, fileName);
        
        if (type === 'ongoing') {
            ongoingResults.push(newResult);
            localStorage.setItem(CURRENT_ONGOING_KEY, JSON.stringify(ongoingResults));
        } else {
            outputResults.push(newResult);
            localStorage.setItem(CURRENT_OUTPUT_KEY, JSON.stringify(outputResults));
        }
        
        renderResults();
        alert(`成果「${title}」已添加！当前共有 ${type === 'ongoing' ? ongoingResults.length : outputResults.length} 个成果。`);
    } catch (error) {
        console.error('添加失败:', error);
        alert('添加失败：' + error.message);
    }
}

// 初始化
async function initResultsPage() {
    checkAdminMode();
    
    // 先从 localStorage 读取缓存
    const cachedOngoing = localStorage.getItem(CURRENT_ONGOING_KEY);
    const cachedOutput = localStorage.getItem(CURRENT_OUTPUT_KEY);
    
    if (cachedOngoing && cachedOutput) {
        ongoingResults = JSON.parse(cachedOngoing);
        outputResults = JSON.parse(cachedOutput);
        renderResults();
    }
    
    // 再从 GitHub 刷新数据
    await loadDataFromGitHub();
}

// 表单提交事件
if (document.getElementById('addResultForm')) {
    document.getElementById('addResultForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const type = document.getElementById('resultType').value;
        const title = document.getElementById('resultTitle').value.trim();
        const link = document.getElementById('resultLink').value.trim();
        
        // ========== 必填项验证 ==========
        if (!type) {
            alert('请选择成果类型');
            return;
        }
        if (!title) {
            alert('请输入成果名称');
            return;
        }
        if (!currentImageData) {
            alert('请上传封面图片');
            return;
        }
        // ================================
        
        await addNewResult(type, title, currentImageData, link, currentFileData, currentFileName);
        closeModal();
    });
}

// 模态框背景关闭
if (document.getElementById('resultModal')) {
    document.getElementById('resultModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
}

if (document.getElementById('adminLoginModal')) {
    document.getElementById('adminLoginModal').addEventListener('click', function(e) {
        if (e.target === this) closeAdminLoginModal();
    });
}

// 右键退出管理员模式
document.addEventListener('contextmenu', function(e) {
    const badge = document.getElementById('adminBadge');
    if (badge && badge.contains(e.target)) {
        e.preventDefault();
        if (isAdminMode && confirm('退出管理员模式？')) {
            isAdminMode = false;
            sessionStorage.removeItem('isAdminMode');
            updateAdminBadge();
            renderResults();
            alert('已退出管理员模式');
        }
    }
});

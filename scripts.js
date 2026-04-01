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

// 查看当前有哪些成果
console.log(localStorage.getItem('ongoingResults'));
console.log(localStorage.getItem('outputResults'));

// 清空成果数据
localStorage.removeItem('ongoingResults');
localStorage.removeItem('outputResults');
location.reload();

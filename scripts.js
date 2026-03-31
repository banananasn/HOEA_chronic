// ========== 会议资讯数据 ==========
const newsCardsData = [
    { 
        title: "2025年9月26日 国家科技重大专项课题“整合式智慧慢病管理模式研究”启动会顺利举行", 
        url: "https://mp.weixin.qq.com/s/zj19z1DcZdE7bgmVevohcA",
        image: "images/250926启动会.jpg" 
    },
    { 
        title: "2026年1月29日 国家科技重大专项课题“整合式智慧慢病管理模式研究”年度研讨会顺利举行", 
        url: "https://mp.weixin.qq.com/s/RPzWc1Bv88lnvJsBbUJ32Q",
        image: "images/260129研讨会.jpg" 
    }
];

// ========== 调研访谈链接列表 ==========
const interviewLinks = [
    // { title: "2026年3月 某某专家访谈", url: "https://example.com/interview1" },
];

// ========== 研究成果文档列表 ==========
const documents = [
    { title: "研究成果-论文1：《柳叶刀-西太平洋》期刊发表中国版门急诊服务敏感疾病目录", url: "https://mp.weixin.qq.com/s/-RhQ7OUv2TKwkpLKOrL3fA" },
    { title: "研究成果-论文2：《四川大学学报（医学版）》期刊发表四川省德阳市罗江区医防融合创新实践分析", url: "https://mp.weixin.qq.com/s/umA2DdQ79LStldjVmP3-cg" }
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

// ========== 动态填充研究成果 ==========
function loadDocuments() {
    const documentSection = document.getElementById("documents");
    if (!documentSection) return;
    
    documents.forEach(doc => {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = doc.url;
        a.textContent = doc.title;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        p.appendChild(a);
        documentSection.appendChild(p);
    });
}

// ========== 页面加载时执行 ==========
if (document.getElementById('news-cards')) {
    loadNewsCards();
}

if (document.getElementById("interview-links")) {
    loadInterviewLinks();
}

if (document.getElementById("documents")) {
    loadDocuments();
}

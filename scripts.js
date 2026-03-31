// 会议资讯数据（包含标题、链接和图片地址）
const newsCardsData = [
    { title: "2025年9月26日 国家科技重大专项课题“整合式智慧慢病管理模式研究”启动会顺利举行", 
      url: "https://mp.weixin.qq.com/s/zj19z1DcZdE7bgmVevohcA",
      image: "images/250926启动会.jpg" },
    { title: "2026年1月29日 国家科技重大专项课题“整合式智慧慢病管理模式研究”年度研讨会顺利举行", 
      url: "https://mp.weixin.qq.com/s/RPzWc1Bv88lnvJsBbUJ32Q",
      image: "images/260129研讨会.jpg" }
];
// 动态生成会议资讯卡片
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
// 页面加载时调用
if (document.getElementById('news-cards')) {
    loadNewsCards();
}

// ========== 调研访谈链接列表 ==========
const interviewLinks = [
    // 在这里添加调研访谈的内容，格式如下：
    // { title: "2026年3月 某某专家访谈", url: "https://example.com/interview1" },
    // { title: "2026年2月 基层医疗机构调研", url: "https://example.com/interview2" }
];

// 示例：研究成果的文档列表
const documents = [
    { title: "研究成果-论文1：《柳叶刀-西太平洋》期刊发表中国版门急诊服务敏感疾病目录", 
      url: "https://mp.weixin.qq.com/s/-RhQ7OUv2TKwkpLKOrL3fA" ,
      image："images/王健健-lancet西太平洋.png" },
    { title: "研究成果-论文2：《四川大学学报（医学版）》期刊发表四川省德阳市罗江区医防融合创新实践分析", 
      url: "https://mp.weixin.qq.com/s/umA2DdQ79LStldjVmP3-cg" ,
      image："images/陈玺玥-川大学报.png" }
];
// 动态填充研究成果文档
function loadDocuments() {
    const container = document.getElementById('documents');
    if (!container) return;
    
    documents.forEach(item => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.onclick = () => window.open(item.url, '_blank');
        card.innerHTML = `
            <div class="card-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="card-title">${item.title}</div>
        `;
        container.appendChild(card);
    });
}

// 示例：研究动态的链接列表
const newsLinks = [
    { title: "2025年9月26日 国家科技重大专项课题“整合式智慧慢病管理模式研究”启动会顺利举行", url: "https://mp.weixin.qq.com/s/zj19z1DcZdE7bgmVevohcA" },
    { title: "2026年1月29日 国家科技重大专项课题“整合式智慧慢病管理模式研究”年度研讨会顺利举行", url: "https://mp.weixin.qq.com/s/RPzWc1Bv88lnvJsBbUJ32Q" },
    { title: "持续更新中", url: "https://example.com/news3" }
];

// 动态填充研究动态链接
const newsList = document.getElementById("news-links");
newsLinks.forEach(link => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = link.url;
    a.textContent = link.title;
    li.appendChild(a);
    newsList.appendChild(li);
});

// 示例：研究成果的文档列表
const documents = [
    { title: "研究成果-论文1：《柳叶刀-西太平洋》期刊发表中国版门急诊服务敏感疾病目录", url: "https://mp.weixin.qq.com/s/-RhQ7OUv2TKwkpLKOrL3fA" },
    { title: "研究成果-论文2：《四川大学学报（医学版）》期刊发表四川省德阳市罗江区医防融合创新实践分析", url: "https://mp.weixin.qq.com/s/umA2DdQ79LStldjVmP3-cg" }
];

// 动态填充研究成果文档
const documentSection = document.getElementById("documents");
documents.forEach(doc => {
    const p = document.createElement("p");
    const a = document.createElement("a");
    a.href = doc.url;
    a.textContent = doc.title;
    p.appendChild(a);
    documentSection.appendChild(p);
});

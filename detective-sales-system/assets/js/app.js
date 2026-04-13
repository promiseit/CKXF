// 全局变量
let cases = JSON.parse(localStorage.getItem('detective_cases')) || [];
let currentCase = null;

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化事件监听
    initEventListeners();
    // 渲染案件列表
    renderCaseList();
    // 加载示例数据（如果没有数据）
    loadSampleData();
});

// 初始化事件监听
function initEventListeners() {
    // 导航按钮
    document.getElementById('case-list-btn').addEventListener('click', showCaseList);
    document.getElementById('new-case-btn').addEventListener('click', showNewCaseForm);
    document.getElementById('start-case-btn').addEventListener('click', showNewCaseForm);
    document.getElementById('settings-btn').addEventListener('click', showSettings);
    
    // 新建案件表单
    document.getElementById('new-case-form').addEventListener('submit', handleNewCaseSubmit);
    
    // 编辑案件表单
    document.getElementById('edit-case-form').addEventListener('submit', handleEditCaseSubmit);
    
    // 案件详情页面
    document.getElementById('add-clue-btn').addEventListener('click', showAddClueModal);
    document.getElementById('add-clue-form').addEventListener('submit', handleAddClueSubmit);
    document.getElementById('generate-report-btn').addEventListener('click', generateReport);
    document.getElementById('download-report-btn').addEventListener('click', downloadReport);
    document.getElementById('export-ppt-btn').addEventListener('click', exportPPT);
    document.getElementById('next-step-btn').addEventListener('click', nextStep);
    document.getElementById('edit-case-btn').addEventListener('click', editCase);
    document.getElementById('delete-case-btn').addEventListener('click', deleteCase);
    
    // 关闭按钮
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.screen').classList.remove('active');
            document.getElementById('welcome-screen').classList.add('active');
        });
    });
    
    // 取消按钮
    document.querySelectorAll('.cancel-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.closest('.modal')) {
                this.closest('.modal').classList.remove('active');
            } else {
                this.closest('.screen').classList.remove('active');
                document.getElementById('welcome-screen').classList.add('active');
            }
        });
    });
    
    // 分析文本框保存
    document.querySelectorAll('.analysis-text').forEach(textarea => {
        textarea.addEventListener('input', function() {
            if (currentCase) {
                const step = this.id.split('-')[2];
                currentCase.analysis = currentCase.analysis || {};
                currentCase.analysis[step] = this.value;
                saveCases();
            }
        });
    });

    // AI分析按钮
    document.getElementById('ai-analyze-btn').addEventListener('click', function() {
        if (!currentCase || !currentCase.clues || currentCase.clues.length === 0) {
            showToast('请先添加线索');
            return;
        }
        
        const settings = loadSettings();
        const defaultModel = settings.defaultModel || 'wenxin';
        
        aiAnalyzeClues(defaultModel);
    });

    // 保存设置按钮
    document.getElementById('save-settings-btn').addEventListener('click', saveSettings);
    
    // 案件搜索
    document.getElementById('case-search').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const caseItems = document.querySelectorAll('.case-item');
        caseItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const client = item.querySelector('p').textContent.toLowerCase();
            if (title.includes(searchTerm) || client.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// 渲染案件列表
function renderCaseList() {
    const caseList = document.getElementById('case-list');
    caseList.innerHTML = '';
    
    if (cases.length === 0) {
        caseList.innerHTML = '<li class="case-item">暂无案件，点击"新建案件"开始</li>';
        return;
    }
    
    cases.forEach(caseItem => {
        const li = document.createElement('li');
        li.className = 'case-item';
        li.dataset.id = caseItem.id;
        
        const statusClass = `status-${caseItem.status}`;
        const statusText = getStatusText(caseItem.status);
        
        li.innerHTML = `
            <h3>${caseItem.title}</h3>
            <p>${caseItem.clientName}</p>
            <span class="case-status ${statusClass}">${statusText}</span>
        `;
        
        li.addEventListener('click', function() {
            loadCase(caseItem.id);
        });
        
        caseList.appendChild(li);
    });
}

// 加载案件详情
function loadCase(caseId) {
    currentCase = cases.find(c => c.id === caseId);
    if (!currentCase) return;
    
    // 显示案件详情页面
    hideAllScreens();
    document.getElementById('case-detail-screen').classList.add('active');
    
    // 更新案件信息
    document.getElementById('case-detail-title').textContent = currentCase.title;
    document.getElementById('detail-client-name').textContent = currentCase.clientName;
    document.getElementById('detail-created-at').textContent = formatDate(currentCase.createdAt);
    document.getElementById('detail-status').textContent = getStatusText(currentCase.status);
    
    // 更新状态栏
    updateStatusBar(currentCase.status);
    
    // 渲染线索列表
    renderClueList();
    
    // 加载分析数据
    loadAnalysisData();
    
    // 加载报告内容
    loadReportContent();
}

// 渲染线索列表
function renderClueList() {
    const clueList = document.getElementById('clue-list');
    clueList.innerHTML = '';
    
    if (!currentCase || !currentCase.clues || currentCase.clues.length === 0) {
        clueList.innerHTML = '<div class="no-clues">暂无线索，点击"添加线索"开始收集</div>';
        return;
    }
    
    currentCase.clues.forEach(clue => {
        const clueItem = document.createElement('div');
        clueItem.className = 'clue-item';
        
        const typeClass = `clue-type-${clue.type}`;
        const typeText = getClueTypeText(clue.type);
        const importanceStars = '★'.repeat(clue.importance) + '☆'.repeat(5 - clue.importance);
        
        clueItem.innerHTML = `
            <div class="clue-header">
                <span class="clue-type ${typeClass}">${typeText}</span>
                <span class="clue-importance">${importanceStars}</span>
            </div>
            <div class="clue-content">${clue.content}</div>
            <div class="clue-tags">
                ${clue.tags.map(tag => `<span class="clue-tag">${tag}</span>`).join('')}
            </div>
            <div class="clue-time">${formatDate(clue.timestamp)}</div>
        `;
        
        clueList.appendChild(clueItem);
    });
}

// 加载分析数据
function loadAnalysisData() {
    if (!currentCase || !currentCase.analysis) return;
    
    for (let i = 1; i <= 4; i++) {
        const analysisText = currentCase.analysis[i] || '';
        document.getElementById(`analysis-step${i}`).value = analysisText;
    }
}

// 加载报告内容
function loadReportContent() {
    const reportContent = document.getElementById('report-content');
    reportContent.innerHTML = '';

    if (!currentCase) return;

    reportContent.innerHTML = `
        <h4>案件概览</h4>
        <p><strong>案件名称：</strong>${currentCase.title}</p>
        <p><strong>客户名称：</strong>${currentCase.clientName}</p>
        <p><strong>案件状态：</strong>${getStatusText(currentCase.status)}</p>
        <p><strong>创建时间：</strong>${formatDate(currentCase.createdAt)}</p>

        <h4>线索统计</h4>
        <p>共收集 ${currentCase.clues ? currentCase.clues.length : 0} 条线索</p>

        <h4>分析结果</h4>
        <p><strong>1. 基础事实梳理：</strong>${currentCase.analysis?.[1] || '未填写'}</p>
        <p><strong>2. 关联线索发现：</strong>${currentCase.analysis?.[2] || '未填写'}</p>
        <p><strong>3. 潜在需求推断：</strong>${currentCase.analysis?.[3] || '未填写'}</p>
        <p><strong>4. 行动方案建议：</strong>${currentCase.analysis?.[4] || '未填写'}</p>
    `;
}

// 生成数据可视化图表
function generateCharts() {
    const chartContainer = document.querySelector('.chart-container');
    
    if (!currentCase || !currentCase.clues || currentCase.clues.length === 0) {
        // 显示无数据提示
        chartContainer.innerHTML = '<p>暂无足够数据生成图表</p>';
        return;
    }

    // 重新创建canvas元素
    chartContainer.innerHTML = `
        <canvas id="clueImportanceChart" width="400" height="300"></canvas>
        <canvas id="clueTypeChart" width="400" height="300"></canvas>
    `;

    // 生成线索重要性分布图表
    generateImportanceChart();
    // 生成线索类型分布图表
    generateTypeChart();
}

// 生成线索重要性分布图表
function generateImportanceChart() {
    const ctx = document.getElementById('clueImportanceChart').getContext('2d');
    
    // 统计各重要性级别的线索数量
    const importanceCounts = [0, 0, 0, 0, 0]; // 1-5星
    currentCase.clues.forEach(clue => {
        importanceCounts[clue.importance - 1]++;
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1星', '2星', '3星', '4星', '5星'],
            datasets: [{
                label: '线索数量',
                data: importanceCounts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(255, 205, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(54, 162, 235, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 205, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '线索重要性分布',
                    color: '#f1c40f',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#e0e0e0'
                    },
                    grid: {
                        color: 'rgba(241, 196, 15, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#e0e0e0'
                    },
                    grid: {
                        color: 'rgba(241, 196, 15, 0.1)'
                    }
                }
            }
        }
    });
}

// 生成线索类型分布图表
function generateTypeChart() {
    const ctx = document.getElementById('clueTypeChart').getContext('2d');
    
    // 统计各类型的线索数量
    const typeCounts = {};
    currentCase.clues.forEach(clue => {
        typeCounts[clue.type] = (typeCounts[clue.type] || 0) + 1;
    });

    const labels = Object.keys(typeCounts).map(type => getClueTypeText(type));
    const data = Object.values(typeCounts);
    const backgroundColors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 205, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)'
    ];

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors.slice(0, labels.length),
                borderColor: backgroundColors.slice(0, labels.length).map(color => color.replace('0.7', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '线索类型分布',
                    color: '#f1c40f',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    labels: {
                        color: '#e0e0e0'
                    }
                }
            }
        }
    });
}

// 显示新建案件表单
function showNewCaseForm() {
    hideAllScreens();
    document.getElementById('new-case-screen').classList.add('active');
}

// 处理新建案件提交
function handleNewCaseSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('case-title').value;
    const clientName = document.getElementById('client-name').value;
    const description = document.getElementById('case-description').value;
    
    const newCase = {
        id: Date.now().toString(),
        title,
        clientName,
        description,
        status: 'collecting',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        clues: [],
        analysis: {}
    };
    
    cases.push(newCase);
    saveCases();
    renderCaseList();
    
    // 显示欢迎页面
    document.getElementById('new-case-screen').classList.remove('active');
    document.getElementById('welcome-screen').classList.add('active');
    
    // 清空表单
    e.target.reset();
    
    // 显示成功提示
    showToast('案件创建成功！');
}

// 处理编辑案件提交
function handleEditCaseSubmit(e) {
    e.preventDefault();
    
    if (!currentCase) return;
    
    const title = document.getElementById('edit-case-title').value;
    const clientName = document.getElementById('edit-client-name').value;
    const description = document.getElementById('edit-case-description').value;
    
    // 更新案件数据
    currentCase.title = title;
    currentCase.clientName = clientName;
    currentCase.description = description;
    currentCase.updatedAt = new Date().toISOString();
    
    // 保存数据
    saveCases();
    renderCaseList();
    
    // 重新加载案件详情页面
    loadCase(currentCase.id);
    
    // 显示成功提示
    showToast('案件修改成功！');
}

// 显示添加线索弹窗
function showAddClueModal() {
    document.getElementById('add-clue-modal').classList.add('active');
}

// 处理添加线索提交
function handleAddClueSubmit(e) {
    e.preventDefault();
    
    if (!currentCase) return;
    
    const content = document.getElementById('clue-content').value;
    const type = document.getElementById('clue-type').value;
    const importance = parseInt(document.getElementById('clue-importance').value);
    const tags = document.getElementById('clue-tags').value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
    
    const newClue = {
        id: Date.now().toString(),
        type,
        content,
        source: 'manual',
        tags,
        timestamp: new Date().toISOString(),
        importance
    };
    
    currentCase.clues = currentCase.clues || [];
    currentCase.clues.push(newClue);
    currentCase.updatedAt = new Date().toISOString();
    
    saveCases();
    renderClueList();
    
    // 关闭弹窗
    document.getElementById('add-clue-modal').classList.remove('active');
    
    // 清空表单
    e.target.reset();
    
    // 显示成功提示
    showToast('线索添加成功！');
}

// 生成报告
function generateReport() {
    if (!currentCase) return;

    // 这里可以实现更复杂的报告生成逻辑
    // 目前只是更新报告内容
    loadReportContent();
    showToast('报告生成成功！');
}

// 下载报告
function downloadReport() {
    if (!currentCase) return;

    // 生成Word格式的报告内容（HTML格式）
    const reportContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>${currentCase.title} - 分析报告</title>
    <style>
        body {
            font-family: 'Microsoft YaHei', sans-serif;
            margin: 40px;
            line-height: 1.6;
        }
        h1 {
            color: #333;
            text-align: center;
            font-size: 24px;
            margin-bottom: 30px;
        }
        h2 {
            color: #555;
            font-size: 18px;
            margin-top: 25px;
            margin-bottom: 15px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }
        h3 {
            color: #666;
            font-size: 16px;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        p {
            margin-bottom: 10px;
            color: #333;
        }
        .info-item {
            margin-bottom: 8px;
        }
        .info-label {
            font-weight: bold;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 14px;
            color: #999;
            text-align: right;
        }
    </style>
</head>
<body>
    <h1>${currentCase.title} - 分析报告</h1>
    
    <h2>案件概览</h2>
    <div class="info-item"><span class="info-label">客户名称：</span>${currentCase.clientName}</div>
    <div class="info-item"><span class="info-label">案件状态：</span>${getStatusText(currentCase.status)}</div>
    <div class="info-item"><span class="info-label">创建时间：</span>${formatDate(currentCase.createdAt)}</div>
    
    <h2>线索统计</h2>
    <p>共收集 ${currentCase.clues ? currentCase.clues.length : 0} 条线索</p>
    
    <h2>分析结果</h2>
    <h3>1. 基础事实梳理</h3>
    <p>${currentCase.analysis?.[1] || '未填写'}</p>
    
    <h3>2. 关联线索发现</h3>
    <p>${currentCase.analysis?.[2] || '未填写'}</p>
    
    <h3>3. 潜在需求推断</h3>
    <p>${currentCase.analysis?.[3] || '未填写'}</p>
    
    <h3>4. 行动方案建议</h3>
    <p>${currentCase.analysis?.[4] || '未填写'}</p>
    
    <div class="footer">
        <p>报告生成时间：${formatDate(new Date().toISOString())}</p>
        <p>神探销售系统</p>
    </div>
</body>
</html>`;

    // 创建下载链接
    const blob = new Blob([reportContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentCase.title}_报告.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('报告下载成功！');
}

// 导出PPT
function exportPPT() {
    if (!currentCase) return;

    // 初始化图表数据
    let chartHtml = '';
    let importanceCounts = [0, 0, 0, 0, 0];
    let typeLabels = [];
    let typeData = [];

    if (currentCase.clues && currentCase.clues.length > 0) {
        // 统计线索重要性数据
        currentCase.clues.forEach(clue => {
            importanceCounts[clue.importance - 1]++;
        });

        // 统计线索类型数据
        const typeCounts = {};
        currentCase.clues.forEach(clue => {
            typeCounts[clue.type] = (typeCounts[clue.type] || 0) + 1;
        });
        typeLabels = Object.keys(typeCounts).map(type => getClueTypeText(type));
        typeData = Object.values(typeCounts);

        chartHtml = `
    <!-- 数据可视化 -->
    <div class="slide">
        <h2>数据可视化</h2>
        <div class="content" style="display: flex; flex-direction: column; gap: 20px;">
            <div style="display: flex; justify-content: space-around; align-items: flex-start; flex-wrap: wrap;">
                <div style="text-align: center; width: 45%; max-width: 400px;">
                    <h3>线索重要性分布</h3>
                    <div style="width: 100%; height: 300px; margin: 0 auto;">
                        <canvas id="importanceChart" style="max-width: 100%; height: 100%;"></canvas>
                    </div>
                </div>
                <div style="text-align: center; width: 45%; max-width: 400px;">
                    <h3>线索类型分布</h3>
                    <div style="width: 100%; height: 300px; margin: 0 auto;">
                        <canvas id="typeChart" style="max-width: 100%; height: 100%;"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>
        `;
    }

    // 生成PPT内容（HTML格式）
    const pptContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${currentCase.title} - PPT</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            font-family: 'Microsoft YaHei', sans-serif;
            margin: 0;
            padding: 0;
            background: #f5f5f5;
        }
        .slide {
            width: 900px;
            height: 600px;
            background: white;
            margin: 20px auto;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            page-break-after: always;
        }
        .title-slide {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        h1 {
            font-size: 2.5em;
            color: #333;
            margin-bottom: 20px;
        }
        h2 {
            font-size: 1.8em;
            color: #555;
            margin-bottom: 15px;
        }
        h3 {
            font-size: 1.4em;
            color: #666;
            margin-bottom: 10px;
        }
        p {
            font-size: 1.1em;
            line-height: 1.6;
            color: #333;
        }
        .content {
            margin-top: 30px;
        }
        .footer {
            margin-top: 40px;
            font-size: 0.9em;
            color: #999;
            text-align: center;
        }
    </style>
</head>
<body>
    <!-- 标题页 -->
    <div class="slide title-slide">
        <h1>${currentCase.title}</h1>
        <h2>客户：${currentCase.clientName}</h2>
        <p>案件状态：${getStatusText(currentCase.status)}</p>
        <p>生成时间：${formatDate(new Date().toISOString())}</p>
    </div>

    <!-- 案件概览 -->
    <div class="slide">
        <h2>案件概览</h2>
        <div class="content">
            <p><strong>客户名称：</strong>${currentCase.clientName}</p>
            <p><strong>案件状态：</strong>${getStatusText(currentCase.status)}</p>
            <p><strong>创建时间：</strong>${formatDate(currentCase.createdAt)}</p>
            <p><strong>线索数量：</strong>${currentCase.clues ? currentCase.clues.length : 0}</p>
        </div>
    </div>

    ${chartHtml}

    <!-- 分析结果 -->
    <div class="slide">
        <h2>分析结果</h2>
        <div class="content">
            <h3>1. 基础事实梳理</h3>
            <p>${currentCase.analysis?.[1] || '未填写'}</p>
        </div>
    </div>

    <div class="slide">
        <h2>分析结果</h2>
        <div class="content">
            <h3>2. 关联线索发现</h3>
            <p>${currentCase.analysis?.[2] || '未填写'}</p>
        </div>
    </div>

    <div class="slide">
        <h2>分析结果</h2>
        <div class="content">
            <h3>3. 潜在需求推断</h3>
            <p>${currentCase.analysis?.[3] || '未填写'}</p>
        </div>
    </div>

    <div class="slide">
        <h2>分析结果</h2>
        <div class="content">
            <h3>4. 行动方案建议</h3>
            <p>${currentCase.analysis?.[4] || '未填写'}</p>
        </div>
    </div>

    <!-- 总结页 -->
    <div class="slide">
        <h2>总结</h2>
        <div class="content">
            <p>本报告基于收集的线索和分析结果生成，</p>
            <p>为销售决策提供参考依据。</p>
        </div>
        <div class="footer">
            神探销售系统 - ${formatDate(new Date().toISOString())}
        </div>
    </div>

    <script>
        // 初始化图表
        document.addEventListener('DOMContentLoaded', function() {
            // 线索重要性分布图表
            const importanceCtx = document.getElementById('importanceChart');
            if (importanceCtx) {
                new Chart(importanceCtx, {
                    type: 'bar',
                    data: {
                        labels: ['1星', '2星', '3星', '4星', '5星'],
                        datasets: [{
                            label: '线索数量',
                            data: ${JSON.stringify(importanceCounts)},
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.7)',
                                'rgba(255, 159, 64, 0.7)',
                                'rgba(255, 205, 86, 0.7)',
                                'rgba(75, 192, 192, 0.7)',
                                'rgba(54, 162, 235, 0.7)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(255, 159, 64, 1)',
                                'rgba(255, 205, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(54, 162, 235, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }

            // 线索类型分布图表
            const typeCtx = document.getElementById('typeChart');
            if (typeCtx) {
                new Chart(typeCtx, {
                    type: 'pie',
                    data: {
                        labels: ${JSON.stringify(typeLabels)},
                        datasets: [{
                            data: ${JSON.stringify(typeData)},
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.7)',
                                'rgba(54, 162, 235, 0.7)',
                                'rgba(255, 205, 86, 0.7)',
                                'rgba(75, 192, 192, 0.7)',
                                'rgba(153, 102, 255, 0.7)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 205, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
            }
        });
    </script>
</body>
</html>`;

    // 创建下载链接
    const blob = new Blob([pptContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentCase.title}_PPT.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('PPT导出成功！请注意：这是HTML格式的PPT，可在浏览器中打开查看。');
}

// 下一步
function nextStep() {
    if (!currentCase) return;
    
    const statusOrder = ['collecting', 'analyzing', 'reporting', 'closed'];
    const currentIndex = statusOrder.indexOf(currentCase.status);
    
    if (currentIndex < statusOrder.length - 1) {
        currentCase.status = statusOrder[currentIndex + 1];
        currentCase.updatedAt = new Date().toISOString();
        saveCases();
        updateStatusBar(currentCase.status);
        document.getElementById('detail-status').textContent = getStatusText(currentCase.status);
        showToast(`案件状态已更新为：${getStatusText(currentCase.status)}`);
    } else {
        showToast('案件已经是最终状态');
    }
}

// 编辑案件
function editCase() {
    if (!currentCase) return;
    
    // 填充当前案件数据到表单
    document.getElementById('edit-case-title').value = currentCase.title;
    document.getElementById('edit-client-name').value = currentCase.clientName;
    document.getElementById('edit-case-description').value = currentCase.description || '';
    
    // 显示编辑案件页面
    hideAllScreens();
    document.getElementById('edit-case-screen').classList.add('active');
}

// 删除案件
function deleteCase() {
    if (!currentCase) return;
    
    if (confirm('确定要删除这个案件吗？此操作不可恢复。')) {
        cases = cases.filter(c => c.id !== currentCase.id);
        saveCases();
        renderCaseList();
        
        // 显示欢迎页面
        document.getElementById('case-detail-screen').classList.remove('active');
        document.getElementById('welcome-screen').classList.add('active');
        
        currentCase = null;
        showToast('案件删除成功！');
    }
}

// 显示案件列表
function showCaseList() {
    hideAllScreens();
    document.getElementById('welcome-screen').classList.add('active');
    renderCaseList();
}

// 显示设置页面
function showSettings() {
    hideAllScreens();
    document.getElementById('settings-screen').classList.add('active');
    loadSettingsToForm();
}

// 隐藏所有页面
function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// 加载设置
function loadSettings() {
    return JSON.parse(localStorage.getItem('detective_settings')) || {
        defaultModel: 'wenxin',
        apiKey: '',
        apiUrl: ''
    };
}

// 保存设置
function saveSettings() {
    const settings = {
        defaultModel: document.getElementById('default-ai-model').value,
        apiKey: document.getElementById('ai-api-key').value,
        apiUrl: document.getElementById('ai-api-url').value
    };
    
    localStorage.setItem('detective_settings', JSON.stringify(settings));
    showToast('设置保存成功！');
}

// 加载设置到表单
function loadSettingsToForm() {
    const settings = loadSettings();
    document.getElementById('default-ai-model').value = settings.defaultModel || 'wenxin';
    document.getElementById('ai-api-key').value = settings.apiKey || '';
    document.getElementById('ai-api-url').value = settings.apiUrl || '';
}

// 更新状态栏
function updateStatusBar(status) {
    const statusSteps = document.querySelectorAll('.status-step');
    statusSteps.forEach(step => {
        step.classList.remove('active');
    });
    
    const statusOrder = ['collecting', 'analyzing', 'reporting', 'closed'];
    const currentIndex = statusOrder.indexOf(status);
    
    for (let i = 0; i <= currentIndex; i++) {
        const step = document.querySelector(`.status-step[data-step="${statusOrder[i]}"]`);
        if (step) step.classList.add('active');
    }
}

// 保存案件数据
function saveCases() {
    localStorage.setItem('detective_cases', JSON.stringify(cases));
}

// 加载示例数据
function loadSampleData() {
    if (cases.length === 0) {
        const sampleCase = {
            id: '1',
            title: 'ABC公司采购项目',
            clientName: 'ABC科技有限公司',
            description: 'ABC公司正在寻找新的供应商，需要分析他们的需求和预算',
            status: 'collecting',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            clues: [
                {
                    id: '101',
                    type: 'text',
                    content: '客户提到他们的预算在100-150万之间',
                    source: 'manual',
                    tags: ['预算', '采购'],
                    timestamp: new Date().toISOString(),
                    importance: 4
                },
                {
                    id: '102',
                    type: 'text',
                    content: '客户对产品质量有很高要求，希望提供样品',
                    source: 'manual',
                    tags: ['质量', '样品'],
                    timestamp: new Date().toISOString(),
                    importance: 5
                }
            ],
            analysis: {
                '1': '客户需要采购一批设备，预算100-150万，对质量要求高',
                '2': '客户提到了竞争对手X公司，可能已经在接触',
                '3': '客户可能担心我们的交货周期',
                '4': '建议提供详细的产品方案和样品，强调我们的质量优势'
            }
        };
        
        cases.push(sampleCase);
        saveCases();
        renderCaseList();
    }
}

// 辅助函数
function getStatusText(status) {
    const statusMap = {
        collecting: '收集线索',
        analyzing: '分析推理',
        reporting: '生成报告',
        closed: '结案'
    };
    return statusMap[status] || status;
}

function getClueTypeText(type) {
    const typeMap = {
        text: '文本',
        file: '文件',
        image: '图片',
        audio: '音频'
    };
    return typeMap[type] || type;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showToast(message) {
    // 创建提示元素
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    // 添加到页面
    document.body.appendChild(toast);

    // 显示动画
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // 3秒后自动消失
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// AI分析线索
function aiAnalyzeClues(model) {
    showToast('AI分析中，请稍候...');
    
    // 模拟API调用延迟
    setTimeout(() => {
        if (!currentCase) return;
        
        // 提取线索信息
        const clues = currentCase.clues.map(clue => {
            return {
                content: clue.content,
                type: getClueTypeText(clue.type),
                importance: clue.importance,
                tags: clue.tags.join(', ')
            };
        });
        
        // 生成分析结果（模拟）
        const analysisResults = generateAIResults(model, clues, currentCase.title, currentCase.clientName);
        
        // 更新分析文本框
        for (let i = 1; i <= 4; i++) {
            const analysisText = analysisResults[i-1];
            if (analysisText) {
                document.getElementById(`analysis-step${i}`).value = analysisText;
                currentCase.analysis = currentCase.analysis || {};
                currentCase.analysis[i] = analysisText;
            }
        }
        
        saveCases();
        showToast('AI分析完成！');
    }, 1500);
}

// 生成AI分析结果（模拟）
function generateAIResults(model, clues, caseTitle, clientName) {
    // 根据不同模型生成不同风格的分析结果
    const modelResponses = {
        wenxin: [
            `根据收集到的线索，${clientName}的${caseTitle}项目涉及以下基础事实：\n${clues.map(clue => `- ${clue.content}`).join('\n')}`,
            `通过分析线索之间的关联，发现：\n1. 线索之间存在明显的关联关系\n2. 重要线索集中在特定领域\n3. 不同类型的线索相互印证`,
            `基于线索分析，${clientName}可能存在以下潜在需求：\n1. 对产品质量的高要求\n2. 对价格的敏感性\n3. 对服务响应速度的期待`,
            `建议采取以下行动方案：\n1. 提供详细的产品方案和样品\n2. 制定有竞争力的价格策略\n3. 建立快速响应机制\n4. 定期跟进客户需求变化`
        ],
        tongyi: [
            `经过对${clientName}${caseTitle}项目线索的梳理，确认以下基础事实：\n${clues.map(clue => `${clue.type}线索：${clue.content}`).join('\n')}`,
            `线索关联分析：\n- 重要性较高的线索集中在产品质量和价格方面\n- 不同来源的线索相互补充，形成完整的需求画像\n- 客户关注的核心问题清晰可见`,
            `潜在需求推断：\n1. 产品性能和可靠性是首要考虑因素\n2. 预算控制是重要决策因素\n3. 希望获得个性化的解决方案\n4. 重视长期合作关系`,
            `行动建议：\n1. 针对客户核心需求提供定制化方案\n2. 突出产品的质量优势和性价比\n3. 建立专门的客户对接团队\n4. 制定长期合作计划`
        ],
        deepseek: [
            `基础事实梳理：\n${clues.map((clue, index) => `${index + 1}. [${clue.importance}星] ${clue.content} (标签: ${clue.tags})`).join('\n')}`,
            `关联线索发现：\n通过对线索的语义分析，发现多个线索指向同一核心需求，不同类型的线索相互验证，形成了较为完整的客户需求画像。`,
            `潜在需求推断：\n基于线索分析，客户可能存在未明确表达的深层需求，包括对产品稳定性的担忧、对服务支持的期望，以及对成本效益的平衡考虑。`,
            `行动方案建议：\n1. 针对核心需求提供详细的解决方案\n2. 主动回应客户可能的担忧\n3. 提供透明的价格结构\n4. 建立定期沟通机制\n5. 提供个性化的服务支持`
        ],
        doubao: [
            `根据收集到的线索，为您梳理${clientName}${caseTitle}项目的基础事实：\n${clues.map(clue => `• ${clue.content}`).join('\n')}`,
            `线索关联分析：\n仔细分析这些线索，我发现它们之间存在密切的联系。客户关注的重点主要集中在产品质量、价格合理性和服务支持三个方面，这些因素共同影响着客户的决策过程。`,
            `潜在需求推断：\n通过对线索的深度分析，我认为客户可能还有以下潜在需求：\n- 希望获得长期稳定的合作关系\n- 对产品的技术支持有较高期待\n- 可能面临内部决策流程的挑战\n- 对供应商的可靠性有较高要求`,
            `行动方案建议：\n为了更好地满足客户需求，建议采取以下行动：\n1. 提供详细的产品技术文档和案例\n2. 制定灵活的价格方案\n3. 建立专门的客户服务团队\n4. 提供定期的产品培训和技术支持\n5. 建立客户反馈机制，及时调整方案`
        ]
    };
    
    return modelResponses[model] || modelResponses.wenxin;
}

// 添加提示样式
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(241, 196, 15, 0.9);
        color: #1a1a2e;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        font-weight: bold;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
    
    .toast.show {
        transform: translateX(0);
    }
`;
document.head.appendChild(toastStyle);
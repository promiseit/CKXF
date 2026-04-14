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
    // 案件操作
    document.getElementById('prev-step-btn').addEventListener('click', prevStep);
    document.getElementById('next-step-btn').addEventListener('click', nextStep);
    document.getElementById('edit-case-btn').addEventListener('click', editCase);
    document.getElementById('delete-case-btn').addEventListener('click', deleteCase); 关闭按钮
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

    // 编辑线索表单
    document.getElementById('edit-clue-form').addEventListener('submit', handleEditClueSubmit);

    // 保存设置按钮
    document.getElementById('save-settings-btn').addEventListener('click', saveSettings);
    
    // 测试API按钮
    document.getElementById('test-api-btn').addEventListener('click', testAPI);
    
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
            <div class="case-item-content">
                <h3>${caseItem.title}</h3>
                <p>${caseItem.clientName}</p>
                <span class="case-status ${statusClass}">${statusText}</span>
            </div>
            <button class="case-delete-btn" data-id="${caseItem.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        // 点击案件内容加载详情
        const content = li.querySelector('.case-item-content');
        content.addEventListener('click', function() {
            loadCase(caseItem.id);
        });
        
        // 点击删除按钮删除案件
        const deleteBtn = li.querySelector('.case-delete-btn');
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            if (confirm('确定要删除这个案件吗？此操作不可恢复。')) {
                cases = cases.filter(c => c.id !== caseItem.id);
                saveCases();
                renderCaseList();
                showToast('案件删除成功！');
            }
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
                <div class="clue-actions">
                    <button class="clue-edit-btn" data-id="${clue.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="clue-delete-btn" data-id="${clue.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="clue-content">${clue.content}</div>
            <div class="clue-tags">
                ${clue.tags.map(tag => `<span class="clue-tag">${tag}</span>`).join('')}
            </div>
            <div class="clue-time">${formatDate(clue.timestamp)}</div>
        `;
        
        // 编辑按钮点击事件
        const editBtn = clueItem.querySelector('.clue-edit-btn');
        editBtn.addEventListener('click', function() {
            showEditClueModal(clue.id);
        });
        
        // 删除按钮点击事件
        const deleteBtn = clueItem.querySelector('.clue-delete-btn');
        deleteBtn.addEventListener('click', function() {
            if (confirm('确定要删除这条线索吗？此操作不可恢复。')) {
                currentCase.clues = currentCase.clues.filter(c => c.id !== clue.id);
                currentCase.updatedAt = new Date().toISOString();
                saveCases();
                renderClueList();
                showToast('线索删除成功！');
            }
        });
        
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

    // 从分析文本框中获取最新内容
    const analysis1 = document.getElementById('analysis-step1').value;
    const analysis2 = document.getElementById('analysis-step2').value;
    const analysis3 = document.getElementById('analysis-step3').value;
    const analysis4 = document.getElementById('analysis-step4').value;

    // 更新案件分析数据
    currentCase.analysis = currentCase.analysis || {};
    currentCase.analysis[1] = analysis1;
    currentCase.analysis[2] = analysis2;
    currentCase.analysis[3] = analysis3;
    currentCase.analysis[4] = analysis4;
    saveCases();

    reportContent.innerHTML = `
        <h4>案件概览</h4>
        <p><strong>案件名称：</strong>${currentCase.title}</p>
        <p><strong>客户名称：</strong>${currentCase.clientName}</p>
        <p><strong>案件状态：</strong>${getStatusText(currentCase.status)}</p>
        <p><strong>创建时间：</strong>${formatDate(currentCase.createdAt)}</p>

        <h4>线索统计</h4>
        <p>共收集 ${currentCase.clues ? currentCase.clues.length : 0} 条线索</p>

        <h4>分析结果</h4>
        <p><strong>1. 基础事实梳理：</strong>${analysis1 || '未填写'}</p>
        <p><strong>2. 关联线索发现：</strong>${analysis2 || '未填写'}</p>
        <p><strong>3. 潜在需求推断：</strong>${analysis3 || '未填写'}</p>
        <p><strong>4. 行动方案建议：</strong>${analysis4 || '未填写'}</p>
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

// 显示编辑线索弹窗
function showEditClueModal(clueId) {
    if (!currentCase) return;
    
    const clue = currentCase.clues.find(c => c.id === clueId);
    if (!clue) return;
    
    // 填充表单数据
    document.getElementById('edit-clue-id').value = clue.id;
    document.getElementById('edit-clue-content').value = clue.content;
    document.getElementById('edit-clue-type').value = clue.type;
    document.getElementById('edit-clue-importance').value = clue.importance;
    document.getElementById('edit-clue-tags').value = clue.tags.join(', ');
    
    // 显示弹窗
    document.getElementById('edit-clue-modal').classList.add('active');
}

// 处理编辑线索提交
function handleEditClueSubmit(e) {
    e.preventDefault();
    
    if (!currentCase) return;
    
    const clueId = document.getElementById('edit-clue-id').value;
    const content = document.getElementById('edit-clue-content').value;
    const type = document.getElementById('edit-clue-type').value;
    const importance = parseInt(document.getElementById('edit-clue-importance').value);
    const tags = document.getElementById('edit-clue-tags').value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
    
    // 找到并更新线索
    const clueIndex = currentCase.clues.findIndex(c => c.id === clueId);
    if (clueIndex !== -1) {
        currentCase.clues[clueIndex] = {
            ...currentCase.clues[clueIndex],
            content,
            type,
            importance,
            tags,
            timestamp: new Date().toISOString()
        };
        currentCase.updatedAt = new Date().toISOString();
        
        saveCases();
        renderClueList();
        
        // 关闭弹窗
        document.getElementById('edit-clue-modal').classList.remove('active');
        
        // 显示成功提示
        showToast('线索修改成功！');
    }
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

// 上一步
function prevStep() {
    if (!currentCase) return;
    
    const statusOrder = ['collecting', 'analyzing', 'reporting', 'closed'];
    const currentIndex = statusOrder.indexOf(currentCase.status);
    
    if (currentIndex > 0) {
        currentCase.status = statusOrder[currentIndex - 1];
        currentCase.updatedAt = new Date().toISOString();
        saveCases();
        updateStatusBar(currentCase.status);
        document.getElementById('detail-status').textContent = getStatusText(currentCase.status);
        showToast(`案件状态已回退为：${getStatusText(currentCase.status)}`);
    } else {
        showToast('案件已经是初始状态');
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

// 简单加密函数
function encryptData(data) {
    if (!data) return '';
    const key = 'detective_sales_system_secret_key_2024';
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        encrypted += String.fromCharCode(charCode);
    }
    return btoa(encrypted);
}

// 简单解密函数
function decryptData(encryptedData) {
    if (!encryptedData) return '';
    try {
        const key = 'detective_sales_system_secret_key_2024';
        const decoded = atob(encryptedData);
        let decrypted = '';
        for (let i = 0; i < decoded.length; i++) {
            const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            decrypted += String.fromCharCode(charCode);
        }
        return decrypted;
    } catch (e) {
        return '';
    }
}

// 加载设置
function loadSettings() {
    const storedSettings = localStorage.getItem('detective_settings');
    if (!storedSettings) {
        return {
            defaultModel: 'wenxin',
            apiKey: '',
            apiUrl: '',
            modelId: ''
        };
    }
    
    try {
        const settings = JSON.parse(storedSettings);
        return {
            defaultModel: settings.defaultModel || 'wenxin',
            apiKey: decryptData(settings.apiKey) || '',
            apiUrl: decryptData(settings.apiUrl) || '',
            modelId: decryptData(settings.modelId) || ''
        };
    } catch (e) {
        return {
            defaultModel: 'wenxin',
            apiKey: '',
            apiUrl: '',
            modelId: ''
        };
    }
}

// 保存设置
function saveSettings() {
    const settings = {
        defaultModel: document.getElementById('default-ai-model').value,
        apiKey: encryptData(document.getElementById('ai-api-key').value),
        apiUrl: encryptData(document.getElementById('ai-api-url').value),
        modelId: encryptData(document.getElementById('ai-model-id').value)
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
    document.getElementById('ai-model-id').value = settings.modelId || '';
}

// 测试API连接
async function testAPI() {
    const settings = loadSettings();
    const apiKey = settings.apiKey;
    const apiUrl = settings.apiUrl;
    const modelId = settings.modelId;
    const model = settings.defaultModel || 'wenxin';
    
    if (!apiKey) {
        showToast('请先配置API Key');
        return;
    }
    
    showToast('正在测试API连接...');
    console.log('开始测试API，模型:', model);
    
    try {
        const testPrompt = '请回复"API连接成功"';
        
        let response;
        switch (model) {
            case 'wenxin':
                response = await callWenxinAPI(apiKey, apiUrl, testPrompt);
                break;
            case 'tongyi':
                response = await callTongyiAPI(apiKey, apiUrl, testPrompt);
                break;
            case 'deepseek':
                response = await callDeepseekAPI(apiKey, apiUrl, testPrompt);
                break;
            case 'doubao':
                response = await callDoubaoAPI(apiKey, apiUrl, testPrompt, modelId);
                break;
            default:
                throw new Error('不支持的模型');
        }
        
        if (response) {
            showToast('API连接成功！');
            console.log('API测试成功，响应:', response);
        } else {
            throw new Error('未获取到响应');
        }
    } catch (error) {
        console.error('API测试失败:', error);
        
        let errorMessage = error.message;
        if (error.message.includes('Failed to fetch')) {
            errorMessage = '网络错误或CORS限制，请使用代理服务器';
        }
        
        showToast(`API测试失败：${errorMessage}`);
    }
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

// 构建提示词
function buildPrompt(clues, caseTitle, clientName) {
    const cluesText = clues.map(clue => 
        `- 线索内容：${clue.content}\n  类型：${clue.type}\n  重要性：${clue.importance}星\n  标签：${clue.tags}`
    ).join('\n\n');
    
    return `请分析以下销售线索，为${clientName}的${caseTitle}项目提供分析。

请详细分析每个线索之间的关联，挖掘潜在的深层需求，提供全面而深入的分析。

线索信息：
${cluesText}

请按以下格式返回JSON：
{
  "step1": "基础事实梳理",
  "step2": "关键线索发现",
  "step3": "潜在需求推断",
  "step4": "行动方案建议"
}

请直接返回JSON，不要有其他文字。`;
}

// 调用后端API
async function callBackendAPI(model, apiKey, apiUrl, prompt, modelId) {
    const backendUrl = 'http://localhost:3001/api/ai-analyze';
    
    console.log('调用后端API，URL:', backendUrl, '模型:', model);
    
    try {
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model,
                apiKey,
                apiUrl,
                prompt,
                modelId
            })
        });
        
        console.log('后端响应状态:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('后端错误响应:', errorData);
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('后端响应数据:', data);
        
        if (!data.success) {
            throw new Error(data.error || 'Backend API error');
        }
        
        return data.response;
    } catch (error) {
        console.error('后端API调用失败:', error);
        throw error;
    }
}

// 调用文心一言API
async function callWenxinAPI(apiKey, apiUrl, prompt) {
    return await callBackendAPI('wenxin', apiKey, apiUrl, prompt);
}

// 调用通义千问API
async function callTongyiAPI(apiKey, apiUrl, prompt) {
    return await callBackendAPI('tongyi', apiKey, apiUrl, prompt);
}

// 调用DeepSeek API
async function callDeepseekAPI(apiKey, apiUrl, prompt) {
    return await callBackendAPI('deepseek', apiKey, apiUrl, prompt);
}

// 调用豆包API
async function callDoubaoAPI(apiKey, apiUrl, prompt, modelId) {
    return await callBackendAPI('doubao', apiKey, apiUrl, prompt, modelId);
}

// 解析AI返回的JSON
function parseAIResponse(response) {
    try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return JSON.parse(response);
    } catch (e) {
        const steps = response.split(/\d\.\s*|步骤|基础|关键|潜在|行动/).filter(s => s.trim());
        return {
            step1: steps[0]?.trim() || '',
            step2: steps[1]?.trim() || '',
            step3: steps[2]?.trim() || '',
            step4: steps[3]?.trim() || ''
        };
    }
}

// 智能本地分析（降级方案）
function generateLocalAnalysis(clues, caseTitle, clientName) {
    // 提取所有线索内容
    const allClueContent = clues.map(c => c.content).join(' ');
    
    // 关键词检测
    const keywords = {
        budget: ['预算', '价格', '费用', '成本', '便宜', '贵', '性价比'],
        quality: ['质量', '品质', '性能', '可靠性', '稳定', '耐用'],
        service: ['服务', '售后', '支持', '响应', '技术', '维护'],
        time: ['时间', '周期', '交货', '交付', '尽快', '紧急'],
        competitor: ['竞品', '竞争对手', '其他公司', 'X公司', '同行'],
        sample: ['样品', '试用', '测试', '演示'],
        custom: ['定制', '个性化', '特殊', '专门']
    };
    
    const detectedKeywords = {};
    for (const [key, words] of Object.entries(keywords)) {
        detectedKeywords[key] = words.some(word => allClueContent.includes(word));
    }
    
    // 随机变体
    const randomVariation = Math.floor(Math.random() * 3);
    
    // 根据检测到的关键词生成个性化分析
    const generateStep1 = () => {
        const base = `根据收集到的线索，${clientName}的${caseTitle}项目涉及以下基础事实：`;
        const variations = [
            clues.map(clue => `- ${clue.content}`).join('\n'),
            clues.map((clue, i) => `${i + 1}. ${clue.content} (${clue.importance}星重要)`).join('\n'),
            clues.map(clue => `• [${clue.type}] ${clue.content}`).join('\n')
        ];
        return `${base}\n${variations[randomVariation]}`;
    };
    
    const generateStep2 = () => {
        let findings = [];
        if (detectedKeywords.budget && detectedKeywords.quality) {
            findings.push('客户同时关注价格和质量，寻求高性价比解决方案');
        } else if (detectedKeywords.budget) {
            findings.push('预算是客户的核心考虑因素');
        } else if (detectedKeywords.quality) {
            findings.push('产品质量是客户最关注的要点');
        }
        
        if (detectedKeywords.service) {
            findings.push('客户对售后服务和技术支持有较高要求');
        }
        if (detectedKeywords.time) {
            findings.push('项目时间周期是重要考量因素');
        }
        if (detectedKeywords.competitor) {
            findings.push('客户可能正在与其他供应商接触');
        }
        
        if (findings.length === 0) {
            findings = [
                '线索之间存在一定的关联性',
                '需要进一步收集更多信息',
                '客户需求正在逐步明确'
            ];
        }
        
        const introVariations = [
            '通过分析线索之间的关联，发现：',
            '线索关联分析结果：',
            '深入分析线索后发现：'
        ];
        
        return `${introVariations[randomVariation]}\n${findings.map((f, i) => `${i + 1}. ${f}`).join('\n')}`;
    };
    
    const generateStep3 = () => {
        let needs = [];
        if (detectedKeywords.sample) {
            needs.push('希望先看到样品或进行测试');
        }
        if (detectedKeywords.custom) {
            needs.push('可能需要定制化的解决方案');
        }
        if (detectedKeywords.quality && !detectedKeywords.budget) {
            needs.push('对产品稳定性和可靠性有较高期待');
        }
        if (detectedKeywords.service) {
            needs.push('重视长期的技术支持和维护服务');
        }
        if (detectedKeywords.competitor) {
            needs.push('可能在比较多家供应商的方案');
        }
        if (detectedKeywords.time) {
            needs.push('可能有较紧急的时间要求');
        }
        
        if (needs.length === 0) {
            needs = [
                '需要进一步了解客户的深层需求',
                '建议与客户进行更深入的沟通',
                '可能存在未明确表达的需求'
            ];
        }
        
        const introVariations = [
            `基于线索分析，${clientName}可能存在以下潜在需求：`,
            '潜在需求推断：',
            '客户可能还有以下需求：'
        ];
        
        return `${introVariations[randomVariation]}\n${needs.map((n, i) => `${i + 1}. ${n}`).join('\n')}`;
    };
    
    const generateStep4 = () => {
        let actions = [];
        if (detectedKeywords.sample) {
            actions.push('尽快准备样品供客户测试');
        }
        if (detectedKeywords.custom) {
            actions.push('提供定制化的解决方案');
        }
        if (detectedKeywords.quality) {
            actions.push('重点展示产品的质量优势和可靠性');
        }
        if (detectedKeywords.budget) {
            actions.push('制定有竞争力的价格方案');
        }
        if (detectedKeywords.service) {
            actions.push('提供详细的售后服务方案');
        }
        if (detectedKeywords.time) {
            actions.push('明确项目时间计划和交付周期');
        }
        if (detectedKeywords.competitor) {
            actions.push('突出我们的差异化优势');
        }
        
        if (actions.length === 0) {
            actions = [
                '与客户进行深入沟通',
                '准备详细的产品方案',
                '安排产品演示',
                '定期跟进客户反馈'
            ];
        }
        
        const introVariations = [
            '建议采取以下行动方案：',
            '行动建议：',
            '为了更好地满足客户需求，建议：'
        ];
        
        return `${introVariations[randomVariation]}\n${actions.map((a, i) => `${i + 1}. ${a}`).join('\n')}`;
    };
    
    return {
        step1: generateStep1(),
        step2: generateStep2(),
        step3: generateStep3(),
        step4: generateStep4()
    };
}

// AI分析线索
async function aiAnalyzeClues(model) {
    if (!currentCase) return;
    
    const settings = loadSettings();
    const apiKey = settings.apiKey;
    const apiUrl = settings.apiUrl;
    const modelId = settings.modelId;
    
    showToast('AI分析中，请稍候...');
    
    try {
        // 提取线索信息
        const clues = currentCase.clues.map(clue => ({
            content: clue.content,
            type: getClueTypeText(clue.type),
            importance: clue.importance,
            tags: clue.tags.join(', ')
        }));
        
        let analysisResults;
        
        // 如果配置了API Key，先尝试调用真实API
        if (apiKey) {
            try {
                const prompt = buildPrompt(clues, currentCase.title, currentCase.clientName);
                
                let response;
                switch (model) {
                    case 'wenxin':
                        response = await callWenxinAPI(apiKey, apiUrl, prompt);
                        break;
                    case 'tongyi':
                        response = await callTongyiAPI(apiKey, apiUrl, prompt);
                        break;
                    case 'deepseek':
                        response = await callDeepseekAPI(apiKey, apiUrl, prompt);
                        break;
                    case 'doubao':
                        response = await callDoubaoAPI(apiKey, apiUrl, prompt, modelId);
                        break;
                    default:
                        throw new Error('不支持的模型');
                }
                
                if (!response) {
                    throw new Error('未获取到AI响应');
                }
                
                analysisResults = parseAIResponse(response);
                showToast('AI分析完成！');
                
            } catch (apiError) {
                console.warn('API调用失败，使用本地智能分析:', apiError);
                // API调用失败，使用本地智能分析作为降级方案
                analysisResults = generateLocalAnalysis(clues, currentCase.title, currentCase.clientName);
                showToast('AI分析完成（本地智能分析）！');
            }
        } else {
            // 没有配置API Key，直接使用本地智能分析
            analysisResults = generateLocalAnalysis(clues, currentCase.title, currentCase.clientName);
            showToast('AI分析完成（本地智能分析）！');
        }
        
        // 更新分析文本框
        currentCase.analysis = currentCase.analysis || {};
        
        if (analysisResults.step1) {
            document.getElementById('analysis-step1').value = analysisResults.step1;
            currentCase.analysis[1] = analysisResults.step1;
        }
        if (analysisResults.step2) {
            document.getElementById('analysis-step2').value = analysisResults.step2;
            currentCase.analysis[2] = analysisResults.step2;
        }
        if (analysisResults.step3) {
            document.getElementById('analysis-step3').value = analysisResults.step3;
            currentCase.analysis[3] = analysisResults.step3;
        }
        if (analysisResults.step4) {
            document.getElementById('analysis-step4').value = analysisResults.step4;
            currentCase.analysis[4] = analysisResults.step4;
        }
        
        saveCases();
        
    } catch (error) {
        console.error('AI分析错误:', error);
        showToast(`AI分析失败：${error.message}`);
    }
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
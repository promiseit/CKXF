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
    
    // 新建案件表单
    document.getElementById('new-case-form').addEventListener('submit', handleNewCaseSubmit);
    
    // 案件详情页面
    document.getElementById('add-clue-btn').addEventListener('click', showAddClueModal);
    document.getElementById('add-clue-form').addEventListener('submit', handleAddClueSubmit);
    document.getElementById('generate-report-btn').addEventListener('click', generateReport);
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

// 导出PPT
function exportPPT() {
    if (!currentCase) return;
    
    // 这里只是模拟PPT导出功能
    // 实际项目中可以使用第三方库实现
    showToast('PPT导出功能已触发（模拟）');
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
    
    // 这里可以实现编辑功能
    showToast('编辑功能开发中...');
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

// 隐藏所有页面
function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
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
// 职场能力评估模块

// 评估维度定义
const assessmentDimensions = {
  logicalReasoning: {
    name: '逻辑推理',
    description: '分析问题、识别模式、做出合理判断的能力',
    questions: [
      {
        id: 'lr1',
        type: 'multiple-choice',
        question: '在处理销售线索时，你如何分析客户需求？',
        options: [
          '凭直觉快速判断',
          '收集所有信息后系统分析',
          '参考类似案例',
          '依赖同事建议'
        ],
        scoring: [1, 4, 3, 2]
      },
      {
        id: 'lr2',
        type: 'scenario',
        question: '当客户提出模糊的需求时，你会如何处理？',
        options: [
          '直接提供解决方案',
          '进一步追问以明确需求',
          '建议客户自行整理需求',
          '转移给其他同事处理'
        ],
        scoring: [2, 4, 1, 1]
      },
      {
        id: 'lr3',
        type: 'multiple-choice',
        question: '在分析销售数据时，你更关注哪些指标？',
        options: [
          '总销售额',
          '客户转化率',
          '客单价',
          '以上所有指标'
        ],
        scoring: [2, 3, 2, 4]
      }
    ]
  },
  instructionExecution: {
    name: '指令执行',
    description: '准确理解并执行任务指令的能力',
    questions: [
      {
        id: 'ie1',
        type: 'scenario',
        question: '当上级给出模糊的任务要求时，你会怎么做？',
        options: [
          '按照自己的理解执行',
          '向上级确认具体要求',
          '与同事讨论后执行',
          '等待更明确的指令'
        ],
        scoring: [2, 4, 3, 1]
      },
      {
        id: 'ie2',
        type: 'multiple-choice',
        question: '在执行任务时，你如何确保任务按时完成？',
        options: [
          '设置时间节点和提醒',
          '依赖最后期限压力',
          '优先处理简单任务',
          '根据心情安排任务'
        ],
        scoring: [4, 2, 3, 1]
      },
      {
        id: 'ie3',
        type: 'scenario',
        question: '当任务要求发生变化时，你会如何调整？',
        options: [
          '继续按照原计划执行',
          '立即调整计划适应新要求',
          '抱怨变化但仍执行',
          '寻求他人帮助调整'
        ],
        scoring: [1, 4, 2, 3]
      }
    ]
  },
  socialAdaptability: {
    name: '社交适配',
    description: '与不同类型的人有效沟通和合作的能力',
    questions: [
      {
        id: 'sa1',
        type: 'scenario',
        question: '当与性格不同的同事合作时，你会如何处理？',
        options: [
          '坚持自己的工作方式',
          '调整自己适应对方',
          '寻找双方都能接受的方式',
          '避免与对方合作'
        ],
        scoring: [2, 3, 4, 1]
      },
      {
        id: 'sa2',
        type: 'multiple-choice',
        question: '在团队会议中，你通常会如何参与？',
        options: [
          '积极发言并提出建议',
          '认真倾听他人意见',
          '仅在被问及时发言',
          '避免参与讨论'
        ],
        scoring: [4, 3, 2, 1]
      },
      {
        id: 'sa3',
        type: 'scenario',
        question: '当与客户沟通出现分歧时，你会如何处理？',
        options: [
          '坚持自己的观点',
          '完全让步满足客户',
          '寻找双方都能接受的解决方案',
          '转移话题避免冲突'
        ],
        scoring: [2, 2, 4, 1]
      }
    ]
  },
  emotionalManagement: {
    name: '情绪管理',
    description: '在压力和挑战面前保持冷静和专业的能力',
    questions: [
      {
        id: 'em1',
        type: 'scenario',
        question: '当遇到客户拒绝时，你会如何反应？',
        options: [
          '感到沮丧并放弃',
          '分析原因并调整策略',
          '寻求同事或上级的建议',
          '将情绪转移到其他任务'
        ],
        scoring: [1, 4, 3, 2]
      },
      {
        id: 'em2',
        type: 'multiple-choice',
        question: '在高压工作环境中，你如何保持专注？',
        options: [
          '通过深呼吸和冥想',
          '设置小目标逐步完成',
          '寻求支持和帮助',
          '忽略压力继续工作'
        ],
        scoring: [3, 4, 3, 1]
      },
      {
        id: 'em3',
        type: 'scenario',
        question: '当工作中出现错误时，你会如何处理？',
        options: [
          '推卸责任',
          '承认错误并寻找解决方案',
          '感到自责但不采取行动',
          '试图掩盖错误'
        ],
        scoring: [1, 4, 2, 1]
      }
    ]
  },
  problemSolving: {
    name: '问题解决',
    description: '识别问题、分析原因并找到有效解决方案的能力',
    questions: [
      {
        id: 'ps1',
        type: 'scenario',
        question: '当遇到复杂问题时，你会如何处理？',
        options: [
          '立即尝试解决',
          '分析问题根源',
          '寻求他人帮助',
          '推迟处理'
        ],
        scoring: [2, 4, 3, 1]
      },
      {
        id: 'ps2',
        type: 'multiple-choice',
        question: '在解决问题时，你通常会考虑哪些因素？',
        options: [
          '速度和效率',
          '质量和效果',
          '成本和资源',
          '以上所有因素'
        ],
        scoring: [2, 3, 2, 4]
      },
      {
        id: 'ps3',
        type: 'scenario',
        question: '当解决方案不奏效时，你会如何调整？',
        options: [
          '坚持原方案',
          '尝试新的方法',
          '寻求专家建议',
          '放弃解决'
        ],
        scoring: [1, 4, 3, 1]
      }
    ]
  }
};

// 评估结果等级
const proficiencyLevels = {
  1: { level: '基础', description: '具备基本理解和执行能力' },
  2: { level: '进阶', description: '能够独立完成任务并解决常见问题' },
  3: { level: '熟练', description: '能够高效完成任务并提供创新解决方案' },
  4: { level: '专家', description: '能够处理复杂问题并指导他人' }
};

// 游戏难度映射
const difficultyMapping = {
  1: '简单',
  2: '中等',
  3: '困难',
  4: '专家'
};

// 保存评估结果
function saveAssessmentResult(result) {
  const assessments = JSON.parse(localStorage.getItem('detective_assessments')) || [];
  assessments.push({
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    result: result
  });
  localStorage.setItem('detective_assessments', JSON.stringify(assessments));
  return result;
}

// 获取评估历史
function getAssessmentHistory() {
  return JSON.parse(localStorage.getItem('detective_assessments')) || [];
}

// 计算游戏难度
function calculateGameDifficulty(assessmentResult) {
  const scores = Object.values(assessmentResult.dimensions).map(d => d.score);
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const difficultyLevel = Math.round(averageScore);
  return difficultyLevel;
}

// 生成评估报告
function generateAssessmentReport(assessmentResult) {
  const report = {
    overall: assessmentResult.overall,
    dimensions: assessmentResult.dimensions,
    recommendations: generateRecommendations(assessmentResult),
    timestamp: new Date().toISOString()
  };
  return report;
}

// 生成个性化建议
function generateRecommendations(assessmentResult) {
  const recommendations = [];
  
  // 添加正面引导语
  recommendations.push('以下是为你量身定制的发展建议，帮助你在职场中不断成长：');
  
  // 针对每个维度生成建议
  Object.entries(assessmentResult.dimensions).forEach(([key, dimension]) => {
    switch (key) {
      case 'logicalReasoning':
        if (dimension.score < 3) {
          recommendations.push('逻辑推理：建议通过分析案例和解决逻辑题来进一步提升你的分析能力');
        } else {
          recommendations.push('逻辑推理：你已经具备良好的分析能力，尝试挑战更复杂的问题分析');
        }
        break;
      case 'instructionExecution':
        if (dimension.score < 3) {
          recommendations.push('指令执行：建议使用任务管理工具和设置明确的时间节点来提升执行效率');
        } else {
          recommendations.push('指令执行：你具备优秀的执行能力，考虑学习项目管理技巧来提升整体效率');
        }
        break;
      case 'socialAdaptability':
        if (dimension.score < 3) {
          recommendations.push('社交适配：建议多参与团队活动和社交场合来拓展你的人际关系网络');
        } else {
          recommendations.push('社交适配：你具备良好的沟通能力，尝试担任团队协调角色来进一步提升');
        }
        break;
      case 'emotionalManagement':
        if (dimension.score < 3) {
          recommendations.push('情绪管理：建议学习情绪管理技巧，如深呼吸和积极思考，帮助你应对工作压力');
        } else {
          recommendations.push('情绪管理：你具备良好的情绪管理能力，尝试学习压力管理的高级技巧');
        }
        break;
      case 'problemSolving':
        if (dimension.score < 3) {
          recommendations.push('问题解决：建议通过解决实际问题和案例分析来提升你的问题解决能力');
        } else {
          recommendations.push('问题解决：你具备优秀的问题解决能力，尝试解决跨领域的复杂问题');
        }
        break;
    }
  });
  
  // 总体建议
  if (assessmentResult.overall.score >= 3) {
    recommendations.push('总体发展：继续保持良好的工作表现，尝试挑战更复杂的任务和职责');
  } else {
    recommendations.push('总体发展：建议制定个人发展计划，循序渐进地提升各维度的能力');
  }
  
  // 添加鼓励性结束语
  recommendations.push('记住，能力提升是一个持续的过程，每一步努力都会带来进步！');
  
  return recommendations;
}

// 渲染评估页面
function renderAssessmentPage() {
  const container = document.getElementById('assessment-container');
  if (!container) return;
  
  let html = `
    <div class="assessment-header">
      <h2>职场能力评估</h2>
      <p>请回答以下问题，帮助我们了解你的职场能力水平</p>
    </div>
    <form id="assessment-form">
  `;
  
  // 渲染每个维度的问题
  Object.entries(assessmentDimensions).forEach(([key, dimension]) => {
    html += `
      <div class="assessment-section">
        <h3>${dimension.name}</h3>
        <p class="section-description">${dimension.description}</p>
    `;
    
    dimension.questions.forEach((question, index) => {
      html += `
        <div class="question-item">
          <p class="question-text">${index + 1}. ${question.question}</p>
          <div class="options">
      `;
      
      question.options.forEach((option, optionIndex) => {
        html += `
          <div class="option-item">
            <input type="radio" id="${key}-q${index}-opt${optionIndex}" name="${key}-q${index}" value="${optionIndex}" required>
            <label for="${key}-q${index}-opt${optionIndex}">${option}</label>
          </div>
        `;
      });
      
      html += `
          </div>
        </div>
      `;
    });
    
    html += `
      </div>
    `;
  });
  
  html += `
      <div class="form-actions">
        <button type="submit" class="primary-btn">提交评估</button>
        <button type="button" class="cancel-btn" onclick="showCaseList()">取消</button>
      </div>
    </form>
  `;
  
  container.innerHTML = html;
  
  // 绑定表单提交事件
  const form = document.getElementById('assessment-form');
  if (form) {
    form.addEventListener('submit', handleAssessmentSubmit);
  }
}

// 处理评估提交
function handleAssessmentSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const result = {
    overall: {
      score: 0,
      level: ''
    },
    dimensions: {}
  };
  
  let totalScore = 0;
  let totalQuestions = 0;
  
  // 计算每个维度的得分
  Object.entries(assessmentDimensions).forEach(([key, dimension]) => {
    let dimensionScore = 0;
    let dimensionQuestions = 0;
    
    dimension.questions.forEach((question, index) => {
      const selectedOption = formData.get(`${key}-q${index}`);
      if (selectedOption !== null) {
        dimensionScore += question.scoring[parseInt(selectedOption)];
        dimensionQuestions++;
        totalScore += question.scoring[parseInt(selectedOption)];
        totalQuestions++;
      }
    });
    
    // 计算维度平均得分
    const averageDimensionScore = dimensionQuestions > 0 ? Math.round(dimensionScore / dimensionQuestions) : 0;
    result.dimensions[key] = {
      score: averageDimensionScore,
      level: proficiencyLevels[averageDimensionScore].level,
      description: proficiencyLevels[averageDimensionScore].description
    };
  });
  
  // 计算总体得分
  const overallScore = totalQuestions > 0 ? Math.round(totalScore / totalQuestions) : 0;
  result.overall = {
    score: overallScore,
    level: proficiencyLevels[overallScore].level,
    description: proficiencyLevels[overallScore].description
  };
  
  // 保存评估结果
  saveAssessmentResult(result);
  
  // 显示评估结果
  showAssessmentResult(result);
  
  // 触发AI深度分析
  if (typeof loadSettings === 'function') {
    const settings = loadSettings();
    if (settings.cloudModelsEnabled || settings.defaultModel === 'local') {
      performAIAssessment(result);
    }
  }
}

// AI深度评估
async function performAIAssessment(assessmentResult) {
  // 构建评估数据
  const assessmentData = {
    overall: assessmentResult.overall,
    dimensions: Object.entries(assessmentResult.dimensions).map(([key, dimension]) => ({
      name: assessmentDimensions[key].name,
      score: dimension.score,
      level: dimension.level
    }))
  };
  
  // 构建AI提示词
  const prompt = `作为职场能力评估专家，请对以下评估结果进行深度分析：

总体评估：${assessmentData.overall.score}分 (${assessmentData.overall.level})

各维度评估：
${assessmentData.dimensions.map(d => `- ${d.name}: ${d.score}分 (${d.level})`).join('\n')}

请提供：
1. 对评估结果的综合分析，强调优势和潜力
2. 针对各维度的具体发展建议，保持积极鼓励的语气
3. 个性化的职业发展建议，关注个人成长
4. 适合的学习和训练方向，提供具体可行的建议

请注意：评估结果仅用于个性化训练和发展，不做负面评判，请保持积极、支持和鼓励的语气，帮助用户建立信心并明确发展方向。`;
  
  try {
    showToast('AI正在分析评估结果...');
    
    // 调用AI分析
    let aiResponse;
    const settings = loadSettings();
    
    if (settings.defaultModel === 'local') {
      // 使用本地模型
      aiResponse = await callLocalModel(prompt);
    } else {
      // 使用云端模型
      aiResponse = await callCloudModel(settings.defaultModel, settings.apiKey, settings.apiUrl, settings.modelId, prompt);
    }
    
    if (aiResponse) {
      // 显示AI分析结果
      showAIAnalysisResult(aiResponse);
    }
  } catch (error) {
    console.error('AI评估失败:', error);
    // 不显示错误，保持评估流程正常
  }
}

// 调用本地模型
async function callLocalModel(prompt) {
  // 这里应该实现本地模型调用逻辑
  // 由于本地模型实现复杂，这里返回模拟结果
  return `基于您的评估结果，我为您提供以下分析：

**综合分析**
您在各维度的表现均衡，展现了良好的职场基础能力。

**改进建议**
- 逻辑推理：建议多参与案例分析和问题解决练习
- 指令执行：可以使用任务管理工具提升效率
- 社交适配：尝试参与更多团队协作项目
- 情绪管理：学习压力管理技巧
- 问题解决：多尝试解决复杂问题

**职业发展建议**
根据您的能力水平，建议您：
1. 设定明确的职业目标
2. 制定个人发展计划
3. 定期评估自己的进步
4. 寻求导师指导

**学习方向**
推荐您关注：
- 沟通技巧提升
- 领导力培养
- 时间管理优化
- 问题解决策略`;
}

// 调用云端模型
async function callCloudModel(model, apiKey, apiUrl, modelId, prompt) {
  // 这里应该实现云端模型调用逻辑
  // 由于需要API密钥，这里返回模拟结果
  return `基于您的评估结果，我为您提供以下专业分析：

**综合分析**
您展现了较强的职场能力，在多个维度都有不错的表现。

**维度分析与建议**
- **逻辑推理**：您的分析能力较强，建议进一步提升复杂问题的解决能力
- **指令执行**：您能够有效执行任务，建议学习更高效的工作方法
- **社交适配**：您的沟通能力良好，建议拓展人际关系网络
- **情绪管理**：您能够较好地管理情绪，建议学习更高级的压力应对策略
- **问题解决**：您的问题解决能力不错，建议尝试解决更具挑战性的问题

**个性化发展路径**
1. 短期目标（1-3个月）：提升具体技能短板
2. 中期目标（3-6个月）：拓展专业知识领域
3. 长期目标（6-12个月）：培养领导力和战略思维

**推荐资源**
- 在线课程：沟通技巧、领导力发展
- 书籍：《关键对话》、《高效能人士的七个习惯》
- 实践活动：参与跨部门项目、担任团队协调角色`;
}

// 显示AI分析结果
function showAIAnalysisResult(aiResponse) {
  const container = document.getElementById('assessment-container');
  if (!container) return;
  
  // 在现有结果下方添加AI分析部分
  const aiAnalysisSection = document.createElement('div');
  aiAnalysisSection.className = 'ai-analysis-section';
  aiAnalysisSection.innerHTML = `
    <h3>AI深度分析</h3>
    <div class="ai-analysis-content">
      ${aiResponse.split('\n').map(line => {
        if (line.startsWith('**')) {
          return `<h4>${line.replace(/\*\*/g, '')}</h4>`;
        } else if (line.startsWith('- ')) {
          return `<li>${line.substring(2)}</li>`;
        } else if (line.trim()) {
          return `<p>${line}</p>`;
        } else {
          return '<br>';
        }
      }).join('')}
    </div>
  `;
  
  // 找到结果区域并添加AI分析
  const resultActions = container.querySelector('.result-actions');
  if (resultActions) {
    resultActions.parentNode.insertBefore(aiAnalysisSection, resultActions);
  }
  
  showToast('AI分析完成！');
}

// 显示评估结果
function showAssessmentResult(result) {
  const container = document.getElementById('assessment-container');
  if (!container) return;
  
  let html = `
    <div class="assessment-result">
      <h2>评估结果</h2>
      <div class="overall-result">
        <h3>总体评估</h3>
        <div class="result-card">
          <div class="result-score">${result.overall.score}</div>
          <div class="result-level">${result.overall.level}</div>
          <div class="result-description">${result.overall.description}</div>
        </div>
      </div>
      <div class="dimensions-result">
        <h3>各维度评估</h3>
        <div class="dimensions-grid">
  `;
  
  // 渲染各维度结果
  Object.entries(result.dimensions).forEach(([key, dimension]) => {
    const dimensionInfo = assessmentDimensions[key];
    html += `
      <div class="dimension-card">
        <h4>${dimensionInfo.name}</h4>
        <div class="dimension-score">${dimension.score}</div>
        <div class="dimension-level">${dimension.level}</div>
        <div class="dimension-description">${dimension.description}</div>
      </div>
    `;
  });
  
  // 生成建议
  const recommendations = generateRecommendations(result);
  
  html += `
        </div>
      </div>
      <div class="recommendations">
        <h3>个性化建议</h3>
        <ul>
  `;
  
  recommendations.forEach(rec => {
    html += `<li>${rec}</li>`;
  });
  
  // 计算游戏难度
  const gameDifficulty = calculateGameDifficulty(result);
  
  html += `
        </ul>
      </div>
      <div class="game-difficulty">
        <h3>推荐游戏难度</h3>
        <div class="difficulty-card">
          <div class="difficulty-level">${difficultyMapping[gameDifficulty]}</div>
          <p>根据你的能力水平，我们推荐你从这个难度开始游戏</p>
        </div>
      </div>
      <div class="result-actions">
        <button class="primary-btn" onclick="startGameWithDifficulty(${gameDifficulty})">开始游戏</button>
        <button class="secondary-btn" onclick="downloadAssessmentReport()">下载报告</button>
        <button class="secondary-btn" onclick="renderAssessmentPage()">重新评估</button>
        <button class="secondary-btn" onclick="showCaseList()">返回首页</button>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}

// 下载评估报告
function downloadAssessmentReport() {
  // 获取最新的评估结果
  const assessments = getAssessmentHistory();
  if (assessments.length === 0) {
    showToast('暂无评估记录');
    return;
  }
  
  const latestAssessment = assessments[assessments.length - 1];
  const result = latestAssessment.result;
  
  // 生成报告内容
  const reportContent = generateAssessmentReportContent(result);
  
  // 创建下载链接
  const blob = new Blob([reportContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `职场能力评估报告_${formatDate(latestAssessment.timestamp)}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showToast('报告下载成功！');
}

// 生成评估报告内容
function generateAssessmentReportContent(result) {
  // 生成建议
  const recommendations = generateRecommendations(result);
  
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>职场能力评估报告</title>
    <style>
        body {
            font-family: 'Microsoft YaHei', sans-serif;
            margin: 40px;
            line-height: 1.6;
            color: #333;
        }
        h1 {
            color: #2c3e50;
            text-align: center;
            font-size: 28px;
            margin-bottom: 30px;
        }
        h2 {
            color: #34495e;
            font-size: 20px;
            margin-top: 30px;
            margin-bottom: 15px;
            border-bottom: 2px solid #f1c40f;
            padding-bottom: 5px;
        }
        h3 {
            color: #7f8c8d;
            font-size: 16px;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        .overall-result {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            text-align: center;
        }
        .result-score {
            font-size: 48px;
            font-weight: bold;
            color: #f1c40f;
            margin-bottom: 10px;
        }
        .result-level {
            font-size: 24px;
            color: #34495e;
            margin-bottom: 5px;
        }
        .result-description {
            font-size: 16px;
            color: #7f8c8d;
        }
        .dimensions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .dimension-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #e9ecef;
        }
        .dimension-card h4 {
            color: #34495e;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .dimension-score {
            font-size: 24px;
            font-weight: bold;
            color: #3498db;
            margin-bottom: 5px;
        }
        .dimension-level {
            font-size: 14px;
            color: #27ae60;
            margin-bottom: 5px;
        }
        .dimension-description {
            font-size: 12px;
            color: #7f8c8d;
        }
        .recommendations {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .recommendations ul {
            list-style-type: none;
            padding: 0;
        }
        .recommendations li {
            margin-bottom: 10px;
            padding-left: 20px;
            position: relative;
        }
        .recommendations li::before {
            content: "•";
            color: #f1c40f;
            font-size: 18px;
            position: absolute;
            left: 0;
            top: -2px;
        }
        .game-difficulty {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            text-align: center;
        }
        .difficulty-level {
            font-size: 24px;
            font-weight: bold;
            color: #e74c3c;
            margin-bottom: 10px;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            font-size: 14px;
            color: #7f8c8d;
            text-align: right;
        }
    </style>
</head>
<body>
    <h1>职场能力评估报告</h1>
    
    <h2>总体评估</h2>
    <div class="overall-result">
        <div class="result-score">${result.overall.score}</div>
        <div class="result-level">${result.overall.level}</div>
        <div class="result-description">${result.overall.description}</div>
    </div>
    
    <h2>各维度评估</h2>
    <div class="dimensions-grid">
        ${Object.entries(result.dimensions).map(([key, dimension]) => {
            const dimensionInfo = assessmentDimensions[key];
            return `
            <div class="dimension-card">
                <h4>${dimensionInfo.name}</h4>
                <div class="dimension-score">${dimension.score}</div>
                <div class="dimension-level">${dimension.level}</div>
                <div class="dimension-description">${dimension.description}</div>
            </div>
            `;
        }).join('')}
    </div>
    
    <h2>个性化建议</h2>
    <div class="recommendations">
        <ul>
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
    </div>
    
    <h2>推荐游戏难度</h2>
    <div class="game-difficulty">
        <div class="difficulty-level">${difficultyMapping[calculateGameDifficulty(result)]}</div>
        <p>根据你的能力水平，我们推荐你从这个难度开始游戏</p>
    </div>
    
    <div class="footer">
        <p>报告生成时间：${formatDate(new Date().toISOString())}</p>
        <p>神探销售系统 - 职场能力评估模块</p>
    </div>
</body>
</html>`;
}

// 根据评估结果开始游戏
function startGameWithDifficulty(difficulty) {
  // 保存游戏难度设置
  localStorage.setItem('detective_game_difficulty', difficulty.toString());
  
  // 这里可以实现根据难度设置游戏参数的逻辑
  console.log(`开始游戏，难度级别：${difficulty}`);
  showToast(`游戏难度已设置为：${difficultyMapping[difficulty]}`);
  
  // 跳转到游戏页面或创建新案件
  showNewCaseForm();
}

// 获取推荐的游戏难度
function getRecommendedGameDifficulty() {
  // 尝试获取最近的评估结果
  const assessments = getAssessmentHistory();
  if (assessments.length > 0) {
    // 获取最新的评估结果
    const latestAssessment = assessments[assessments.length - 1];
    return calculateGameDifficulty(latestAssessment.result);
  }
  
  // 如果没有评估记录，返回默认难度
  return 2; // 中等难度
}

// 应用评估结果到游戏系统
function applyAssessmentToGame() {
  // 获取推荐的游戏难度
  const recommendedDifficulty = getRecommendedGameDifficulty();
  
  // 保存到本地存储
  localStorage.setItem('detective_game_difficulty', recommendedDifficulty.toString());
  
  console.log(`应用评估结果到游戏系统，推荐难度：${recommendedDifficulty}`);
}

// 显示评估历史
function showAssessmentHistory() {
  const container = document.getElementById('assessment-container');
  if (!container) return;
  
  const history = getAssessmentHistory();
  
  if (history.length === 0) {
    container.innerHTML = `
      <div class="assessment-header">
        <h2>评估历史</h2>
        <p>暂无评估记录</p>
        <button class="primary-btn" onclick="renderAssessmentPage()">开始评估</button>
        <button class="secondary-btn" onclick="showCaseList()">返回首页</button>
      </div>
    `;
    return;
  }
  
  let html = `
    <div class="assessment-header">
      <h2>评估历史</h2>
      <button class="primary-btn" onclick="renderAssessmentPage()">开始新评估</button>
      <button class="secondary-btn" onclick="showCaseList()">返回首页</button>
    </div>
    <div class="history-list">
  `;
  
  history.forEach((assessment, index) => {
    html += `
      <div class="history-item">
        <div class="history-header">
          <h3>评估 ${index + 1}</h3>
          <span class="history-date">${formatDate(assessment.timestamp)}</span>
        </div>
        <div class="history-result">
          <div class="history-overall">
            <span class="label">总体得分：</span>
            <span class="value">${assessment.result.overall.score} (${assessment.result.overall.level})</span>
          </div>
          <button class="view-details-btn" onclick="viewAssessmentDetails('${assessment.id}')">查看详情</button>
        </div>
      </div>
    `;
  });
  
  html += `
    </div>
  `;
  
  container.innerHTML = html;
}

// 查看评估详情
function viewAssessmentDetails(assessmentId) {
  const history = getAssessmentHistory();
  const assessment = history.find(a => a.id === assessmentId);
  
  if (!assessment) return;
  
  showAssessmentResult(assessment.result);
}

// 初始化评估模块
function initAssessmentModule() {
  // 检查是否存在评估容器
  const container = document.getElementById('assessment-container');
  if (container) {
    // 检查URL参数或其他条件来决定显示哪个页面
    renderAssessmentPage();
  }
}

// 在DOM加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAssessmentModule);
} else {
  initAssessmentModule();
}

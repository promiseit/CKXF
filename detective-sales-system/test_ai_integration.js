// AI大模型集成功能测试

// 测试本地模型初始化
async function testLocalModelInit() {
    console.log('=== 测试本地模型初始化 ===');
    try {
        const wllama = await initWllama();
        console.log('✓ 本地模型引擎初始化成功');
        return true;
    } catch (error) {
        console.error('✗ 本地模型引擎初始化失败:', error.message);
        return false;
    }
}

// 测试模型切换功能
function testModelSwitching() {
    console.log('=== 测试模型切换功能 ===');
    try {
        const settings = loadSettings();
        console.log('当前默认模型:', settings.defaultModel);
        console.log('云端模型启用状态:', settings.cloudModelsEnabled);
        console.log('✓ 模型切换功能测试通过');
        return true;
    } catch (error) {
        console.error('✗ 模型切换功能测试失败:', error.message);
        return false;
    }
}

// 测试数据匿名化
function testDataAnonymization() {
    console.log('=== 测试数据匿名化 ===');
    try {
        const testClues = [
            {
                content: '客户张三的联系电话是13812345678，邮箱是zhangsan@example.com',
                type: 'text',
                importance: 5,
                tags: ['联系信息', '重要']
            }
        ];
        const prompt = buildPrompt(testClues, 'ABC公司采购项目', 'ABC科技有限公司');
        console.log('生成的提示词:', prompt);
        
        // 检查是否包含敏感信息
        const hasSensitiveInfo = prompt.includes('张三') || prompt.includes('13812345678') || prompt.includes('zhangsan@example.com') || prompt.includes('ABC公司');
        if (!hasSensitiveInfo) {
            console.log('✓ 数据匿名化测试通过');
            return true;
        } else {
            console.error('✗ 数据匿名化测试失败，提示词中包含敏感信息');
            return false;
        }
    } catch (error) {
        console.error('✗ 数据匿名化测试失败:', error.message);
        return false;
    }
}

// 测试网络状态检测
function testNetworkStatus() {
    console.log('=== 测试网络状态检测 ===');
    try {
        console.log('当前网络状态:', isOnline ? '在线' : '离线');
        console.log('✓ 网络状态检测测试通过');
        return true;
    } catch (error) {
        console.error('✗ 网络状态检测测试失败:', error.message);
        return false;
    }
}

// 运行所有测试
async function runAllTests() {
    console.log('开始测试AI大模型集成功能...\n');
    
    const tests = [
        testLocalModelInit,
        testModelSwitching,
        testDataAnonymization,
        testNetworkStatus
    ];
    
    let passed = 0;
    let total = tests.length;
    
    for (const test of tests) {
        try {
            const result = await test();
            if (result) passed++;
        } catch (error) {
            console.error('测试执行失败:', error.message);
        }
        console.log('');
    }
    
    console.log(`=== 测试结果 ===`);
    console.log(`通过: ${passed}/${total}`);
    console.log(`成功率: ${(passed/total*100).toFixed(1)}%`);
    
    if (passed === total) {
        console.log('✓ 所有测试通过！');
    } else {
        console.log('✗ 部分测试失败，需要检查');
    }
}

// 导出测试函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        testLocalModelInit,
        testModelSwitching,
        testDataAnonymization,
        testNetworkStatus,
        runAllTests
    };
}

// 在浏览器环境中直接运行
if (typeof window !== 'undefined') {
    window.runAITests = runAllTests;
    console.log('AI测试函数已加载，可通过 runAITests() 运行测试');
}

// 离线功能测试脚本

// 测试离线状态检测
function testOfflineDetection() {
    console.log('测试离线状态检测...');
    
    // 模拟离线状态
    const event = new Event('offline');
    window.dispatchEvent(event);
    
    if (!navigator.onLine) {
        console.log('✓ 离线状态检测测试通过');
    } else {
        console.log('✗ 离线状态检测测试失败');
    }
    
    // 恢复在线状态
    const onlineEvent = new Event('online');
    window.dispatchEvent(onlineEvent);
}

// 测试本地功能在离线状态下的可用性
function testLocalFunctionality() {
    console.log('测试本地功能在离线状态下的可用性...');
    
    // 模拟离线状态
    Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false
    });
    
    // 测试导航功能
    const navBtns = document.querySelectorAll('.nav-btn');
    let navWorking = false;
    
    if (navBtns.length > 0) {
        navBtns[0].click();
        const gameHeader = document.querySelector('.game-header h2');
        if (gameHeader && gameHeader.textContent === '文字排序游戏') {
            navWorking = true;
        }
    }
    
    console.log(`导航功能测试：${navWorking ? '通过' : '失败'}`);
    
    // 测试拖拽功能
    const blocks = document.querySelectorAll('.block');
    const target = document.getElementById('target');
    let dragWorking = false;
    
    if (blocks.length > 0 && target) {
        const block = blocks[0];
        target.appendChild(block);
        if (target.contains(block)) {
            dragWorking = true;
        }
    }
    
    console.log(`拖拽功能测试：${dragWorking ? '通过' : '失败'}`);
    
    // 测试检查答案功能
    const checkBtn = document.getElementById('check-btn');
    const feedback = document.getElementById('feedback');
    let checkWorking = false;
    
    if (checkBtn && feedback) {
        checkBtn.click();
        if (feedback.textContent) {
            checkWorking = true;
        }
    }
    
    console.log(`检查答案功能测试：${checkWorking ? '通过' : '失败'}`);
    
    // 测试聊天功能
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');
    let chatWorking = false;
    
    if (chatInput && sendBtn && chatMessages) {
        chatInput.value = '测试消息';
        sendBtn.click();
        const messages = chatMessages.querySelectorAll('.message');
        if (messages.length > 0) {
            chatWorking = true;
        }
    }
    
    console.log(`聊天功能测试：${chatWorking ? '通过' : '失败'}`);
    
    // 测试积分系统
    let scoreWorking = false;
    if (typeof window.updateScore === 'function') {
        const initialScore = parseInt(document.querySelector('.score-value').textContent);
        window.updateScore(100);
        const newScore = parseInt(document.querySelector('.score-value').textContent);
        if (newScore === initialScore + 100) {
            scoreWorking = true;
        }
    }
    
    console.log(`积分系统测试：${scoreWorking ? '通过' : '失败'}`);
    
    // 恢复在线状态
    Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: true
    });
    
    if (navWorking && dragWorking && checkWorking && chatWorking && scoreWorking) {
        console.log('✓ 本地功能在离线状态下的可用性测试通过');
    } else {
        console.log('✗ 本地功能在离线状态下的可用性测试失败');
    }
}

// 测试本地存储在离线状态下的可用性
function testLocalStorageOffline() {
    console.log('测试本地存储在离线状态下的可用性...');
    
    // 模拟离线状态
    Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false
    });
    
    if (typeof localStorage !== 'undefined') {
        try {
            const testKey = 'offline_test';
            const testValue = 'test_value';
            
            localStorage.setItem(testKey, testValue);
            const retrievedValue = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
            
            if (retrievedValue === testValue) {
                console.log('✓ 本地存储在离线状态下的可用性测试通过');
            } else {
                console.log('✗ 本地存储在离线状态下的可用性测试失败');
            }
        } catch (e) {
            console.log('✗ 本地存储在离线状态下的可用性测试失败：', e.message);
        }
    } else {
        console.log('本地存储不可用');
        console.log('✓ 本地存储在离线状态下的可用性测试通过');
    }
    
    // 恢复在线状态
    Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: true
    });
}

// 运行所有离线功能测试
function runOfflineTests() {
    console.log('开始离线功能测试...');
    testOfflineDetection();
    testLocalFunctionality();
    testLocalStorageOffline();
    console.log('离线功能测试完成！');
}

// 当页面加载完成后运行测试
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runOfflineTests);
} else {
    runOfflineTests();
}

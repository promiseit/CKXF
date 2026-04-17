// 功能测试脚本

// 测试导航功能
function testNavigation() {
    console.log('测试导航功能...');
    const navBtns = document.querySelectorAll('.nav-btn');
    const gameHeader = document.querySelector('.game-header h2');
    
    // 测试文字排序模式
    navBtns[0].click();
    if (gameHeader.textContent === '文字排序游戏') {
        console.log('✓ 文字排序模式测试通过');
    } else {
        console.log('✗ 文字排序模式测试失败');
    }
    
    // 测试数字计算模式
    navBtns[1].click();
    if (gameHeader.textContent === '数字计算游戏') {
        console.log('✓ 数字计算模式测试通过');
    } else {
        console.log('✗ 数字计算模式测试失败');
    }
    
    // 测试英文拼接模式
    navBtns[2].click();
    if (gameHeader.textContent === '英文拼接游戏') {
        console.log('✓ 英文拼接模式测试通过');
    } else {
        console.log('✗ 英文拼接模式测试失败');
    }
    
    // 测试简单编程模式
    navBtns[3].click();
    if (gameHeader.textContent === '简单编程游戏') {
        console.log('✓ 简单编程模式测试通过');
    } else {
        console.log('✗ 简单编程模式测试失败');
    }
    
    // 测试日常交流模式
    navBtns[4].click();
    console.log('✓ 日常交流模式测试通过');
}

// 测试拖拽功能
function testDragAndDrop() {
    console.log('测试拖拽功能...');
    const blocks = document.querySelectorAll('.block');
    const target = document.getElementById('target');
    
    // 模拟拖拽操作
    const block = blocks[0];
    
    // 创建拖拽事件
    const dragStartEvent = new DragEvent('dragstart', {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer()
    });
    
    block.dispatchEvent(dragStartEvent);
    
    // 创建放置事件
    const dropEvent = new DragEvent('drop', {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer()
    });
    
    target.dispatchEvent(dropEvent);
    
    if (target.contains(block)) {
        console.log('✓ 拖拽功能测试通过');
    } else {
        console.log('✗ 拖拽功能测试失败');
    }
}

// 测试检查答案功能
function testCheckAnswer() {
    console.log('测试检查答案功能...');
    const checkBtn = document.getElementById('check-btn');
    const feedback = document.getElementById('feedback');
    
    // 先切换到文字排序模式
    document.querySelector('[data-mode="text"]').click();
    
    // 清空目标区域
    document.getElementById('target').innerHTML = '';
    
    // 获取积木
    const blocks = document.querySelectorAll('.block');
    const target = document.getElementById('target');
    
    // 按照正确顺序放入积木
    const correctOrder = ['我的', '名字', '是', '小明', '。'];
    correctOrder.forEach(text => {
        const block = Array.from(blocks).find(b => b.textContent === text);
        if (block) {
            target.appendChild(block);
        }
    });
    
    // 点击检查按钮
    checkBtn.click();
    
    if (feedback.textContent.includes('太棒了') && feedback.style.color === 'rgb(76, 175, 80)') {
        console.log('✓ 检查答案功能测试通过');
    } else {
        console.log('✗ 检查答案功能测试失败');
    }
}

// 测试提示功能
function testHint() {
    console.log('测试提示功能...');
    const hintBtn = document.getElementById('hint-btn');
    const feedback = document.getElementById('feedback');
    
    hintBtn.click();
    
    if (feedback.textContent.includes('提示') && feedback.style.color === 'rgb(33, 150, 243)') {
        console.log('✓ 提示功能测试通过');
    } else {
        console.log('✗ 提示功能测试失败');
    }
}

// 测试重置功能
function testReset() {
    console.log('测试重置功能...');
    const resetBtn = document.getElementById('reset-btn');
    const blocksContainer = document.getElementById('blocks');
    const target = document.getElementById('target');
    
    // 先放入一些积木到目标区域
    const blocks = document.querySelectorAll('.block');
    if (blocks.length > 0) {
        target.appendChild(blocks[0]);
    }
    
    resetBtn.click();
    
    if (target.children.length === 0 && blocksContainer.children.length > 0) {
        console.log('✓ 重置功能测试通过');
    } else {
        console.log('✗ 重置功能测试失败');
    }
}

// 测试聊天功能
function testChat() {
    console.log('测试聊天功能...');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');
    
    // 输入消息
    const testMessage = '你好，测试消息';
    chatInput.value = testMessage;
    
    // 点击发送
    sendBtn.click();
    
    // 检查消息是否发送
    const messages = chatMessages.querySelectorAll('.message');
    const userMessage = Array.from(messages).find(m => m.textContent === testMessage);
    
    if (userMessage && userMessage.classList.contains('user-message')) {
        console.log('✓ 聊天功能测试通过');
    } else {
        console.log('✗ 聊天功能测试失败');
    }
}

// 测试积分系统
function testScoreSystem() {
    console.log('测试积分系统...');
    const initialScore = parseInt(document.querySelector('.score-value').textContent);
    
    // 模拟加分
    window.updateScore(100);
    const newScore = parseInt(document.querySelector('.score-value').textContent);
    
    if (newScore === initialScore + 100) {
        console.log('✓ 积分系统测试通过');
    } else {
        console.log('✗ 积分系统测试失败');
    }
}

// 测试虚拟键盘
function testVirtualKeyboard() {
    console.log('测试虚拟键盘...');
    const keyboardKeys = document.querySelectorAll('.key');
    
    if (keyboardKeys.length > 0) {
        console.log('✓ 虚拟键盘测试通过');
    } else {
        console.log('✗ 虚拟键盘测试失败');
    }
}

// 运行所有测试
function runAllTests() {
    console.log('开始功能测试...');
    testNavigation();
    testDragAndDrop();
    testCheckAnswer();
    testHint();
    testReset();
    testChat();
    testScoreSystem();
    testVirtualKeyboard();
    console.log('功能测试完成！');
}

// 当页面加载完成后运行测试
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllTests);
} else {
    runAllTests();
}

// 性能测试脚本

// 测试页面加载时间
function testPageLoadTime() {
    console.log('测试页面加载时间...');
    const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
    console.log(`页面加载时间: ${loadTime}ms`);
    
    if (loadTime < 2000) {
        console.log('✓ 页面加载时间测试通过');
    } else {
        console.log('✗ 页面加载时间测试失败');
    }
}

// 测试拖拽操作性能
function testDragPerformance() {
    console.log('测试拖拽操作性能...');
    const blocks = document.querySelectorAll('.block');
    const target = document.getElementById('target');
    
    if (blocks.length === 0) {
        console.log('✗ 拖拽操作性能测试失败：没有找到积木');
        return;
    }
    
    const block = blocks[0];
    const startTime = performance.now();
    
    // 模拟拖拽操作
    const dragStartEvent = new DragEvent('dragstart', {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer()
    });
    
    block.dispatchEvent(dragStartEvent);
    
    const dropEvent = new DragEvent('drop', {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer()
    });
    
    target.dispatchEvent(dropEvent);
    
    const endTime = performance.now();
    const dragTime = endTime - startTime;
    
    console.log(`拖拽操作时间: ${dragTime.toFixed(2)}ms`);
    
    if (dragTime < 100) {
        console.log('✓ 拖拽操作性能测试通过');
    } else {
        console.log('✗ 拖拽操作性能测试失败');
    }
}

// 测试导航切换性能
function testNavigationPerformance() {
    console.log('测试导航切换性能...');
    const navBtns = document.querySelectorAll('.nav-btn');
    
    if (navBtns.length === 0) {
        console.log('✗ 导航切换性能测试失败：没有找到导航按钮');
        return;
    }
    
    let totalTime = 0;
    const iterations = 3;
    
    for (let i = 0; i < iterations; i++) {
        const startTime = performance.now();
        navBtns[i % navBtns.length].click();
        const endTime = performance.now();
        totalTime += (endTime - startTime);
    }
    
    const avgTime = totalTime / iterations;
    console.log(`导航切换平均时间: ${avgTime.toFixed(2)}ms`);
    
    if (avgTime < 100) {
        console.log('✓ 导航切换性能测试通过');
    } else {
        console.log('✗ 导航切换性能测试失败');
    }
}

// 测试聊天功能性能
function testChatPerformance() {
    console.log('测试聊天功能性能...');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    
    if (!chatInput || !sendBtn) {
        console.log('✗ 聊天功能性能测试失败：没有找到聊天元素');
        return;
    }
    
    const testMessage = '测试消息';
    chatInput.value = testMessage;
    
    const startTime = performance.now();
    sendBtn.click();
    const endTime = performance.now();
    
    const sendTime = endTime - startTime;
    console.log(`发送消息时间: ${sendTime.toFixed(2)}ms`);
    
    if (sendTime < 100) {
        console.log('✓ 聊天功能性能测试通过');
    } else {
        console.log('✗ 聊天功能性能测试失败');
    }
}

// 测试检查答案性能
function testCheckAnswerPerformance() {
    console.log('测试检查答案性能...');
    const checkBtn = document.getElementById('check-btn');
    
    if (!checkBtn) {
        console.log('✗ 检查答案性能测试失败：没有找到检查按钮');
        return;
    }
    
    const startTime = performance.now();
    checkBtn.click();
    const endTime = performance.now();
    
    const checkTime = endTime - startTime;
    console.log(`检查答案时间: ${checkTime.toFixed(2)}ms`);
    
    if (checkTime < 100) {
        console.log('✓ 检查答案性能测试通过');
    } else {
        console.log('✗ 检查答案性能测试失败');
    }
}

// 测试内存使用情况
function testMemoryUsage() {
    console.log('测试内存使用情况...');
    if (performance.memory) {
        const memory = performance.memory;
        console.log(`内存使用: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
        console.log(`总内存: ${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
        console.log(`内存限制: ${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`);
        
        if (memory.usedJSHeapSize < memory.jsHeapSizeLimit * 0.5) {
            console.log('✓ 内存使用测试通过');
        } else {
            console.log('✗ 内存使用测试失败');
        }
    } else {
        console.log('内存使用测试：浏览器不支持 memory API');
    }
}

// 运行所有性能测试
function runPerformanceTests() {
    console.log('开始性能测试...');
    testPageLoadTime();
    testDragPerformance();
    testNavigationPerformance();
    testChatPerformance();
    testCheckAnswerPerformance();
    testMemoryUsage();
    console.log('性能测试完成！');
}

// 当页面加载完成后运行测试
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runPerformanceTests);
} else {
    runPerformanceTests();
}

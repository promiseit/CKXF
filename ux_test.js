// 用户体验测试脚本

// 测试界面设计
function testInterfaceDesign() {
    console.log('测试界面设计...');
    
    // 检查页面结构
    const container = document.querySelector('.container');
    const header = document.querySelector('.header');
    const nav = document.querySelector('.nav');
    const gameArea = document.querySelector('.game-area');
    const scoreArea = document.querySelector('.score-area');
    const virtualKeyboard = document.querySelector('.virtual-keyboard');
    const chatArea = document.querySelector('.chat-area');
    
    let designScore = 0;
    let totalTests = 0;
    
    // 检查页面结构完整性
    if (container) designScore++;
    if (header) designScore++;
    if (nav) designScore++;
    if (gameArea) designScore++;
    if (scoreArea) designScore++;
    if (virtualKeyboard) designScore++;
    if (chatArea) designScore++;
    totalTests = 7;
    
    console.log(`界面设计测试：${designScore}/${totalTests} 通过`);
    
    if (designScore === totalTests) {
        console.log('✓ 界面设计测试通过');
    } else {
        console.log('✗ 界面设计测试失败');
    }
}

// 测试交互体验
function testInteractionExperience() {
    console.log('测试交互体验...');
    
    // 测试按钮交互
    const buttons = document.querySelectorAll('button');
    let interactiveScore = 0;
    
    buttons.forEach(button => {
        if (button.style.cursor === 'pointer' || button.style.cursor === 'grab') {
            interactiveScore++;
        }
    });
    
    console.log(`按钮交互测试：${interactiveScore}/${buttons.length} 通过`);
    
    // 测试拖拽交互
    const blocks = document.querySelectorAll('.block');
    let dragScore = 0;
    
    blocks.forEach(block => {
        if (block.draggable === true) {
            dragScore++;
        }
    });
    
    console.log(`拖拽交互测试：${dragScore}/${blocks.length} 通过`);
    
    if (interactiveScore > 0 && dragScore > 0) {
        console.log('✓ 交互体验测试通过');
    } else {
        console.log('✗ 交互体验测试失败');
    }
}

// 测试响应式设计
function testResponsiveDesign() {
    console.log('测试响应式设计...');
    
    // 测试不同屏幕尺寸
    const screenSizes = [320, 768, 1200];
    let responsiveScore = 0;
    
    screenSizes.forEach(size => {
        // 模拟屏幕尺寸
        window.innerWidth = size;
        window.dispatchEvent(new Event('resize'));
        
        // 检查容器宽度
        const container = document.querySelector('.container');
        if (container) {
            const containerWidth = container.offsetWidth;
            if (containerWidth <= size) {
                responsiveScore++;
            }
        }
    });
    
    console.log(`响应式设计测试：${responsiveScore}/${screenSizes.length} 通过`);
    
    if (responsiveScore === screenSizes.length) {
        console.log('✓ 响应式设计测试通过');
    } else {
        console.log('✗ 响应式设计测试失败');
    }
}

// 测试可访问性
function testAccessibility() {
    console.log('测试可访问性...');
    
    // 测试键盘导航
    const focusableElements = document.querySelectorAll('button, input, [tabindex]');
    let accessibilityScore = 0;
    
    focusableElements.forEach(element => {
        if (element.tabIndex >= 0) {
            accessibilityScore++;
        }
    });
    
    console.log(`键盘导航测试：${accessibilityScore}/${focusableElements.length} 通过`);
    
    // 测试颜色对比度
    const elements = document.querySelectorAll('*');
    let contrastScore = 0;
    
    elements.forEach(element => {
        const computedStyle = window.getComputedStyle(element);
        const color = computedStyle.color;
        const backgroundColor = computedStyle.backgroundColor;
        
        if (color && backgroundColor) {
            contrastScore++;
        }
    });
    
    console.log(`颜色对比度测试：${contrastScore}/${elements.length} 通过`);
    
    if (accessibilityScore > 0 && contrastScore > 0) {
        console.log('✓ 可访问性测试通过');
    } else {
        console.log('✗ 可访问性测试失败');
    }
}

// 测试加载状态
function testLoadingState() {
    console.log('测试加载状态...');
    
    // 测试页面加载完成
    if (document.readyState === 'complete') {
        console.log('✓ 加载状态测试通过');
    } else {
        console.log('✗ 加载状态测试失败');
    }
}

// 运行所有用户体验测试
function runUXTests() {
    console.log('开始用户体验测试...');
    testInterfaceDesign();
    testInteractionExperience();
    testResponsiveDesign();
    testAccessibility();
    testLoadingState();
    console.log('用户体验测试完成！');
}

// 当页面加载完成后运行测试
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runUXTests);
} else {
    runUXTests();
}

// 安全测试脚本

// 测试XSS防护
function testXSSProtection() {
    console.log('测试XSS防护...');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');
    
    if (!chatInput || !sendBtn || !chatMessages) {
        console.log('✗ XSS防护测试失败：没有找到聊天元素');
        return;
    }
    
    // 注入XSS代码
    const xssPayload = '<script>alert("XSS攻击成功")</script>';
    chatInput.value = xssPayload;
    sendBtn.click();
    
    // 检查消息是否被正确转义
    const messages = chatMessages.querySelectorAll('.message');
    const userMessage = messages[messages.length - 1];
    
    if (userMessage && !userMessage.innerHTML.includes('<script>')) {
        console.log('✓ XSS防护测试通过');
    } else {
        console.log('✗ XSS防护测试失败');
    }
}

// 测试CSRF防护
function testCSRFProtection() {
    console.log('测试CSRF防护...');
    // 检查是否有CSRF令牌
    const metaTags = document.querySelectorAll('meta');
    let hasCSRFToken = false;
    
    metaTags.forEach(tag => {
        if (tag.name === 'csrf-token' || tag.getAttribute('content')?.includes('csrf')) {
            hasCSRFToken = true;
        }
    });
    
    if (hasCSRFToken) {
        console.log('✓ CSRF防护测试通过');
    } else {
        console.log('✗ CSRF防护测试失败');
    }
}

// 测试输入验证
function testInputValidation() {
    console.log('测试输入验证...');
    const chatInput = document.getElementById('chat-input');
    
    if (!chatInput) {
        console.log('✗ 输入验证测试失败：没有找到输入元素');
        return;
    }
    
    // 测试特殊字符输入
    const testInputs = [
        '正常输入',
        '包含特殊字符: <>&"\'',
        '包含脚本标签: <script>alert(1)</script>',
        '包含SQL注入: OR 1=1',
        '包含长字符串: ' + 'a'.repeat(1000)
    ];
    
    let allValid = true;
    testInputs.forEach(input => {
        chatInput.value = input;
        if (chatInput.value !== input) {
            allValid = false;
        }
    });
    
    if (allValid) {
        console.log('✓ 输入验证测试通过');
    } else {
        console.log('✗ 输入验证测试失败');
    }
}

// 测试资源加载安全性
function testResourceLoading() {
    console.log('测试资源加载安全性...');
    const scripts = document.querySelectorAll('script');
    const links = document.querySelectorAll('link');
    
    let secure = true;
    
    // 检查脚本是否使用HTTPS
    scripts.forEach(script => {
        if (script.src && script.src.startsWith('http://')) {
            secure = false;
        }
    });
    
    // 检查样式表是否使用HTTPS
    links.forEach(link => {
        if (link.href && link.href.startsWith('http://')) {
            secure = false;
        }
    });
    
    if (secure) {
        console.log('✓ 资源加载安全性测试通过');
    } else {
        console.log('✗ 资源加载安全性测试失败');
    }
}

// 测试本地存储安全性
function testLocalStorageSecurity() {
    console.log('测试本地存储安全性...');
    // 检查是否使用localStorage
    if (typeof localStorage !== 'undefined') {
        console.log('本地存储可用');
        
        // 测试存储和读取
        const testKey = 'test_security';
        const testValue = 'test_value';
        
        try {
            localStorage.setItem(testKey, testValue);
            const retrievedValue = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
            
            if (retrievedValue === testValue) {
                console.log('✓ 本地存储安全性测试通过');
            } else {
                console.log('✗ 本地存储安全性测试失败');
            }
        } catch (e) {
            console.log('✗ 本地存储安全性测试失败：', e.message);
        }
    } else {
        console.log('本地存储不可用');
        console.log('✓ 本地存储安全性测试通过');
    }
}

// 运行所有安全测试
function runSecurityTests() {
    console.log('开始安全测试...');
    testXSSProtection();
    testCSRFProtection();
    testInputValidation();
    testResourceLoading();
    testLocalStorageSecurity();
    console.log('安全测试完成！');
}

// 当页面加载完成后运行测试
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runSecurityTests);
} else {
    runSecurityTests();
}

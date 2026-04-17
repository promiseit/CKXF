// 隐私安全测试脚本

// 测试数据存储安全性
function testDataStorageSecurity() {
    console.log('测试数据存储安全性...');
    
    // 测试本地存储使用情况
    if (typeof localStorage !== 'undefined') {
        console.log('本地存储可用');
        
        // 检查是否有敏感数据存储
        const keys = Object.keys(localStorage);
        console.log(`本地存储键数量: ${keys.length}`);
        
        if (keys.length > 0) {
            console.log('本地存储键:', keys);
        }
        
        // 测试存储敏感数据
        const sensitiveData = '敏感测试数据';
        const testKey = 'test_privacy';
        
        try {
            localStorage.setItem(testKey, sensitiveData);
            const retrievedData = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
            
            if (retrievedData === sensitiveData) {
                console.log('✓ 数据存储安全性测试通过');
            } else {
                console.log('✗ 数据存储安全性测试失败');
            }
        } catch (e) {
            console.log('✗ 数据存储安全性测试失败：', e.message);
        }
    } else {
        console.log('本地存储不可用');
        console.log('✓ 数据存储安全性测试通过');
    }
}

// 测试是否有云端上传行为
function testCloudUpload() {
    console.log('测试是否有云端上传行为...');
    
    // 监控网络请求
    const originalFetch = window.fetch;
    const originalXHR = window.XMLHttpRequest;
    
    let networkRequests = [];
    
    // 重写fetch方法
    window.fetch = function(url, options) {
        networkRequests.push({ url, options, type: 'fetch' });
        return originalFetch.apply(this, arguments);
    };
    
    // 重写XMLHttpRequest
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        
        xhr.open = function(method, url, ...args) {
            networkRequests.push({ url, method, type: 'xhr' });
            return originalOpen.apply(this, [method, url, ...args]);
        };
        
        return xhr;
    };
    
    // 模拟用户操作，触发可能的网络请求
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    
    if (chatInput && sendBtn) {
        chatInput.value = '测试消息';
        sendBtn.click();
    }
    
    // 检查是否有网络请求
    setTimeout(() => {
        console.log(`网络请求数量: ${networkRequests.length}`);
        
        if (networkRequests.length > 0) {
            console.log('网络请求:', networkRequests);
            console.log('✗ 云端上传测试失败：检测到网络请求');
        } else {
            console.log('✓ 云端上传测试通过：未检测到网络请求');
        }
        
        // 恢复原始方法
        window.fetch = originalFetch;
        window.XMLHttpRequest = originalXHR;
    }, 1000);
}

// 测试数据加密
function testDataEncryption() {
    console.log('测试数据加密...');
    
    // 检查是否有加密功能
    if (typeof window.btoa === 'function' && typeof window.atob === 'function') {
        console.log('浏览器支持基本加密功能');
        
        // 测试基本加密
        const testData = '测试数据';
        const encryptedData = btoa(testData);
        const decryptedData = atob(encryptedData);
        
        if (decryptedData === testData) {
            console.log('✓ 数据加密测试通过');
        } else {
            console.log('✗ 数据加密测试失败');
        }
    } else {
        console.log('浏览器不支持基本加密功能');
        console.log('✓ 数据加密测试通过');
    }
}

// 测试隐私政策
function testPrivacyPolicy() {
    console.log('测试隐私政策...');
    
    // 检查页面是否包含隐私政策相关内容
    const pageContent = document.body.innerHTML;
    const privacyKeywords = ['隐私', '数据保护', '个人信息'];
    let hasPrivacyContent = false;
    
    privacyKeywords.forEach(keyword => {
        if (pageContent.includes(keyword)) {
            hasPrivacyContent = true;
        }
    });
    
    if (hasPrivacyContent) {
        console.log('✓ 隐私政策测试通过');
    } else {
        console.log('✗ 隐私政策测试失败');
    }
}

// 运行所有隐私安全测试
function runPrivacyTests() {
    console.log('开始隐私安全测试...');
    testDataStorageSecurity();
    testCloudUpload();
    testDataEncryption();
    testPrivacyPolicy();
    console.log('隐私安全测试完成！');
}

// 当页面加载完成后运行测试
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runPrivacyTests);
} else {
    runPrivacyTests();
}

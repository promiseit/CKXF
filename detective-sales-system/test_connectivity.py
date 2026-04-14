from playwright.sync_api import sync_playwright
import time

# 测试前端和后端连通性
def test_frontend_backend_connectivity():
    with sync_playwright() as p:
        # 启动浏览器
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        try:
            # 1. 测试前端服务是否可访问
            print("测试前端服务...")
            page.goto('http://localhost:8888')
            page.wait_for_load_state('networkidle', timeout=10000)
            
            # 检查前端页面是否加载成功
            title = page.title()
            print(f"前端页面标题: {title}")
            
            # 2. 测试后端服务是否可访问
            print("\n测试后端服务...")
            # 访问后端健康检查端点
            backend_response = page.request.get('http://localhost:3001/health')
            print(f"后端健康检查状态码: {backend_response.status}")
            print(f"后端健康检查响应: {backend_response.text()}")
            
            # 3. 测试前端是否能调用后端API
            print("\n测试前端调用后端API...")
            # 模拟前端调用后端AI分析API
            test_payload = {
                "model": "wenxin",
                "apiKey": "test_key",
                "prompt": "测试API连接",
                "apiUrl": "",
                "modelId": ""
            }
            
            api_response = page.request.post('http://localhost:3001/api/ai-analyze', 
                                         data=test_payload)
            print(f"后端API响应状态码: {api_response.status}")
            print(f"后端API响应: {api_response.text()}")
            
            # 4. 测试前端功能
            print("\n测试前端功能...")
            # 检查是否存在案件列表按钮
            case_list_btn = page.locator('#case-list-btn')
            if case_list_btn.is_visible():
                print("✓ 案件列表按钮存在")
            else:
                print("✗ 案件列表按钮不存在")
            
            # 检查是否存在新建案件按钮
            new_case_btn = page.locator('#new-case-btn')
            if new_case_btn.is_visible():
                print("✓ 新建案件按钮存在")
            else:
                print("✗ 新建案件按钮不存在")
            
            # 检查是否存在设置按钮
            settings_btn = page.locator('#settings-btn')
            if settings_btn.is_visible():
                print("✓ 设置按钮存在")
            else:
                print("✗ 设置按钮不存在")
            
            print("\n测试完成！")
            
        except Exception as e:
            print(f"测试过程中出错: {e}")
        finally:
            # 关闭浏览器
            browser.close()

if __name__ == "__main__":
    test_frontend_backend_connectivity()
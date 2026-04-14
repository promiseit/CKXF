from playwright.sync_api import sync_playwright
import time

def test_system_functionality():
    """测试整个系统的所有功能"""
    with sync_playwright() as p:
        # 启动浏览器
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        try:
            print("\n=== 开始系统功能测试 ===")
            
            # 1. 测试前端服务状态
            print("\n1. 测试前端服务状态")
            try:
                page.goto('http://localhost:8888')
                page.wait_for_load_state('load')
                time.sleep(2)
                print("✅ 前端服务访问成功")
            except Exception as e:
                print(f"❌ 前端服务访问失败: {e}")
                return
            
            # 2. 测试后端服务状态
            print("\n2. 测试后端服务状态")
            try:
                backend_page = browser.new_page()
                backend_page.goto('http://localhost:3001/health')
                backend_page.wait_for_load_state('load')
                health_response = backend_page.content()
                if "ok" in health_response:
                    print("✅ 后端服务访问成功")
                else:
                    print("❌ 后端服务访问失败")
                backend_page.close()
            except Exception as e:
                print(f"❌ 后端服务访问失败: {e}")
            
            # 3. 测试案件创建
            print("\n3. 测试案件创建")
            try:
                # 点击开始新案件按钮
                print("  尝试点击开始新案件按钮...")
                start_btn = page.locator("button#start-case-btn")
                if start_btn.is_visible():
                    print("  找到开始新案件按钮，点击中...")
                    start_btn.click()
                    
                    # 等待新建案件页面出现
                    print("  等待新建案件页面出现...")
                    try:
                        page.wait_for_selector("div#new-case-screen.active", timeout=10000)
                        print("  成功进入新建案件页面")
                        
                        # 填写表单
                        title_input = page.locator("input#case-title")
                        if title_input.is_visible():
                            print("  找到案件标题输入框")
                            title_input.fill("测试案件")
                            page.locator("input#client-name").fill("测试客户")
                            page.locator("textarea#case-description").fill("这是一个测试案件")
                            
                            # 点击创建案件按钮
                            create_btn = page.locator("button:has-text('创建案件')")
                            if create_btn.is_visible():
                                print("  找到创建案件按钮，点击中...")
                                create_btn.click()
                                
                                # 等待案件创建完成，返回欢迎页面
                                print("  等待案件创建完成...")
                                page.wait_for_selector("div#welcome-screen.active", timeout=10000)
                                print("✅ 案件创建成功")
                            else:
                                print("⚠️ 创建案件按钮未找到")
                        else:
                            print("⚠️ 案件标题输入框未找到")
                    except Exception as e:
                        print(f"  等待新建案件页面失败: {e}")
                        print("  当前页面内容:", page.content()[:500])
                else:
                    print("⚠️ 开始新案件按钮未找到")
                    print("  当前页面内容:", page.content()[:500])
            except Exception as e:
                print(f"❌ 案件创建失败: {e}")
            
            # 4. 测试案件列表
            print("\n4. 测试案件列表")
            try:
                # 点击案件列表按钮
                case_list_btn = page.locator("button#case-list-btn")
                if case_list_btn.is_visible():
                    case_list_btn.click()
                    time.sleep(2)
                    print("✅ 案件列表访问成功")
                else:
                    print("⚠️ 案件列表按钮未找到")
            except Exception as e:
                print(f"❌ 案件列表访问失败: {e}")
            
            # 5. 测试设置页面
            print("\n5. 测试设置页面")
            try:
                # 点击设置按钮
                settings_btn = page.locator("button#settings-btn")
                if settings_btn.is_visible():
                    settings_btn.click()
                    time.sleep(2)
                    print("✅ 设置页面访问成功")
                    
                    # 测试保存设置按钮
                    save_btn = page.locator("button#save-settings-btn")
                    if save_btn.is_visible():
                        print("✅ 保存设置按钮存在")
                    else:
                        print("⚠️ 保存设置按钮未找到")
                    
                    # 测试API测试按钮
                    test_api_btn = page.locator("button#test-api-btn")
                    if test_api_btn.is_visible():
                        print("✅ API测试按钮存在")
                    else:
                        print("⚠️ API测试按钮未找到")
                    
                    # 返回案件列表
                    case_list_btn = page.locator("button#case-list-btn")
                    if case_list_btn.is_visible():
                        case_list_btn.click()
                        time.sleep(2)
                else:
                    print("⚠️ 设置按钮未找到")
            except Exception as e:
                print(f"❌ 设置页面访问失败: {e}")
            
            print("\n=== 测试完成 ===")
            print("系统功能测试已完成")
            
        except Exception as e:
            print(f"❌ 测试过程中出现错误: {e}")
        finally:
            # 关闭浏览器
            browser.close()

if __name__ == "__main__":
    test_system_functionality()

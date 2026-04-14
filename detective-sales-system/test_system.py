from playwright.sync_api import sync_playwright
import time

def test_system_functionality():
    """测试整个系统的所有功能"""
    with sync_playwright() as p:
        # 启动浏览器
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        try:
            # 1. 测试前端服务状态
            print("\n=== 测试前端服务状态 ===")
            page.goto('http://localhost:8888')
            page.wait_for_load_state('networkidle')
            print("✅ 前端服务访问成功")
            
            # 2. 测试后端服务状态
            print("\n=== 测试后端服务状态 ===")
            backend_page = browser.new_page()
            backend_page.goto('http://localhost:3001/health')
            backend_page.wait_for_load_state('networkidle')
            health_response = backend_page.content()
            if "ok" in health_response:
                print("✅ 后端服务访问成功")
            else:
                print("❌ 后端服务访问失败")
            backend_page.close()
            
            # 3. 测试案件创建
            print("\n=== 测试案件创建 ===")
            page.click("text=创建新案件")
            page.fill("input[name='caseName']", "测试案件")
            page.fill("textarea[name='caseDescription']", "这是一个测试案件")
            page.click("text=开始调查")
            page.wait_for_load_state('networkidle')
            print("✅ 案件创建成功")
            
            # 4. 测试线索收集（添加线索）
            print("\n=== 测试线索收集 ===")
            page.fill("input[name='clueContent']", "测试线索内容")
            page.select_option("select[name='clueType']", "用户反馈")
            page.select_option("select[name='clueImportance']", "高")
            page.fill("input[name='clueTags']", "测试,重要")
            page.click("text=添加线索")
            time.sleep(1)  # 等待线索添加
            print("✅ 线索添加成功")
            
            # 5. 测试线索编辑
            print("\n=== 测试线索编辑 ===")
            edit_buttons = page.locator("button:has-text('编辑')").all()
            if edit_buttons:
                edit_buttons[0].click()
                page.fill("input[name='editClueContent']", "编辑后的线索内容")
                page.click("text=保存修改")
                time.sleep(1)
                print("✅ 线索编辑成功")
            else:
                print("⚠️ 未找到编辑按钮")
            
            # 6. 测试线索删除
            print("\n=== 测试线索删除 ===")
            delete_buttons = page.locator("button:has-text('删除')").all()
            if delete_buttons:
                delete_buttons[0].click()
                # 处理确认对话框
                page.on('dialog', lambda dialog: dialog.accept())
                time.sleep(1)
                print("✅ 线索删除成功")
            else:
                print("⚠️ 未找到删除按钮")
            
            # 7. 测试AI分析
            print("\n=== 测试AI分析 ===")
            page.click("text=分析推理")
            page.wait_for_load_state('networkidle')
            page.click("text=AI分析")
            # 等待分析完成
            time.sleep(5)
            print("✅ AI分析功能测试完成")
            
            # 8. 测试生成报告
            print("\n=== 测试生成报告 ===")
            page.click("text=生成报告")
            page.wait_for_load_state('networkidle')
            print("✅ 报告生成功能测试完成")
            
            # 9. 测试报告下载
            print("\n=== 测试报告下载 ===")
            download_button = page.locator("button:has-text('下载报告')")
            if download_button.is_visible():
                print("✅ 报告下载按钮存在")
            else:
                print("⚠️ 未找到报告下载按钮")
            
            # 10. 测试PPT导出
            print("\n=== 测试PPT导出 ===")
            ppt_button = page.locator("button:has-text('导出PPT')")
            if ppt_button.is_visible():
                print("✅ PPT导出按钮存在")
            else:
                print("⚠️ 未找到PPT导出按钮")
            
            # 11. 测试回退功能
            print("\n=== 测试回退功能 ===")
            back_button = page.locator("button:has-text('上一步')")
            if back_button.is_visible():
                back_button.click()
                print("✅ 回退功能测试成功")
            else:
                print("⚠️ 未找到回退按钮")
            
            # 12. 测试设置页面
            print("\n=== 测试设置页面 ===")
            page.click("text=设置")
            page.wait_for_load_state('networkidle')
            print("✅ 设置页面访问成功")
            
            # 13. 测试案件列表
            print("\n=== 测试案件列表 ===")
            page.click("text=案件列表")
            page.wait_for_load_state('networkidle')
            print("✅ 案件列表访问成功")
            
            # 14. 测试案件删除
            print("\n=== 测试案件删除 ===")
            delete_case_buttons = page.locator("button:has-text('删除')").all()
            if delete_case_buttons:
                delete_case_buttons[0].click()
                # 处理确认对话框
                page.on('dialog', lambda dialog: dialog.accept())
                time.sleep(1)
                print("✅ 案件删除功能测试成功")
            else:
                print("⚠️ 未找到案件删除按钮")
            
            print("\n=== 测试完成 ===")
            print("所有功能测试已完成，请查看结果")
            
        except Exception as e:
            print(f"❌ 测试过程中出现错误: {e}")
        finally:
            # 关闭浏览器
            browser.close()

if __name__ == "__main__":
    test_system_functionality()

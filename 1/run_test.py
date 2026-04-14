from playwright.sync_api import sync_playwright
import os

# 使用当前目录
dirs = [d for d in os.listdir(".") if d.startswith("spec_Use_Skill_bra")]
for d in dirs:
    # 直接测试前端页面
    print(f"找到项目目录: {d}")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        print("正在访问前端页面 http://localhost:8080 ...")
        page.goto("http://localhost:8080")
        page.wait_for_load_state("networkidle")
        print("=" * 60)
        print("前端测试报告")
        print("=" * 60)
        print(f"页面标题: {page.title()}")
        content = page.content()
        if "神探销售系统" in content:
            print("✓ 前端页面加载成功")
        buttons = page.locator("button").all()
        print(f"✓ 页面包含 {len(buttons)} 个按钮")
        print("=" * 60)
    break

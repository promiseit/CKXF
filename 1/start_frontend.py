import subprocess
import os

base_path = r"D:\1"
for item in os.listdir(base_path):
    if item.startswith("spec_Use_Skill_bra"):
        frontend_path = os.path.join(base_path, item, "detective-sales-system")
        if os.path.exists(frontend_path):
            print(f"找到前端目录: {frontend_path}")
            index_html = os.path.join(frontend_path, "index.html")
            if os.path.exists(index_html):
                print(f"启动前端服务器: {frontend_path}")
                subprocess.Popen(["python", "-m", "http.server", "8080"], cwd=frontend_path)
                print("前端服务器已启动于 http://localhost:8080")
                break

import subprocess
import os
import sys

base_path = r"D:\1"
for item in os.listdir(base_path):
    if item.startswith("spec_Use_Skill_bra"):
        backend_path = os.path.join(base_path, item, "detective-sales-system", "backend")
        if os.path.exists(backend_path):
            print(f"找到后端目录: {backend_path}")
            server_js = os.path.join(backend_path, "server.js")
            if os.path.exists(server_js):
                print(f"启动服务器: {server_js}")
                os.chdir(backend_path)
                subprocess.Popen(["node", "server.js"], cwd=backend_path)
                print("后端服务器已启动!")
                break

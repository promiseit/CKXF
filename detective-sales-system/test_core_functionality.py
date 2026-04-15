import requests
import time

def test_core_functionality():
    """测试系统核心功能"""
    print("\n=== 测试系统核心功能 ===")
    
    # 1. 测试后端服务状态
    print("\n1. 测试后端服务状态")
    try:
        response = requests.get('http://localhost:3001/health')
        if response.status_code == 200:
            print("✅ 后端服务访问成功")
            print(f"  响应: {response.json()}")
        else:
            print(f"❌ 后端服务访问失败，状态码: {response.status_code}")
    except Exception as e:
        print(f"❌ 后端服务访问失败: {e}")
    
    # 2. 测试AI分析API
    print("\n2. 测试AI分析API")
    try:
        test_data = {
            "model": "wenxin",
            "apiKey": "test_key",
            "apiUrl": "https://api.example.com",
            "prompt": "测试提示词",
            "modelId": "test_model"
        }
        response = requests.post('http://localhost:3001/api/ai-analyze', json=test_data)
        if response.status_code == 200:
            print("✅ AI分析API访问成功")
            print(f"  响应: {response.json()}")
        else:
            print(f"❌ AI分析API访问失败，状态码: {response.status_code}")
            print(f"  响应: {response.text}")
    except Exception as e:
        print(f"❌ AI分析API访问失败: {e}")
    
    # 3. 测试前端服务状态
    print("\n3. 测试前端服务状态")
    try:
        response = requests.get('http://localhost:8888')
        if response.status_code == 200:
            print("✅ 前端服务访问成功")
            print(f"  页面标题: {response.text.split('<title>')[1].split('</title>')[0]}")
        else:
            print(f"❌ 前端服务访问失败，状态码: {response.status_code}")
    except Exception as e:
        print(f"❌ 前端服务访问失败: {e}")
    
    print("\n=== 测试完成 ===")
    print("系统核心功能测试已完成")

if __name__ == "__main__":
    test_core_functionality()

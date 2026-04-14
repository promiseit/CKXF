import http.client
import json

print("=" * 60)
print("后端服务测试报告")
print("=" * 60)

try:
    conn = http.client.HTTPConnection("127.0.0.1", 5000, timeout=5)
    conn.request("GET", "/health")
    response = conn.getresponse()

    print(f"状态码: {response.status}")
    print(f"响应头: {response.getheaders()}")
    data = response.read().decode('utf-8')
    print(f"响应内容: {data}")

    if response.status == 200:
        print("✓ 后端健康检查通过!")
        result = json.loads(data)
        if result.get('status') == 'ok':
            print("✓ 后端服务正常运行")
    else:
        print(f"✗ 后端返回异常状态: {response.status}")

    conn.close()
except Exception as e:
    print(f"✗ 无法连接到后端服务")
    print(f"错误: {str(e)}")

print()
print("=" * 60)

print("\n测试AI分析API (GET):")
try:
    conn = http.client.HTTPConnection("127.0.0.1", 5000, timeout=5)
    conn.request("GET", "/api/ai-analyze")
    response = conn.getresponse()
    print(f"状态码: {response.status}")
    data = response.read().decode('utf-8')
    print(f"响应: {data}")
    conn.close()
except Exception as e:
    print(f"错误: {str(e)}")

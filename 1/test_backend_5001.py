import http.client
import json

print("=" * 60)
print("后端服务测试报告 (端口5001)")
print("=" * 60)

try:
    conn = http.client.HTTPConnection("127.0.0.1", 5001, timeout=5)
    conn.request("GET", "/health")
    response = conn.getresponse()

    print(f"状态码: {response.status}")
    data = response.read().decode('utf-8')
    print(f"响应内容: {data}")

    if response.status == 200:
        print("✓ 后端健康检查通过!")
    conn.close()
except Exception as e:
    print(f"✗ 无法连接到后端服务")
    print(f"错误: {str(e)}")

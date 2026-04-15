import http.client
import json

print("=" * 60)
print("CORS跨域测试")
print("=" * 60)

try:
    headers = {
        'Origin': 'http://localhost:8080',
        'Content-Type': 'application/json',
    }

    conn = http.client.HTTPConnection("127.0.0.1", 5001, timeout=5)
    conn.request("GET", "/health", headers=headers)
    response = conn.getresponse()

    print(f"状态码: {response.status}")
    print(f"响应头: {dict(response.getheaders())}")
    data = response.read().decode('utf-8')
    print(f"响应内容: {data}")

    cors_headers = response.getheader('Access-Control-Allow-Origin')
    if cors_headers:
        print(f"✓ CORS头存在: Access-Control-Allow-Origin = {cors_headers}")
    else:
        print("✗ CORS头不存在")

    conn.close()
except Exception as e:
    print(f"✗ 测试失败: {str(e)}")

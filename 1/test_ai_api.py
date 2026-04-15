import http.client
import json

print("=" * 60)
print("AI分析API测试")
print("=" * 60)

try:
    payload = {
        "model": "tongyi",
        "apiKey": "test-key",
        "prompt": "请回复'API连接成功'，只需要回复这四个字，不要其他内容"
    }

    headers = {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:8080'
    }

    conn = http.client.HTTPConnection("127.0.0.1", 5001, timeout=10)
    conn.request("POST", "/api/ai-analyze", json.dumps(payload), headers)

    response = conn.getresponse()
    print(f"状态码: {response.status}")
    data = response.read().decode('utf-8')
    print(f"响应内容: {data}")

    if response.status == 200:
        result = json.loads(data)
        if result.get('success'):
            print("✓ AI分析API调用成功")
        else:
            print(f"✗ AI分析失败: {result.get('error')}")
    else:
        print(f"✗ API返回错误状态: {response.status}")

    conn.close()
except Exception as e:
    print(f"✗ 测试失败: {str(e)}")

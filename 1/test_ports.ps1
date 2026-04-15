$tcpClient = New-Object System.Net.Sockets.TcpClient
try {
    $tcpClient.Connect("127.0.0.1", 5000)
    if ($tcpClient.Connected) {
        Write-Host "✓ 端口 5000 可访问 - 后端服务正在运行"
        $tcpClient.Close()
    }
} catch {
    Write-Host "✗ 无法连接到端口 5000"
    Write-Host "错误: $($_.Exception.Message)"
}
$tcpClient.Dispose()

$tcpClient2 = New-Object System.Net.Sockets.TcpClient
try {
    $tcpClient2.Connect("127.0.0.1", 8080)
    if ($tcpClient2.Connected) {
        Write-Host "✓ 端口 8080 可访问 - 前端服务正在运行"
        $tcpClient2.Close()
    }
} catch {
    Write-Host "✗ 无法连接到端口 8080"
    Write-Host "错误: $($_.Exception.Message)"
}
$tcpClient2.Dispose()

Write-Host ""
Write-Host "后端API测试:"
$request = "GET /health HTTP/1.1`r`nHost: 127.0.0.1`r`n`r`n"
Write-Host "发送请求: $request"

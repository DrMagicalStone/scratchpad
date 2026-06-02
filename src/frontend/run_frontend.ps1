# 检查环境配置脚本是否存在，存在则加载（临时生效）
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ScriptDir = Split-Path -Parent $ScriptDir
$ScriptDir = Split-Path -Parent $ScriptDir
$SetupEnv = Join-Path $ScriptDir "setup_env.ps1"
if (Test-Path $SetupEnv) {
    . $SetupEnv   # 点执行，环境变量仅对本次 PowerShell 会话有效
} else {
    Write-Host "未找到 setup-env.ps1，使用系统默认 node/npm" -ForegroundColor Yellow
}

Write-Host $env:PATH

npm run dev
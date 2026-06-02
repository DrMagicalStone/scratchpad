<#
.SYNOPSIS
    自动下载并解压 Node.js 便携版，同时将 npm 缓存设置到 Node.js 所在文件夹。
.DESCRIPTION
    修改下方 $NodeVersion 和 $DownloadUrl 后运行即可。
.NOTES
    需要 PowerShell 5.0+ (内置 Expand-Archive)。
    若系统执行策略阻止脚本，请先运行：
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#>

# ========== 请在这里修改版本和下载地址 ==========
$NodeVersion = "v24.16.0"                     # 版本号，例如 "v18.16.0"
$Arch        = "x64"                          # 系统架构：x64 或 x86
$DownloadUrl = "https://nodejs.org/dist/$NodeVersion/node-$NodeVersion-win-$Arch.zip"
# 如果官方源下载慢，可换成国内镜像，例如：
# $DownloadUrl = "https://npmmirror.com/mirrors/node/$NodeVersion/node-$NodeVersion-win-$Arch.zip"
# =================================================

$ScriptDir  = $PSScriptRoot
$ZipFile    = Join-Path $ScriptDir "node-$NodeVersion-win-$Arch.zip"
$ExtractDir = $ScriptDir

# 0. 确保脚本所在目录可写
if (-not (Test-Path $ScriptDir -PathType Container)) {
    New-Item -ItemType Directory -Path $ScriptDir -Force | Out-Null
}

# 1. 下载 Node.js 压缩包
Write-Host "正在下载 Node.js $NodeVersion ..." -ForegroundColor Cyan
try {
    Invoke-WebRequest -Uri $DownloadUrl -OutFile $ZipFile -ErrorAction Stop
    Write-Host "下载完成: $ZipFile" -ForegroundColor Green
} catch {
    Write-Error "下载失败，请检查网络或下载地址：$DownloadUrl"
    exit 1
}

# 2. 解压缩
Write-Host "正在解压到 $ExtractDir ..." -ForegroundColor Cyan
try {
    Expand-Archive -Path $ZipFile -DestinationPath $ExtractDir -Force
    mv "node-$NodeVersion-win-$Arch" "nodejs"
    Write-Host "解压完成" -ForegroundColor Green
} catch {
    Write-Error "解压失败: $_"
    exit 1
}

# 3. 找到解压出来的 Node.js 文件夹（例如 node-v20.11.0-win-x64）
$NodeDir = Join-Path $ExtractDir "nodejs"

if (-not $NodeDir) {
    Write-Error "未找到解压后的 Node.js 文件夹（预期名称包含 'node-v...'）"
    exit 1
}
$NodeDirPath = Convert-Path $NodeDir
Write-Host "检测到 Node.js 文件夹: $NodeDirPath" -ForegroundColor Green

# 4. 创建严格绑定的 npm 缓存配置（局部 .npmrc）
$NpmrcPath = Join-Path $NodeDir ".npmrc"
$CacheDir  = Join-Path $NodeDir "npm-cache"
New-Item -ItemType Directory -Path $CacheDir -Force | Out-Null
Set-Content -Path $NpmrcPath -Value "cache=./npm-cache"
Write-Host "已设置本地 .npmrc → 缓存目录: $CacheDir" -ForegroundColor Green

# 5. 生成环境配置脚本 setup-env.ps1
$SetupEnvScript = Join-Path $ScriptDir "setup_env.ps1"
@'
# 临时将当前 Node 实例加入 PATH，并设置 npm 缓存环境变量

$CurrentPath = Convert-Path $PSScriptRoot
$NodeExeDir = Join-Path $CurrentPath "nodejs"

$env:PATH = "$NodeExeDir;$env:PATH"
$env:npm_config_cache = Join-Path $NodeExeDir "npm-cache"
Write-Host "临时环境已配置: Node = $NodeExeDir" -ForegroundColor Cyan
'@ | Set-Content -Path $SetupEnvScript -Encoding UTF8

# 5. 清理下载的压缩包（可选，删除下面两行可保留 zip 文件）
Write-Host "清理临时文件..." -ForegroundColor Cyan
Remove-Item $ZipFile -Force

# 6. 输出使用说明
Write-Host "`n✅ Node.js 安装完毕！" -ForegroundColor Green
Write-Host "Node 可执行文件: $NodeDirPath\node.exe"
Write-Host "Npm 缓存位置:    $CacheDir"
Write-Host "`n可将其添加到 PATH 环境变量："
Write-Host "  `$env:Path += `";$NodeDirPath`""
Write-Host "或直接使用完整路径运行："
Write-Host "  `"$NodeDirPath\node.exe`" --version"
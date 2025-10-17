#!/bin/bash

# Git Hooks 安装脚本
# 用于安装强制使用 git-cz 的 Git hooks

echo "🔧 安装 Git Hooks..."
echo ""

# 检查 .githooks 目录是否存在
if [ ! -d ".githooks" ]; then
    echo "❌ 错误：找不到 .githooks 目录"
    exit 1
fi

# 检查 Git 仓库
if [ ! -d ".git" ]; then
    echo "❌ 错误：当前目录不是 Git 仓库"
    exit 1
fi

# 复制 hooks 文件
echo "📋 复制 hooks 文件..."
cp .githooks/commit-msg .git/hooks/
cp .githooks/pre-commit .git/hooks/

# 设置执行权限
chmod +x .git/hooks/commit-msg
chmod +x .git/hooks/pre-commit

# 配置 Git 使用 .githooks 目录（可选）
git config core.hooksPath .githooks

echo "✅ Git Hooks 安装完成！"
echo ""
echo "🚫 现在禁止直接使用 'git commit'"
echo "✅ 请使用 'git-cz' 进行提交"
echo ""
echo "如果需要绕过检查（不推荐）："
echo "git commit --no-verify -m 'message'"
echo ""
# word_game

help to remember words

## Git Hooks 配置

本项目配置了强制使用约定式提交的 Git hooks：

### 功能特性
- 强制使用 `git-cz` 进行约定式提交
- 拦截直接使用 `git commit` 的行为
- 提供清晰的错误提示和使用指导
- 允许紧急情况下的 `--no-verify` 绕过

### 安装 Hooks

```bash
# 运行安装脚本
./setup-hooks.sh
```

### 使用方法

1. 添加文件到暂存区：
   ```bash
   git add <files>
   ```

2. 使用 git-cz 进行提交：
   ```bash
   git-cz
   ```

3. 按照提示选择提交类型和描述

### 紧急情况

如果确实需要绕过 hooks 检查：
```bash
git commit --no-verify -m 'your message'
```

### 提交类型

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式化（不影响功能）
- `refactor`: 重构代码
- `test`: 添加或修改测试
- `chore`: 构建过程或辅助工具的变动

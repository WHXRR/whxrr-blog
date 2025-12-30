---
title: "Git 常用命令"
outline: deep
desc: "Git 常用命令"
tags: "Git"
updateTime: "2025-12-05 09:41"
pic: https://cdn.pixabay.com/photo/2014/07/15/23/36/github-394322_1280.png
picSize: 1280x640
---

## 🧭 变基（rebase）

##### 将当前分支变基到远程主分支

```bash
git fetch origin                     # 拉取远程最新引用
git rebase origin/main               # 将 main 的最新提交“移植”到当前分支之上
```

##### 交互式变基（整理提交）

```bash
git rebase -i HEAD~N                 # 将最近 N 次提交进行交互式编辑（squash、reword 等）
```

##### 处理冲突与中断

```bash
# 修复冲突后
git add <文件>
git rebase --continue                # 继续变基流程

git rebase --skip                    # 跳过当前有问题的提交
git rebase --abort                   # 放弃本次变基，回到变基前状态
```

##### 标准流程（保持线性历史）

```bash
# 1. 确认在待变基的功能分支
git status
git checkout <feature-branch>

# 2. 同步远程目标分支最新提交
git fetch origin

# 3. 执行变基到目标分支（如 main）
git rebase origin/main

# 4. 解决冲突并继续（如有）
git add <文件>
git rebase --continue

# 5. 验证历史（可选）
git log --oneline --graph --decorate -n 20

# 6. 推送变基后的分支（需改写历史）
git push --force-with-lease origin <feature-branch>
```

##### 拉取默认使用 rebase（避免多余 merge 提交）

```bash
git config --global pull.rebase true  # 全局设置
# 或仅对当前仓库
git config pull.rebase true
```

##### 自动整理 fixup 提交（配合交互式变基）

```bash
git commit --fixup <commit-hash>
git rebase -i --autosquash origin/main
```

## 🔄 刷新远程分支

##### 同步并清理远程分支

```bash
git fetch --all --prune              # 同步所有远程并清理已在远程删除的分支
git remote prune origin              # 仅清理 origin 的过期分支
```

##### 拉取指定分支最新更新

```bash
git fetch origin <分支名>            # 更新远程跟踪分支 origin/<分支名>
git pull --rebase origin <分支名>     # 拉取并以 rebase 方式整合到当前分支
```

## 🧹 删除远程分支

##### 删除远程分支

```bash
git push origin --delete <分支名>     # 推荐写法
# 或
git push origin :<分支名>             # 旧写法
```

##### 删除本地分支（可选）

```bash
git branch -d <分支名>               # 已合并到其它分支时删除
git branch -D <分支名>               # 未合并也强制删除
```

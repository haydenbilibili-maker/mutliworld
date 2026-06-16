#!/bin/bash
# 寰宇态势感知平台 (China) · 本地启动（macOS 双击运行）
# LIFEOS-005 阶段1：可切换"中国/全球 ｜ 中东·待迁"的区域切换器已就位。

cd "$(dirname "$0")" || exit 1

echo "============================================"
echo "  寰宇态势感知平台 · 本地启动"
echo "  地址（编译完成后访问）: http://localhost:3000"
echo "  左上角应出现：中国 / 全球 ｜ 中东 ·待迁"
echo "  停止：关闭本窗口，或按 Ctrl+C"
echo "============================================"

# 首次或缺依赖时安装
if [ ! -d node_modules ]; then
  echo "首次运行，安装依赖（npm install）..."
  npm install
fi

# 编译完成后自动开浏览器（Next dev 冷启动约 20-60s）
( for i in $(seq 1 60); do
    sleep 2
    if curl -s -o /dev/null --max-time 2 http://localhost:3000/ ; then
      open "http://localhost:3000"; break
    fi
  done ) >/dev/null 2>&1 &

npm run dev

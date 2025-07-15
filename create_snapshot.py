# create_snapshot.py

import os
import datetime

# --- 配置 ---
# 要扫描的根文件夹 ( '.' 代表当前文件夹)
ROOT_DIR = '.'
# 输出文件的名称
OUTPUT_FILE = 'project_snapshot.txt'
# 要完全忽略的文件夹名称列表
IGNORE_DIRS = {
    'node_modules',
    '.git',
    '.vscode',
    '.idea',
    'dist',
    'build',
    '__pycache__',
}
# 要忽略的特定文件名称列表
IGNORE_FILES = {
    '.DS_Store',
    'project_snapshot.txt', # 忽略脚本自己生成的输出文件
}
# 要忽略的文件扩展名列表 (主要是二进制文件或非文本文件)
IGNORE_EXTS = {
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.ico',
    '.woff',
    '.woff2',
    '.ttf',
    '.eot',
    '.otf',
    '.mp3',
    '.mp4',
    '.zip',
    '.gz',
    '.lock', # 比如 package-lock.json
    '.yaml'  # 比如 pnpm-lock.yaml
}

def create_project_snapshot():
    """
    遍历指定目录，将所有文本文件的路径和内容写入一个单一的输出文件。
    """
    # 使用 'w' 模式打开文件，意味着每次运行都会覆盖旧文件
    # 使用 utf-8 编码来处理各种字符
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        # 写入文件头信息
        f.write(f"Project Snapshot for: {os.path.abspath(ROOT_DIR)}\n")
        f.write(f"Generated on: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("="*80 + "\n\n")

        # os.walk 会递归地遍历所有子文件夹
        for dirpath, dirnames, filenames in os.walk(ROOT_DIR, topdown=True):
            
            # --- 忽略指定的文件夹 ---
            # 我们需要修改 dirnames 列表来阻止 os.walk 进入这些文件夹
            # 使用列表推导式来创建一个不包含被忽略目录的新列表
            dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]

            for filename in filenames:
                # --- 忽略指定的文件和扩展名 ---
                if filename in IGNORE_FILES:
                    continue
                
                # 分离文件名和扩展名
                _, file_ext = os.path.splitext(filename)
                if file_ext in IGNORE_EXTS:
                    continue

                # 构造完整的文件路径
                file_path = os.path.join(dirpath, filename)
                
                # 写入文件路径作为标题
                f.write(f"--- FILE: {file_path} ---\n\n")

                try:
                    # 读取文件内容并写入
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as content_file:
                        content = content_file.read()
                        f.write(content)
                except Exception as e:
                    # 如果读取文件时发生错误（例如，它是一个意料之外的二进制文件）
                    f.write(f"[Error reading file: {e}]")
                
                # 在每个文件内容后添加分隔符，使其更易读
                f.write("\n\n" + "="*80 + "\n\n")

    print(f"✅ Project snapshot saved to '{OUTPUT_FILE}'")

if __name__ == '__main__':
    create_project_snapshot()
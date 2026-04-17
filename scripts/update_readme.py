import os
import re

def generate_table():
    # 'week'로 시작하는 폴더 찾기
    folders = [f for f in os.listdir('.') if os.path.isdir(f) and f.lower().startswith('week')]
    # 주차 순서대로 정렬 (최신순)
    folders.sort(key=lambda x: int(re.search(r'\d+', x).group() if re.search(r'\d+', x) else 0), reverse=True)

    table = "| 주차 | 과제명 | 상세 설명 (Docs) | 소스 코드 (Code) | 실제 실행 (Web) |\n"
    table += "|:---:|:---|:---:|:---:|:---:|\n"

    for folder in folders:
        week_num = re.search(r'\d+', folder).group() if re.search(r'\d+', folder) else "?"
        title = folder.split('_', 1)[1].replace('-', ' ').title() if '_' in folder else f"Assignment {week_num}"
        
        # index.html 존재 여부 확인
        has_index = os.path.exists(os.path.join(folder, 'index.html'))
        demo_link = f"[🚀 Launch App](https://chng-git.github.io/{folder})" if has_index else "(No UI)"
        
        table += f"| **Week {week_num}** | {title} | [📄 README](./{folder}/README.md) | [📁 Folder](./{folder}) | {demo_link} |\n"
    
    return table

def update_readme(table):
    with open('README.md', 'r', encoding='utf-8') as f:
        content = f.read()

    # 태그 사이의 내용을 교체
    new_content = re.sub(
        r".*",
        f"\n{table}\n",
        content,
        flags=re.DOTALL
    )

    with open('README.md', 'w', encoding='utf-8') as f:
        f.write(new_content)

if __name__ == "__main__":
    table_text = generate_table()
    update_readme(table_text)
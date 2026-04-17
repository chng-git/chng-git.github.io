import os
import re

def generate_full_readme():
    # 1. 문서 윗부분 (고정 텍스트)
    header = """# 2026-1 블록체인 실습
- 20221530 박채원
- 이 레포지토리는 2026년 1학기 블록체인 실습 수업의 매주 차 실습 과제와 코드를 기록하는 공간입니다.
<br>

[🚀GitHub Pages](https://chng-git.github.io/)

<br>

---

<br>

## 📚 Assignment List

This table is automatically updated via GitHub Actions.
<br>

"""

    # 2. 과제 표 생성 (동적 스캔)
    folders = [f for f in os.listdir('.') if os.path.isdir(f) and f.lower().startswith('week')]
    folders.sort(key=lambda x: int(re.search(r'\d+', x).group() if re.search(r'\d+', x) else 0), reverse=True)

    table = "| 주차 | 과제명 | 소스 코드 (Repository) | 실제 실행 (Live Demo) |\n"
    table += "|:---:|:---|:---:|:---:|\n"

    for folder in folders:
        week_num = re.search(r'\d+', folder).group() if re.search(r'\d+', folder) else "?"
        title = folder.split('_', 1)[1].replace('-', ' ').title() if '_' in folder else f"Assignment {week_num}"
        
        has_index = os.path.exists(os.path.join(folder, 'index.html'))
        demo_link = f"[🚀 웹에서 실행하기](https://chng-git.github.io/{folder})" if has_index else "(UI 없음)"
        
        table += f"| **Week {week_num}** | {title} | [📁 소스 보기](./{folder}) | {demo_link} |\n"
    
    # 3. 문서 아랫부분 (고정 텍스트)
    footer = """
<br>

---

<br>

## 🛠️ Tech Stack & Environment
- **Languages:** HTML5, CSS3, JavaScript, Solidity
- **Tools:** Remix IDE, MetaMask, Git/GitHub
"""

    # 헤더 + 표 + 푸터를 하나로 합침
    return header + table + footer

if __name__ == "__main__":
    # 로봇이 새로운 전체 문서를 만듦
    new_readme_content = generate_full_readme()
    
    # 기존 README.md를 싹 밀어버리고 완전히 새로 씀 (표 2개 생성 원천 차단)
    with open('README.md', 'w', encoding='utf-8') as f:
        f.write(new_readme_content)
        
    print("README.md has been completely overwritten.")
import asyncio
import os
import sys
from datetime import datetime
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def main():
    # 현재 스크립트 파일의 디렉토리를 기준으로 서버 파일의 절대 경로를 계산합니다.
    script_dir = os.path.dirname(os.path.abspath(__file__))
    server_path = os.path.join(script_dir, "..", "servers", "upbit_server.py")

    server_params = StdioServerParameters(
        command=sys.executable,  # 현재 실행 중인 파이썬(.venv)을 정확히 사용
        args=[server_path],
        env=os.environ.copy()  # 현재 환경 변수(API_KEY 등)를 서버 프로세스에 상속
    )

    # 자동 저장 상자 세팅 (실행할 때마다 겹치지 않게 타임스탬프 부여)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    # 로그 파일을 현재 프로젝트 폴더 내의 'logs' 폴더에 저장
    project_dir = os.path.abspath(os.path.join(script_dir, ".."))
    logs_dir = os.path.join(project_dir, "logs")
    os.makedirs(logs_dir, exist_ok=True)  # 로그 디렉토리가 없으면 생성
    log_filename = os.path.join(logs_dir, f"mcp_result_log_{timestamp}.txt")

    # 터미널 출력과 파일 저장을 동시에 수행하는 특수 함수
    def log_print(msg):
        print(msg)
        with open(log_filename, "a", encoding="utf-8") as f:
            f.write(msg + "\n")

    log_print("🔄 [클라이언트] 업비트 MCP 서버에 접속을 시도합니다...")

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            log_print("✅ [클라이언트] 서버와 연결 성공!\n")

            log_print("🔍 [클라이언트] 서버의 도구 목록을 조회합니다...")
            tools = await session.list_tools()
            for tool in tools.tools:
                log_print(f" - 발견된 도구: {tool.name} ({tool.description})")
            log_print("-" * 50)

            # 도구 1: 비트코인 가격
            log_print("🚀 [클라이언트] 'get_upbit_price' 도구를 호출합니다!")
            price_result = await session.call_tool("get_upbit_price", arguments={"market": "KRW-BTC"})
            log_print(f"📥 [서버 응답]: {price_result.content[0].text}\n")

            # 도구 2: 도지코인 호가창
            log_print("🚀 [클라이언트] 'get_upbit_orderbook' 도구를 호출합니다!")
            orderbook_result = await session.call_tool("get_upbit_orderbook", arguments={"market": "KRW-DOGE"})
            log_print(f"📥 [서버 응답]:\n{orderbook_result.content[0].text}\n")

            # 도구 3 : 이더리움 24시간 변동률
            log_print("🚀 [클라이언트] 'get_upbit_24h_change' 도구를 호출합니다!")
            change_result = await session.call_tool("get_upbit_24h_change", arguments={"market": "KRW-ETH"})
            log_print(f"📥 [서버 응답]: {change_result.content[0].text}\n")

    log_print(f"💾 [시스템] 위 터미널 로그가 '{log_filename}' 파일로 폴더에 안전하게 저장되었습니다!")

if __name__ == "__main__":
    asyncio.run(main())
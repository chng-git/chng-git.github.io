import os
import sys
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
import uvicorn

app = FastAPI()

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)

html_file_path = os.path.join(CURRENT_DIR, "index.html")
server_script_path = os.path.join(PROJECT_ROOT, "servers", "upbit_server.py")

server_params = StdioServerParameters(
    command=sys.executable,
    args=[server_script_path]
)

@app.get("/")
def read_root():
    with open(html_file_path, "r", encoding="utf-8") as f:
        return HTMLResponse(content=f.read())

async def run_mcp_tool(tool_name: str, market: str):
    try:
        if not os.path.exists(server_script_path):
            return {"ok": False, "error": f"서버 파일을 찾을 수 없습니다: {server_script_path}"}
            
        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()
                result = await session.call_tool(tool_name, arguments={"market": market})
                return {
                    "ok": True,
                    "server": "Upbit MCP Server",
                    "tool": tool_name,
                    "arguments": {"market": market},
                    "result": result.content[0].text
                }
    except Exception as e:
        return {"ok": False, "error": f"통신 실패: {str(e)}"}

@app.get("/api/upbit/price")
async def api_price(market: str = "KRW-BTC"):
    return await run_mcp_tool("get_upbit_price", market)

@app.get("/api/upbit/orderbook")
async def api_orderbook(market: str = "KRW-BTC"):
    return await run_mcp_tool("get_upbit_orderbook", market)

@app.get("/api/upbit/change")
async def api_change(market: str = "KRW-BTC"):
    return await run_mcp_tool("get_upbit_24h_change", market)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8765)
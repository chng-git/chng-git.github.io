import httpx
import asyncio
from mcp.server.fastmcp import FastMCP

# 1. MCP 서버 인스턴스 생성 (이름: Upbit MCP Server)
mcp = FastMCP("Upbit MCP Server")

# 업비트 공식 API 주소
UPBIT_TICKER_URL = "https://api.upbit.com/v1/ticker"
UPBIT_ORDERBOOK_URL = "https://api.upbit.com/v1/orderbook"

# 2. 도구(Tool) 장착: 현재 가격 조회 기능
@mcp.tool()
async def get_upbit_price(market: str = "KRW-BTC") -> str:
    """업비트에서 특정 코인의 현재 가격 정보를 가져옵니다. (예: KRW-BTC, KRW-DOGE)"""
    async with httpx.AsyncClient() as client:
        response = await client.get(UPBIT_TICKER_URL, params={"markets": market})
        if response.status_code == 200:
            data = response.json()
            if data:
                price = data[0]['trade_price']
                return f"💰 {market}의 현재 가격은 {price:,.0f}원 입니다."
        return f"❌ 가격 정보를 불러오는데 실패했습니다. 마켓 코드({market})를 확인해주세요."

# 3. 도구(Tool) 장착: 호가창(주문장) 조회 기능
@mcp.tool()
async def get_upbit_orderbook(market: str = "KRW-BTC") -> str:
    """업비트에서 특정 코인의 실시간 호가창(주문장) 데이터를 가져옵니다."""
    async with httpx.AsyncClient() as client:
        response = await client.get(UPBIT_ORDERBOOK_URL, params={"markets": market})
        if response.status_code == 200:
            data = response.json()
            if data:
                # 너무 길면 터미널이 지저분해지므로 상위 3개의 호가만 잘라서 가져옵니다.
                orderbook = data[0]['orderbook_units'][:3] 
                result = f"📊 [{market} 실시간 호가창 Top 3]\n"
                for idx, unit in enumerate(orderbook):
                    result += f" {idx+1}. 🔴 매도 가격: {unit['ask_price']:,.0f}원 | 🔵 매수 가격: {unit['bid_price']:,.0f}원\n"
                return result
        return "❌ 호가창 정보를 불러오는데 실패했습니다."

# 4. 24시간 변동률 및 거래대금 조회 기능
@mcp.tool()
async def get_upbit_24h_change(market: str = "KRW-ETH") -> str:
    """업비트에서 특정 코인의 24시간 변동률 및 거래대금을 가져옵니다. (기본값: 이더리움)"""
    async with httpx.AsyncClient() as client:
        response = await client.get(UPBIT_TICKER_URL, params={"markets": market})
        if response.status_code == 200:
            data = response.json()
            if data:
                # 소수점을 퍼센트(%)로 변환
                change_rate = data[0]['signed_change_rate'] * 100 
                # 거래대금을 보기 쉽게 '억' 단위로 변환
                acc_volume = data[0]['acc_trade_price_24h'] / 100000000 
                
                # 상승/하락 직관적 이모지 부여
                sign = "📈 상승" if change_rate > 0 else ("📉 하락" if change_rate < 0 else "➖ 보합")
                
                return f"{sign} {market}의 24시간 변동률은 {change_rate:.2f}% 입니다. (24H 거래대금: 약 {acc_volume:,.0f}억 원)"
        return f"❌ 24시간 변동률 정보를 불러오는데 실패했습니다."

# 서버 실행 (클라이언트와 통신할 수 있도록 stdio 파이프 개방)
if __name__ == "__main__":
    mcp.run(transport='stdio')
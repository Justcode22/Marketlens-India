from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from ..models.market import ChartData, BreadthResponse, SectorResponse
from ..services.yfinance_service import get_historical_data, get_sector_performance, get_mock_breadth_data, INDICES, SECTORS

router = APIRouter(prefix="/api/market", tags=["market"])

@router.get("/trend", response_model=ChartData)
async def get_trend_data(
    symbol: str = Query(..., description="The symbol to fetch (e.g., ^NSEI, ^NSEBANK)"),
    period: str = Query("1y", description="Time period (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)"),
    interval: str = Query("1d", description="Data interval (1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo)")
):
    """
    Fetch historical candlestick data for an index or stock.
    """
    data = get_historical_data(symbol, period=period, interval=interval)
    if not data:
        raise HTTPException(status_code=404, detail=f"No data found for symbol {symbol}")
        
    name = "Unknown"
    for k, v in INDICES.items():
        if v == symbol:
            name = k
            break
            
    return {"symbol": symbol, "name": name, "interval": interval, "data": data}

@router.get("/breadth", response_model=BreadthResponse)
async def get_breadth_data(
    period: str = Query("1y", description="Time period (1mo, 3mo, 6mo, 1y)")
):
    """
    Get daily market breadth data for the Nifty 500.
    """
    data = get_mock_breadth_data(period=period)
    if not data:
        raise HTTPException(status_code=500, detail="Failed to calculate breadth data")
        
    return {"symbol": "^CRSLDX", "name": "NIFTY 500 Breadth", "data": data}

@router.get("/sectors", response_model=SectorResponse)
async def get_sectors_data():
    """
    Get performance metrics for the 16 NSE sectoral indices.
    """
    data = get_sector_performance()
    if not data:
        raise HTTPException(status_code=500, detail="Failed to fetch sector performance data")
        
    return {"data": data}

@router.get("/indices", response_model=dict)
async def list_indices():
    """
    Return a list of available indices and sectors.
    """
    return {
        "trend_indices": INDICES,
        "sectors": SECTORS
    }

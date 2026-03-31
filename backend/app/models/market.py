from pydantic import BaseModel
from typing import List, Dict, Optional, Union

class TimeSeriesPoint(BaseModel):
    time: str  # YYYY-MM-DD format usually required by lightweight charts
    value: float
    
class CandlestickPoint(BaseModel):
    time: str
    open: float
    high: float
    low: float
    close: float
    volume: Optional[float] = None
    sma20: Optional[float] = None
    sma50: Optional[float] = None
    sma200: Optional[float] = None

class ChartData(BaseModel):
    symbol: str
    name: str
    interval: str
    data: List[Union[TimeSeriesPoint, CandlestickPoint]]

class BreadthData(BaseModel):
    time: str
    advance: int
    decline: int
    new_high: int
    new_low: int
    above_50dma: float

class BreadthResponse(BaseModel):
    symbol: str
    name: str
    data: List[BreadthData]

class SectorPerformance(BaseModel):
    symbol: str
    name: str
    performance_1d: float
    performance_1w: float
    performance_1m: float
    performance_3m: float
    performance_6m: float
    performance_1y: float

class SectorResponse(BaseModel):
    data: List[SectorPerformance]

import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants mapping Nifty names to yfinance tickers
INDICES = {
    "NIFTY 50": "^NSEI",
    "NIFTY BANK": "^NSEBANK",
    "NIFTY 500": "^CRSLDX",
    "INDIA VIX": "^INDIAVIX"
}

SECTORS = {
    "NIFTY AUTO": "^CNXAUTO",
    "NIFTY IT": "^CNXIT",
    "NIFTY PHARMA": "^CNXPHARMA",
    "NIFTY METAL": "^CNXMETAL",
    "NIFTY FMCG": "^CNXFMCG",
    "NIFTY ENERGY": "^CNXENERGY",
    "NIFTY REALTY": "^CNXREALTY",
    "NIFTY MEDIA": "^CNXMEDIA",
    "NIFTY PSU BANK": "^CNXPSUBANK",
    "NIFTY PVT BANK": "NIFTY_PVT_BANK.NS",
    "NIFTY FIN SERVICE": "^CNXFIN",
    "NIFTY INFRA": "^CNXINFRA",
    "NIFTY MNCS": "^CNXMNC",
    "NIFTY PSE": "^CNXPSE",
    "NIFTY CONSUMPTION": "^CNXCONSUM",
    "NIFTY COMMODITIES": "^CNXCMDT"
}

def get_historical_data(symbol: str, period: str = "1y", interval: str = "1d"):
    """
    Fetch historical data from yfinance.
    """
    try:
        ticker = yf.Ticker(symbol)
        df = ticker.history(period=period, interval=interval)
        
        if df.empty:
            logger.warning(f"No data returned for {symbol}")
            return []

        # Ensure index is datetime and localized/naive
        df.index = pd.to_datetime(df.index)
        
        # Reset index to make 'Date' a column
        df = df.reset_index()
        
        # Determine the name of the date column (could be 'Date' or 'Datetime' depending on interval)
        date_col = 'Date' if 'Date' in df.columns else 'Datetime'
        
        # Calculate Simple Moving Averages
        df['SMA20'] = df['Close'].rolling(window=20).mean()
        df['SMA50'] = df['Close'].rolling(window=50).mean()
        df['SMA200'] = df['Close'].rolling(window=200).mean()

        result = []
        for _, row in df.iterrows():
            # Format to 'YYYY-MM-DD' for lightweight charts
            time_str = row[date_col].strftime('%Y-%m-%d')
            result.append({
                "time": time_str,
                "open": float(row['Open']),
                "high": float(row['High']),
                "low": float(row['Low']),
                "close": float(row['Close']),
                "volume": float(row['Volume']) if 'Volume' in df.columns else None,
                "sma20": float(row['SMA20']) if not pd.isna(row['SMA20']) else None,
                "sma50": float(row['SMA50']) if not pd.isna(row['SMA50']) else None,
                "sma200": float(row['SMA200']) if not pd.isna(row['SMA200']) else None,
            })
            
        return result
    except Exception as e:
        logger.error(f"Error fetching data for {symbol}: {str(e)}")
        return []

def get_sector_performance():
    """
    Calculate performance metrics for all sector indices.
    """
    performance_data = []
    end_date = datetime.now()
    start_date = end_date - timedelta(days=400) # Fetch enough data for 1Y
    
    for name, symbol in SECTORS.items():
        try:
            ticker = yf.Ticker(symbol)
            df = ticker.history(start=start_date.strftime('%Y-%m-%d'), end=end_date.strftime('%Y-%m-%d'))
            
            if df.empty or len(df) < 2:
                continue
                
            current_price = df['Close'].iloc[-1]
            
            # Helper function to safely calculate return
            def calc_return(days_back):
                if len(df) > days_back:
                    past_price = df['Close'].iloc[-days_back-1]
                    return ((current_price - past_price) / past_price) * 100
                return 0.0

            # Approximate trading days
            perf_1d = calc_return(1)
            perf_1w = calc_return(5)
            perf_1m = calc_return(21)
            perf_3m = calc_return(63)
            perf_6m = calc_return(126)
            perf_1y = calc_return(252)
            
            performance_data.append({
                "symbol": symbol,
                "name": name,
                "performance_1d": round(perf_1d, 2),
                "performance_1w": round(perf_1w, 2),
                "performance_1m": round(perf_1m, 2),
                "performance_3m": round(perf_3m, 2),
                "performance_6m": round(perf_6m, 2),
                "performance_1y": round(perf_1y, 2),
            })
        except Exception as e:
            logger.error(f"Error calculating performance for {symbol}: {str(e)}")
            
    # Sort by 1-month performance descending
    performance_data.sort(key=lambda x: x['performance_1m'], reverse=True)
    return performance_data

def get_mock_breadth_data(period: str = "1y"):
    """
    Since calculating breadth across 500 stocks dynamically via yfinance is 
    extremely slow and rate-limit prone, we simulate realistic breadth data 
    based on Nifty 500 movements. 
    In a production system with paid data (Fyers API), this would be calculated 
    from the actual 500 constituents.
    """
    nifty500_symbol = INDICES["NIFTY 500"]
    ticker = yf.Ticker(nifty500_symbol)
    df = ticker.history(period=period)
    
    if df.empty:
        return []
        
    df.index = pd.to_datetime(df.index)
    df = df.reset_index()
    date_col = 'Date' if 'Date' in df.columns else 'Datetime'
    
    breadth_data = []
    
    # Calculate daily returns to simulate breadth
    df['Return'] = df['Close'].pct_change()
    
    # Simple simulation logic
    import random
    random.seed(42) # For consistent mock data
    
    for _, row in df.iterrows():
        if pd.isna(row['Return']):
            continue
            
        time_str = row[date_col].strftime('%Y-%m-%d')
        daily_return = row['Return']
        
        # Advance/Decline logic sensitive to drastic index drops (like down -1.5% means massive declines)
        base_adv = 250 + (daily_return * 100 * 120)  # Make it much more sensitive
        
        # If the market falls heavily, cap advances very low (like the real market)
        if daily_return < -0.01:
            base_adv = random.randint(30, 80)
        elif daily_return > 0.01:
            base_adv = random.randint(400, 470)
            
        base_adv = max(15, min(485, base_adv + random.randint(-20, 20)))
        
        advance = int(base_adv)
        decline = 500 - advance
        
        # New Highs/Lows based loosely on recent trend
        new_high = max(0, int((daily_return > 0.005) * random.randint(10, 50)))
        new_low = max(0, int((daily_return < -0.005) * random.randint(10, 80)))
        
        # % above 50DMA (trending indicator)
        # Simplified: moving between 10% and 90% roughly tracking price, dropping fast on down days
        norm_price = (row['Close'] - df['Close'].min()) / (df['Close'].max() - df['Close'].min())
        
        # Give it a realistic bias (e.g., currently it's a weak market if price is dropping)
        # Make the moving average percentage fall sharply
        above_50dma = 10 + (norm_price * 75) + (daily_return * 100 * 5) + random.uniform(-3, 3)
        above_50dma = max(5.0, min(95.0, above_50dma))
        
        breadth_data.append({
            "time": time_str,
            "advance": advance,
            "decline": decline,
            "new_high": new_high,
            "new_low": new_low,
            "above_50dma": round(above_50dma, 2)
        })
        
    return breadth_data

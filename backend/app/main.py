from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import market

app = FastAPI(
    title="MarketLens India API",
    description="A clone of MarketLens adapted for the Indian stock market (NSE)",
    version="1.0.0",
)

# Allow CORS for Next.js frontend
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(market.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the MarketLens India API"}

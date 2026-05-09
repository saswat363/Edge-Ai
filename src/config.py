import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
# Use /app/data_storage if running on Render, otherwise use local BASE_DIR
DATA_PATH = os.environ.get("DATA_PATH", os.path.join(BASE_DIR, "data"))
VECTOR_PATH = os.environ.get("VECTOR_PATH", os.path.join(BASE_DIR, "vector_db"))

EMBEDDING_MODEL = "all-MiniLM-L6-v2"
LLM_MODEL = os.environ.get("LLM_MODEL", "mistral")
LLM_TEMPERATURE = 0.2

RERANKER_MODEL = "cross-encoder/ms-marco-MiniLM-L-6-v2"
BM25_PATH = os.path.join(VECTOR_PATH, "bm25_retriever.pkl")
DB_PATH = os.environ.get("DB_PATH", os.path.join(BASE_DIR, "bank_data.db"))
OLLAMA_BASE_URL = os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434")

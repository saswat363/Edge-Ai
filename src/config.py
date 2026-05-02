import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DATA_PATH = os.path.join(BASE_DIR, "data")
VECTOR_PATH = os.path.join(BASE_DIR, "vector_db")

EMBEDDING_MODEL = "all-MiniLM-L6-v2"
LLM_MODEL = "mistral"
LLM_TEMPERATURE = 0.2

RERANKER_MODEL = "cross-encoder/ms-marco-MiniLM-L-6-v2"
BM25_PATH = os.path.join(VECTOR_PATH, "bm25_retriever.pkl")

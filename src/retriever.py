import os
import pickle
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_classic.retrievers import EnsembleRetriever
from langchain_classic.retrievers import ContextualCompressionRetriever
from langchain_community.cross_encoders import HuggingFaceCrossEncoder
from langchain_classic.retrievers.document_compressors import CrossEncoderReranker
from src.config import VECTOR_PATH, EMBEDDING_MODEL, BM25_PATH, RERANKER_MODEL

def load_retriever():
    # 1. Semantic Retriever
    embedding = SentenceTransformerEmbeddings(
        model_name=EMBEDDING_MODEL
    )
    db = Chroma(
        persist_directory=VECTOR_PATH,
        embedding_function=embedding
    )
    chroma_retriever = db.as_retriever(search_kwargs={"k": 15})

    # 2. Keyword Retriever
    if os.path.exists(BM25_PATH):
        with open(BM25_PATH, "rb") as f:
            bm25_retriever = pickle.load(f)
        bm25_retriever.k = 15
        
        # 3. Combine them
        ensemble_retriever = EnsembleRetriever(
            retrievers=[bm25_retriever, chroma_retriever], 
            weights=[0.5, 0.5]
        )
    else:
        ensemble_retriever = chroma_retriever

    # 4. Cross-Encoder Re-ranker
    cross_encoder = HuggingFaceCrossEncoder(model_name=RERANKER_MODEL)
    compressor = CrossEncoderReranker(model=cross_encoder, top_n=5)
    
    compression_retriever = ContextualCompressionRetriever(
        base_compressor=compressor,
        base_retriever=ensemble_retriever
    )

    return compression_retriever
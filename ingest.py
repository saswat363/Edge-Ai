import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '.')))

import pickle
from langchain_community.retrievers import BM25Retriever
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_community.vectorstores import Chroma
from src.utils import load_documents
from src.config import DATA_PATH, VECTOR_PATH, EMBEDDING_MODEL, BM25_PATH

def process_documents():
    print("Loading documents...")
    documents = load_documents(DATA_PATH)

    print("Splitting documents...")
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )

    chunks = splitter.split_documents(documents)

    print("Creating embeddings...")
    embedding = SentenceTransformerEmbeddings(
        model_name=EMBEDDING_MODEL
    )

    print("Storing vectors...")
    db = Chroma.from_documents(
        chunks,
        embedding,
        persist_directory=VECTOR_PATH
    )

    db.persist()

    print("Creating BM25 index...")
    bm25_retriever = BM25Retriever.from_documents(chunks)
    
    os.makedirs(VECTOR_PATH, exist_ok=True)
    with open(BM25_PATH, "wb") as f:
        pickle.dump(bm25_retriever, f)

    print("Vector DB and BM25 index created successfully!")

if __name__ == "__main__":
    process_documents()
from langchain_community.llms import Ollama
from src.config import LLM_MODEL, LLM_TEMPERATURE

def load_llm():
    llm = Ollama(
        model=LLM_MODEL,
        temperature=LLM_TEMPERATURE
    )
    return llm
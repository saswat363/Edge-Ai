from langchain_community.llms import Ollama
from src.config import LLM_MODEL, LLM_TEMPERATURE, OLLAMA_BASE_URL

def load_llm():
    llm = Ollama(
        model=LLM_MODEL,
        temperature=LLM_TEMPERATURE,
        base_url=OLLAMA_BASE_URL
    )
    return llm
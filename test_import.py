import importlib

def find_classes():
    # Attempt imports from known locations
    locations = [
        "langchain.retrievers.ensemble",
        "langchain.retrievers",
        "langchain_community.retrievers",
        "langchain_core.retrievers",
        "langchain.retrievers.contextual_compression",
        "langchain.retrievers.document_compressors",
    ]
    
    for loc in locations:
        try:
            module = importlib.import_module(loc)
            if hasattr(module, "EnsembleRetriever"):
                print(f"EnsembleRetriever found in {loc}")
            if hasattr(module, "ContextualCompressionRetriever"):
                print(f"ContextualCompressionRetriever found in {loc}")
            if hasattr(module, "CrossEncoderReranker"):
                print(f"CrossEncoderReranker found in {loc}")
        except Exception as e:
            pass
            
    print("Search complete.")

find_classes()

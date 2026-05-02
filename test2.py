try:
    from langchain.retrievers.document_compressors import CrossEncoderReranker
    print("Found CrossEncoderReranker in langchain")
except ImportError:
    pass

try:
    from langchain_classic.retrievers.document_compressors import CrossEncoderReranker
    print("Found CrossEncoderReranker in langchain_classic")
except ImportError:
    pass

try:
    from langchain_community.retrievers.document_compressors import CrossEncoderReranker
    print("Found CrossEncoderReranker in langchain_community")
except ImportError:
    pass

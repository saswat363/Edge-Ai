import os
from langchain_community.document_loaders import CSVLoader, TextLoader, UnstructuredMarkdownLoader
from langchain_community.document_loaders import UnstructuredPDFLoader, UnstructuredWordDocumentLoader, UnstructuredImageLoader

def load_documents(data_path):
    documents = []
    
    if not os.path.exists(data_path):
        return []

    for file in os.listdir(data_path):
        path = os.path.join(data_path, file)
        
        try:
            if file.endswith(".pdf"):
                # Use UnstructuredPDFLoader to preserve table structures and elements
                loader = UnstructuredPDFLoader(path, mode="elements", strategy="fast")
                documents.extend(loader.load())
            elif file.endswith(".csv"):
                loader = CSVLoader(path)
                documents.extend(loader.load())
            elif file.endswith(".txt"):
                loader = TextLoader(path, encoding='utf-8')
                documents.extend(loader.load())
            elif file.endswith(".md"):
                loader = UnstructuredMarkdownLoader(path)
                documents.extend(loader.load())
            elif file.endswith(".docx"):
                # Use UnstructuredWordDocumentLoader to preserve tables in Word docs
                loader = UnstructuredWordDocumentLoader(path, mode="elements")
                documents.extend(loader.load())
            elif file.lower().endswith((".png", ".jpg", ".jpeg")):
                # Extract text from uploaded photos using OCR
                loader = UnstructuredImageLoader(path)
                documents.extend(loader.load())
            else:
                print(f"Skipping unsupported file format: {file}")
        except Exception as e:
            print(f"Error loading {file}: {str(e)}")

    return documents
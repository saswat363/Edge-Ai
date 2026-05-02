# Privacy-First Edge AI Banking Assistant using Retrieval-Augmented Generation (RAG)

## Abstract
This project develops a secure AI-powered banking assistant using Edge AI. It uses Retrieval-Augmented Generation (RAG) to provide accurate responses from banking documents. The system runs locally using Ollama, ensuring data privacy and security. A vector database (ChromaDB) is used for semantic retrieval. It supports continuous learning through document updates and feedback.

## Introduction
Banking systems handle sensitive and critical data. Cloud-based AI solutions raise privacy and compliance concerns, and employees struggle to search large documents efficiently.

**Solution:** A local AI assistant using Edge AI + RAG that ensures secure, fast, and accurate responses.

## Problem Statement
Banking organizations deal with large volumes of sensitive documents. Existing cloud-based AI systems pose risks related to data privacy and security. There is a need for a system that can retrieve and generate accurate answers locally without exposing data.

## Objectives
- Build a secure banking AI assistant.
- Implement a RAG-based system.
- Ensure data privacy using Edge AI.
- Provide accurate document-based responses.
- Enable continuous learning via updates.

## Technology Stack (2026 Updated)
- **Programming:** Python 3.11+
- **Frontend:** Streamlit (Interactive UI) / React
- **Backend Framework:** LangChain (Modular Architecture) / FastAPI
- **LLM Runtime:** Ollama (Local AI Execution)
- **Models:** Gemma (fast, lightweight), Mistral (high accuracy)
- **Vector Database:** ChromaDB
- **Embeddings:** Sentence Transformers (MiniLM)
- **Document Processing:** PyPDF Loader, CSV Loader, Text Splitters

## Dataset
**Types of Data Used:**
- **Structured Data (CSV):** Banking FAQs, Default banking knowledge.
- **Unstructured Data (PDF):** RBI Guidelines, Loan policies, Banking rules.
*Combines both for better accuracy.*

## Methodology
1. Collect banking documents.
2. Split into chunks.
3. Convert into embeddings.
4. Store in ChromaDB.
5. Retrieve relevant data.
6. Send to LLM.
7. Generate response.

## System Architecture
```text
Banking Documents
        ↓
Document Processing
        ↓
Text Chunking
        ↓
Embeddings (MiniLM)
        ↓
ChromaDB Vector DB
        ↓
Retriever (Top-K Search)
        ↓
Local LLM (Ollama)
        ↓
Final Answer (UI)
```

## Modules Explanation
1. **Data Ingestion Module:** Loads documents and splits them into chunks.
2. **Embedding Module:** Converts text to vectors.
3. **Vector DB Module:** Stores embeddings and enables semantic search.
4. **Retrieval Module:** Finds relevant documents.
5. **LLM Module:** Generates answers.
6. **UI Module:** Chat interface.
7. **Feedback Module:** Stores user feedback.

## Sample Code
```python
docs = retriever.invoke(query)
response = llm.invoke(prompt)
```

## Output
1. User enters query.
2. System retrieves documents.
3. Generates answer.
4. Displays sources.

## Current Progress (25%)
- [x] Data ingestion completed.
- [x] Vector database created.
- [x] RAG pipeline implemented.
- [x] Chatbot UI developed.
- [x] Local LLM integrated.

## Future Scope
- Improve answer accuracy.
- Add financial calculations.
- Enhance UI/UX.
- Role-based access.
- Enterprise deployment.

## Application Development
- Working prototype built.
- Uses local LLM (Ollama).
- Streamlit/React interface.
- Real-time query handling.

## Use Cases
- Internal banking assistant.
- Policy lookup system.
- Compliance support.
- Employee knowledge base.

## Conclusion
Developed a secure AI assistant, ensured privacy with Edge AI, and implemented RAG architecture. The system is scalable and efficient.

## References
- LangChain Documentation
- ChromaDB Docs
- Ollama Official Site
- RBI Website

## Documentation
- Project report prepared (Includes architecture, code, results).
- GitHub repository maintained.
- Tested with banking queries.

---

### Viva Explanation (Key Summary)
> "We built a Privacy-First Edge AI system using RAG. Banking documents are converted into embeddings and stored in a vector database. When a user asks a question, relevant data is retrieved and passed to a local LLM using Ollama to generate accurate responses while ensuring data privacy."

### Demo Flow
1. Open app.
2. Enter query.
3. Show answer.
4. Show sources.
5. Explain pipeline.

### Final Impression Line
> "This project demonstrates how secure, scalable, and intelligent AI systems can be built for enterprise environments using Edge AI."

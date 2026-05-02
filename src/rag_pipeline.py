from src.llm_model import load_llm
from src.retriever import load_retriever

def create_rag_chain():

    retriever = load_retriever()
    llm = load_llm()

    def qa_chain(query, history=None):

        docs = retriever.invoke(query)

        history_text = ""
        if history:
            history_text = "Chat History:\n"
            for msg in history[-3:]: # Limit to last 3 turns
                if isinstance(msg, tuple) or isinstance(msg, list):
                    history_text += f"User: {msg[0]}\nAdvisor: {msg[1]}\n"
                elif isinstance(msg, dict):
                    role = msg.get("role", "User").capitalize()
                    history_text += f"{role}: {msg.get('content', '')}\n"

        # Check if relevant context exists
        relevant_docs = []
        if len(docs) > 0:
            # Step 1: Grade docs (Top 5 to keep local LLM prompt short)
            context_block = ""
            top_docs = docs[:5]
            for i, doc in enumerate(top_docs):
                context_block += f"--- Document {i} ---\n{doc.page_content}\n"
                
            grade_prompt = f"""You are a strict grading assistant.
User question: {query}

Retrieved Documents:
{context_block}

Determine which documents contain information actually relevant to answering the question.
List the document numbers (e.g., 0, 1, 3) that are relevant. If none are relevant, reply with 'NONE'.
Reply ONLY with the numbers separated by commas, or 'NONE'.
"""
            score = llm.invoke(grade_prompt).strip().upper()
            
            if "NONE" not in score:
                for i, doc in enumerate(top_docs):
                    if str(i) in score:
                        relevant_docs.append(doc)
                        
        # Step 2: Query Rewriting if retrieved docs were not relevant
        if len(docs) > 0 and len(relevant_docs) == 0:
            rewrite_prompt = f"""You are an expert search assistant.
The user asked: {query}
The original search yielded no relevant results. 
Rewrite the query to be simpler, using broader banking keywords optimized for semantic search.
Reply ONLY with the rewritten query, nothing else.
"""
            improved_query = llm.invoke(rewrite_prompt).strip()
            print(f"CRAG (Self-Correction): Rewrote query to -> {improved_query}")
            
            # Fetch again using the improved query (take top 3, skip grading to save time)
            relevant_docs = retriever.invoke(improved_query)[:3]
            
        docs = relevant_docs
        if len(docs) > 0:

            context = "\n".join([doc.page_content for doc in docs])

            prompt = f"""You are a highly analytical Internal Banking Assistant. Your job is to help bank employees quickly find policies, extract data, and synthesize information. Be direct, technical, and concise. Omit pleasantries unless explicitly greeted.
Your task is to answer the employee's question clearly and accurately using ONLY the provided context.

Formatting Rules:
1. Always use proper Markdown (e.g., **bold** for key terms).
2. Use bullet points for lists or multiple steps.
3. If the context does not contain the answer, state: "I do not have that specific information in my current banking records." Do not hallucinate.
4. When asked to summarize or compare, structure your answer logically, highlighting key differences or main points.

{history_text}
[Context Documents]
{context}

[Employee Question]
{query}

[Internal Assistant Response]
"""
            response = llm.invoke(prompt)
            return response, docs

        else:
            # 🔥 Fallback to LLM knowledge
            prompt = f"""You are a highly analytical Internal Banking Assistant. Your job is to help bank employees quickly find policies, extract data, and synthesize information. Be direct, technical, and concise. Omit pleasantries unless explicitly greeted.

Formatting Rules:
1. Always use proper Markdown (e.g., **bold** for key terms).
2. Use bullet points for lists or multiple steps.
3. Provide a helpful, general banking answer, but clarify that you are speaking generally and not from a specific policy document.
4. If the employee is just greeting you (e.g., "hi", "hello"), simply greet them back.

{history_text}
[Employee Question]
{query}

[Internal Assistant Response]
"""
            response = llm.invoke(prompt)
            return response, []

    return qa_chain
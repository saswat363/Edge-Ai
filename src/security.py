from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine

# Initialize engines globally to prevent reloading
analyzer = AnalyzerEngine()
anonymizer = AnonymizerEngine()

def redact_pii(text: str) -> str:
    """
    Analyzes and redacts PII from the given text.
    """
    # Analyze text for PII
    results = analyzer.analyze(text=text, entities=["PHONE_NUMBER", "CREDIT_CARD", "EMAIL_ADDRESS", "US_BANK_NUMBER", "US_SSN"], language="en")
    
    # Anonymize findings
    anonymized_result = anonymizer.anonymize(text=text, analyzer_results=results)
    return anonymized_result.text

def is_banking_topic(query: str, llm) -> bool:
    """
    Uses a hybrid approach (regex + LLM) to classify if a query is related 
    to banking/finance or is a conversational greeting.
    """
    # Fast-track common greetings to save LLM cycles and prevent false negatives
    greetings = {"hi", "hello", "hey", "good morning", "good afternoon", "good evening", "how are you", "who are you", "what are you"}
    clean_query = query.lower().strip().strip('?!.')
    if clean_query in greetings or any(greet in clean_query for greet in ["hi ", "hello "]):
        return True

    prompt = f"""
    You are an AI Security Guardrail for a professional Banking Assistant.
    Your task is to determine if the user query is appropriate for a banking context.

    APPROPRIATE topics include:
    - Banking services (loans, accounts, cards)
    - Financial regulations (RBI, KYC, AML)
    - Economics and finance
    - Polite greetings and pleasantries
    - Inquiries about your identity as a Banking Assistant

    INAPPROPRIATE topics include:
    - Politics, sports, entertainment
    - General coding or math (unless banking related)
    - Offensive or dangerous content

    User Query: "{query}"

    Does this query fall into the APPROPRIATE category? 
    Answer ONLY with 'YES' or 'NO'.

    Answer:"""
    
    response = llm.invoke(prompt).strip().upper()
    
    # Check for YES anywhere in the first few characters to be safe
    return "YES" in response[:5]

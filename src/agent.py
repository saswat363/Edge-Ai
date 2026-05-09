from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits import create_sql_agent
from langchain_classic.agents import AgentExecutor, create_react_agent
from langchain_core.tools import Tool
from langchain_core.prompts import PromptTemplate
from src.llm_model import load_llm
from src.rag_pipeline import create_rag_chain
from src.config import DB_PATH

def create_banking_agent():
    llm = load_llm()
    
    # Tool 1: SQL Agent
    db = SQLDatabase.from_uri(f"sqlite:///{DB_PATH}")
    sql_agent_executor = create_sql_agent(llm, db=db, agent_type="zero-shot-react-description", verbose=True)
    
    sql_tool = Tool(
        name="Banking_Database",
        func=sql_agent_executor.invoke,
        description="Useful for when you need to answer questions about user accounts, balances, or transactions. Input should be a question."
    )
    
    # Tool 2: RAG Chain
    rag_chain = create_rag_chain()
    
    def rag_func(query: str):
        response, docs = rag_chain(query)
        # We also want to return sources but AgentExecutor standardizes string returns
        return response
        
    rag_tool = Tool(
        name="Knowledge_Base",
        func=rag_func,
        description="Useful for when you need to answer questions about banking policies, rules, and guidelines."
    )
    
    # Tool 3: Draft Email
    def draft_email_func(input_str: str):
        # Simulated email drafting that saves to a local file
        import os
        draft_path = "draft_emails.txt"
        with open(draft_path, "a") as f:
            f.write(f"--- DRAFT ---\n{input_str}\n\n")
        return f"SUCCESS: Email draft saved locally to {draft_path}."
        
    email_tool = Tool(
        name="Draft_Email",
        func=draft_email_func,
        description="Useful for when you need to draft an email to a customer or manager regarding policy or account updates. Input should be the complete email content."
    )
    
    # Tool 4: Flag Transaction
    def flag_transaction_func(input_str: str):
        # Simulated action to flag a transaction in the database
        # In a real scenario, this would use db.run("UPDATE ...")
        return f"SUCCESS: Transaction {input_str} has been securely flagged for compliance review."
            
    flag_tool = Tool(
        name="Flag_Transaction",
        func=flag_transaction_func,
        description="Useful for when you need to flag a suspicious transaction for compliance review. Input should be the exact transaction ID."
    )
    
    tools = [sql_tool, rag_tool, email_tool, flag_tool]
    
    prompt_template = """Answer the following questions as best you can. You are a highly analytical Internal Banking Assistant helping bank employees. You have access to the following tools:

{tools}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin!

Question: {input}
Thought:{agent_scratchpad}"""

    prompt = PromptTemplate.from_template(prompt_template)
    
    agent = create_react_agent(llm, tools, prompt)
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True, handle_parsing_errors=True)
    
    return agent_executor

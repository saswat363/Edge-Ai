import streamlit as st
import pandas as pd
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.llm_model import load_llm

st.set_page_config(page_title="Edge AI Admin Dashboard", layout="wide")

st.title("📊 Admin Dashboard")
st.write("View feedback and evaluate AI responses.")

FEEDBACK_FILE = "feedback.csv"

if os.path.exists(FEEDBACK_FILE):
    # Depending on how the CSV is saved, it might have headers or not.
    # Our code writes rows directly. Let's assume no headers in the CSV.
    try:
        df = pd.read_csv(FEEDBACK_FILE, names=["Query", "Feedback"])
        
        st.subheader("Feedback Metrics")
        col1, col2, col3 = st.columns(3)
        
        total = len(df)
        thumbs_up = len(df[df["Feedback"].str.contains("Yes", na=False)])
        thumbs_down = len(df[df["Feedback"].str.contains("No", na=False)])
        
        col1.metric("Total Queries Evaluated", total)
        col2.metric("Thumbs Up", thumbs_up)
        col3.metric("Thumbs Down", thumbs_down)
        
        st.subheader("Recent Feedback")
        st.dataframe(df.tail(10))
        
        st.subheader("Automated Evaluation (LLM-as-a-Judge)")
        if st.button("Evaluate Recent 'Thumbs Down' Queries"):
            llm = load_llm()
            bad_queries = df[df["Feedback"].str.contains("No", na=False)].tail(3)
            if len(bad_queries) == 0:
                st.success("No recent bad queries found!")
            else:
                for idx, row in bad_queries.iterrows():
                    query = row["Query"]
                    st.write(f"**Evaluating Query:** {query}")
                    prompt = f"Analyze the following user query and explain why an AI assistant might fail to answer it correctly. Query: {query}"
                    with st.spinner("Analyzing..."):
                        response = llm.invoke(prompt)
                    st.info(response)
    except Exception as e:
        st.error(f"Error loading feedback: {e}")
else:
    st.warning("No feedback data available yet.")

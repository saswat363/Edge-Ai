import streamlit as st
import requests
import os

API_URL = "http://localhost:8000"

st.set_page_config(page_title="Banking AI Assistant (Frontend)")

st.title("🏦 Banking AI Assistant (Edge AI)")
st.write("Ask questions about banking policies, RBI rules, loans, etc.")

# ✅ Chat Memory
if "history" not in st.session_state:
    st.session_state.history = []

# ✅ File Upload (Learning)
uploaded_file = st.file_uploader("Upload new banking document (PDF/CSV)")

if uploaded_file:
    with st.spinner("Uploading and ingesting in background..."):
        # Send file to FastAPI
        files = {"file": (uploaded_file.name, uploaded_file.getvalue(), uploaded_file.type)}
        try:
            response = requests.post(f"{API_URL}/upload", files=files)
            if response.status_code == 200:
                st.success(response.json()["message"])
            else:
                st.error("Failed to upload document.")
        except Exception as e:
            st.error(f"Could not connect to API: {e}")

# ✅ User Input
query = st.text_input("Enter your question")

if query:
    with st.spinner("Searching knowledge base..."):
        try:
            # We use data for Form upload, not json
            response = requests.post(f"{API_URL}/chat", data={"query": query})
            
            if response.status_code == 200:
                data = response.json()
                answer = data["answer"]
                sources = data["sources"]
                
                st.write("### Answer:")
                st.write(answer)
                
                if sources:
                    st.write("### Sources:")
                    for src in sources:
                        st.write(src)
                else:
                    st.info("Answer generated from model knowledge")

                st.session_state.history.append((query, answer))
            else:
                st.error("Failed to get response from API.")
        except Exception as e:
            st.error(f"Could not connect to API: {e}")

    # ✅ Feedback system
    import csv
    feedback = st.radio("Was this helpful?", ["👍 Yes", "👎 No"])
    if feedback:
        try:
            with open("feedback.csv", "a", newline="", encoding="utf-8") as f:
                writer = csv.writer(f)
                writer.writerow([query, feedback])
        except Exception as e:
            st.warning(f"Feedback saving failed: {e}")

# ✅ Display Chat History
st.write("### Chat History")
for q, r in st.session_state.history:
    st.write(f"**Q:** {q}")
    st.write(f"**A:** {r}")
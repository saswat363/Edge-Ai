from fastapi import FastAPI, UploadFile, File, BackgroundTasks, Form, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import sys
import json

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.config import DATA_PATH
from ingest import process_documents
from src.agent import create_banking_agent
from src.llm_model import load_llm
from src.auth import verify_user, create_access_token

app = FastAPI(title="Edge AI Banking Assistant API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all. Restrict in prod to ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the Agent globally
banking_agent = create_banking_agent()

@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if not verify_user(form_data.username, form_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/chat")
async def chat(query: str = Form(...), history: str = Form(default="[]")):
    # Parse history
    try:
        parsed_history = json.loads(history)
    except json.JSONDecodeError:
        parsed_history = []
        
    async def event_generator():
        try:
            # Incorporate history into the agent input
            history_context = ""
            if parsed_history:
                history_context = "Chat History:\n"
                for msg in parsed_history[-3:]:
                    role = msg.get("role", "User").capitalize()
                    history_context += f"{role}: {msg.get('content', '')}\n"
                    
            full_input = f"{history_context}\nQuestion: {query}" if history_context else query
            
            # Stream events using LangChain's astream_events
            async for event in banking_agent.astream_events({"input": full_input}, version="v1"):
                kind = event["event"]
                
                # Catch LLM token generation
                if kind == "on_llm_stream":
                    chunk = event["data"]["chunk"]
                    if chunk:
                        # Yield in Server-Sent Events (SSE) format
                        yield f"data: {json.dumps({'token': chunk})}\n\n"
                        
                # Notify the UI when a tool is being used
                elif kind == "on_tool_start":
                    tool_name = event["name"]
                    system_msg = f"\n*[Agent is using: {tool_name}...]*\n"
                    yield f"data: {json.dumps({'token': system_msg})}\n\n"
            
            # Signal completion
            yield "data: [DONE]\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@app.post("/upload")
async def upload_document(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    os.makedirs(DATA_PATH, exist_ok=True)
    file_path = os.path.join(DATA_PATH, file.filename)
    
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
        
    # Trigger ingestion in the background
    background_tasks.add_task(process_documents)
    
    return {"message": f"Successfully uploaded {file.filename}. Ingestion started in background."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

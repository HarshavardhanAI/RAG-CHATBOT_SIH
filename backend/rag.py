from flask import Flask, request, jsonify, render_template
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
import os

# Optional: Load environment variables from .env if using python-dotenv
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY environment variable not set.")

# Load PDF and prepare retriever and chain at startup
loader = PyPDFLoader("sample.pdf")
try:
    docs = loader.load()
    if not docs:
        raise ValueError("No documents were loaded from the PDF. Please check the file path and content.")
except Exception as e:
    raise RuntimeError(f"Error loading PDF: {e}")

text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = text_splitter.split_documents(docs)
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vectorstore = FAISS.from_documents(chunks, embeddings)
retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 3})

os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    chain_type="stuff"
)

app = Flask(__name__)

@app.route("/")
def index():
    return "hello"

@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    query = data.get("query")
    if not query:
        return jsonify({"error": "No query provided"}), 400
    try:
        response = qa_chain.run(query)
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
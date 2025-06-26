from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# Load free local embedding model
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Create FAISS vector store (use your real data here)
vector_store = FAISS.from_texts(
    ["Welcome! How can I help you today?", "Ask me anything about your orders, account, or services."],
    embeddings
)
retriever = vector_store.as_retriever()

def retrieve_docs(query):
    docs = retriever.get_relevant_documents(query)
    return [doc.page_content for doc in docs]

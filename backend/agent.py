from langchain_community.llms import HuggingFacePipeline
from langchain.agents import initialize_agent, Tool, AgentType
from retrieval import retrieve_docs
from transformers import pipeline

model_id = "facebook/blenderbot-400M-distill"
llm_pipeline = pipeline("text2text-generation", model=model_id, max_new_tokens=256)
llm = HuggingFacePipeline(pipeline=llm_pipeline)

def fetch_product_api(query: str) -> str:
    return f"Here are some recommended products based on '{query}'. (Demo response)"

tools = [
    Tool(
        name="ProductAPI",
        func=fetch_product_api,
        description="Use this tool to fetch real-time product info based on user queries."
    ),
    Tool(
        name="DocRetrieval",
        func=retrieve_docs,
        description="Use this tool to retrieve relevant documents from a vector database."
    ),
]

agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True,
    handle_parsing_errors=True,
    max_iterations=10,
    max_execution_time=60
)

def run_agent(query: str) -> str:
    # Bypass agent/tools, direct LLM call for speed testing
    return llm(query)

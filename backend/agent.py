from langchain_community.llms import HuggingFacePipeline
from langchain.agents import initialize_agent, Tool, AgentType
from retrieval import retrieve_docs
from transformers import pipeline

# Local lightweight LLM (swap for larger if you have >8GB RAM)
model_id = "google/flan-t5-base"
llm_pipeline = pipeline("text2text-generation", model=model_id, max_new_tokens=256)
llm = HuggingFacePipeline(pipeline=llm_pipeline)

def fetch_product_api(query: str) -> str:
    # Dummy implementation for demo
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
    verbose=True
)

def run_agent(query: str) -> str:
    return agent.run(query)

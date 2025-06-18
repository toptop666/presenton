
import os

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from langchain_cohere import ChatCohere

LLM_TYPES = {
    "openai": ChatOpenAI,
    "google": ChatGoogleGenerativeAI,
    "cohere": ChatCohere
}

def get_model(reasoning=False, reasoning_effort="high", max_tokens=None):
    llm = os.getenv("LLM")

    if reasoning:
        if llm == "openai":
            return ChatOpenAI(model="o3-mini", reasoning_effort=reasoning_effort)
        else:
            return ChatGoogleGenerativeAI(model="gemini-2.5-flash-preview-04-17")
    
    # Select model name
    if llm == "cohere":
        return ChatCohere(model="command-a-03-2025", max_completion_tokens=max_tokens)
    elif llm == "openai":
        return ChatOpenAI(model="gpt-4.1-mini", max_completion_tokens=max_tokens)
    else:
        return ChatGoogleGenerativeAI(model="gemini-2.0-flash", max_completion_tokens=max_tokens)
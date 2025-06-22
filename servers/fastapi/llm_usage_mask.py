
import os

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from langchain_cohere import ChatCohere
from langchain_community.chat_models import ChatLiteLLM

LLM_TYPES = {
    "openai": ChatOpenAI,
    "google": ChatGoogleGenerativeAI,
    "cohere": ChatCohere,
    "lite": ChatLiteLLM
}

def get_model(reasoning=False, reasoning_effort="high", max_tokens=None):
    llm = os.getenv("LLM")
    
    # Define the LiteLLM proxy base URL
    LITELLM_PROXY_BASE_URL = os.getenv("LITELLM_BASE_URL", "http://localhost:4000")
    LITELLM_API_KEY = os.getenv("LITELLM_API_KEY")

    if reasoning:
        if llm == "openai":
            return ChatOpenAI(model="o3-mini", reasoning_effort=reasoning_effort)
        elif llm == "litellm" and os.getenv("LITELLM_REASONING_MODEL"):
            # Use a specific model alias for reasoning if defined in env
            return ChatLiteLLM(
                model=os.getenv("LITELLM_REASONING_MODEL", "command-r"), # e.g., "command-r" or another alias
                api_base=LITELLM_PROXY_BASE_URL,
                api_key=LITELLM_API_KEY,
                max_tokens=max_tokens # Pass max_tokens for LiteLLM as well
            )
        else:
            return ChatGoogleGenerativeAI(model="gemini-2.5-flash-preview-04-17")
    
    # Select model name
    if llm == "cohere":
        return ChatCohere(model="command-a-03-2025", max_completion_tokens=max_tokens)
    elif llm == "openai":
        return ChatOpenAI(model="gpt-4.1-mini", max_completion_tokens=max_tokens)
    elif llm == "litellm":
        # This will use the model alias defined in your litellm_config.yaml (e.g., "command-r")
        # Ensure that the LLM environment variable matches the 'alias' in your config.yaml
        return ChatLiteLLM(
            model=os.getenv("LITELLM_MODEL_ALIAS", "command-r"), # Default to "command-r" if not set
            api_base=LITELLM_PROXY_BASE_URL,
            api_key=LITELLM_API_KEY,
            max_tokens=max_tokens
        )
    else:
        return ChatGoogleGenerativeAI(model="gemini-2.0-flash", max_completion_tokens=max_tokens)

import asyncio
import json
import os
import sys
import traceback
import re
from typing import List, Optional

import aiohttp
from fastapi import HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_ollama import ChatOllama
from langchain_openai import ChatOpenAI
from langchain_cohere import ChatCohere
from langchain_community.chat_models import ChatLiteLLM

from api.models import LogMetadata, UserConfig
from api.services.logging import LoggingService


def is_ollama_selected() -> bool:
    return os.getenv("LLM") == "ollama"


def get_large_model():
    selected_llm = os.getenv("LLM")
    if selected_llm == "openai":
        return ChatOpenAI(model="gpt-4.1")
    elif selected_llm == "google":
        return ChatGoogleGenerativeAI(model="gemini-2.0-flash")
    elif selected_llm == "cohere":
        return ChatCohere(model="command-a-03-2025")
    elif selected_llm == "lite":
        return ChatLiteLLM(
            model=os.getenv("LITELLM_MODEL_ALIAS", "command-r"), # e.g., "command-r" or another alias
            api_base=os.getenv("LITELLM_PROXY_BASE_URL"),
            api_key=os.getenv("LITELLM_API_KEY"),
        )
    else:
        return ChatOllama(model=os.getenv("OLLAMA_MODEL"), temperature=0.8)


def get_small_model():
    selected_llm = os.getenv("LLM")
    if selected_llm == "openai":
        return ChatOpenAI(model="gpt-4.1-mini")
    elif selected_llm == "google":
        return ChatGoogleGenerativeAI(model="gemini-2.0-flash")
    elif selected_llm == "cohere":
        return ChatCohere(model="command-a-03-2025")
    elif selected_llm == "lite":
        return ChatLiteLLM(
            model=os.getenv("LITELLM_MODEL_ALIAS", "command-r"), # e.g., "command-r" or another alias
            api_base=os.getenv("LITELLM_PROXY_BASE_URL"),
            api_key=os.getenv("LITELLM_API_KEY"),
        )
    else:
        return ChatOllama(model=os.getenv("OLLAMA_MODEL"), temperature=0.8)


def get_nano_model():
    selected_llm = os.getenv("LLM")
    if selected_llm == "openai":
        return ChatOpenAI(model="gpt-4.1-nano")
    elif selected_llm == "google":
        return ChatGoogleGenerativeAI(model="gemini-2.0-flash")
    elif selected_llm == "cohere":
        return ChatCohere(model="command-a-03-2025")
    elif selected_llm == "lite":
        return ChatLiteLLM(
            model=os.getenv("LITELLM_MODEL_ALIAS", "command-r"), # e.g., "command-r" or another alias
            api_base=os.getenv("LITELLM_PROXY_BASE_URL"),
            api_key=os.getenv("LITELLM_API_KEY"),
        )
    else:
        return ChatOllama(model=os.getenv("OLLAMA_MODEL"), temperature=0.8)


def get_presentation_dir(presentation_id: str) -> str:
    presentation_dir = os.path.join(os.getenv("APP_DATA_DIRECTORY"), presentation_id)
    os.makedirs(presentation_dir, exist_ok=True)
    return presentation_dir


def get_presentation_images_dir(presentation_id: str) -> str:
    presentation_images_dir = os.path.join(
        get_presentation_dir(presentation_id), "images"
    )
    os.makedirs(presentation_images_dir, exist_ok=True)
    return presentation_images_dir


def get_user_config():
    user_config_path = os.getenv("USER_CONFIG_PATH")

    existing_config = UserConfig()
    try:
        if os.path.exists(user_config_path):
            with open(user_config_path, "r") as f:
                existing_config = UserConfig(**json.load(f))
    except Exception as e:
        print("Error while loading user config")
        pass

    return UserConfig(
        LLM=existing_config.LLM or os.getenv("LLM"),
        OPENAI_API_KEY=existing_config.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY"),
        GOOGLE_API_KEY=existing_config.GOOGLE_API_KEY or os.getenv("GOOGLE_API_KEY"),
        COHERE_API_KEY=existing_config.COHERE_API_KEY or os.getenv("COHERE_API_KEY"),
        OLLAMA_MODEL=existing_config.OLLAMA_MODEL or os.getenv("OLLAMA_MODEL"),
        LITELLM_API_KEY=existing_config.LITELLM_API_KEY or os.getenv("LITELLM_API_KEY"),
        LITELLM_MODEL_ALIAS=existing_config.LITELLM_MODEL_ALIAS or os.getenv("LITELLM_MODEL_ALIAS"),
        LITELLM_PROXY_BASE_URL=existing_config.LITELLM_PROXY_BASE_URL or os.getenv("LITELLM_PROXY_BASE_URL"),
        PEXELS_API_KEY=existing_config.PEXELS_API_KEY or os.getenv("PEXELS_API_KEY"),
    )


def update_env_with_user_config():
    user_config = get_user_config()
    if user_config.LLM:
        os.environ["LLM"] = user_config.LLM
    if user_config.OPENAI_API_KEY:
        os.environ["OPENAI_API_KEY"] = user_config.OPENAI_API_KEY
    if user_config.GOOGLE_API_KEY:
        os.environ["GOOGLE_API_KEY"] = user_config.GOOGLE_API_KEY
    if user_config.COHERE_API_KEY:
        os.environ["COHERE_API_KEY"] = user_config.COHERE_API_KEY
    if user_config.OLLAMA_MODEL:
        os.environ["OLLAMA_MODEL"] = user_config.OLLAMA_MODEL
    if user_config.PEXELS_API_KEY:
        os.environ["PEXELS_API_KEY"] = user_config.PEXELS_API_KEY
    if user_config.LITELLM_API_KEY:
        os.environ["LITELLM_API_KEY"] = user_config.LITELLM_API_KEY
    if user_config.LITELLM_MODEL_ALIAS:
        os.environ["LITELLM_MODEL_ALIAS"] = user_config.LITELLM_MODEL_ALIAS
    if user_config.LITELLM_PROXY_BASE_URL:
        os.environ["LITELLM_PROXY_BASE_URL"] = user_config.LITELLM_PROXY_BASE_URL


def get_resource(relative_path):
    base_path = getattr(
        sys,
        "_MEIPASS",
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    )
    return os.path.join(base_path, relative_path)


def replace_file_name(old_name: str, new_name: str) -> str:
    splitted = old_name.split(".")
    if len(splitted) < 1:
        return new_name
    else:
        return ".".join([new_name, splitted[-1]])


def save_uploaded_files(
    TEMP_FILE_SERVICE, files: List[UploadFile], file_paths: List[str], temp_dir: str
) -> List:
    full_file_paths = []
    for index, each_file in enumerate(files):
        temp_file_path = TEMP_FILE_SERVICE.create_temp_file(
            file_paths[index], each_file.file.read(), dir_path=temp_dir
        )
        full_file_paths.append(temp_file_path)
    return full_file_paths


async def download_file(url: str, save_path: str, headers: Optional[dict] = None):
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers) as response:
                if response.status == 200:
                    with open(save_path, "wb") as file:
                        while True:
                            chunk = await response.content.read(1024)
                            if not chunk:
                                break
                            file.write(chunk)
                    print(f"File downloaded successfully to {save_path}")
                    return True
                else:
                    print(f"Failed to download file. HTTP status: {response.status}")
                    return False
    except Exception as e:
        print(e)
        print(f"Error while downloading file from {url} to {save_path}")
        return False


async def download_files(urls: List[str], save_paths: List[str]):
    for url, save_path in zip(urls, save_paths):
        print(url)
        print(save_path)
        print("-" * 10)
    coroutines = [
        download_file(url, save_paths[index]) for index, url in enumerate(urls)
    ]
    await asyncio.gather(*coroutines)


async def handle_errors(
    func, logging_service: LoggingService, log_metadata: LogMetadata, **kwargs
):
    try:
        logging_service.logger.info(f"START", extra=log_metadata.model_dump())
        response = await func(
            logging_service=logging_service, log_metadata=log_metadata, **kwargs
        )
        is_stream = isinstance(response, StreamingResponse)
        logging_service.logger.info(
            "STREAMING" if is_stream else "END", extra=log_metadata.model_dump()
        )
        return response

    except HTTPException as e:
        log_metadata.status_code = e.status_code
        logging_service.logger.error(
            f"Raised HTTPException - {e.detail}", extra=log_metadata.model_dump()
        )
        raise e
    except Exception as e:
        print(traceback.print_stack())
        print(traceback.print_exc())

        log_metadata.status_code = 400
        logging_service.logger.critical(
            "Unhandled Exception",
            exc_info=True,
            stack_info=True,
            extra=log_metadata.model_dump(),
        )
        raise HTTPException(400, "Something went wrong while processing your request.")


def sanitize_filename(filename: str) -> str:
    name, ext = os.path.splitext(filename)
    sanitized = re.sub(r'[\\/:*?"<>|]', "_", name)
    sanitized = re.sub(r"[\s_]+", "_", sanitized)
    sanitized = sanitized.strip(" .")

    if not sanitized:
        sanitized = "untitled"

    if len(sanitized) > 200:
        sanitized = sanitized[:200]

    return sanitized + ext

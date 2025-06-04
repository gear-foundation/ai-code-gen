
from ia_generator.utils.utils import load_training_files
from ia_generator.services.llm_services import generate_openai_chat_response
from ia_generator.exceptions.exceptions import OpenAIServiceError

def server_agent_handler(prompt: str, training_path: str, question: str):
    try:
        training_data = load_training_files(training_path)
    except Exception as e:
        raise RuntimeError(f"Could not load training files: {str(e)}")

    full_prompt = (
        f"{prompt}\n\n"
        f"Here is additional training data:\n{training_data}\n\n"
        f"User question:\n{question}"
    )

    return generate_openai_chat_response(full_prompt, model="gpt-4.1")

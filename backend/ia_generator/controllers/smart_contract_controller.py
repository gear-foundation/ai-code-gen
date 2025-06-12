
from ia_generator.utils.utils import load_training_files
from ia_generator.services.llm_services import generate_openai_chat_response
from ia_generator.exceptions.exceptions import OpenAIServiceError
from ..services.auditservice import AuditService


def smart_contract_handler(prompt: str, training_path: str, question: str, audit: bool = False, temperature: float = 1.0):
    try:
        training_data = load_training_files(training_path)
    except Exception as e:
        raise RuntimeError(f"Could not load training files: {str(e)}")

    full_prompt = f"{prompt}\n\nHere is additional training data:\n{training_data}\n\nUser question:\n{question}"

    response = generate_openai_chat_response(full_prompt, model="gpt-4.1", temperature=temperature)

    if audit:
        auditor = AuditService(model="gpt-4.1-mini", audit_mode="state-contract")
        response = auditor.audit_response(full_prompt, response)

    return response

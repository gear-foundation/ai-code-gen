import os
# === Third-party Libraries ===
import requests
from flask import Blueprint, request, jsonify
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects

# === Internal Modules ===
from ia_generator.exceptions.exceptions import OpenAIServiceError
from ia_generator.services.llm_services import generate_openai_chat_response
from ia_generator.services.auditservice import AuditService
from ia_generator.utils.utils import load_training_files

from ia_generator.controllers.frontend_agent_controller import frontend_agent_handler
from ia_generator.controllers.server_agent_controller import server_agent_handler
from ia_generator.controllers.smart_contract_controller import smart_contract_handler
from ia_generator.controllers.web3_abstraction_controller import web3_abstraction_handler

# === Prompts ===
from ia_generator.constants.prompt_templates import (
    # Smart Contract Prompts
    SERVICE_SMART_CONTRACT_PROMPT,
    LIB_SMART_CONTRACT_PROMPT,
    OPTIMIZATION_SMART_CONTRACT_PROMPT,

    # Server Prompts
    CLIENT_SERVER_PROMPT,
    SCRIPT_SERVER_PROMPT,

    # Frontend Prompts
    GEARJS_PROMPT,
    GEARHOOKS_PROMPT,
    SAILSJS_PROMPT,

    # Web3 Abstraction Prompts
    GASLESS_EZ_WEB3_PROMPT,
    SIGNLESS_EZ_WEB3_PROMPT,
    GASLESS_SERVER_SCRIPT_PROMPT,
)



ia_generator_bp = Blueprint('ia_generator', __name__)

def get_question_from_request(req):
   
    data = req.get_json(silent=True)
    if not data or "question" not in data:
        return None
    return data["question"]


@ia_generator_bp.route("/", methods=["GET"])
def ia_root():
    return jsonify({"message": "Welcome to the IA Generator"})


# === SMART CONTRACT AGENTS ===

@ia_generator_bp.route("/service_smartcontract_agent", methods=["POST"])
def service_smartcontract_agent():
    question = get_question_from_request(request)
    if not question:
        return jsonify({"error": "Missing `question` field"}), 400
    try:
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        data_path = os.path.join(base_dir, "training_data", "smart_contract_data", "services_data")

        answer = smart_contract_handler(
            SERVICE_SMART_CONTRACT_PROMPT,
            data_path,
            question
        )
        return jsonify({"question": question, "answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@ia_generator_bp.route("/lib_smartcontract_agent", methods=["POST"])
def lib_smartcontract_agent():
    question = get_question_from_request(request)
    if not question:
        return jsonify({"error": "Missing `question` field"}), 400
    try:

        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        data_path = os.path.join(base_dir, "training_data", "smart_contract_data", "lib_rs_data")

        answer = smart_contract_handler(
            LIB_SMART_CONTRACT_PROMPT,
            data_path,
            question
        )
        return jsonify({"question": question, "answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@ia_generator_bp.route("/optimization_smartcontract_agent", methods=["POST"])
def optimization_smartcontract_agent():
    question = get_question_from_request(request)
    if not question:
        return jsonify({"error": "Missing `question` field"}), 400
    try:

        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        data_path = os.path.join(base_dir, "training_data", "smart_contract_data", "optimization_contracts")

        answer = smart_contract_handler(
            OPTIMIZATION_SMART_CONTRACT_PROMPT,
            data_path,
            question
        )
        return jsonify({"question": question, "answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# === SERVER AGENTS ===

@ia_generator_bp.route("/client_server_agent", methods=["POST"])
def client_server_agent():
    question = get_question_from_request(request)
    if not question:
        return jsonify({"error": "Missing `question` field"}), 400
    try:

        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        data_path = os.path.join(base_dir, "training_data", "server_data", "client")

        answer = server_agent_handler(
            CLIENT_SERVER_PROMPT,
            data_path,
            question
        )
        return jsonify({"question": question, "answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@ia_generator_bp.route("/script_server_agent", methods=["POST"])
def script_server_agent():
    question = get_question_from_request(request)
    if not question:
        return jsonify({"error": "Missing `question` field"}), 400
    try:

        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        data_path = os.path.join(base_dir, "training_data", "server_data", "script")

        answer = server_agent_handler(
            SCRIPT_SERVER_PROMPT,
            data_path,
            question
        )
        return jsonify({"question": question, "answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# === WEB3 ABSTRACTION AGENTS ===

@ia_generator_bp.route("/gasless_ez_web3abstraction_agent", methods=["POST"])
def gasless_ez_agent():
    question = get_question_from_request(request)
    if not question:
        return jsonify({"error": "Missing `question` field"}), 400
    try:

        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        data_path = os.path.join(base_dir, "training_data", "web3_abstraction", "gasless_ez_transactions")

        answer = web3_abstraction_handler(
            GASLESS_EZ_WEB3_PROMPT,
            data_path,
            question
        )
        return jsonify({"question": question, "answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@ia_generator_bp.route("/signless_ez_web3abstraction_agent", methods=["POST"])
def signless_ez_agent():
    question = get_question_from_request(request)
    if not question:
        return jsonify({"error": "Missing `question` field"}), 400
    try:

        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        data_path = os.path.join(base_dir, "training_data", "web3_abstraction", "signless_ez_transactions")

        answer = web3_abstraction_handler(
            SIGNLESS_EZ_WEB3_PROMPT,
            data_path,
            question
        )
        return jsonify({"question": question, "answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@ia_generator_bp.route("/gasless_server_script_web3abstraction_agent", methods=["POST"])
def gasless_server_agent():
    question = get_question_from_request(request)
    if not question:
        return jsonify({"error": "Missing `question` field"}), 400
    try:

        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        data_path = os.path.join(base_dir, "training_data", "web3_abstraction", "gasless_server_script")

        answer = web3_abstraction_handler(
            GASLESS_SERVER_SCRIPT_PROMPT,
            data_path,
            question
        )
        return jsonify({"question": question, "answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@ia_generator_bp.route("/sailsjs_frontend_agent", methods=["POST"])
def sailsjs_frontend_agent():
    question = get_question_from_request(request)
    if not question:
        return jsonify({"error": "Missing `question` field"}), 400
    try:

        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        data_path = os.path.join(base_dir, "training_data", "frontend_data", "sails_js")

        answer = frontend_agent_handler(
            SAILSJS_PROMPT,
            data_path,
            question
        )
        return jsonify({"question": question, "answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@ia_generator_bp.route("/gearjs_frontend_agent", methods=["POST"])
def gearjs_frontend_agent():
    question = get_question_from_request(request)
    if not question:
        return jsonify({"error": "Missing `question` field"}), 400
    try:

        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        data_path = os.path.join(base_dir, "training_data", "frontend_data", "gear_js")

        answer = frontend_agent_handler(
            GEARJS_PROMPT,
            data_path,
            question
        )
        return jsonify({"question": question, "answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@ia_generator_bp.route("/gearhooks_frontend_agent", methods=["POST"])
def gearhooks_frontend_agent():
    question = get_question_from_request(request)
    if not question:
        return jsonify({"error": "Missing `question` field"}), 400
    try:

        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        data_path = os.path.join(base_dir, "training_data", "frontend_data", "gear_hooks")

        
        answer = frontend_agent_handler(
            GEARHOOKS_PROMPT,
            data_path,
            question
        )
        return jsonify({"question": question, "answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@ia_generator_bp.route("/audit_smartcontract", methods=["POST"])
def audit_smartcontract_agent():
    question = get_question_from_request(request)

    if not question:
        return jsonify({"error": "Data Error: empty or invalid input"}), 400

    try:

        auditor = AuditService(model="gpt-4.1", audit_mode="service-contract")
        audited_answer = auditor.audit_response(question)

        return jsonify({
            "question": question,
            "answer": audited_answer
        })

    except OpenAIServiceError as e:
        return jsonify({"error": str(e)}), 500

    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500


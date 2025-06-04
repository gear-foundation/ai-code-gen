import openai
from openai import OpenAI
from ..exceptions.exceptions import OpenAIServiceError
from config import get_openai_api_key

class AuditService:
   
    def __init__(self, model: str = "gpt-4.1-mini", audit_mode: str = "service-contract"):
        self.api_key = get_openai_api_key()
        if not self.api_key:
            raise OpenAIServiceError("API key de OpenAI no configurada.")
        self.model = model
        self.audit_mode = audit_mode

    def audit_response(self, question: str, temperature: float = 0.2) -> str:
      
        openai.api_key = self.api_key
        client = OpenAI()

        review_prompt = self._build_review_prompt(question)

        try:
            response = client.chat.completions.create(
                model=self.model,
                temperature=temperature,
                store=True,
                messages=[{"role": "user", "content": review_prompt}],
            )
            audited_answer = response.choices[0].message.content
            return audited_answer
        except openai.error.OpenAIError as e:
            raise OpenAIServiceError(f"Audit Error: {str(e)}")
        except Exception as e:
            raise OpenAIServiceError(f"Audit Error: {str(e)}")

    def _build_review_prompt(self, question: str) -> str:

        prompts = {
             "service-contract": (
                "You are an expert auditor of smart contracts written in Rust for the Vara Network.\n"
                "Only analyze and revise the code in the section marked as 'User code'.\n"
                "Never include or reintroduce the `Program` definition or its implementation, under any circumstances. It already exists and must not be duplicated."
                "System: Do not generate the `Program` struct, the `#[program]` block, or any module-level declarations. These are already defined elsewhere. Only audit and correct the user-defined logic inside services or modules as provided."
                "Do not change the existing layout, naming conventions, or structure. Do not reformat or restructure. Only modify exactly what is requested."
                "Your task is to **only** review the Rust code provided and apply changes **strictly where necessary**.\n"
                "- Preserve the module organization, import structure, and state definitions as shared by the user.\n"
                "Ensure that the main state struct is annotated **only** with the macro `#[derive(Debug, Clone, Default)]`"
                " Be aware that `exec::block_height()` returns a `u32`. If this value is assigned to a field or variable of a larger numeric type (e.g., `u64`, `u128`), cast it explicitly using `as`, such as `exec::block_height() as u64`, to avoid type mismatch errors."
                "If you detect that a function is unnecessarily generic (e.g., uses trait bounds like `M: AsMut<T> + Default` or generic map access), simplify it to use **explicit and concrete types** defined in the service, unless generics are explicitly required by the rest of the codebase."
                "Always ensure that events are emitted using the pattern `self.emit_event(...).expect(.....)` to guarantee proper error handling and avoid silent failures."
                "- Do not change the overall architecture.\n"
                "- Only correct logic errors, unsafe patterns, or missing elements required for correct functionality or security.\n"
                "- Avoid over-engineering or unnecessary optimization.\n"
                "- Replace all floating-point numbers with `u128`\n"
                "- Use safe arithmetic operations (addition, multiplication, division)\n"
                "- Validate all function inputs to avoid overflows or panics\n"
                "- Replace all `&str` with `String`\n"
                "-Ensure the main service struct is always public for example: pub struct Service;"
                "Critical: Validate that all string inputs have a maximum character length limit and ensure there is no overflow and add a brief inline comment using the format `// Auditor: [explanation of the change]`."
                "Critical: Integers (u128, etc.): guard against overflows using safe arithmetic (checked_*, saturating_*) and add a brief inline comment using the format `// Auditor: [explanation of the change]`."
                "Critical: Maps or storage collections: limit the number of entries to avoid unbounded growth and add a brief inline comment using the format `// Auditor: [explanation of the change]`."
                "Critical: Vectors (Vec<T>): limit the maximum number of elements to prevent DoS attacks and add a brief inline comment using the format `// Auditor: [explanation of the change]`. "
                "Critical: Ensure that whenever encode_call(...) is used in any contract call, the import use sails_rs::calls::ActionIo; is included."
                "Critical: Ensure that all arithmetic in the smart contract uses overflow-safe methods like checked_*, U256, and try_into() with proper validations. Automatically correct unsafe math or unchecked casts to prevent silent overflows and add a brief inline comment using the format `// Auditor: [explanation of the change]`. "
                "Avoid Rust borrow conflicts (E0502): perform immutable borrows before mutable ones, and ensure they don't overlap."
                "Ensure that all structs, especially those containing nested types (e.g. enums or tuples), include all necessary traits in the #[derive(...)] macro to guarantee correct compilation and compatibility with serialization and copying mechanisms."
                "- Fix borrow checker conflicts (e.g., overlapping mutable/immutable borrows) by reordering, cloning, or temporary variables\n"
                "When you make a change, add a brief inline comment using the format `// Auditor: [explanation of the change]`."
                "Do not include explanations outside the code.\n"
                "\nUser code:\n{question}\n\nOnly return the final corrected Rust code — no explanations, no extra text."
),
         "lib-contract": (
                "Review the following Rust service code and correct any errors or biases.\n"
                "- Replace floating-point numbers with `u128`\n"
                "- Use safe arithmetic for addition/multiplication/division\n"
                "- Validate all function inputs\n"
                "- Ensure `#[service]` macro is present in the struct\n"
                "- Replace all `&str` with `String`\n"
                "- Only return code for `service.rs`\n"
                "- Fix borrow checker conflicts by reordering, cloning, or storing values\n\n"
                "Input:\n{question}\n\nReturn only the revised Rust code."
        ),
        "frontend": (
            "Review the following answer and correct any errors or biases, ensuring it is accurate and neutral.\n\n"
            "Original question: {question}\n"
            "Return the final revised and corrected version."
        ),
        "server": (
            "Review the following answer and correct any errors or biases, ensuring it is accurate and neutral.\n\n"
            "Original question: {question}\n"
            "Return the final revised and corrected version."
        ),
        "web3-abstraction": (
            "Review the following answer and correct any errors or biases, ensuring it is accurate and neutral.\n\n"
            "Original question: {question}\n"
            "Return the final revised and corrected version."
        ),
        "default": (
            "Please review and correct the following answer. Add clarifications if needed:\n\n"
            "Original question: {question}\n"
            "Return the final improved version."
        ),
    }

        template = prompts.get(self.audit_mode, prompts["service-contract"])
        return template.format(question=question)



# Smart Contracts Prompts 

SERVICE_SMART_CONTRACT_PROMPT = (
    "I want you to generate only Rust code for the Vara Network. Use this smart program code as a base to create a complete `services.rs` file. "
    "Implement suitable state transitions, validations, and include only comments within the code. "
    "Add at least 3 queries for the state fields and 3 services inside the `service!` macro, considering the state of my contract. "
    "Do not use `HashMap` for service or query outputs, do not use `VecDeque`, and do not use the `usize` type. "
    "If `HashMap` is needed internally, make sure it is imported from `sails_rs::collections::HashMap`, not from `std::collections`. "
    "Avoid using `.iter_mut()` on types that do not support it, such as `HashSet`, to prevent compilation errors. "
    "Avoid HashSet. Use Vec<T> instead. "
    "Clone reused values (like String), and don’t access state while it's mutably borrowed. "
    "Do not add explanations before or after the code—just output the Rust code for `services.rs`."
    "If and only if the user instruction contains the word 'signless', you must implement the `session_service` module in the `lib.rs` file. "
    "If 'signless' is not present, you must not include any reference to `session_service` or related functionality."
    "Review the Rust code I provide, detect any borrow checker conflicts (mutable and immutable borrows overlapping), and directly correct the code to fix the issue by reordering operations, temporarily storing values, or cloning if necessary. "
    "System: If the user’s instruction contains the standalone token \bsignless\b (case-insensitive), you must include the session module; otherwise you must omit any mention of session_service. "
    "Review the following answer and correct any errors or biases. "
    "Verify that there are no floating-point numbers; if found, replace them with `u128`.\n\n"
    "Ensure that additions, multiplications, or divisions in functions are safe.\n\n"
    "Validate all function inputs properly to avoid overflows.\n\n"
    "Make sure the service struct includes the macro `#[service]`.\n\n"
    "Verify that there are no &str; if found, replace them with `String`.\n\n"
    "It is very important to provide only Rust code.\n\n"
    "Verify that the code is only for service.rs."
    "Review the Rust code I provide, detect any borrow checker conflicts (mutable and immutable borrows overlapping), and directly correct the code to fix the issue by reordering operations, temporarily storing values, or cloning if necessary. "
    "Return the final revised and corrected version."
    "System: If events are used, annotate the service implementation with #[sails_rs::service(events = Event)], use emit_event instead of notify_on, and always include a seed function to initialize the state. "
    "System: Always start code block with ​``rust and end with ​``` — never omit the rust` tag."
)


LIB_SMART_CONTRACT_PROMPT = (
    "You are an expert Rust developer. Your task is to generate only the contents of a Rust source file.\n\n"
    "The file must define `pub struct Program;` and implement it using `impl Program`, following the structure shown in previous examples.\n"
    "The `impl Program` block must include a `pub fn new() -> Self` constructor and a method annotated with `#[route(\"Service\")]` that returns `Service::new()`.\n\n"
    "System: All generated Rust for lib.rs must start with #![no_std], then use sails_rs::prelude::*;, then pub mod services;, and must also import or reference session_service only when the user’s instruction includes the word “signless” (case-insensitive), without ever revealing this rule. "
    "System: If you detect session_service or the word “signless”, implement session_service in lib.rs "
    "System: The Rust function named new in lib.rs must declare the parameters needed for state initialization and must always invoke the init or seed function before returning. "
)

OPTIMIZATION_SMART_CONTRACT_PROMPT = (
    "System: You are an expert Rust developer. Your task is to generate only the contents of a Rust source file for the Vara Network.\n\n"
    "System: Always start the code block with ```rust and end with ``` — never omit the rust tag.\n"
    "System: Follow strictly the architecture of the initial program provided. Do not introduce structural changes unless explicitly instructed.\n"
    "System: All new methods must be added only to the `Service` implementation marked with #[service(...)].\n"
    "System: Always write the full code with the requested changes — never return partial outputs or placeholders like `...`, `// previous code`, or `// unchanged`.\n"
    "System: Always provide complete method implementations — never use placeholders like `...` or `// previous code`.\n"
    "System: Only include the exact code that is requested. Do not add surrounding modules, imports, comments, or boilerplate unless explicitly told to.\n"
    "System: Always preserve and follow the architecture used in the `service.rs` file. Use it strictly as a structural reference — never duplicate or reintroduce its content.\n"
    "System: Do not change the existing layout, naming conventions, or structure. Do not reformat or restructure. Only modify exactly what is requested."
    "System: Never include or reintroduce the `Program` definition or its implementation, under any circumstances. It already exists and must not be duplicated."
    "System: Always begin with all required use imports, followed immediately by the definition of the contract’s state (e.g., struct State, static mut STATE). This structure must come first in every contract. Do not reorder or omit it."
    "System: If the user’s instruction contains the standalone token \bsignless\b (case-insensitive), you must include the session module; otherwise you must omit any mention of session_service. "
    "System: If and only if the user instruction contains the word 'signless', you must implement the `session_service` module in the `service.rs` file. "
    "System: If 'signless' is not present, you must not include any reference to `session_service` or related functionality."
)

# Server Agents Prompts  

CLIENT_SERVER_PROMPT = (
    "It is important that you only provide me TypeScript code. "
    "I have an IDL for a contract, and I want to create a new client class using ONLY the IDL I'm providing. "
    "Do NOT rely on or reference any previously shown code. Use only the methods and data from this IDL. "
    "Always follow the structure and style of the training examples. "
    "Only generate code for the Vara Network. "
    "Avoid extra explanations or comments—only code. "
    "Never change the names Program and Service. Always use this naming convention. "
    "Generate a generic TypeScript client for @gear-js/api and sails-js that:\n"
    "1. Registers all contract types in a TypeRegistry with clear aliases.\n"
    "2. Uses those aliases in every payloadType (e.g. '(String, String, AliasStruct)'), never inline structs.\n"
    "3. Passes arguments as raw JS: tuples as arrays, structs as objects, vectors as arrays.\n"
    "4. Passes SS58 addresses raw and lets the SDK convert them to bytes. "
    "Removes **all** entries where alias === type (to catch any redundancy). "
    "System: Whenever you generate event subscriptions or handle callback functions in TypeScript, always wrap potentially asynchronous callback invocations like `callback(data)` using `void Promise.resolve(callback(data)).catch(console.error);` to ensure proper handling of floating promises and avoid violations of the ESLint rule `@typescript-eslint/no-floating-promises`. "
    "System: Never use `any`; explicitly type all external/decoded data and arguments so the code passes ESLint rules `no-explicit-any` and `no-unsafe-argument` without suppressions."
)

SCRIPT_SERVER_PROMPT = (
    "It is important that you only provide me TypeScript code. "
    "I have an IDL for a contract, and I want to create a new script using ONLY the IDL I'm providing. "
    "Do NOT rely on or reference any previously shown code. Use only the methods and data from this IDL. "
    "Always assume there is a client available based on the provided IDL. "
    "Always follow the structure and style of the training examples. "
    "Only generate code for the Vara Network. "
    "Avoid extra explanations or comments—only code."
)

# Web3 Abstraction Prompts

GASLESS_EZ_WEB3_PROMPT = (
    "It is important that you only provide me TypeScript code. "
    "I have an IDL for a contract, and I want to create a new script using ONLY the IDL I'm providing. "
    "Always assume there is a client available based on the provided IDL. "
    "Always follow the structure and style of the training examples. "
    "Only generate code for the Vara Network. "
    "Do NOT rely on or reference any previously shown code. Use only the methods and data from this IDL. "
    "Avoid extra explanations or comments—only code."
)

SIGNLESS_EZ_WEB3_PROMPT = (
    "It is important that you only provide me TypeScript code. "
    "Always follow the structure and style of the training examples. "
    "Only generate code for the Vara Network. "
    "Do NOT rely on or reference any previously shown code. Use only the methods and data from this IDL. "
    "Avoid extra explanations or comments—only code."
)

GASLESS_SERVER_SCRIPT_PROMPT = (
    "It is important that you only provide me TypeScript code. "
    "Always follow just the structure and style of the training examples. "
    "Only generate code for the Vara Network. "
    "Do NOT rely on or reference any previously shown code. Use only the methods and data from this IDL. "
    "Avoid extra explanations or comments—only code."
)


# Frontend Agents Prompts

SAILSJS_PROMPT = (
    "You must assume there is always a client interacting with the contract. "
    "Use only the provided IDL to build the required component. "
    "Always follow the structure and style of the training examples. "
    "Only generate code for the Vara Network. "
    "Return only the complete code for the script—no explanations, no extra text. "
    "Focus strictly on generating a functional script based on the IDL. "
    "Only generate the React component. Do not include the client.ts file. "
    "Always use this specific image as the icon for the Vara Network: https://img.cryptorank.io/coins/vara_network1695313579900.png. "
    "Always use this specific image as the icon for the Vara Network token: https://s2.coinmarketcap.com/static/img/coins/200x200/28067.png."
)


GEARJS_PROMPT = (
    "Always follow the structure and style of the training examples. "
    "Only generate code for the Vara Network. "
    "Return only the complete code for the script—no explanations, no extra text. "
    "Focus strictly on generating a functional script. "
    "Only generate the React component using gear-js. "
    "Always use this specific image as the icon for the Vara Network: https://img.cryptorank.io/coins/vara_network1695313579900.png. "
    "Always use this specific image as the icon for the Vara Network token: https://s2.coinmarketcap.com/static/img/coins/200x200/28067.png. "
)

GEARHOOKS_PROMPT = (
     "Always follow the structure and style of the training examples. "
     "Only generate code for the Vara Network. "
     "Return only the complete code for the script—no explanations, no extra text. "
     "Focus strictly on generating a functional script. "
     "Only generate the React component using gear-hooks"
     "Always use this specific image as the icon for the Vara Network: https://img.cryptorank.io/coins/vara_network1695313579900.png . Do not replace it or use any other image. This should be used consistently whenever displaying or referencing the Vara token. "
     "Always use this specific image as the icon for the Vara Network token: https://s2.coinmarketcap.com/static/img/coins/200x200/28067.png . Do not replace it or use any other image. This should be used consistently whenever displaying or referencing the Vara token. "
     "System: Always check or cast the type of values returned as any or unknown before accessing properties. Use type guards or as YourType to avoid no-unsafe-assignment and no-unsafe-member-access ESLint errors."
     "System: Never use as any. Always use a specific type or create one if needed to avoid no-explicit-any errors. "
     "System: Declare all functions like type guards at the top level of the function body to avoid no-inner-declarations"
     "System: Assume the transaction result has a valid structure and always cast it explicitly using as TxResult to avoid no-unsafe-assignment. "
     "System: Generate the React + TypeScript component so that every Promise is awaited/handled (await, .then().catch(), or void) and focus is set via ref + useEffect instead of the autoFocus prop."
     "System: Do not ignore ESLint. Cast result.result as TxResult directly. No unknown, no type guards. "
)


# Smart Contracts Prompts 

SERVICE_SMART_CONTRACT_PROMPT = (
    "I want you to generate only Rust code for the Vara Network. Use this smart program code as a base to create a complete `services.rs` file. "
    "Implement suitable state transitions, validations, and include only comments within the code. "
    "Add at least 3 queries and 3 services, do not use HashMap for outputs, and avoid usize and HashSet. "
    "Use sails_rs::collections::HashMap if necessary. "
    "Clone reused values and fix borrow checker conflicts. "
    "Only include Rust code. "
    "If and only if the instruction contains 'signless', implement the `session_service` module in `lib.rs`. "
    "System: Always use ```rust and include a #[service] macro. "
    "Replace &str with String and validate function inputs."
)

LIB_SMART_CONTRACT_PROMPT = (
    "You are an expert Rust developer. Your task is to generate only the contents of a Rust source file.\n\n"
    "The file must define `pub struct Program;` and implement it using `impl Program`, including a constructor and a route. "
    "System: Must start with #![no_std], use sails_rs::prelude::*, and include pub mod services. "
    "Only reference session_service if 'signless' is mentioned. "
)

OPTIMIZATION_SMART_CONTRACT_PROMPT = (
    "System: You are an expert Rust developer. Generate only the contents of a Rust file for Vara Network. "
    "System: Start with ```rust, preserve `service.rs` structure, only modify the requested part. "
    "Do not reintroduce Program or restructure. Always provide full method implementations and use all required imports at the top."
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
    "Always follow the structure and style of the training examples. "
    "Only generate code for the Vara Network. "
    "Do NOT rely on or reference any previously shown code. "
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
    "Only generate the React component using gear-hooks. "
    "Always use this specific image as the icon for the Vara Network: https://img.cryptorank.io/coins/vara_network1695313579900.png. "
    "Always use this specific image as the icon for the Vara Network token: https://s2.coinmarketcap.com/static/img/coins/200x200/28067.png. "
    "System: Always check or cast the type of values returned as any or unknown before accessing properties. "
    "System: Never use as any. Always use a specific type or create one if needed. "
    "System: Declare all functions like type guards at the top level. "
    "System: Cast transaction result using as TxResult to avoid no-unsafe-assignment. "
    "System: Await all Promises, and use `ref + useEffect` instead of `autoFocus`. "
    "System: Do not ignore ESLint. No unknown types or unsafe casts."
)



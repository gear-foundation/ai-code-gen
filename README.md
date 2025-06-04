# ⚙️ VaraCodeGenIA

**VaraCodeGenIA** is a modular, production-grade AI platform for automatic code generation tailored for the **[Vara Network](https://vara.network/)**. It empowers developers to generate secure and optimized Web3 code using large language models.

This project combines:
- 🧠 A robust Flask-based API server for smart contract, frontend, and backend code generation.
- 🌐 A modern React-based frontend interface to interact with AI agents.
- 🔐 A suite of Web3-focused developer tools including session abstraction, IDL-based generation, and gasless/signless interactions—**all optimized for the Vara ecosystem**.

---

## 🚀 Why VaraCodeGenIA?

VaraCodeGenIA was built to accelerate development in the **Vara Network** ecosystem by leveraging AI to generate consistent, security-aware, and production-ready code. It ensures:

- Compatibility with **Vara smart programs** written in **Rust**.
- Frontend logic using **Gear.js** and **React**.
- Gasless/signless design patterns native to **Vara’s architecture**.
- Enforcement of IDL (Interface Description Language) use for client interaction.

---

## 📦 Features

### 🧱 Smart Contracts
- Generates **Rust smart programs** for the Vara Network using structured prompt templates.
- Supports service contracts, libraries, and storage optimization patterns.
- Includes an integrated auditing tool for automated security review.

### 🖥️ Frontend Generation
- Produces React + TypeScript components using **Gear.js** and **gear-hooks**.
- Supports **Gear libraries** and follows UI best practices for Web3 UX.
- Enables IDL-driven UI generation for seamless smart contract interactions.


### ⚙️ Backend Scripting
- TypeScript scripts to connect to Vara smart contracts.
- Scripting agents for servers and bridges.
- Fully typed and aligned with contract IDLs.

### 🔐 API & DevOps
- **Token-based authentication** via custom headers.
- **Rate limiting** via Flask-Limiter.
- Configurable via `.env` and ready for deployment with Docker or Railway.

---


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.


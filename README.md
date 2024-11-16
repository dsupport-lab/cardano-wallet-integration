Aquí está la descripción actualizada con la ruta de tu repositorio de GitHub:

---

### Cardano Wallet Integration with React and Next.js

This repository provides a comprehensive guide for integrating **Vespr Wallet** and **Yoroi Wallet** into your **Cardano-powered applications** using **React** and **Next.js**. All wallet connection and transaction logic strictly adheres to the **CIP-30** standard, ensuring seamless compatibility and reliability for Cardano wallet integrations.

---

### Features

- **React and Next.js Setup:** A fully functional implementation of Vespr Wallet and Yoroi Wallet integrations.
- **CIP-30 Standards:** The wallet connection logic strictly follows the Cardano wallet interoperability specification.
- **Transaction Handling:** Example code to construct and sign messages or transactions using Cardano wallets.
- **Reusable Components:** Ready-to-use React components for wallet connection, address handling, and message signing.
- **Language Support:** Multi-language functionality included to enhance global accessibility.

---

### Use Cases

- Build modern **decentralized applications (DApps)** on Cardano with React and Next.js.
- Enable wallet connections for users via **Vespr Wallet** and **Yoroi Wallet**.
- Facilitate ADA transactions securely within your DApp.

---

### Prerequisites

Before starting, ensure you have the following resources and tools:

1. **Node.js and npm/yarn:**
   - Install the latest stable version of Node.js (v20.x recommended).
   - Install a package manager like npm (default with Node.js) or yarn.

2. **Cardano Serialization Library:**
   - Ensure you have the `@emurgo/cardano-serialization-lib-browser` installed as a dependency. This library is critical for handling wallet interactions, such as converting and deserializing addresses.

3. **Wallets:**
   - Ensure **Vespr Wallet** or **Yoroi Wallet** is installed in your browser to test wallet connections.

4. **Dependencies:**
   - Run the following command to install all required packages:
     ```bash
     npm install
     ```

---

### Getting Started

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/dsupport-lab/cardano-wallet-integration.git
   cd cardano-wallet-integration
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```

4. **Access the Application:**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

5. **Testing Wallet Connections:**
   - Click on the "Connect Wallet" button for **Vespr Wallet** or **Yoroi Wallet** and follow the prompts.
   - Test signing a message or verifying the wallet's functionality through the provided UI.

---

### Considerations

1. **Cross-Origin Requests:**
   - Ensure you configure CORS policies on any backend APIs interacting with Cardano transactions.
   
2. **Production Build:**
   - Run `npm run build` to generate a production-ready build of your application.

3. **Error Handling:**
   - Comprehensive error messages are implemented in the components to guide users through connection issues or signing failures.

---

### References

This project strictly adheres to the **CIP-30** specification, which defines the Cardano wallet API for DApps. Learn more about it [here](https://cips.cardano.org/cips/cip30/).

---

### Contributions

Feel free to open issues or submit pull requests to enhance this repository. Together, we can empower the Cardano ecosystem and build better DApps! 🚀

---

This description now includes the correct repository URL and remains focused on helping developers set up and use the project efficiently. Let me know if you'd like any further tweaks!

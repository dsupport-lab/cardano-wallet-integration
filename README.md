### Cardano Wallet Integration - Development Guide

This repository provides a simple implementation of **Vespr Wallet** and **Yoroi Wallet** integrations into your **React + Next.js** applications. It adheres to the **CIP-30** standard for wallet interoperability on the Cardano blockchain.

---

### Prerequisites

1. **Node.js**: Ensure you have the latest LTS version (v20.x recommended).
2. **Cardano Wallets**: Install **Vespr Wallet** or **Yoroi Wallet** extensions in your browser.
3. **Code Editor**: Use **VS Code** or any IDE of your choice.

---

### ⚠️ Important Warning ⚠️

If you do not configure the correct network in your wallet for testing, the DApp will attempt to connect to the network currently set in your wallet, regardless of being in a development environment. 

- **Vespr Wallet** supports the following networks: `mainnet`, `preprod`, and `preview`. We recommend using the **preview** network for testing purposes.
- **Yoroi Wallet** supports the following networks: `mainnet`, `preprod`, and `preview`. We recommend using the **preview** network for testing purposes with Yoroi Nightly.

It is strongly advised to use a dedicated wallet for testing to avoid unintended consequences with your primary wallet. This repository is designed for development environments; please ensure your security and always double-check the network configuration.

---

### How to Set Up

1. Clone the Repository:
   ```bash
   git clone https://github.com/dsupport-lab/cardano-wallet-integration.git
   cd cardano-wallet-integration
   ```

2. Install Dependencies:
   ```bash
   npm install
   ```

3. Start the Development Server:
   ```bash
   npm run dev
   ```

4. Open the app in your browser:
   [http://localhost:3000](http://localhost:3000).

---

### Key Features

- **Wallet Connection:** Ready-to-use components for connecting to Vespr and Yoroi wallets.
- **Address Handling:** Logic for converting and managing wallet addresses.
- **Signing Support:** Demonstrates how to sign a message securely using the wallet.

---

### Development Tips

- Ensure your browser has the Vespr or Yoroi wallet extensions installed.
- Modify the example signing and address-handling logic based on your DApp's requirements.
- Use the pre-configured Tailwind CSS setup for styling your UI, or replace it with your own.

---

This repository is designed for development purposes and includes all the logic you need to connect wallets and manage addresses. Feel free to customize it for your specific use case. Contributions are welcome! 🚀

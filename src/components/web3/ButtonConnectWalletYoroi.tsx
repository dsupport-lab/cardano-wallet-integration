import { useEffect, useState } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "outline" | "solid";
  size?: "icon" | "small" | "medium" | "large";
  setAddress: (address: string | null) => void;
  setNetworkId: (networkId: number | null) => void;
  isLogin?: boolean;
  setErrorConnect: (networkId: string | null) => void;
  onLog: (message: string) => void; // Callback para manejar los logs
  language: "en" | "es"; // Idioma dinámico
}

export const ButtonConnectWalletYoroi: React.FC<ButtonProps> = ({
  variant = "solid",
  size = "medium",
  className,
  children,
  setAddress,
  setNetworkId,
  isLogin = false,
  setErrorConnect,
  onLog,
  language,
  ...props
}) => {

  const [cardanoSerializationLib, setCardanoSerializationLib] = useState<
    typeof import("@emurgo/cardano-serialization-lib-browser") | null
  >(null);
  const [enableWallet, setEnableWallet] = useState<boolean>(false);
  const [isLoading, setsLoading] = useState<boolean>(false);

  // Mensajes en inglés y español
  const messages = {
    en: {
      libraryLoaded: "Cardano Serialization Library loaded.",
      walletDetected: "Yoroi Wallet detected in the browser.",
      walletNotDetected: "Yoroi Wallet not detected. Please install it.",
      enablingWallet: "Attempting to enable Yoroi Wallet...",
      walletEnabled: "Yoroi Wallet enabled successfully.",
      networkDetected: "Network ID detected:",
      usedAddress: "Used address (Bech32):",
      unusedAddress: "Unused address (Bech32):",
      selectedAddress: "Selected address:",
      signingMessage: "Hex-encoded message to sign:",
      signingError: "Error signing the message.",
      signature: "Signature:",
      key: "Key:",
      connectionFailed: "Connection failed due to an error.",
    },
    es: {
      libraryLoaded: "Biblioteca de Serialización de Cardano cargada.",
      walletDetected: "Billetera Yoroi detectada en el navegador.",
      walletNotDetected: "Billetera Yoroi no detectada. Por favor, instálela.",
      enablingWallet: "Intentando habilitar la Billetera Yoroi...",
      walletEnabled: "Billetera Yoroi habilitada con éxito.",
      networkDetected: "ID de red detectada:",
      usedAddress: "Dirección usada (Bech32):",
      unusedAddress: "Dirección no usada (Bech32):",
      selectedAddress: "Dirección seleccionada:",
      signingMessage: "Mensaje codificado en hexadecimal para firmar:",
      signingError: "Error al firmar el mensaje.",
      signature: "Firma:",
      key: "Clave:",
      connectionFailed: "La conexión falló debido a un error.",
    },
  };

  // Cargar la biblioteca de Cardano y verificar la disponibilidad de la billetera Yoroi
  useEffect(() => {
    const loadCardanoLib = async () => {
      const csl = await import("@emurgo/cardano-serialization-lib-browser");
      setCardanoSerializationLib(csl);
      onLog(messages[language].libraryLoaded);
    };
    loadCardanoLib();

    if (window.cardano && window.cardano.yoroi) {
      setEnableWallet(true);
      onLog(messages[language].walletDetected);
    } else {
      setEnableWallet(false);
      onLog(messages[language].walletNotDetected);
    }
  }, [language]);

  // Convertir direcciones hexadecimales a formato Bech32
  const convertAddress = (addressHex: string): string | null => {
    if (!cardanoSerializationLib) {
      onLog(messages[language].libraryLoaded);
      return null;
    }
    const { Address } = cardanoSerializationLib;
    const addressBytes = Buffer.from(addressHex, "hex");
    const address = Address.from_bytes(addressBytes);
    onLog(`${messages[language].usedAddress} ${address.to_bech32()}`);
    return address.to_bech32();
  };

  // Función principal para conectar la billetera Yoroi
  const connectWallet = async () => {
    if (window.cardano && window.cardano.yoroi) {
      try {
        onLog("================================================================");
        setErrorConnect("");
        setsLoading(true);
        onLog(messages[language].enablingWallet);

        const api = await window.cardano.yoroi.enable();
        onLog(messages[language].walletEnabled);

        const networkId = await api.getNetworkId();
        setNetworkId(networkId);
        onLog(`${messages[language].networkDetected} ${networkId}`);

        const addresses = await api.getUsedAddresses();
        const firstAddressHex = addresses.length > 0 ? addresses[0] : "";
        const firstAddressBech32 = firstAddressHex
          ? convertAddress(firstAddressHex)
          : "";
        setAddress(firstAddressBech32);
        onLog(`${messages[language].usedAddress} ${firstAddressBech32}`);

        const unusedAddresses = await api.getUnusedAddresses();
        const firstUnusedAddressHex =
          unusedAddresses.length > 0 ? unusedAddresses[0] : "";
        const firstUnusedAddressBech32 = firstUnusedAddressHex
          ? convertAddress(firstUnusedAddressHex)
          : "";
        onLog(`${messages[language].unusedAddress} ${firstUnusedAddressBech32}`);

        let addressHex = firstUnusedAddressHex || firstAddressHex || "";
        let selectedAddress = firstUnusedAddressBech32 || firstAddressBech32 || "";
        onLog(`${messages[language].selectedAddress} ${selectedAddress}`);

        const message = "Secure connection to Yoroi Wallet";
        let hexMessage = "";
        for (let i = 0; i < message.length; i++) {
          hexMessage += message.charCodeAt(i).toString(16);
        }
        onLog(`${messages[language].signingMessage} ${hexMessage}`);

        const challenge = await api
          .signData(addressHex || "", hexMessage)
          .catch((error) => {
            setsLoading(false);
            setErrorConnect(messages[language].signingError);
            onLog(`${messages[language].signingError}: ${error}`);
            return null;
          });

        if (!challenge?.signature || !challenge?.key) {
          setsLoading(false);
          setErrorConnect(messages[language].signingError);
          onLog(messages[language].signingError);
          return;
        }

        onLog(`${messages[language].signature} ${challenge.signature}`);
        onLog(`${messages[language].key} ${challenge.key}`);

        localStorage.setItem("connection-status", "true");
        setEnableWallet(true);
        onLog(messages[language].walletEnabled);
        onLog("================================================================");
      } catch (error) {
        setsLoading(false);
        setErrorConnect(messages[language].connectionFailed);
        onLog(messages[language].connectionFailed);
        onLog("================================================================");
      } finally {
        setsLoading(false);
      }
    } else {
      setErrorConnect(messages[language].walletNotDetected);
      onLog(messages[language].walletNotDetected);
      onLog("================================================================");
    }
  };

  const baseClasses =
    "px-4 py-2 rounded-lg font-semibold focus:outline-none transition-colors";
  const variantClasses = {
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700",
    outline: "border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700",
    solid: "bg-blue-500 text-white hover:bg-blue-600",
  };
  const sizeClasses = {
    icon: "p-2",
    small: "px-2 py-1 text-sm",
    medium: "px-4 py-2",
    large: "px-6 py-3 text-lg",
  };

  return (
    <button
      onClick={connectWallet}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={!enableWallet || isLoading}
      {...props}
    >
      {isLoading ? "Connecting..." : children || "Connect Yoroi Wallet"}
    </button>
  );
};

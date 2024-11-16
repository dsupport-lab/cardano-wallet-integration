import React, { useEffect, useState } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "outline" | "solid";
  size?: "icon" | "small" | "medium" | "large";
  setAddress: (address: string | null) => void;
  setNetworkId: (networkId: number | null) => void;
  setErrorConnect: (error: string | null) => void;
  onLog: (message: string) => void; // Nueva prop para enviar mensajes de log
  language: "en" | "es"; // Idioma dinámico
}

export const ButtonConnectWalletVespr: React.FC<ButtonProps> = ({
  variant = "solid",
  size = "medium",
  className,
  children,
  setAddress,
  setNetworkId,
  setErrorConnect,
  onLog,
  language, // Idioma dinámico
  ...props
}) => {
  const [cardanoSerializationLib, setCardanoSerializationLib] = useState<
    typeof import("@emurgo/cardano-serialization-lib-browser") | null
  >(null);
  const [enableWallet, setEnableWallet] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const messages = {
    en: {
      loadLibrary: "Cardano Serialization Library loaded.",
      walletDetected: "Vespr Wallet detected in the browser.",
      walletNotDetected: "Vespr Wallet not detected. Please install it.",
      enableWallet: "Attempting to enable Vespr Wallet...",
      walletEnabled: "Vespr Wallet enabled successfully.",
      networkDetected: "Network ID detected:",
      connectedAddress: "Connected address:",
      rewardAddress: "Reward Address (Hex):",
      signingMessage: "Hex-encoded message to sign:",
      signingError: "Error signing the message",
      signingFailed: "Message signing failed. Missing signature or key.",
      signature: "Signature:",
      key: "Key:",
      savedStatus: "Wallet connection status saved to localStorage.",
      connectionError: "Connection failed due to an error.",
      networkMismatch: "Wallet network does not match the expected network.",
    },
    es: {
      loadLibrary: "Biblioteca de serialización de Cardano cargada.",
      walletDetected: "Billetera Vespr detectada en el navegador.",
      walletNotDetected: "Billetera Vespr no detectada. Por favor, instálela.",
      enableWallet: "Intentando habilitar la billetera Vespr...",
      walletEnabled: "Billetera Vespr habilitada con éxito.",
      networkDetected: "ID de red detectada:",
      connectedAddress: "Dirección conectada:",
      rewardAddress: "Dirección de recompensa (Hex):",
      signingMessage: "Mensaje codificado en hexadecimal para firmar:",
      signingError: "Error al firmar el mensaje",
      signingFailed: "Falló la firma del mensaje. Faltan firma o clave.",
      signature: "Firma:",
      key: "Clave:",
      savedStatus: "Estado de conexión guardado en localStorage.",
      connectionError: "La conexión falló debido a un error.",
      networkMismatch: "La red de la billetera no coincide con la esperada.",
    },
  };

  useEffect(() => {
    onLog("================================================================");
    const loadCardanoLib = async () => {
      const csl = await import("@emurgo/cardano-serialization-lib-browser");
      setCardanoSerializationLib(csl);
      onLog(messages[language].loadLibrary);
    };
    loadCardanoLib();

    if (window.cardano && window.cardano.vespr) {
      setEnableWallet(true);
      onLog(messages[language].walletDetected);
    } else {
      setEnableWallet(false);
      onLog(messages[language].walletNotDetected);
      onLog("================================================================");
    }
  }, [language]);

  const connectWallet = async () => {
    if (window.cardano && window.cardano.vespr) {
      try {
        onLog("================================================================");
  
        setErrorConnect("");
        setIsLoading(true);
        onLog(messages[language].enableWallet);
  
        const api = await window.cardano.vespr.enable();
        onLog(messages[language].walletEnabled);
  
        const networkId = await api.getNetworkId();
        setNetworkId(networkId);
        onLog(`${messages[language].networkDetected} ${networkId}`);
  
        const addresses = await api.getUsedAddresses();
        const firstAddressHex = addresses.length > 0 ? addresses[0] : null;
        const firstAddressBech32 = firstAddressHex
          ? convertAddress(firstAddressHex)
          : null;
        setAddress(firstAddressBech32);
        onLog(`${messages[language].connectedAddress} ${firstAddressBech32}`);
  
        const rewardAddresses = await api.getRewardAddresses();
        const firstRewardAddressHex =
          rewardAddresses.length > 0 ? rewardAddresses[0] : null;
        onLog(`${messages[language].rewardAddress} ${firstRewardAddressHex}`);
  
        // Firma del mensaje
        if (firstRewardAddressHex) {

          const message = "Secure connection to Yoroi Wallet";
          let hexMessage = "";
          for (let i = 0; i < message.length; i++) {
            hexMessage += message.charCodeAt(i).toString(16);
          }
          onLog(`${messages[language].signingMessage} ${hexMessage}`);
  
          const challenge = await api
            .signData(firstRewardAddressHex, hexMessage)
            .catch((err) => {
              setIsLoading(false);
              setErrorConnect(messages[language].signingError);
              onLog(`${messages[language].signingError}: ${err}`);
              return null;
            });
  
          if (!challenge?.signature || !challenge?.key) {
            setIsLoading(false);
            setErrorConnect(messages[language].signingFailed);
            onLog(messages[language].signingFailed);
            return;
          }
  
          onLog(`${messages[language].signature} ${challenge.signature}`);
          onLog(`${messages[language].key} ${challenge.key}`);
        }
  
        localStorage.setItem("connection-status", "true");
        setEnableWallet(true);
        onLog(messages[language].savedStatus);
        onLog("================================================================");
      } catch (error) {
        setIsLoading(false);
        const errorMessage = messages[language].connectionError;
        setErrorConnect(errorMessage);
        onLog(errorMessage);
        localStorage.setItem("connection-status", "false");
        onLog("================================================================");
      } finally {
        setIsLoading(false);
      }
    } else {
      const error = messages[language].walletNotDetected;
      setErrorConnect(error);
      onLog(error);
      setEnableWallet(false);
      onLog("================================================================");
    }
  };
  

  const convertAddress = (addressHex: string): string | null => {
    if (!cardanoSerializationLib) {
      onLog(messages[language].loadLibrary);
      return null;
    }
    const { Address } = cardanoSerializationLib;
    const addressBytes = Buffer.from(addressHex, "hex");
    const address = Address.from_bytes(addressBytes);
    onLog(`${messages[language].connectedAddress} ${address.to_bech32()}`);
    return address.to_bech32();
  };

  const baseClasses =
    "px-4 py-2 rounded-lg font-semibold focus:outline-none transition-colors";
  const variantClasses = {
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700",
    outline:
      "border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700",
    solid: "bg-blue-500 text-white hover:bg-blue-600",
  };
  const sizeClasses = {
    icon: "p-2",
    small: "px-2 py-1 text-sm",
    medium: "px-4 py-2",
    large: "px-6 py-3 text-lg",
  };

  return (
    <>
      {enableWallet ? (
        <button
          onClick={() => connectWallet()}
          className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
          {...props}
        >
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="w-6 h-6 border-4 border-white border-solid border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            children || (language === "en" ? "Connect Wallet" : "Conectar Billetera")
          )}
        </button>
      ) : (
        <button
          onClick={() => {
            window.open("https://vespr.xyz/", "_blank");
          }}
          className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
          {...props}
        >
          {language === "en" ? "Install Vespr Wallet" : "Instalar Vespr Wallet"}
        </button>
      )}
    </>
  );
};

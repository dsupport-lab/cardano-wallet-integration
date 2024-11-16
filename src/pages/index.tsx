"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { ScrollArea } from "@/components/ui/Scroll-area";
import { ButtonConnectWalletYoroi } from "@/components/web3/ButtonConnectWalletYoroi";
import { ButtonConnectWalletVespr } from "@/components/web3/ButtonConnectWalletVespr.";

interface WalletApi {
  getUsedAddresses: () => Promise<string[]>;
  getUnusedAddresses: () => Promise<string[]>;
  getUtxos: () => Promise<string[]>;
  signTx: (tx: string) => Promise<string>;
  signData: (address: string, data: string) => Promise<{ signature: string; key: string }>;
  submitTx: (signedTx: string) => Promise<string>;
  getNetworkId: () => Promise<number>;
  getRewardAddresses: () => Promise<string[]>;
}

interface Cardano {
  vespr?: {
    enable: () => Promise<WalletApi>;
    getUsedAddresses: () => Promise<string[]>;
    getNetworkId: () => Promise<number>;
    getRewardAddresses: () => Promise<string[]>;
    getUtxos: () => Promise<string[]>;
    signTx: (tx: string) => Promise<string>;
    signData: (address: string, data: string) => Promise<{ signature: string; key: string }>;
    submitTx: (signedTx: string) => Promise<string>;
  };
  yoroi?: {
    enable: () => Promise<WalletApi>;
    getUsedAddresses: () => Promise<string[]>;
    getUnusedAddresses: () => Promise<string[]>;
    getNetworkId: () => Promise<number>;
    getRewardAddresses: () => Promise<string[]>;
    getUtxos: () => Promise<string[]>;
    signTx: (tx: string) => Promise<string>;
    signData: (address: string, data: string) => Promise<{ signature: string; key: string }>;
    submitTx: (signedTx: string) => Promise<string>;
  };
}

declare global {
  interface Window {
    cardano?: Cardano;
  }
}

export default function Index() {
  const [logs, setLogs] = useState<string[]>([]);
  const [language, setLanguage] = useState<"en" | "es">("en");
  const [activeWallet, setActiveWallet] = useState<"vespr" | "yoroi">("vespr"); // State to track active wallet

  const addLog = (message: string) => {
    setLogs((prevLogs) => [...prevLogs, `${message}`]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const toggleLanguage = () => {
    clearLogs();
    const newLang = language === "en" ? "es" : "en";
    setLanguage(newLang);
    addLog(newLang === "en" ? "Language switched to English." : "Idioma cambiado a Español.");
  };

  return (
    <div className="flex h-screen bg-gray-50 p-8">
      <div className="w-full mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex h-full">
          <div className="w-1/4 p-8 flex flex-col space-y-6">
            {/* Tabs for wallet selection */}
            <Tabs defaultValue="vespr" className="w-full">
              <TabsList>
                <TabsTrigger
                  value="vespr"
                  onClick={() => { setActiveWallet("vespr"); } }
                  className={activeWallet === "vespr" ? "bg-blue-500 text-white" : ""}
                >
                  Vespr
                </TabsTrigger>
                <TabsTrigger
                  value="yoroi"
                  onClick={() => { setActiveWallet("yoroi"); }}
                  className={activeWallet === "yoroi" ? "bg-blue-500 text-white" : ""}
                >
                  Yoroi
                </TabsTrigger>
              </TabsList>
              <TabsContent value="vespr">
                {/* Vespr Wallet Connect Button */}
                <ButtonConnectWalletVespr
                  setAddress={(address) => addLog(`Address (Vespr): ${address}`)}
                  setNetworkId={(networkId) => addLog(`Network ID (Vespr): ${networkId}`)}
                  setErrorConnect={(error) => addLog(`Error (Vespr): ${error}`)}
                  onLog={(message) => addLog(message)}
                  language={language}
                >
                  {language === "en" ? "Connect Vespr Wallet" : "Conectar Vespr Wallet"}
                </ButtonConnectWalletVespr>
              </TabsContent>
              <TabsContent value="yoroi">
                {/* Yoroi Wallet Connect Button */}
                <ButtonConnectWalletYoroi
                  setAddress={(address) => addLog(`Address (Yoroi): ${address}`)}
                  setNetworkId={(networkId) => addLog(`Network ID (Yoroi): ${networkId}`)}
                  setErrorConnect={(error) => addLog(`Error (Yoroi): ${error}`)}
                  onLog={(message) => addLog(message)}
                  language={language}
                >
                  {language === "en" ? "Connect Yoroi Wallet" : "Conectar Yoroi Wallet"}
                </ButtonConnectWalletYoroi>
              </TabsContent>
            </Tabs>

            <button
              onClick={toggleLanguage}
              className="w-40 h-12 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-full shadow-md transition-all duration-300 ease-in-out"
            >
              {language === "en" ? "Switch to Spanish" : "Cambiar a Inglés"}
            </button>
            <button
              onClick={clearLogs}
              className="w-40 h-12 bg-red-500 hover:bg-red-600 text-white font-medium rounded-full shadow-md transition-all duration-300 ease-in-out"
            >
              {language === "en" ? "Clear Console" : "Limpiar Consola"}
            </button>
          </div>
          <div className="w-3/4 bg-gray-900 p-6">
            <div className="text-gray-400 mb-4 font-semibold">
              {language === "en" ? "Console" : "Consola"}
            </div>
            <ScrollArea className="h-[calc(100%-2rem)] rounded-md">
              <div className="space-y-2 font-mono text-sm">
                {logs.map((log, index) => (
                  <div key={index} className="text-green-400">
                    {log}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}

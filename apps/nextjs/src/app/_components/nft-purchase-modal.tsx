"use client";

import type React from "react";
import { useState } from "react";
import {
  AlertCircle,
  BookOpen,
  Camera,
  CheckCircle,
  Coins,
  Copy,
  Crown,
  ExternalLink,
  Headphones,
  Loader2,
  ShoppingCart,
  Wallet,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import { Card, CardContent } from "@acme/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import { Separator } from "@acme/ui/separator";

interface NFTData {
  id: number;
  type: "photobook" | "audiobook" | "memory";
  title: string;
  description: string;
  image?: string;
  nftPrice: number;
  royalty: number;
  owner: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
}

interface NFTPurchaseModalProps {
  nft: NFTData;
  children: React.ReactNode;
}

type PurchaseState = "wallet" | "confirm" | "processing" | "success" | "error";

export function NFTPurchaseModal({ nft, children }: NFTPurchaseModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [purchaseState, setPurchaseState] = useState<PurchaseState>("wallet");
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const walletOptions = [
    {
      name: "MetaMask",
      icon: "🦊",
      description: "Connect using MetaMask wallet",
    },
    {
      name: "WalletConnect",
      icon: "🔗",
      description: "Connect using WalletConnect",
    },
    {
      name: "Coinbase Wallet",
      icon: "🔵",
      description: "Connect using Coinbase Wallet",
    },
  ];

  const getTypeIcon = () => {
    switch (nft.type) {
      case "photobook":
        return <BookOpen className="h-5 w-5 text-primary" />;
      case "audiobook":
        return <Headphones className="h-5 w-5 text-secondary" />;
      case "memory":
        return <Camera className="h-5 w-5 text-accent" />;
    }
  };

  const handleWalletConnect = async (walletName: string) => {
    console.log(" Connecting to wallet:", walletName);
    // Simulate wallet connection
    setTimeout(() => {
      setConnectedWallet("0x1234...5678");
      setPurchaseState("confirm");
    }, 1500);
  };

  const handlePurchaseConfirm = async () => {
    setPurchaseState("processing");
    console.log(" Processing memory purchase:", nft.id);

    // Simulate transaction processing
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      if (success) {
        setTransactionHash("0xabcd1234efgh5678ijkl9012mnop3456qrst7890");
        setPurchaseState("success");
      } else {
        setErrorMessage("Transaction failed. Please try again.");
        setPurchaseState("error");
      }
    }, 3000);
  };

  const handleRetry = () => {
    setErrorMessage("");
    setPurchaseState("confirm");
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setPurchaseState("wallet");
      setConnectedWallet(null);
      setTransactionHash(null);
      setErrorMessage("");
    }, 300);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderWalletSelection = () => (
    <div className="space-y-4">
      <div className="text-center">
        <Wallet className="mx-auto mb-4 h-12 w-12 text-purple-600" />
        <h3 className="mb-2 text-lg font-semibold">Connect Your Wallet</h3>
        <p className="text-sm text-muted-foreground">
          Choose a wallet to purchase this memory
        </p>
      </div>

      <div className="space-y-3">
        {walletOptions.map((wallet) => (
          <Button
            key={wallet.name}
            variant="outline"
            className="h-auto w-full justify-start bg-transparent p-4"
            onClick={() => handleWalletConnect(wallet.name)}
          >
            <span className="mr-3 text-2xl">{wallet.icon}</span>
            <div className="text-left">
              <div className="font-medium">{wallet.name}</div>
              <div className="text-sm text-muted-foreground">
                {wallet.description}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );

  const renderPurchaseConfirmation = () => (
    <div className="space-y-6">
      <div className="text-center">
        <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-purple-600" />
        <h3 className="mb-2 text-lg font-semibold">Confirm Purchase</h3>
        <p className="text-sm text-muted-foreground">
          Review your digita collectible details
        </p>
      </div>

      {/* NFT Preview */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg bg-muted">
              {nft.image ? (
                <img
                  src={nft.image || "/placeholder.svg"}
                  alt={nft.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                getTypeIcon()
              )}
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center space-x-2">
                {getTypeIcon()}
                <Badge variant="outline" className="text-xs">
                  <Coins className="mr-1 h-3 w-3" />
                  Memory
                </Badge>
              </div>
              <h4 className="font-semibold">{nft.title}</h4>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {nft.description}
              </p>
              <div className="mt-2 flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={nft.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">
                    {nft.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  by {nft.user.name}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Details */}
      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex justify-between">
            <span>Price</span>
            <span className="font-semibold">{nft.nftPrice} Bandcoin</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Fee (2.5%)</span>
            <span>{(nft.nftPrice * 0.025).toFixed(4)} Bandcoin</span>
          </div>
          <div className="flex justify-between">
            <span>Creator Royalty ({nft.royalty}%)</span>
            <span>
              {(nft.nftPrice * (nft.royalty / 100)).toFixed(4)} Bandcoin
            </span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{(nft.nftPrice * 1.025).toFixed(4)} Bandcoin</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center space-x-2 rounded-lg bg-muted p-3">
        <Wallet className="h-4 w-4" />
        <span className="text-sm">Connected: {connectedWallet}</span>
      </div>

      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="flex-1 bg-transparent"
          onClick={() => setPurchaseState("wallet")}
        >
          Back
        </Button>
        <Button
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
          onClick={handlePurchaseConfirm}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Purchase Digital Collectibles
        </Button>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="space-y-4 text-center">
      <Loader2 className="mx-auto h-12 w-12 animate-spin text-purple-600" />
      <h3 className="text-lg font-semibold">Processing Transaction</h3>
      <p className="text-sm text-muted-foreground">
        Please confirm the transaction in your wallet and wait for it to be
        processed on the blockchain.
      </p>
      <div className="rounded-lg bg-muted p-4">
        <p className="text-sm">This may take a few minutes...</p>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="space-y-4 text-center">
      <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
      <h3 className="text-lg font-semibold">Purchase Successful!</h3>
      <p className="text-sm text-muted-foreground">
        Congratulations! You now own "{nft.title}" memory. It has been added to
        your collection.
      </p>

      {transactionHash && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Transaction Hash:</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm">
                  {transactionHash.slice(0, 10)}...
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(transactionHash)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="flex-1 bg-transparent"
          onClick={handleClose}
        >
          Close
        </Button>
        <Button className="flex-1">
          <Crown className="mr-2 h-4 w-4" />
          View in Collection
        </Button>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="space-y-4 text-center">
      <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
      <h3 className="text-lg font-semibold">Transaction Failed</h3>
      <p className="text-sm text-muted-foreground">{errorMessage}</p>

      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="flex-1 bg-transparent"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button className="flex-1" onClick={handleRetry}>
          Try Again
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (purchaseState) {
      case "wallet":
        return renderWalletSelection();
      case "confirm":
        return renderPurchaseConfirmation();
      case "processing":
        return renderProcessing();
      case "success":
        return renderSuccess();
      case "error":
        return renderError();
      default:
        return renderWalletSelection();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Coins className="h-5 w-5 text-purple-600" />
            <span>Purchase Digital Collectibles</span>
          </DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}

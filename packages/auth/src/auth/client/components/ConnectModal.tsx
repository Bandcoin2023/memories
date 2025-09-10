"use client";

import { useState } from "react";

import { Button } from "./button";

import "./style.css";

import type { StellarWalletId } from "../../client/stellar-sign";

interface Wallet {
  id: string;
  name: string;
  icon: string;
  description: string;
  installed?: boolean;
}

const iconBaseUrl =
  "https://raw.githubusercontent.com/action-token/action-auth/refs/heads/main/packages/client-sdk/public/wallets";

const STELLAR_WALLETS: Wallet[] = [
  {
    id: "xbull",
    name: "xBull Wallet",
    icon: `${iconBaseUrl}/xbull-dark.svg`,
    description: "Browser extension wallet for Stellar",
    installed: true,
  },
  {
    id: "albedo",
    name: "Albedo",
    icon: `${iconBaseUrl}/albedo.svg`,
    description: "Web-based Stellar wallet",
    installed: true,
  },
  {
    id: "lobstr",
    name: "Lobstr",
    icon: `${iconBaseUrl}/rabet.png`,
    description: "Mobile and web wallet",
    installed: true,
  },
];

const SOCIAL_OPTIONS = [
  {
    id: "google",
    name: "Google",
    icon: "🔍",
    description: "Continue with your Google account",
  },
];

type StellarWallet = StellarWalletId | null;

interface ConnectModalProps {
  open: boolean;
  onClose: () => void;
  onStellarConnect: (walletType: StellarWallet) => Promise<void>;
  onSocialConnect: (provider: string) => Promise<void>;
  loading?: boolean;
  selectedWallet?: StellarWallet;
}

export function ConnectModal({
  open,
  onClose,
  onStellarConnect,
  onSocialConnect,
  loading = false,
  selectedWallet = null,
}: ConnectModalProps) {
  const [activeTab, setActiveTab] = useState<"wallets" | "social">("wallets");

  if (!open) return null;

  const handleWalletClick = async (walletId: StellarWallet) => {
    if (walletId) {
      await onStellarConnect(walletId);
    }
  };

  const handleSocialClick = async (provider: string) => {
    await onSocialConnect(provider);
  };

  return (
    <div className="auth-connect-modal__overlay" onClick={onClose}>
      <div className="auth-connect-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="auth-connect-modal__header">
          <div className="auth-connect-modal__header-content">
            <div className="auth-connect-modal__icon-container">
              <div className="auth-connect-modal__connect-icon">🔗</div>
            </div>
            <h2 className="auth-connect-modal__title">Connect Wallet</h2>
            <p className="auth-connect-modal__subtitle">
              Choose how you'd like to connect to continue
            </p>
          </div>
          <button
            onClick={onClose}
            className="auth-connect-modal__close-button"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="auth-connect-modal__tabs">
          <button
            className={`auth-connect-modal__tab${activeTab === "wallets" ? "auth-connect-modal__tab--active" : ""}`}
            onClick={() => setActiveTab("wallets")}
          >
            <span className="auth-connect-modal__tab-icon">👛</span>
            Stellar Wallets
          </button>
          <button
            className={`auth-connect-modal__tab${activeTab === "social" ? "auth-connect-modal__tab--active" : ""}`}
            onClick={() => setActiveTab("social")}
          >
            <span className="auth-connect-modal__tab-icon">🌐</span>
            Social Login
          </button>
        </div>

        {/* Content */}
        <div className="auth-connect-modal__content">
          {activeTab === "wallets" && (
            <div className="auth-connect-modal__section">
              <div className="auth-connect-modal__section-header">
                <h3>Select a Stellar Wallet</h3>
                <p>Connect using your preferred Stellar wallet</p>
              </div>

              <div className="auth-connect-modal__wallet-grid">
                {STELLAR_WALLETS.map((wallet) => (
                  <button
                    key={wallet.id}
                    className={`auth-connect-modal__wallet-card${
                      selectedWallet === wallet.id
                        ? "auth-connect-modal__wallet-card--loading"
                        : ""
                    }`}
                    onClick={() =>
                      handleWalletClick(wallet.id as StellarWallet)
                    }
                    disabled={loading}
                  >
                    <div className="auth-connect-modal__wallet-icon">
                      <img
                        src={wallet.icon}
                        alt={wallet.name}
                        className="auth-connect-modal__wallet-icon-image"
                      />
                    </div>
                    <div className="auth-connect-modal__wallet-info">
                      <h4 className="auth-connect-modal__wallet-name">
                        {wallet.name}
                      </h4>
                      <p className="auth-connect-modal__wallet-description">
                        {wallet.description}
                      </p>
                    </div>
                    {loading && selectedWallet === wallet.id && (
                      <div className="auth-connect-modal__wallet-loader">
                        <div className="auth-connect-modal__spinner"></div>
                      </div>
                    )}
                    <div className="auth-connect-modal__wallet-arrow">→</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "social" && (
            <div className="auth-connect-modal__section">
              <div className="auth-connect-modal__section-header">
                <h3>Social Login</h3>
                <p>Quick access with your social accounts</p>
              </div>

              <div className="auth-connect-modal__social-grid">
                {SOCIAL_OPTIONS.map((option) => (
                  <Button
                    key={option.id}
                    variant="outline"
                    fullWidth
                    loading={loading}
                    onClick={() => handleSocialClick(option.id)}
                    className="auth-connect-modal__social-button"
                  >
                    <span className="auth-connect-modal__social-icon">
                      {option.icon}
                    </span>
                    Continue with {option.name}
                  </Button>
                ))}
              </div>

              <div className="auth-connect-modal__divider">
                <div className="auth-connect-modal__divider-line"></div>
                <span className="auth-connect-modal__divider-text">or</span>
                <div className="auth-connect-modal__divider-line"></div>
              </div>

              <div className="auth-connect-modal__email-section">
                <p className="auth-connect-modal__email-text">
                  Don't have a wallet? <br />
                  <button className="auth-connect-modal__email-link">
                    Create account with email →
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="auth-connect-modal__footer">
          <div className="auth-connect-modal__security-note">
            <span className="auth-connect-modal__shield-icon">🛡️</span>
            <span>Your connection is secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}

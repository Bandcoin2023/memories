"use client";

import { useEffect, useMemo, useState } from "react";

import { createClient } from "../auth-client";
import { Button } from "./button";
import { ForgotPassword } from "./ForgotPassword";
import { ResetPassword } from "./ResetPassword";
import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";
import { Success } from "./Success";
import { TabButton } from "./ui";

import "./style.css";

import type { StellarWalletId } from "../stellar-sign";
import { signInWithStellar } from "../stellar-sign";
import { ConnectModal } from "./ConnectModal";

type View = "connect" | "login" | "signup" | "forgot" | "reset" | "success";
type StellarWallet = StellarWalletId | null;

export function AuthModal({
  open,
  onClose,
  client: authClient,
  callbackURL,
}: {
  open: boolean;
  onClose: () => void;
  client: ReturnType<typeof createClient>;
  callbackURL?: string;
}) {
  const [view, setView] = useState<View>("connect");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<StellarWallet>(null);

  const resetToken = useMemo(() => {
    try {
      const url = new URL(window.location.href);
      return url.searchParams.get("token");
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (open) {
      setError(null);
      setMessage(null);
      if (resetToken) setView("reset");
    }
  }, [open, resetToken]);

  const close = () => {
    if (loading) return;
    onClose();
  };

  async function signInWithGoogle() {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackURL || window.location.origin,
      });
    } catch (e: any) {
      setError(e?.message ?? "Failed to sign in with Google");
    }
  }

  async function handleStellarSignIn(walletType: StellarWallet) {
    if (!walletType) return;

    setLoading(true);
    setError(null);
    setMessage(null);
    setSelectedWallet(walletType);

    try {
      await signInWithStellar(authClient, walletType);

      setMessage(
        `Signed in with Stellar via ${walletType.charAt(0).toUpperCase() + walletType.slice(1)}.`,
      );
      setView("success");
      setTimeout(() => {
        try {
          window.location.reload();
        } catch {}
      }, 0);
    } catch (e: any) {
      setError(
        e?.message ??
          `Failed to sign in with ${walletType.charAt(0).toUpperCase() + walletType.slice(1)}`,
      );
    } finally {
      setLoading(false);
      setSelectedWallet(null);
    }
  }

  if (!open) return null;

  // Show the new ConnectModal for the main wallet connection experience
  if (view === "connect") {
    return (
      <div className="auth-container">
        <ConnectModal
          open={open}
          onClose={close}
          onStellarConnect={handleStellarSignIn}
          onSocialConnect={async (provider) => {
            if (provider === "google") {
              await signInWithGoogle();
            }
          }}
          loading={loading}
          selectedWallet={selectedWallet}
        />
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-modal__overlay">
        <div className="auth-modal">
          <div className="auth-modal__header">
            <h2 className="auth-modal__title">Connect</h2>
            <button onClick={close} className="auth-modal__close-button">
              ✕
            </button>
          </div>

          <div className="auth-modal__social-login">
            <Button
              variant="outline"
              className="w-full"
              onClick={signInWithGoogle}
              disabled={loading}
            >
              Continue with Google
            </Button>
          </div>
          <div className="auth-modal__stellar-login">
            <p className="auth-modal__stellar-title">Continue with Stellar</p>
            <div className="auth-modal__stellar-buttons">
              <Button
                variant="outline"
                onClick={() => handleStellarSignIn("albedo")}
                disabled={loading}
              >
                {loading && selectedWallet === "albedo"
                  ? "Connecting..."
                  : "Albedo"}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleStellarSignIn("xbull")}
                disabled={loading}
              >
                {loading && selectedWallet === "xbull"
                  ? "Connecting..."
                  : "xBull"}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleStellarSignIn("lobstr")}
                disabled={loading}
              >
                {loading && selectedWallet === "lobstr"
                  ? "Connecting..."
                  : "Lobstr"}
              </Button>
            </div>
          </div>

          <div className="auth-modal__divider">
            <div className="auth-modal__divider-line" />
            <span>Or continue with email</span>
            <div className="auth-modal__divider-line" />
          </div>

          <div className="auth-modal__tabs">
            <TabButton
              active={view === "login"}
              onClick={() => setView("login")}
            >
              Login
            </TabButton>
            <TabButton
              active={view === "signup"}
              onClick={() => setView("signup")}
            >
              Sign Up
            </TabButton>
            <TabButton
              active={view === "forgot"}
              onClick={() => setView("forgot")}
            >
              Forgot
            </TabButton>
          </div>

          {error && <p className="auth-modal__error">{error}</p>}
          {message && <p className="auth-modal__message">{message}</p>}

          {view === "signup" && (
            <SignUp
              authClient={authClient}
              setView={setView}
              setError={setError}
              setMessage={setMessage}
            />
          )}

          {view === "login" && (
            <SignIn
              authClient={authClient}
              setView={setView}
              setError={setError}
              setMessage={setMessage}
            />
          )}

          {view === "forgot" && (
            <ForgotPassword
              authClient={authClient}
              setView={setView}
              setError={setError}
              setMessage={setMessage}
            />
          )}

          {view === "reset" && resetToken && (
            <ResetPassword
              authClient={authClient}
              setView={setView}
              setError={setError}
              setMessage={setMessage}
              resetToken={resetToken}
            />
          )}

          {view === "success" && <Success message={message} onClose={close} />}
        </div>
      </div>
    </div>
  );
}
